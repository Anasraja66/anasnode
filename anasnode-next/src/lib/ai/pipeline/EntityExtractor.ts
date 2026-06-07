import { Token } from "./Tokenizer";
import { Annotation, EXTRACTION_RULES, EntityType, NER_CATEGORY } from "../resources/schemas";
import { Lexicon } from "../resources/lexicons";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * EntityExtractor — Full NER Processing Resource
 * Implements 3 layers of Named Entity Recognition:
 *   Level 1: Dictionary Look-up   (Gazetteer from Lexicons)
 *   Level 2: Rule-Based (Regex)   (EXTRACTION_RULES from schemas)
 *   Level 3: Title/Context Rules  (Dr. → PERSON, Ltd. → ORGANIZATION)
 *
 * Covers full NER taxonomy: ENAMEX + NUMEX + TIMEX
 * ─────────────────────────────────────────────────────────────────────────────
 */
export class EntityExtractor {

  // ── Level 1: Dictionary / Gazetteer Look-up ────────────────────────────────
  static extractFromLexicon(text: string, tokens: Token[], lexicon: Lexicon): Annotation[] {
    const annotations: Annotation[] = [];
    const lowerText = text.toLowerCase();

    const tag = (words: string[], type: EntityType) => {
      for (const word of words) {
        let index = lowerText.indexOf(word.toLowerCase());
        while (index !== -1) {
          // Word boundary check — avoid matching inside longer words
          const before = index === 0 ? " " : lowerText[index - 1];
          const after = index + word.length >= lowerText.length ? " " : lowerText[index + word.length];
          const isBoundary = /[\s,.\-!?]/.test(before) && /[\s,.\-!?]/.test(after);

          const tokenMatch = tokens.find(t => t.start <= index && t.end >= index + word.length);
          if (tokenMatch || word.includes(" ") || isBoundary) {
            const value = text.substring(index, index + word.length);
            annotations.push({
              id: `lex_${type}_${index}`,
              type,
              nerCategory: NER_CATEGORY[type] ?? "MISC",
              start: index,
              end: index + word.length,
              value,
              confidence: 0.90,
              xmlTag: buildXmlTag(type, value),
            });
          }
          index = lowerText.indexOf(word.toLowerCase(), index + 1);
        }
      }
    };

    tag(lexicon.entities.product,    "PRODUCT");
    tag(lexicon.entities.action,     "ACTION");
    tag(lexicon.entities.location,   "LOCATION");
    tag(lexicon.entities.attributes, "ATTRIBUTE");

    return annotations;
  }

  // ── Level 2: Regex / Rule-Based Extraction (NUMEX + TIMEX + title ENAMEX) ──
  static extractFromRules(text: string): Annotation[] {
    const annotations: Annotation[] = [];

    for (const rule of EXTRACTION_RULES) {
      rule.pattern.lastIndex = 0; // reset stateful regex
      let match;
      while ((match = rule.pattern.exec(text)) !== null) {
        const value = match[0].trim();
        if (!value || value.length < 2) continue; // skip noise

        annotations.push({
          id: `rule_${rule.type}_${match.index}`,
          type: rule.type,
          nerCategory: NER_CATEGORY[rule.type] ?? "MISC",
          start: match.index,
          end: match.index + match[0].length,
          value,
          confidence: 0.85,
          xmlTag: buildXmlTag(rule.type, value),
        });
      }
    }

    return annotations;
  }

  // ── Level 3: Person Name Detection (Capitalized Words heuristic) ───────────
  // Catches names like "Ali Raza" or "Sara Khan" that aren't in title-prefixed rules
  static extractPersonNames(text: string): Annotation[] {
    const annotations: Annotation[] = [];

    // Pattern: Two or more consecutive Capitalized Words not at sentence start
    const pattern = /(?<!\.\s)(?<!\n)\b([A-Z][a-z]{1,15})\s([A-Z][a-z]{1,15})\b/g;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      // Skip common false positives (days, months, org words)
      const skip = ["January","February","March","April","June","July","August",
        "September","October","November","December","Monday","Tuesday","Wednesday",
        "Thursday","Friday","Saturday","Sunday","Ltd","Corp","Inc","Group"];
      if (skip.includes(match[1]) || skip.includes(match[2])) continue;

      const value = match[0];
      annotations.push({
        id: `person_${match.index}`,
        type: "PERSON",
        nerCategory: "ENAMEX",
        start: match.index,
        end: match.index + value.length,
        value,
        confidence: 0.75,
        xmlTag: buildXmlTag("PERSON", value),
      });
    }
    return annotations;
  }

  // ── Master Extractor: runs all levels, deduplicates overlaps ──────────────
  static extractAll(text: string, tokens: Token[], lexicon: Lexicon): Annotation[] {
    const lex   = this.extractFromLexicon(text, tokens, lexicon);
    const rules = this.extractFromRules(text);
    const names = this.extractPersonNames(text);

    const combined = [...lex, ...rules, ...names];

    // Deduplicate: if two annotations overlap, keep the one with higher confidence
    const deduped = deduplicate(combined);

    return deduped.sort((a, b) => a.start - b.start);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generates the standard NER XML tag string for an entity.
 * e.g. PERSON → <ENAMEX TYPE="PERSON">Ali Raza</ENAMEX>
 *      MONEY  → <NUMEX TYPE="MONEY">50 lakh</NUMEX>
 *      DATE   → <TIMEX TYPE="DATE">15 August</TIMEX>
 */
function buildXmlTag(type: EntityType, value: string): string {
  const category = NER_CATEGORY[type] ?? "MISC";
  if (category === "ENAMEX") return `<ENAMEX TYPE="${type}">${value}</ENAMEX>`;
  if (category === "NUMEX")  return `<NUMEX TYPE="${type}">${value}</NUMEX>`;
  if (category === "TIMEX")  return `<TIMEX TYPE="${type}">${value}</TIMEX>`;
  return value;
}

/**
 * Removes overlapping annotations, keeping higher-confidence ones.
 */
function deduplicate(annotations: Annotation[]): Annotation[] {
  const sorted = [...annotations].sort((a, b) => b.confidence - a.confidence);
  const result: Annotation[] = [];

  for (const anno of sorted) {
    const overlaps = result.some(r =>
      !(anno.end <= r.start || anno.start >= r.end) // they overlap
    );
    if (!overlaps) result.push(anno);
  }

  return result;
}
