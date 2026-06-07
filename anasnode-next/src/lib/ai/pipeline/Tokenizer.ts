/**
 * A simple Tokenizer (PR - Processing Resource in GATE terms).
 * It takes raw text and breaks it down into tokens (words, punctuation).
 */

export interface Token {
  value: string;
  start: number;
  end: number;
}

export class Tokenizer {
  /**
   * Tokenizes a string into words and punctuation, keeping track of character offsets.
   */
  static tokenize(text: string): Token[] {
    const tokens: Token[] = [];
    const regex = /\w+|\S/g; // Matches words or single non-whitespace characters
    let match;

    while ((match = regex.exec(text)) !== null) {
      tokens.push({
        value: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    return tokens;
  }
}
