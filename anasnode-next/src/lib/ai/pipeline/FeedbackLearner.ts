/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FeedbackLearner.ts — Reinforcement Learning Style Feedback Loop
 *
 * Deep Learning Concept: Online Learning / Reinforcement Learning
 *
 * When a user ACCEPTS an automation → that prediction gets REWARDED (+weight)
 * When a user REJECTS an automation → that prediction gets PENALIZED (-weight)
 * Over time, the model gets smarter from real user behavior!
 *
 * This is similar to:
 *  - RLHF (Reinforcement Learning from Human Feedback) — used in ChatGPT
 *  - Online Gradient Descent — weights update after each sample
 *  - Bandit Algorithms — explore vs exploit tradeoff
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface FeedbackEntry {
  timestamp: number;
  promptKeywords: string[];
  predictedIndustry: string;
  actualIndustry: string;
  wasCorrect: boolean;
  reward: number;           // +1 correct, -1 wrong, 0 uncertain
}

export interface LearningWeights {
  industryAccuracy: Record<string, { correct: number; total: number }>;
  keywordSignals: Record<string, Record<string, number>>;  // keyword → industry → weight
  lastUpdated: number;
}

// ── In-Memory Store (in production: save to DB/Redis) ────────────────────────
let weights: LearningWeights = {
  industryAccuracy: {},
  keywordSignals: {},
  lastUpdated: Date.now(),
};

const feedbackLog: FeedbackEntry[] = [];

export class FeedbackLearner {
  /**
   * Record user feedback after workspace is generated
   * Call this when user clicks "Accept" or "Regenerate"
   *
   * @param prompt - original user prompt
   * @param predictedIndustry - what our model predicted
   * @param actualIndustry - what the user confirmed (or corrected to)
   * @param accepted - did the user accept the prediction?
   */
  static recordFeedback(
    prompt: string,
    predictedIndustry: string,
    actualIndustry: string,
    accepted: boolean
  ): void {
    const keywords = prompt
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3);

    const wasCorrect = predictedIndustry === actualIndustry;
    const reward = accepted ? 1 : -1;

    const entry: FeedbackEntry = {
      timestamp: Date.now(),
      promptKeywords: keywords,
      predictedIndustry,
      actualIndustry,
      wasCorrect,
      reward,
    };

    feedbackLog.push(entry);

    // ── Online Weight Update (Gradient Descent step) ──────────────────────────
    // Update accuracy tracking
    if (!weights.industryAccuracy[predictedIndustry]) {
      weights.industryAccuracy[predictedIndustry] = { correct: 0, total: 0 };
    }
    weights.industryAccuracy[predictedIndustry].total++;
    if (wasCorrect) weights.industryAccuracy[predictedIndustry].correct++;

    // Update keyword signal weights (this is the learning!)
    const learningRate = 0.1; // How fast to update (like neural network lr)
    for (const keyword of keywords) {
      if (!weights.keywordSignals[keyword]) {
        weights.keywordSignals[keyword] = {};
      }
      const currentWeight = weights.keywordSignals[keyword][actualIndustry] || 0;
      // Gradient step: move weight toward reward signal
      weights.keywordSignals[keyword][actualIndustry] =
        currentWeight + learningRate * reward;
    }

    weights.lastUpdated = Date.now();

    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[FeedbackLearner] Feedback recorded: ${predictedIndustry} → ${actualIndustry} | Correct: ${wasCorrect} | Reward: ${reward}`
      );
    }
  }

  /**
   * Get learned confidence boost for an industry given prompt keywords
   * This is the "memory" of what worked before!
   *
   * @param keywords - words from the prompt
   * @param industry - industry to check boost for
   * @returns boost value (positive = seen before and worked, negative = usually wrong)
   */
  static getLearningBoost(keywords: string[], industry: string): number {
    let boost = 0;
    let count = 0;

    for (const keyword of keywords) {
      const signals = weights.keywordSignals[keyword];
      if (signals && signals[industry] !== undefined) {
        boost += signals[industry];
        count++;
      }
    }

    // Normalize by keyword count
    return count > 0 ? boost / count : 0;
  }

  /**
   * Get industry accuracy stats (for admin dashboard)
   */
  static getAccuracyStats(): Record<string, { accuracy: number; samples: number }> {
    const stats: Record<string, { accuracy: number; samples: number }> = {};

    for (const [industry, data] of Object.entries(weights.industryAccuracy)) {
      stats[industry] = {
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        samples: data.total,
      };
    }

    return stats;
  }

  /**
   * Get total feedback count
   */
  static getFeedbackCount(): number {
    return feedbackLog.length;
  }

  /**
   * Get recent feedback entries (for debugging/admin)
   */
  static getRecentFeedback(limit = 10): FeedbackEntry[] {
    return feedbackLog.slice(-limit).reverse();
  }

  /**
   * Export weights (for persistence to DB)
   */
  static exportWeights(): LearningWeights {
    return { ...weights };
  }

  /**
   * Import weights (restore from DB on server restart)
   */
  static importWeights(imported: LearningWeights): void {
    weights = imported;
    console.log(`[FeedbackLearner] Weights imported. Last updated: ${new Date(imported.lastUpdated).toISOString()}`);
  }
}
