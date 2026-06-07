/**
 * ─────────────────────────────────────────────────────────────────────────────
 * POSTagger.ts — Part-Of-Speech Tagger (Processing Resource)
 * 
 * Implements 3-level POS Tagging (as per lecture):
 *   Level 1: Dictionary Look-up  → most common tag for known words
 *   Level 2: Rule-Based (Brill)  → suffix/context rules fix wrong tags
 *   Level 3: Context Rules       → Transition logic (TO → VB, DT → NN)
 *
 * Standard Penn Treebank POS Tags used:
 *   NN  = Noun (singular)        NNS = Noun (plural)
 *   NNP = Proper Noun            NNPS = Proper Noun (plural)
 *   VB  = Verb (base)            VBZ = Verb (3rd person singular)
 *   VBD = Verb (past tense)      VBG = Verb (gerund/present participle)
 *   VBN = Verb (past participle) VBP = Verb (non-3rd person)
 *   JJ  = Adjective              JJR = Adjective (comparative)
 *   JJS = Adjective (superlative)
 *   RB  = Adverb                 RBR = Adverb (comparative)
 *   DT  = Determiner             IN  = Preposition / Subordinating Conjunction
 *   CC  = Coordinating Conjunction
 *   PRP = Personal Pronoun       PRP$ = Possessive Pronoun
 *   CD  = Cardinal Number        TO  = to
 *   MD  = Modal                  EX  = Existential there
 *   WP  = Wh-pronoun             WDT = Wh-determiner
 *   UH  = Interjection           FW  = Foreign Word
 *   SYM = Symbol                 POS = Possessive Ending
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type POSTag =
  | "NN" | "NNS" | "NNP" | "NNPS"
  | "VB" | "VBZ" | "VBD" | "VBG" | "VBN" | "VBP"
  | "JJ" | "JJR" | "JJS"
  | "RB" | "RBR" | "RBS"
  | "DT" | "IN" | "CC"
  | "PRP" | "PRP$"
  | "CD" | "TO" | "MD" | "EX"
  | "WP" | "WDT" | "WRB"
  | "UH" | "FW" | "SYM" | "POS"
  | "UNKNOWN";

export interface TaggedToken {
  word: string;          // original word
  tag: POSTag;           // assigned POS tag
  tagLabel: string;      // human-readable label (e.g., "Noun", "Verb")
  isProperNoun: boolean; // quick flag for NER pipeline
  isVerb: boolean;       // quick flag for intent detection
  isAdjective: boolean;  // quick flag for attribute detection
  isAdverb: boolean;     // quick flag for modifier detection
}

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 1: Static Dictionary (Most Frequent Tag per Word)
// ─────────────────────────────────────────────────────────────────────────────
const WORD_TAG_DICT: Record<string, POSTag> = {
  // ── Determiners ──
  the: "DT", a: "DT", an: "DT", this: "DT", that: "DT",
  these: "DT", those: "DT", my: "PRP$", your: "PRP$", his: "PRP$",
  her: "PRP$", its: "PRP$", our: "PRP$", their: "PRP$",
  some: "DT", any: "DT", each: "DT", every: "DT", no: "DT",

  // ── Pronouns ──
  i: "PRP", you: "PRP", he: "PRP", she: "PRP", it: "PRP",
  we: "PRP", they: "PRP", me: "PRP", him: "PRP", us: "PRP", them: "PRP",
  who: "WP", what: "WP", which: "WDT", whose: "WP",

  // ── Modal Verbs ──
  can: "MD", could: "MD", will: "MD", would: "MD", shall: "MD",
  should: "MD", may: "MD", might: "MD", must: "MD", ought: "MD",

  // ── Common Verbs ──
  is: "VBZ", are: "VBP", was: "VBD", were: "VBD", be: "VB", been: "VBN",
  being: "VBG", have: "VBP", has: "VBZ", had: "VBD", having: "VBG",
  do: "VBP", does: "VBZ", did: "VBD", doing: "VBG", done: "VBN",
  go: "VB", goes: "VBZ", went: "VBD", going: "VBG", gone: "VBN",
  want: "VBP", wants: "VBZ", wanted: "VBD", wanting: "VBG",
  need: "VBP", needs: "VBZ", needed: "VBD",
  buy: "VB", buys: "VBZ", bought: "VBD", buying: "VBG",
  sell: "VB", sells: "VBZ", sold: "VBD", selling: "VBG",
  rent: "VB", rents: "VBZ", rented: "VBD", renting: "VBG",
  book: "VB", books: "VBZ", booked: "VBD", booking: "VBG",
  order: "VB", orders: "VBZ", ordered: "VBD", ordering: "VBG",
  make: "VB", makes: "VBZ", made: "VBD", making: "VBG",
  get: "VB", gets: "VBZ", got: "VBD", getting: "VBG",
  give: "VB", gives: "VBZ", gave: "VBD", giving: "VBG",
  take: "VB", takes: "VBZ", took: "VBD", taking: "VBG",
  come: "VB", comes: "VBZ", came: "VBD", coming: "VBG",
  know: "VB", knows: "VBZ", knew: "VBD", knowing: "VBG",
  think: "VB", thinks: "VBZ", thought: "VBD", thinking: "VBG",
  see: "VB", sees: "VBZ", saw: "VBD", seeing: "VBG",
  look: "VB", looks: "VBZ", looked: "VBD", looking: "VBG",
  send: "VB", sends: "VBZ", sent: "VBD", sending: "VBG",
  live: "VB", lives: "VBZ", lived: "VBD", living: "VBG",
  work: "VB", works: "VBZ", worked: "VBD", working: "VBG",
  provide: "VB", provides: "VBZ", provided: "VBD", providing: "VBG",
  show: "VB", shows: "VBZ", showed: "VBD", showing: "VBG",
  call: "VB", calls: "VBZ", called: "VBD", calling: "VBG",
  pay: "VB", pays: "VBZ", paid: "VBD", paying: "VBG",
  deliver: "VB", delivers: "VBZ", delivered: "VBD", delivering: "VBG",
  reserve: "VB", reserves: "VBZ", reserved: "VBD", reserving: "VBG",
  cancel: "VB", cancels: "VBZ", cancelled: "VBD", cancelling: "VBG",
  check: "VB", checks: "VBZ", checked: "VBD", checking: "VBG",
  confirm: "VB", confirms: "VBZ", confirmed: "VBD", confirming: "VBG",
  schedule: "VB", schedules: "VBZ", scheduled: "VBD", scheduling: "VBG",

  // ── Prepositions ──
  in: "IN", on: "IN", at: "IN", by: "IN", for: "IN", with: "IN",
  about: "IN", against: "IN", between: "IN", into: "IN", through: "IN",
  during: "IN", before: "IN", after: "IN", above: "IN", below: "IN",
  from: "IN", up: "IN", down: "IN", out: "IN", off: "IN", over: "IN",
  under: "IN", around: "IN", near: "IN", within: "IN", without: "IN",
  of: "IN", to: "TO", until: "IN", than: "IN", since: "IN",

  // ── Conjunctions ──
  and: "CC", but: "CC", or: "CC", nor: "CC", yet: "CC", so: "CC",
  if: "IN", because: "IN", although: "IN", while: "IN", when: "IN",
  where: "WRB", why: "WRB", how: "WRB",

  // ── Common Adjectives ──
  good: "JJ", bad: "JJ", big: "JJ", small: "JJ", large: "JJ",
  new: "JJ", old: "JJ", high: "JJ", low: "JJ", long: "JJ", short: "JJ",
  great: "JJ", little: "JJ", own: "JJ", right: "JJ", best: "JJS",
  next: "JJ", early: "JJ", young: "JJ", important: "JJ", public: "JJ",
  private: "JJ", real: "JJ", full: "JJ", free: "JJ", sure: "JJ",
  better: "JJR", worse: "JJR", bigger: "JJR", smaller: "JJR",
  furnished: "JJ", unfurnished: "JJ", modern: "JJ", luxury: "JJ",
  affordable: "JJ", expensive: "JJ", cheap: "JJ", urgent: "JJ",
  available: "JJ", open: "JJ", closed: "JJ", active: "JJ",
  fresh: "JJ", hot: "JJ", cold: "JJ", spicy: "JJ", sweet: "JJ",

  // ── Common Adverbs ──
  not: "RB", also: "RB", just: "RB", very: "RB", still: "RB",
  even: "RB", well: "RB", only: "RB", really: "RB", already: "RB",
  now: "RB", then: "RB", here: "RB", there: "EX", always: "RB",
  never: "RB", often: "RB", again: "RB", once: "RB", soon: "RB",
  quickly: "RB", slowly: "RB", easily: "RB", directly: "RB",
  immediately: "RB", recently: "RB", finally: "RB", simply: "RB",

  // ── "to" ──
  // (handled as TO tag separately)

  // ── Interjections ──
  oh: "UH", ah: "UH", hey: "UH", yes: "UH",
  ok: "UH", okay: "UH", please: "UH", thanks: "UH", hello: "UH",
  hi: "UH", sorry: "UH", wow: "UH",
};

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 2: Suffix-Based Rules (Brill Tagger — Rule Learning)
// "If word ends in -ly → RB (Adverb)"
// ─────────────────────────────────────────────────────────────────────────────
function applyMorphologicalRules(word: string, currentTag: POSTag): POSTag {
  const lower = word.toLowerCase();

  // Adverb suffixes
  if (lower.endsWith("ly") && word.length > 4)                return "RB";

  // Adjective suffixes
  if (lower.endsWith("ful") || lower.endsWith("ous") ||
      lower.endsWith("ive") || lower.endsWith("able") ||
      lower.endsWith("ible") || lower.endsWith("al") ||
      lower.endsWith("ical") || lower.endsWith("less"))        return "JJ";

  // Comparative / Superlative adjective
  if (lower.endsWith("er") && word.length > 3)                return "JJR";
  if (lower.endsWith("est") && word.length > 4)               return "JJS";

  // Noun suffixes
  if (lower.endsWith("tion") || lower.endsWith("sion") ||
      lower.endsWith("ment") || lower.endsWith("ness") ||
      lower.endsWith("ity") || lower.endsWith("ism") ||
      lower.endsWith("ist") || lower.endsWith("er") ||
      lower.endsWith("or") || lower.endsWith("ry"))           return "NN";

  // Plural noun
  if (lower.endsWith("s") && word.length > 3 &&
      !lower.endsWith("ss") && currentTag === "NN")           return "NNS";

  // Verb gerund (-ing)
  if (lower.endsWith("ing") && word.length > 5)               return "VBG";

  // Verb past tense (-ed)
  if (lower.endsWith("ed") && word.length > 4)                return "VBD";

  // Proper noun: starts with capital (and not at sentence start)
  if (word[0] === word[0].toUpperCase() &&
      word[0] !== word[0].toLowerCase())                       return "NNP";

  // Pure number → Cardinal digit
  if (/^\d+(\.\d+)?$/.test(word))                             return "CD";

  return currentTag;
}

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 3: Context / Transition Rules (Brill Patch Rules)
// "If prev tag is TO → current should be VB (not NN)"
// ─────────────────────────────────────────────────────────────────────────────
function applyContextRules(
  tagged: { word: string; tag: POSTag }[],
  index: number
): POSTag {
  const current = tagged[index];
  const prev    = index > 0 ? tagged[index - 1] : null;
  const next    = index < tagged.length - 1 ? tagged[index + 1] : null;

  // Brill Rule: TO + NN → change NN to VB  (e.g., "want to race" → race=VB)
  if (prev?.tag === "TO" && current.tag === "NN") return "VB";

  // Brill Rule: MD + NN → VB  (e.g., "will book" → book=VB)
  if (prev?.tag === "MD" && current.tag === "NN") return "VB";

  // Brill Rule: DT + VB → NN  (e.g., "a book" → book=NN not VB)
  if (prev?.tag === "DT" && current.tag === "VB") return "NN";

  // Brill Rule: VB + NNP → NNP stays (Proper noun after verb is still proper noun)
  if (prev && ["VB","VBZ","VBD","VBP"].includes(prev.tag) && current.tag === "NNP") return "NNP";

  // Brill Rule: CC + VB → VB (remains verb after conjunction — "and go")
  if (prev?.tag === "CC" && current.tag === "NN") return "VB";

  // Brill Rule: PRP + NN → likely VB (e.g., "I book" → book=VB)
  if (prev?.tag === "PRP" && current.tag === "NN") return "VB";

  // Brill Rule: If followed by NN, a JJ stays JJ (e.g., "large apartment")
  if (next?.tag === "NN" && current.tag === "VBD") return "JJ";

  return current.tag;
}

// ─────────────────────────────────────────────────────────────────────────────
// Human-readable labels for POS tags
// ─────────────────────────────────────────────────────────────────────────────
const TAG_LABELS: Record<POSTag, string> = {
  NN: "Noun", NNS: "Noun (plural)", NNP: "Proper Noun", NNPS: "Proper Noun (plural)",
  VB: "Verb (base)", VBZ: "Verb (3rd person)", VBD: "Verb (past)",
  VBG: "Verb (gerund)", VBN: "Verb (past participle)", VBP: "Verb (present)",
  JJ: "Adjective", JJR: "Adjective (comparative)", JJS: "Adjective (superlative)",
  RB: "Adverb", RBR: "Adverb (comparative)", RBS: "Adverb (superlative)",
  DT: "Determiner", IN: "Preposition", CC: "Conjunction",
  PRP: "Pronoun", "PRP$": "Possessive Pronoun",
  CD: "Number", TO: "to", MD: "Modal", EX: "Existential",
  WP: "Wh-pronoun", WDT: "Wh-determiner", WRB: "Wh-adverb",
  UH: "Interjection", FW: "Foreign Word", SYM: "Symbol", POS: "Possessive",
  UNKNOWN: "Unknown",
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN POS TAGGER CLASS
// ─────────────────────────────────────────────────────────────────────────────
export class POSTagger {

  /**
   * Tags an array of word-strings and returns TaggedToken[]
   * Full 3-level pipeline: Dictionary → Morphology → Context
   */
  static tag(words: string[]): TaggedToken[] {

    // ── Level 1: Dictionary Look-up ─────────────────────────────────────────
    const step1 = words.map(word => ({
      word,
      tag: (WORD_TAG_DICT[word.toLowerCase()] ?? "NN") as POSTag,
    }));

    // ── Level 2: Morphological / Suffix Rules ───────────────────────────────
    const step2 = step1.map(({ word, tag }) => ({
      word,
      tag: applyMorphologicalRules(word, tag),
    }));

    // ── Level 3: Context / Transition Rules (Brill Patches) ─────────────────
    const step3 = step2.map((item, i) => ({
      word: item.word,
      tag: applyContextRules(step2, i),
    }));

    // ── Final: Build TaggedToken output ─────────────────────────────────────
    return step3.map(({ word, tag }) => ({
      word,
      tag,
      tagLabel: TAG_LABELS[tag] ?? "Unknown",
      isProperNoun: tag === "NNP" || tag === "NNPS",
      isVerb:       tag.startsWith("VB") || tag === "MD",
      isAdjective:  tag.startsWith("JJ"),
      isAdverb:     tag.startsWith("RB"),
    }));
  }

  /**
   * Returns a readable string like:
   * "The/DT dog/NN barks/VBZ loudly/RB"
   */
  static toTagString(tagged: TaggedToken[]): string {
    return tagged.map(t => `${t.word}/${t.tag}`).join(" ");
  }

  /**
   * Extracts only Proper Nouns (NNP) — directly feeds into NER as candidates
   */
  static getProperNouns(tagged: TaggedToken[]): string[] {
    return tagged.filter(t => t.isProperNoun).map(t => t.word);
  }

  /**
   * Extracts main Verbs — feeds into Intent detection
   */
  static getMainVerbs(tagged: TaggedToken[]): string[] {
    return tagged.filter(t => t.isVerb).map(t => t.word);
  }

  /**
   * Extracts Adjectives — feeds into Attribute extraction
   */
  static getAdjectives(tagged: TaggedToken[]): string[] {
    return tagged.filter(t => t.isAdjective).map(t => t.word);
  }
}
