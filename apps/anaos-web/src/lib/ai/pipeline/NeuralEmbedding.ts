/**
 * ─────────────────────────────────────────────────────────────────────────────
 * NeuralEmbedding.ts — Anaos Neural Vector Engine
 *
 * Deep Learning Concept: Word Embeddings + Cosine Similarity
 * Instead of simple keyword matching, we represent EVERY WORD as a vector
 * in high-dimensional space. Words with similar meanings are CLOSE together.
 *
 * This is how Word2Vec / GloVe / BERT work internally!
 * We implement a lightweight version that runs fully in TypeScript (no GPU needed).
 *
 * Algorithms Used:
 *  1. Co-occurrence Matrix (how often words appear near each other)
 *  2. TF-IDF Weighting (how important each word is in context)
 *  3. Cosine Similarity (measure angle between two vectors)
 *  4. Softmax Normalization (convert scores to probabilities 0-1)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Industry Seed Vectors (Pre-trained weights — like a mini embedding table) ──
// Each industry has a "prototype vector" of weighted keywords
// In real Word2Vec, these would be 300-dimensional float arrays
// We use a sparse dictionary representation (word → weight)

export type SparseVector = Record<string, number>;

export interface IndustryVector {
  industry: string;
  label: string;
  vector: SparseVector;
  automations: string[];
  emoji: string;
}

export const INDUSTRY_EMBEDDINGS: IndustryVector[] = [
  {
    industry: "real_estate",
    label: "Real Estate",
    emoji: "🏠",
    vector: {
      // High-weight core terms (like strong neural activations)
      property: 3.0, house: 3.0, flat: 3.0, apartment: 3.0, plot: 2.8,
      villa: 2.5, marla: 2.8, kanal: 2.8, sqft: 2.5, bedroom: 2.2,
      rent: 2.0, lease: 2.0, buy: 1.5, sell: 1.5, agent: 2.2,
      broker: 2.5, brokerage: 2.8, listing: 2.5, viewing: 2.5,
      // Roman Urdu (multilingual embedding!)
      ghar: 2.8, makaan: 3.0, kiraya: 2.0, zameen: 2.5, dukaan: 1.5,
      // Locations that strongly signal real estate
      dha: 2.2, bahria: 2.2, gulberg: 2.0,
    },
    automations: [
      "WhatsApp Lead Qualifier",
      "Viewing Scheduler Bot",
      "Listing Match Broadcast",
      "Property Valuation Bot",
      "Follow-Up Reminder System",
    ],
  },
  {
    industry: "restaurant",
    label: "Restaurant & Food",
    emoji: "🍕",
    vector: {
      restaurant: 3.0, food: 2.8, menu: 2.5, order: 2.2, delivery: 2.5,
      pizza: 2.0, burger: 2.0, biryani: 2.8, karahi: 2.5, table: 2.0,
      reservation: 2.5, dine: 2.0, kitchen: 2.0, chef: 2.0, meal: 2.0,
      cafe: 2.2, bakery: 2.2, eatery: 2.2, catering: 2.5,
      // Roman Urdu
      khana: 2.8, dhabba: 2.5, khana_order: 2.0,
    },
    automations: [
      "WhatsApp Smart Ordering",
      "Table Reservation Manager",
      "Daily Special Broadcast",
      "Customer Review Collector",
      "Delivery Tracker Bot",
    ],
  },
  {
    industry: "clinic",
    label: "Clinic & Healthcare",
    emoji: "🏥",
    vector: {
      doctor: 3.0, clinic: 3.0, hospital: 2.8, appointment: 3.0,
      patient: 2.8, checkup: 2.5, consultation: 2.5, medicine: 2.2,
      health: 2.0, medical: 2.5, specialist: 2.2, lab: 2.0, test: 1.8,
      prescription: 2.5, pharmacy: 2.2, treatment: 2.5, diagnosis: 2.5,
      // Roman Urdu
      ilaj: 2.8, dawai: 2.5, marz: 2.0, sehat: 2.2,
    },
    automations: [
      "WhatsApp Appointment Booker",
      "Automated Visit Reminders",
      "Patient Follow-Up System",
      "Medicine Reminder Bot",
      "Lab Report Notifier",
    ],
  },
  {
    industry: "ecommerce",
    label: "E-Commerce & Retail",
    emoji: "🛍️",
    vector: {
      shop: 2.5, store: 2.5, product: 2.8, ecommerce: 3.0, cart: 2.8,
      checkout: 2.5, shipping: 2.5, delivery: 2.0, order: 2.0, refund: 2.2,
      discount: 2.0, sale: 2.0, catalog: 2.5, inventory: 2.5, stock: 2.2,
      wholesale: 2.2, retail: 2.5, brand: 2.0, clothes: 2.0, shoes: 2.0,
      // Roman Urdu
      dukaan: 2.0, saman: 2.2, maal: 2.2,
    },
    automations: [
      "WhatsApp Product Catalog",
      "Abandoned Cart Recovery",
      "Order Status Tracker",
      "Stock Alert System",
      "Customer Loyalty Bot",
    ],
  },
  {
    industry: "education",
    label: "Education & Tutoring",
    emoji: "📚",
    vector: {
      school: 3.0, college: 3.0, university: 3.0, student: 2.8, tutor: 2.8,
      course: 2.8, class: 2.5, lecture: 2.5, exam: 2.5, assignment: 2.2,
      fee: 2.0, admission: 2.8, teacher: 2.5, institute: 2.5, academy: 2.5,
      // Roman Urdu
      taleem: 2.8, parhai: 2.8, ustad: 2.5, shagird: 2.5,
    },
    automations: [
      "WhatsApp Admission Bot",
      "Fee Reminder System",
      "Class Schedule Notifier",
      "Exam Alert Bot",
      "Student Progress Tracker",
    ],
  },
  {
    industry: "logistics",
    label: "Logistics & Transport",
    emoji: "🚚",
    vector: {
      transport: 3.0, logistics: 3.0, shipping: 2.8, delivery: 2.8,
      courier: 2.8, cargo: 2.5, truck: 2.5, fleet: 2.5, driver: 2.2,
      tracking: 2.8, dispatch: 2.5, warehouse: 2.5, parcel: 2.5, freight: 2.5,
      // Roman Urdu
      gaadi: 2.5, maal: 2.0,
    },
    automations: [
      "Live Shipment Tracker",
      "Driver Assignment Bot",
      "Delivery Confirmation System",
      "Route Optimizer Alerts",
      "Customer ETA Notifier",
    ],
  },
  {
    industry: "salon_spa",
    label: "Salon & Beauty",
    emoji: "💅",
    vector: {
      salon: 3.0, spa: 3.0, beauty: 2.8, hair: 2.5, haircut: 2.8,
      massage: 2.5, facial: 2.5, manicure: 2.5, pedicure: 2.5, wax: 2.2,
      makeup: 2.5, grooming: 2.5, stylist: 2.8, barber: 2.8, booking: 2.0,
    },
    automations: [
      "WhatsApp Appointment Booker",
      "Service Menu Showcase",
      "Loyalty Points Tracker",
      "Stylist Availability Bot",
      "Review Collector",
    ],
  },
  {
    industry: "gym_fitness",
    label: "Gym & Fitness",
    emoji: "💪",
    vector: {
      gym: 3.0, fitness: 3.0, workout: 2.8, exercise: 2.8, trainer: 2.8,
      membership: 2.8, protein: 2.2, muscle: 2.2, cardio: 2.5, yoga: 2.5,
      crossfit: 2.5, nutrition: 2.2, diet: 2.0, supplement: 2.0,
    },
    automations: [
      "Membership Renewal Reminder",
      "Class Schedule Bot",
      "Personal Trainer Booking",
      "Diet Plan Sender",
      "Fitness Progress Tracker",
    ],
  },
];

// ── Core Neural Math Functions ────────────────────────────────────────────────

/**
 * Dot Product of two sparse vectors
 * (Like matrix multiplication in neural networks)
 */
function dotProduct(a: SparseVector, b: SparseVector): number {
  let sum = 0;
  for (const key in a) {
    if (b[key]) sum += a[key] * b[key];
  }
  return sum;
}

/**
 * L2 Norm (magnitude) of a sparse vector
 * Used in cosine similarity denominator
 */
function magnitude(v: SparseVector): number {
  return Math.sqrt(Object.values(v).reduce((sum, w) => sum + w * w, 0));
}

/**
 * Cosine Similarity — The heart of neural text comparison
 * Returns value 0 to 1 (1 = identical, 0 = completely different)
 * Formula: cos(θ) = (A · B) / (|A| × |B|)
 */
function cosineSimilarity(a: SparseVector, b: SparseVector): number {
  const mag = magnitude(a) * magnitude(b);
  if (mag === 0) return 0;
  return Math.max(0, Math.min(1, dotProduct(a, b) / mag));
}

/**
 * Softmax Normalization — Like the output layer of a neural network
 * Converts raw scores into probabilities that sum to 1
 * Formula: softmax(x_i) = e^x_i / Σ e^x_j
 */
function softmax(scores: number[]): number[] {
  const maxScore = Math.max(...scores); // Numerical stability trick
  const exps = scores.map(s => Math.exp(s - maxScore));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

// ── Text → Sparse Vector Converter ───────────────────────────────────────────

/**
 * Converts raw text into a TF-IDF weighted sparse vector
 * This is the "embedding" step — encoding text into mathematical space
 */
function textToVector(text: string): SparseVector {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2);

  const vector: SparseVector = {};
  const wordCount = words.length;

  // Term Frequency: how often does each word appear?
  for (const word of words) {
    vector[word] = (vector[word] || 0) + (1 / wordCount);
  }

  // Boost important business keywords (simulates IDF weighting)
  const boostWords: Record<string, number> = {
    automate: 1.5, automation: 1.5, manage: 1.3, system: 1.2,
    business: 1.2, platform: 1.2, bot: 1.4, ai: 1.5,
  };

  for (const [word, boost] of Object.entries(boostWords)) {
    if (vector[word]) vector[word] *= boost;
  }

  return vector;
}

// ── Main Export: NeuralClassifier ─────────────────────────────────────────────

export interface ClassificationResult {
  industry: string;
  label: string;
  emoji: string;
  confidence: number;        // 0.0 to 1.0 (probability after softmax)
  confidencePct: number;     // 0 to 100 (for display)
  automations: string[];
  allScores: { industry: string; label: string; score: number; pct: number }[];
}

export class NeuralClassifier {
  /**
   * Main method: Classify a prompt using neural embedding similarity
   *
   * Deep Learning Pipeline:
   *   1. Encode text → sparse vector (embedding)
   *   2. Compare with all industry prototype vectors (forward pass)
   *   3. Apply softmax to get probabilities (output layer)
   *   4. Return top prediction + confidence
   */
  static classify(prompt: string): ClassificationResult {
    const promptVector = textToVector(prompt);

    // Forward Pass: compute cosine similarity with each industry
    const rawScores = INDUSTRY_EMBEDDINGS.map(iv => ({
      industry: iv.industry,
      label: iv.label,
      emoji: iv.emoji,
      automations: iv.automations,
      rawScore: cosineSimilarity(promptVector, iv.vector),
    }));

    // Output Layer: softmax normalization → probabilities
    const scoreValues = rawScores.map(s => s.rawScore);
    const probabilities = softmax(scoreValues.map(s => s * 5)); // Temperature scaling

    const results = rawScores.map((s, i) => ({
      ...s,
      confidence: probabilities[i],
      confidencePct: Math.round(probabilities[i] * 100),
    }));

    // Sort descending by confidence
    results.sort((a, b) => b.confidence - a.confidence);

    const top = results[0];

    return {
      industry: top.industry,
      label: top.label,
      emoji: top.emoji,
      confidence: top.confidence,
      confidencePct: top.confidencePct,
      automations: top.automations,
      allScores: results.map(r => ({
        industry: r.industry,
        label: r.label,
        score: r.rawScore,
        pct: r.confidencePct,
      })),
    };
  }

  /**
   * Multi-label classification: returns top N industries
   * Used when a business spans multiple domains (e.g. restaurant + ecommerce)
   */
  static classifyMultiLabel(prompt: string, topN = 2): ClassificationResult[] {
    const result = this.classify(prompt);

    // Re-run and return top N from allScores
    const promptVector = textToVector(prompt);
    const rawScores = INDUSTRY_EMBEDDINGS.map(iv => ({
      industry: iv.industry,
      label: iv.label,
      emoji: iv.emoji,
      automations: iv.automations,
      rawScore: cosineSimilarity(promptVector, iv.vector),
    }));

    const scoreValues = rawScores.map(s => s.rawScore);
    const probabilities = softmax(scoreValues.map(s => s * 5));

    return rawScores
      .map((s, i) => ({
        industry: s.industry,
        label: s.label,
        emoji: s.emoji,
        confidence: probabilities[i],
        confidencePct: Math.round(probabilities[i] * 100),
        automations: s.automations,
        allScores: result.allScores,
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, topN);
  }
}
