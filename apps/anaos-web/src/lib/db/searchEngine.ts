import { DocumentAnnotation } from "../ai/resources/schemas";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * searchEngine.ts — Anaos Simulated Search Engine
 *
 * Upgraded to TF-IDF based ranking (as per NLP Vectorization lecture):
 *
 *   Level 1 (Old): Simple word match → BoW style (all words equal weight)
 *   Level 2 (New): TF-IDF scoring  → common words penalized, rare words win
 *
 * TF  = term frequency in document     (how often word appears)
 * IDF = inverse document frequency     (how rare word is across all docs)
 * TF-IDF = TF × IDF                    (final relevance score)
 *
 * Stop Words: "the","is","and","a","in","on","at","of","to","for","with"
 * → IDF ≈ 0 for these → score ≈ 0 → automatically ignored ✅
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface IndexedDocument {
  _id: string;
  timestamp: number;
  data: DocumentAnnotation;
  // TF-IDF Index: word → term frequency in this document
  tfIndex: Record<string, number>;
  tokenCount: number;
}

export interface SearchResult {
  document: IndexedDocument;
  score: number;         // TF-IDF relevance score
  matchedTerms: string[]; // which query terms matched
}

// ── Stop Words (common English words — IDF will auto-zero these) ──────────────
const STOP_WORDS = new Set([
  "the","a","an","is","are","was","were","be","been","being",
  "have","has","had","do","does","did","will","would","could","should",
  "may","might","shall","can","need","dare","ought","used",
  "i","you","he","she","it","we","they","me","him","her","us","them",
  "my","your","his","its","our","their",
  "this","that","these","those","what","which","who","whom","whose",
  "when","where","why","how","all","each","every","some","any","few",
  "more","most","other","such","no","not","only","same","so","than",
  "too","very","just","but","and","or","if","in","on","at","by",
  "for","with","about","against","between","into","through","of","to","from",
]);

// ─────────────────────────────────────────────────────────────────────────────
// TEXT UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/** Tokenize text into lowercase cleaned words */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Build Term Frequency map for a document.
 * TF(t, d) = count(t in d) / total_terms_in_d
 */
function buildTF(tokens: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const token of tokens) {
    counts[token] = (counts[token] ?? 0) + 1;
  }
  // Normalize by document length
  const total = tokens.length || 1;
  const tf: Record<string, number> = {};
  for (const [term, count] of Object.entries(counts)) {
    tf[term] = count / total;
  }
  return tf;
}

/**
 * Calculate IDF for a term across all indexed documents.
 * IDF(t) = log10(N / df_t)
 * where N = total docs, df_t = docs containing term t
 */
function calculateIDF(term: string, allDocs: IndexedDocument[]): number {
  const N = allDocs.length;
  if (N === 0) return 0;

  const docsContaining = allDocs.filter(doc => term in doc.tfIndex).length;
  if (docsContaining === 0) return 0;

  return Math.log10(N / docsContaining);
}

/**
 * Calculate TF-IDF score for a single term in a document.
 * TF-IDF = TF(t, d) × IDF(t)
 */
function tfidf(term: string, doc: IndexedDocument, allDocs: IndexedDocument[]): number {
  const tf = doc.tfIndex[term] ?? 0;
  const idf = calculateIDF(term, allDocs);
  return tf * idf;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH ENGINE CLASS
// ─────────────────────────────────────────────────────────────────────────────

class SearchEngine {
  private index: Map<string, IndexedDocument> = new Map();

  // ── Index a Document ────────────────────────────────────────────────────────
  async indexDocument(doc: DocumentAnnotation): Promise<string> {
    const id = `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Build the full text corpus for this document
    // Include: original text + intent + entity values + summary fields
    const fullText = [
      doc.originalText,
      doc.intent,
      ...doc.annotations.map(a => a.value),
      ...doc.summary.persons,
      ...doc.summary.locations,
      ...doc.summary.products,
      ...doc.summary.money,
    ].join(" ");

    const tokens     = tokenize(fullText);
    const tfIndex    = buildTF(tokens);
    const tokenCount = tokens.length;

    this.index.set(id, {
      _id: id,
      timestamp: Date.now(),
      data: doc,
      tfIndex,
      tokenCount,
    });

    console.log(`[Anaos SearchEngine] Indexed doc ${id} | ${tokenCount} terms | Intent: ${doc.intent}`);
    return id;
  }

  // ── TF-IDF Search ──────────────────────────────────────────────────────────
  async search(query: string): Promise<SearchResult[]> {
    const allDocs    = Array.from(this.index.values());
    const queryTerms = tokenize(query);

    if (queryTerms.length === 0) {
      // Query is all stop-words → return recent docs
      return allDocs
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
        .map(d => ({ document: d, score: 0, matchedTerms: [] }));
    }

    const results: SearchResult[] = [];

    for (const doc of allDocs) {
      let totalScore = 0;
      const matchedTerms: string[] = [];

      for (const term of queryTerms) {
        // 1. TF-IDF score for this term in this document
        const tfIdfScore = tfidf(term, doc, allDocs);

        // 2. Bonus: if the term matches an entity value → higher weight
        const entityBonus = doc.data.annotations.some(
          a => a.value.toLowerCase().includes(term)
        ) ? 0.5 : 0;

        // 3. Bonus: if the term matches the intent
        const intentBonus = doc.data.intent.toLowerCase().includes(term) ? 0.3 : 0;

        // 4. Bonus: if the term is in summary locations/products (high relevance)
        const summaryBonus = [
          ...doc.data.summary.locations,
          ...doc.data.summary.products,
          ...doc.data.summary.persons,
        ].some(s => s.toLowerCase().includes(term)) ? 0.4 : 0;

        const termScore = tfIdfScore + entityBonus + intentBonus + summaryBonus;

        if (termScore > 0 || doc.data.originalText.toLowerCase().includes(term)) {
          totalScore += termScore;
          matchedTerms.push(term);
        }
      }

      if (matchedTerms.length > 0) {
        results.push({
          document: doc,
          score: parseFloat(totalScore.toFixed(4)),
          matchedTerms,
        });
      }
    }

    // Sort by TF-IDF score (highest relevance first)
    return results.sort((a, b) => b.score - a.score);
  }

  // ── Get All (sorted by recency) ────────────────────────────────────────────
  async getAll(): Promise<IndexedDocument[]> {
    return Array.from(this.index.values())
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // ── Stats (for dashboard analytics) ───────────────────────────────────────
  getStats() {
    const docs = Array.from(this.index.values());
    const intentCounts: Record<string, number> = {};
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };

    for (const doc of docs) {
      const intent = doc.data.intent;
      intentCounts[intent] = (intentCounts[intent] ?? 0) + 1;
      sentimentCounts[doc.data.sentiment]++;
    }

    return {
      totalDocuments: docs.length,
      intentBreakdown: intentCounts,
      sentimentBreakdown: sentimentCounts,
      vocabularySize: new Set(docs.flatMap(d => Object.keys(d.tfIndex))).size,
    };
  }
}

// Export singleton
export const esClient = new SearchEngine();
