/**
 * ─────────────────────────────────────────────────────────────────────────────
 * QAEngine.ts — Question Answering System
 *
 * Implements all 3 pillars from the QA lecture:
 *
 *   Pillar 1: Question Processing
 *     → Answer Type Detection  (Who=PERSON, Where=LOCATION, How much=MONEY...)
 *     → Keyword Selection       (Dan Moldovan priority algorithm)
 *     → Question NER + POS      (uses our existing pipeline)
 *
 *   Pillar 2: Passage Retrieval
 *     → TF-IDF search from SearchEngine
 *     → Passage Re-ranking (entity match + keyword proximity + N-gram overlap)
 *
 *   Pillar 3: Answer Extraction & Candidate Ranking
 *     → Extract best answer span from top passage
 *     → Rank by keyword distance + punctuation proximity
 *     → MRR scoring for system evaluation
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { AnaosNLP, NLPResult } from "./AnaosNLP";
import { esClient, SearchResult } from "../../db/searchEngine";
import { IndustryType } from "../resources/lexicons";
import { Annotation } from "../resources/schemas";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AnswerType =
  | "PERSON"       // Who questions    → expects name
  | "LOCATION"     // Where questions  → expects city/place
  | "MONEY"        // How much         → expects price/amount
  | "DATE"         // When questions   → expects date/time
  | "COUNT"        // How many         → expects number
  | "ORGANIZATION" // Which company    → expects org name
  | "DEFINITION"   // What is          → expects explanation
  | "REASON"       // Why questions    → expects explanation
  | "METHOD"       // How questions    → expects process
  | "PRODUCT"      // What product     → expects item name
  | "UNKNOWN";     // Fallback

export interface QACandidate {
  text: string;           // The extracted answer span
  confidence: number;     // 0 to 1
  sourceDoc: string;      // original text it came from
  rank: number;           // 1-indexed rank in result list
  entityType?: string;    // PERSON / LOCATION / MONEY etc.
  keywordDistance: number; // how close to query keywords
}

export interface QAResult {
  question: string;
  answerType: AnswerType;
  keywords: string[];          // Moldovan-selected keywords
  topAnswer: QACandidate | null;
  allCandidates: QACandidate[];
  passages: string[];          // top retrieved passages
  mrrScore: number;            // Reciprocal Rank for this query
  nlpAnalysis: NLPResult;      // full NLP breakdown of the question
}

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 1A: ANSWER TYPE DETECTION
// Rule-based classifier (Regex + POS/NER aware)
// ─────────────────────────────────────────────────────────────────────────────

const ANSWER_TYPE_RULES: [RegExp, AnswerType][] = [
  // PERSON: Who/Founder/Owner questions
  [/^who\b|who is|who was|who are|who were|founder|owner|ceo|head of|named after/i, "PERSON"],

  // LOCATION: Where questions
  [/^where\b|where is|where was|which city|which country|which place|location of|address/i, "LOCATION"],

  // MONEY: How much / price / rate / cost
  [/how much|price|rate|cost|kitna|budget|fee|charge|salary|rent|amount/i, "MONEY"],

  // DATE: When / time questions
  [/^when\b|when was|when did|which year|what date|what time|kab|what day/i, "DATE"],

  // COUNT: How many
  [/how many|how often|kitne|count|number of|total/i, "COUNT"],

  // ORGANIZATION: Which company / brand
  [/which company|which organization|which brand|which institute|which bank/i, "ORGANIZATION"],

  // DEFINITION: What is / define / explain
  [/what is\b|what are\b|define|explain|meaning of|kya hai|tell me about/i, "DEFINITION"],

  // REASON: Why
  [/^why\b|why is|why was|reason for|cause of|wajah|kyun/i, "REASON"],

  // METHOD: How (process)
  [/^how\b(?! much| many)|how do|how does|how can|how to|tareeqa|process/i, "METHOD"],

  // PRODUCT: Which product / what product
  [/which product|what product|which item|konsa|which model|which type/i, "PRODUCT"],
];

function detectAnswerType(question: string): AnswerType {
  for (const [pattern, type] of ANSWER_TYPE_RULES) {
    if (pattern.test(question)) return type;
  }
  return "UNKNOWN";
}

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 1B: KEYWORD SELECTION (Dan Moldovan Priority Algorithm)
// Priority: Quoted phrases > Named Entities > Complex Nominals > Nouns/Verbs
// ─────────────────────────────────────────────────────────────────────────────

const QA_STOP_WORDS = new Set([
  "is","are","was","were","be","been","being",
  "have","has","had","do","does","did",
  "the","a","an","this","that","these","those",
  "i","you","he","she","it","we","they",
  "what","who","where","when","why","how",
  "which","whose","whom","some","any","please",
  "tell","me","can","could","would","should","will","may",
]);

function selectKeywords(question: string, nlp: NLPResult): string[] {
  const keywords: string[] = [];

  // Priority 1: Words inside quotation marks
  const quoted = question.match(/"([^"]+)"/g);
  if (quoted) {
    quoted.forEach(q => keywords.push(q.replace(/"/g, "").trim()));
  }

  // Priority 2: Named Entity values (Moldovan: NEs are highest priority)
  for (const anno of nlp.annotations) {
    if (anno.nerCategory === "ENAMEX" || anno.nerCategory === "NUMEX") {
      keywords.push(anno.value);
    }
  }

  // Priority 3: Proper Nouns from POS (NNP)
  for (const tok of nlp.posTagged) {
    if (tok.isProperNoun && !keywords.includes(tok.word)) {
      keywords.push(tok.word);
    }
  }

  // Priority 4: Adjective + Noun pairs (complex nominals)
  for (let i = 0; i < nlp.posTagged.length - 1; i++) {
    const cur  = nlp.posTagged[i];
    const next = nlp.posTagged[i + 1];
    if (cur.isAdjective && (next.tag === "NN" || next.tag === "NNS")) {
      const pair = `${cur.word} ${next.word}`;
      if (!keywords.includes(pair)) keywords.push(pair);
    }
  }

  // Priority 5: Remaining Nouns + main Verbs (excluding stop words)
  for (const tok of nlp.posTagged) {
    if (
      (tok.tag === "NN" || tok.tag === "NNS" || tok.isVerb) &&
      !QA_STOP_WORDS.has(tok.word.toLowerCase()) &&
      !keywords.includes(tok.word)
    ) {
      keywords.push(tok.word);
    }
  }

  // Deduplicate and clean
  return [...new Set(keywords.map(k => k.trim()).filter(k => k.length > 1))];
}

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 2: PASSAGE RETRIEVAL + RE-RANKING
// ─────────────────────────────────────────────────────────────────────────────

function rerankPassages(
  results: SearchResult[],
  keywords: string[],
  answerType: AnswerType
): SearchResult[] {
  return results
    .map(result => {
      const text   = result.document.data.originalText.toLowerCase();
      let bonus    = 0;

      // Bonus 1: Answer type entity present in passage
      const hasAnswerTypeEntity = result.document.data.annotations.some(
        a => a.type === answerType
      );
      if (hasAnswerTypeEntity) bonus += 0.5;

      // Bonus 2: Number of query keywords present in passage
      const matchingKeywords = keywords.filter(k => text.includes(k.toLowerCase()));
      bonus += matchingKeywords.length * 0.2;

      // Bonus 3: N-gram overlap (bigrams)
      const questionBigrams = buildNgrams(keywords.join(" "), 2);
      const passageBigrams  = buildNgrams(text, 2);
      const ngramOverlap    = questionBigrams.filter(ng => passageBigrams.includes(ng)).length;
      bonus += ngramOverlap * 0.15;

      // Bonus 4: Keyword proximity (keywords appear close together)
      bonus += calculateProximityBonus(text, keywords);

      return {
        ...result,
        score: parseFloat((result.score + bonus).toFixed(4)),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function buildNgrams(text: string, n: number): string[] {
  const words  = text.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(" "));
  }
  return ngrams;
}

function calculateProximityBonus(text: string, keywords: string[]): number {
  const words = text.split(/\s+/);
  const positions: number[][] = keywords.map(kw =>
    words.reduce<number[]>((acc, w, i) => {
      if (w.toLowerCase().includes(kw.toLowerCase())) acc.push(i);
      return acc;
    }, [])
  );

  // If at least 2 keywords found, measure their gap
  const found = positions.filter(p => p.length > 0);
  if (found.length < 2) return 0;

  // Minimum distance between any two keyword positions
  let minDist = Infinity;
  for (let i = 0; i < found.length - 1; i++) {
    for (const a of found[i]) {
      for (const b of found[i + 1]) {
        minDist = Math.min(minDist, Math.abs(a - b));
      }
    }
  }

  // Closer = bigger bonus (max 0.3)
  return minDist === Infinity ? 0 : Math.max(0, 0.3 - minDist * 0.03);
}

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 3A: ANSWER EXTRACTION
// Extract candidate answers from top passage based on answer type
// ─────────────────────────────────────────────────────────────────────────────

const ANSWER_TYPE_TO_NER: Record<AnswerType, string[]> = {
  PERSON:       ["PERSON"],
  LOCATION:     ["LOCATION"],
  MONEY:        ["MONEY", "QUANTITY"],
  DATE:         ["DATE", "DAY", "TIME", "YEAR", "MONTH", "PERIOD"],
  COUNT:        ["COUNT", "CD"],
  ORGANIZATION: ["ORGANIZATION"],
  DEFINITION:   ["PRODUCT", "ARTIFACT"],
  REASON:       [],
  METHOD:       [],
  PRODUCT:      ["PRODUCT", "ARTIFACT"],
  UNKNOWN:      [],
};

function extractCandidates(
  passages: SearchResult[],
  answerType: AnswerType,
  keywords: string[]
): QACandidate[] {
  const candidates: QACandidate[] = [];
  const targetNerTypes = ANSWER_TYPE_TO_NER[answerType];

  for (const passage of passages.slice(0, 5)) {
    const { annotations, originalText } = passage.document.data;

    // Extract entities matching the answer type
    const matchingEntities = annotations.filter(
      a => targetNerTypes.includes(a.type)
    );

    if (matchingEntities.length > 0) {
      for (const entity of matchingEntities) {
        const dist = calculateKeywordDistance(originalText, entity.value, keywords);
        candidates.push({
          text: entity.value,
          confidence: entity.confidence * (1 - dist * 0.05),
          sourceDoc: originalText,
          rank: 0, // assigned later
          entityType: entity.type,
          keywordDistance: dist,
        });
      }
    } else {
      // Fallback: return a summary sentence from the passage
      const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 5);
      const bestSentence = sentences.find((s: string) =>
        keywords.some((k: string) => s.toLowerCase().includes(k.toLowerCase()))
      ) ?? sentences[0];

      if (bestSentence) {
        candidates.push({
          text: bestSentence.trim(),
          confidence: 0.4,
          sourceDoc: originalText,
          rank: 0,
          keywordDistance: 999,
        });
      }
    }
  }

  return candidates;
}

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 3B: CANDIDATE RANKING
// Rank by keyword distance + punctuation proximity + entity confidence
// ─────────────────────────────────────────────────────────────────────────────

function rankCandidates(candidates: QACandidate[]): QACandidate[] {
  return candidates
    .map((c: QACandidate) => ({
      ...c,
      confidence: parseFloat(
        Math.min(1, c.confidence * (1 / (1 + c.keywordDistance * 0.1))).toFixed(3)
      ),
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .map((c, i) => ({ ...c, rank: i + 1 }));
}

function calculateKeywordDistance(text: string, answer: string, keywords: string[]): number {
  const words     = text.toLowerCase().split(/\s+/);
  const ansIdx    = words.findIndex(w => w.includes(answer.toLowerCase()));
  if (ansIdx === -1) return 999;

  let minDist = 999;
  for (const kw of keywords) {
    const kwIdx = words.findIndex(w => w.includes(kw.toLowerCase()));
    if (kwIdx !== -1) minDist = Math.min(minDist, Math.abs(ansIdx - kwIdx));
  }
  return minDist;
}

// ─────────────────────────────────────────────────────────────────────────────
// PILLAR 4: MRR (Mean Reciprocal Rank)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate MRR for a single query.
 * MRR = 1/rank_of_first_correct_answer
 * If correct answer found at rank 1 → MRR = 1.0
 * If at rank 2 → MRR = 0.5, rank 3 → 0.33, not found → 0
 */
export function calculateMRR(candidates: QACandidate[], correctAnswer: string): number {
  const correctIdx = candidates.findIndex(c =>
    c.text.toLowerCase().includes(correctAnswer.toLowerCase())
  );
  if (correctIdx === -1) return 0;
  return parseFloat((1 / (correctIdx + 1)).toFixed(3));
}

/**
 * Calculate Mean MRR across multiple queries.
 * MRR = (Σ 1/rank_i) / N
 */
export function calculateMeanMRR(queryResults: { candidates: QACandidate[]; correctAnswer: string }[]): number {
  if (queryResults.length === 0) return 0;
  const sum = queryResults.reduce(
    (acc, q) => acc + calculateMRR(q.candidates, q.correctAnswer),
    0
  );
  return parseFloat((sum / queryResults.length).toFixed(3));
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN QA ENGINE CLASS
// ─────────────────────────────────────────────────────────────────────────────

export class QAEngine {

  /**
   * Full QA Pipeline — question in, answer out
   * Implements all 3 QA pillars from the lecture
   */
  static async answer(
    question: string,
    industry: IndustryType = "general"
  ): Promise<QAResult> {

    // ── Pillar 1: Question Processing ─────────────────────────────────────────

    // 1a. NLP analysis of the question (reuse our full pipeline)
    const nlp = AnaosNLP.processText(question, industry);

    // 1b. Answer type detection
    const answerType = detectAnswerType(question);

    // 1c. Keyword selection (Dan Moldovan priority algorithm)
    const keywords = selectKeywords(question, nlp);

    // ── Pillar 2: Passage Retrieval ───────────────────────────────────────────

    // 2a. TF-IDF search using keywords joined as query
    const searchQuery   = keywords.slice(0, 5).join(" ");
    const rawResults    = await esClient.search(searchQuery);

    // 2b. Re-rank passages based on entity match + keyword proximity + N-grams
    const rankedResults = rerankPassages(rawResults, keywords, answerType);
    const topPassages   = rankedResults.slice(0, 5).map(r => r.document.data.originalText);

    // ── Pillar 3: Answer Extraction & Ranking ─────────────────────────────────

    // 3a. Extract candidates from top passages
    const rawCandidates = extractCandidates(rankedResults, answerType, keywords);

    // 3b. Rank candidates by keyword distance + confidence
    const rankedCandidates = rankCandidates(rawCandidates);

    // 3c. Top answer
    const topAnswer = rankedCandidates[0] ?? null;

    // 3d. MRR for this query (self-evaluation using top answer as "correct")
    const mrrScore = topAnswer ? parseFloat((1 / topAnswer.rank).toFixed(3)) : 0;

    return {
      question,
      answerType,
      keywords,
      topAnswer,
      allCandidates: rankedCandidates,
      passages: topPassages,
      mrrScore,
      nlpAnalysis: nlp,
    };
  }
}
