/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Tokenizer.ts — Lexical Analysis & Text Processing (PR)
 *
 * Upgraded to implement the full Lexical Analysis pipeline:
 *
 *   1. Tokenization: Splits text into Tokens (handles punctuation/whitespace).
 *   2. Normalization: Case Folding (converting to lowercase).
 *   3. Stemming: Simplified Porter Stemmer (Affix chopping for plurals/ing).
 *   4. Lemmatization: Dictionary reduction (is/are -> be).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Token {
  originalValue: string; // "Cars"
  value: string;         // "cars" (Normalized / Case Folded)
  lemma: string;         // "car"  (Lemmatized)
  stem: string;          // "car"  (Stemmed)
  start: number;
  end: number;
}

export class Tokenizer {
  
  // ── 1. Dictionary for Lemmatization (Deep Morphological Rules) ─────────────
  private static LEMMA_DICT: Record<string, string> = {
    "am": "be", "is": "be", "are": "be", "was": "be", "were": "be", "been": "be",
    "has": "have", "had": "have",
    "does": "do", "did": "do", "done": "do",
    "men": "man", "women": "woman", "children": "child", "teeth": "tooth",
    "mice": "mouse", "geese": "goose",
  };

  /**
   * Main Lexical Analysis Pipeline
   */
  static process(text: string): Token[] {
    const tokens: Token[] = [];
    
    // ── STEP 1: Tokenization (Splitting raw text) ──
    const regex = /\w+|\S/g; // Words or single punctuation
    let match;

    while ((match = regex.exec(text)) !== null) {
      const originalValue = match[0];
      
      // ── STEP 2: Normalization (Case Folding) ──
      const normalizedValue = originalValue.toLowerCase();

      // ── STEP 3: Lemmatization (Better Precision) ──
      const lemma = this.lemmatize(normalizedValue);

      // ── STEP 4: Stemming (Better Recall - crude chopping) ──
      const stem = this.stem(normalizedValue);

      tokens.push({
        originalValue,
        value: normalizedValue,
        lemma,
        stem,
        start: match.index,
        end: match.index + originalValue.length,
      });
    }

    return tokens;
  }

  /**
   * Old tokenize method for backward compatibility
   * Maps new Token structure to old {value, start, end}
   */
  static tokenize(text: string): { value: string; start: number; end: number }[] {
    return this.process(text).map(t => ({
      value: t.originalValue,
      start: t.start,
      end: t.end
    }));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPERS: Stemming vs Lemmatization
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Lemmatization: Uses proper dictionary mapping.
   * "is" -> "be", "cars" -> "car"
   */
  private static lemmatize(word: string): string {
    // 1. Check strict dictionary overrides
    if (this.LEMMA_DICT[word]) return this.LEMMA_DICT[word];

    // 2. Simple singularization rule for regular nouns
    if (word.length > 3 && word.endsWith("ies") && !word.endsWith("eies") && !word.endsWith("aies")) {
      return word.slice(0, -3) + "y"; // flies -> fly, cities -> city
    }
    if (word.length > 2 && word.endsWith("ves")) {
      return word.slice(0, -3) + "f"; // wolves -> wolf, halves -> half
    }
    if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us")) {
      return word.slice(0, -1); // cars -> car
    }

    return word;
  }

  /**
   * Stemming: Simplified Porter-style crude chopping.
   * "automates", "automatic", "automation" -> "automat"
   */
  private static stem(word: string): string {
    let stem = word;

    // Plurals / Suffixes
    if (stem.endsWith("sses")) stem = stem.slice(0, -2);
    else if (stem.endsWith("ies")) stem = stem.slice(0, -3) + "i";
    else if (stem.endsWith("ss")) stem = stem;
    else if (stem.endsWith("s") && stem.length > 3) stem = stem.slice(0, -1);

    // -ing and -ed
    if (stem.endsWith("ing") && stem.length > 4) {
      stem = stem.slice(0, -3);
    } else if (stem.endsWith("ed") && stem.length > 3) {
      stem = stem.slice(0, -2);
    }

    // -ational -> -ate (Porter Step 2 example)
    if (stem.endsWith("ational")) stem = stem.slice(0, -7) + "ate";

    // -ation -> -ate
    if (stem.endsWith("ation")) stem = stem.slice(0, -5) + "ate";

    return stem;
  }
}
