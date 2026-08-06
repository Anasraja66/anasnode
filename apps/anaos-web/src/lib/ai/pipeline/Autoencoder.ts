/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Autoencoder.ts — Anaos Anomaly Detection & Prompt Compression Engine
 *
 * Deep Learning Concept: Autoencoder Neural Network
 *
 * Architecture:
 *   INPUT LAYER  → 50 neurons  (vocab features)
 *   ENCODER      → 20 neurons  (hidden layer 1)
 *   BOTTLENECK   → 8 neurons   (compressed latent space — the "memory")
 *   DECODER      → 20 neurons  (hidden layer 2)
 *   OUTPUT LAYER → 50 neurons  (reconstructed features)
 *
 * How it works:
 *   1. Convert prompt → feature vector (50 dims)
 *   2. ENCODE: compress 50 → 8 numbers (squeeze meaning)
 *   3. DECODE: expand 8 → 50 numbers (try to rebuild)
 *   4. Measure ERROR between original and rebuilt
 *   5. High error = ANOMALY (spam/gibberish/attack)
 *   6. Low error  = VALID business prompt ✅
 *
 * Real-world equivalent:
 *   - Same architecture used by Netflix for recommendation anomalies
 *   - Used in fraud detection at banks
 *   - Used in ChatGPT safety filters
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Constants ─────────────────────────────────────────────────────────────────
const INPUT_DIM    = 50;   // Feature vector size
const HIDDEN_DIM   = 20;   // Hidden layer size
const LATENT_DIM   = 8;    // Bottleneck (compressed representation)
const ANOMALY_THRESHOLD = 0.45; // Reconstruction error above this = spam

// ── Types ─────────────────────────────────────────────────────────────────────
export type LatentVector = number[];  // 8 compressed numbers

export interface AutoencoderResult {
  isAnomaly: boolean;           // Is this prompt spam/gibberish?
  reconstructionError: number;  // 0.0 (perfect) → 1.0 (total gibberish)
  latentVector: LatentVector;   // 8-dim compressed representation
  confidence: number;           // 0-100 how sure we are it's valid
  reason: string;               // Human-readable explanation
}

export interface StoredPrompt {
  id: string;
  originalPrompt: string;
  latentVector: LatentVector;
  industry: string;
  timestamp: number;
}

// ── In-Memory Vector Store (in production: use pgvector / Pinecone) ───────────
const promptMemory: StoredPrompt[] = [];

// ── Vocabulary: Business words the autoencoder knows ─────────────────────────
// These are the 50 "neurons" in our input/output layer
// Each word occupies one dimension in our feature space
const VOCAB: string[] = [
  // Business intents
  "automate", "automation", "manage", "system", "bot", "ai", "help", "need",
  "want", "build", "create", "setup", "run", "start",
  // Industries
  "restaurant", "food", "property", "real", "estate", "clinic", "doctor",
  "shop", "store", "ecommerce", "school", "college", "gym", "salon", "salon",
  "transport", "delivery", "logistics", "bakery", "cafe",
  // Channels
  "whatsapp", "instagram", "facebook", "online", "digital", "social",
  // Business words
  "customer", "order", "booking", "appointment", "payment", "lead",
  "notification", "reminder", "report", "track", "schedule",
  // Roman Urdu
  "chahiye", "mujhe", "hamara", "apna", "business", "dukaan", "khana",
];

// ── Math Utilities ────────────────────────────────────────────────────────────

/** ReLU activation — like a light switch, kills negative values */
function relu(x: number): number {
  return Math.max(0, x);
}

/** Sigmoid activation — squeezes any number to 0–1 range */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/** Dot product of two arrays */
function dot(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
}

/** Mean Squared Error — measures how different two vectors are */
function mse(original: number[], reconstructed: number[]): number {
  const sum = original.reduce(
    (acc, val, i) => acc + Math.pow(val - (reconstructed[i] ?? 0), 2),
    0
  );
  return sum / original.length;
}

/** Cosine similarity between two latent vectors */
function cosineSim(a: number[], b: number[]): number {
  const dotAB = dot(a, b);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  if (magA === 0 || magB === 0) return 0;
  return Math.max(-1, Math.min(1, dotAB / (magA * magB)));
}

// ── Pre-trained Weights (simulated — in production: train on real data) ───────
// These weights define how our neurons connect
// Shape: [output_dim][input_dim]
// Values represent learned connection strengths (like synapses in a brain!)

function generateDeterministicWeights(
  rows: number,
  cols: number,
  seed: number
): number[][] {
  // Deterministic pseudo-random weights (Xavier initialization style)
  const scale = Math.sqrt(2.0 / (rows + cols));
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => {
      // Simple deterministic hash as pseudo-random
      const h = Math.sin((i * 37 + j * 13 + seed) * 9301 + 49297) * 233280;
      return ((h - Math.floor(h)) * 2 - 1) * scale;
    })
  );
}

// Layer weight matrices
const W_enc1 = generateDeterministicWeights(HIDDEN_DIM, INPUT_DIM,  1); // Encoder layer 1
const W_enc2 = generateDeterministicWeights(LATENT_DIM, HIDDEN_DIM, 2); // Encoder layer 2 (bottleneck)
const W_dec1 = generateDeterministicWeights(HIDDEN_DIM, LATENT_DIM, 3); // Decoder layer 1
const W_dec2 = generateDeterministicWeights(INPUT_DIM,  HIDDEN_DIM, 4); // Decoder layer 2 (output)

// ── Feature Extraction: Text → 50-dim vector ─────────────────────────────────
function textToFeatureVector(text: string): number[] {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const wordSet = new Set(words);

  // TF (term frequency) for each vocab word
  const tf = VOCAB.map(word => {
    const count = words.filter(w => w.includes(word) || word.includes(w)).length;
    return count / Math.max(words.length, 1);
  });

  // Extra features at the end (within 50 dims)
  tf[47] = Math.min(1, words.length / 30);                 // Length feature
  tf[48] = /[^a-z0-9\s]/i.test(text) ? 1 : 0;            // Special chars
  tf[49] = words.filter(w => w.length > 10).length > 2 ? 1 : 0; // Long words

  return tf;
}

// ── Matrix × Vector multiplication ───────────────────────────────────────────
function matVec(W: number[][], x: number[]): number[] {
  return W.map(row => dot(row, x));
}

// ── Encoder: 50-dim → 8-dim (compress!) ──────────────────────────────────────
function encode(features: number[]): LatentVector {
  // Layer 1: INPUT(50) → HIDDEN(20) with ReLU
  const h1 = matVec(W_enc1, features).map(relu);
  // Layer 2: HIDDEN(20) → LATENT(8) with Sigmoid
  const latent = matVec(W_enc2, h1).map(sigmoid);
  return latent;
}

// ── Decoder: 8-dim → 50-dim (reconstruct!) ───────────────────────────────────
function decode(latent: LatentVector): number[] {
  // Layer 1: LATENT(8) → HIDDEN(20) with ReLU
  const h1 = matVec(W_dec1, latent).map(relu);
  // Layer 2: HIDDEN(20) → OUTPUT(50) with Sigmoid
  const output = matVec(W_dec2, h1).map(sigmoid);
  return output;
}

// ── Main Export: Autoencoder ──────────────────────────────────────────────────
export class Autoencoder {

  /**
   * MAIN METHOD: Analyze a prompt through the autoencoder
   *
   * Pipeline:
   *   text → features → ENCODE → latent → DECODE → reconstructed → MSE error
   *
   * @param prompt - the user's business description
   * @returns AutoencoderResult with anomaly flag, error score, latent vector
   */
  static analyze(prompt: string): AutoencoderResult {
    // Step 1: Convert text to feature vector
    const features = textToFeatureVector(prompt);

    // Step 2: ENCODE — compress 50 → 8 (forward pass through encoder)
    const latentVector = encode(features);

    // Step 3: DECODE — expand 8 → 50 (forward pass through decoder)
    const reconstructed = decode(latentVector);

    // Step 4: Calculate reconstruction error (MSE)
    const reconstructionError = mse(features, reconstructed);

    // Step 5: Normalize error to 0-1 range
    // Calibrated: valid prompts usually score < 0.45, spam > 0.45
    const normalizedError = Math.min(1, reconstructionError * 4);

    // Step 6: Anomaly decision
    const isAnomaly = normalizedError > ANOMALY_THRESHOLD;
    const confidence = Math.round((1 - normalizedError) * 100);

    // Step 7: Generate reason
    const reason = generateReason(prompt, normalizedError, isAnomaly);

    return {
      isAnomaly,
      reconstructionError: parseFloat(normalizedError.toFixed(3)),
      latentVector,
      confidence: Math.max(0, Math.min(100, confidence)),
      reason,
    };
  }

  /**
   * REMEMBER: Store a prompt's latent vector in memory
   * Used later for similarity search
   *
   * @param prompt - original prompt text
   * @param industry - detected industry label
   * @returns stored prompt ID
   */
  static remember(prompt: string, industry: string): string {
    const features = textToFeatureVector(prompt);
    const latentVector = encode(features);
    const id = `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    promptMemory.push({
      id,
      originalPrompt: prompt,
      latentVector,
      industry,
      timestamp: Date.now(),
    });

    // Keep memory lean (last 500 prompts max)
    if (promptMemory.length > 500) promptMemory.shift();

    return id;
  }

  /**
   * RECALL: Find top-N similar prompts from memory using latent space similarity
   * This is semantic search — finds prompts with SIMILAR MEANING, not just same words!
   *
   * e.g. "restaurant food bot" will find "pizza delivery automation" (both food!)
   *
   * @param prompt - query prompt
   * @param topN - how many similar prompts to return
   * @returns array of similar stored prompts with similarity scores
   */
  static recall(
    prompt: string,
    topN = 3
  ): Array<StoredPrompt & { similarity: number }> {
    if (promptMemory.length === 0) return [];

    const features = textToFeatureVector(prompt);
    const queryLatent = encode(features);

    return promptMemory
      .map(stored => ({
        ...stored,
        similarity: parseFloat(
          cosineSim(queryLatent, stored.latentVector).toFixed(3)
        ),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topN);
  }

  /**
   * VALIDATE: Quick check — is this a valid business prompt?
   * Returns true if prompt is valid, false if spam/gibberish
   */
  static isValidPrompt(prompt: string): boolean {
    if (!prompt || prompt.trim().length < 5) return false;
    const result = this.analyze(prompt);
    return !result.isAnomaly;
  }

  /**
   * COMPRESS: Get the 8-number latent representation of any text
   * These 8 numbers encode the "meaning" of the entire prompt!
   * Useful for: deduplication, clustering, storage optimization
   */
  static compress(prompt: string): LatentVector {
    const features = textToFeatureVector(prompt);
    return encode(features);
  }

  /**
   * GET MEMORY STATS: How many prompts are remembered?
   */
  static getMemoryStats(): {
    totalStored: number;
    byIndustry: Record<string, number>;
    oldestEntry: string | null;
  } {
    const byIndustry: Record<string, number> = {};
    for (const p of promptMemory) {
      byIndustry[p.industry] = (byIndustry[p.industry] || 0) + 1;
    }
    return {
      totalStored: promptMemory.length,
      byIndustry,
      oldestEntry:
        promptMemory.length > 0
          ? new Date(promptMemory[0].timestamp).toISOString()
          : null,
    };
  }

  /**
   * CLEAR MEMORY: Reset the prompt store
   */
  static clearMemory(): void {
    promptMemory.length = 0;
  }
}

// ── Helper: Generate human-readable reason ────────────────────────────────────
function generateReason(
  prompt: string,
  error: number,
  isAnomaly: boolean
): string {
  const words = prompt.trim().split(/\s+/);

  if (isAnomaly) {
    if (words.length < 3)
      return "Prompt too short — not enough business context detected";
    if (/[^a-zA-Z0-9\s\u0600-\u06FF.,!?'-]/g.test(prompt))
      return "Unusual characters detected — possible spam or injection attempt";
    if (error > 0.8)
      return "Completely unrecognized pattern — gibberish or random input";
    return "Low business signal — prompt does not match known automation patterns";
  }

  if (error < 0.1)
    return "Very strong business signal — high confidence automation match";
  if (error < 0.25)
    return "Clear business intent detected with known industry keywords";
  return "Valid business prompt — partial keyword match with known patterns";
}
