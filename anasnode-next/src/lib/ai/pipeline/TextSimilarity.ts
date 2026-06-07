/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TextSimilarity.ts — NLP Similarity Metrics
 *
 * Implements 3 core metrics for comparing text (as per lecture):
 *
 *   1. Cosine Similarity (Angle Wala Math)
 *      - Measures angle between two vectors (ignores magnitude)
 *      - Best for general text similarity in NLP (TF-IDF vectors)
 *      - Range: 0 (no similarity) to 1 (exact same direction)
 *
 *   2. Jaccard Similarity (Sets Wala Overlap)
 *      - Intersection over Union of unique words
 *      - Best for quick keyword overlap, plagiarism, spell-check ideas
 *      - Range: 0 (no common words) to 1 (exact same words)
 *
 *   3. Euclidean Distance (Seedhi Line ka Fasla)
 *      - Straight-line geometric distance in high-dimensional space
 *      - Best for document clustering (K-Means etc.)
 *      - Range: 0 (exact match) to Infinity
 * ─────────────────────────────────────────────────────────────────────────────
 */

export class TextSimilarity {
  
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. COSINE SIMILARITY
  // ─────────────────────────────────────────────────────────────────────────────
  
  /**
   * Calculates Cosine Similarity between two numerical vectors.
   * Formula: (A • B) / (||A|| * ||B||)
   */
  static cosine(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    
    return parseFloat((dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))).toFixed(4));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. JACCARD SIMILARITY
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Calculates Jaccard Similarity between two sets of strings.
   * Formula: |A ∩ B| / |A ∪ B|
   */
  static jaccard(setA: Set<string> | string[], setB: Set<string> | string[]): number {
    const a = new Set(setA);
    const b = new Set(setB);

    if (a.size === 0 && b.size === 0) return 1;

    let intersectionCount = 0;
    for (const item of a) {
      if (b.has(item)) intersectionCount++;
    }

    const unionCount = a.size + b.size - intersectionCount;
    
    return parseFloat((intersectionCount / unionCount).toFixed(4));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. EUCLIDEAN DISTANCE
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Calculates Euclidean Distance between two numerical vectors.
   * Formula: sqrt( Σ (A_i - B_i)² )
   * Note: This is a DISTANCE, so lower = more similar.
   */
  static euclideanDistance(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return Infinity;

    let sumOfSquares = 0;
    for (let i = 0; i < vecA.length; i++) {
      const diff = vecA[i] - vecB[i];
      sumOfSquares += diff * diff;
    }

    return parseFloat(Math.sqrt(sumOfSquares).toFixed(4));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPER: BUILD ALIGNED VECTORS (For Cosine/Euclidean)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Takes two raw text strings and builds aligned frequency vectors for them
   * based on a combined vocabulary. 
   */
  static buildVectors(textA: string, textB: string): { vecA: number[], vecB: number[], vocab: string[] } {
    // 1. Tokenize (simple split)
    const tokensA = textA.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const tokensB = textB.toLowerCase().split(/\s+/).filter(w => w.length > 0);

    // 2. Build Vocabulary (Union of words)
    const vocabSet = new Set([...tokensA, ...tokensB]);
    const vocab = Array.from(vocabSet);

    // 3. Initialize Vectors
    const vecA = new Array(vocab.length).fill(0);
    const vecB = new Array(vocab.length).fill(0);

    // 4. Fill Frequencies
    tokensA.forEach(word => {
      const idx = vocab.indexOf(word);
      if (idx !== -1) vecA[idx]++;
    });

    tokensB.forEach(word => {
      const idx = vocab.indexOf(word);
      if (idx !== -1) vecB[idx]++;
    });

    return { vecA, vecB, vocab };
  }

  /**
   * End-to-End helper: Pass two sentences, get Cosine Similarity directly.
   */
  static compareCosineText(textA: string, textB: string): number {
    const { vecA, vecB } = this.buildVectors(textA, textB);
    return this.cosine(vecA, vecB);
  }
}
