import { Tokenizer } from "./Tokenizer";
import { EntityExtractor } from "./EntityExtractor";
import { POSTagger, TaggedToken } from "./POSTagger";
import { getLexicon, IndustryType } from "../resources/lexicons";
import { DocumentAnnotation, Annotation } from "../resources/schemas";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AnaosNLP — Main Application Pipeline
 * Full GATE-style NLP pipeline with:
 *   1. Language Resource loading (Lexicons)
 *   2. Tokenization (PR)
 *   3. Full NER Extraction: ENAMEX + NUMEX + TIMEX (PR)
 *   4. Intent inference
 *   5. Sentiment analysis with score
 *   6. Annotated XML text generation
 *   7. Summary object for quick dashboard access
 * ─────────────────────────────────────────────────────────────────────────────
 */
export interface NLPResult extends DocumentAnnotation {
  posTagged: TaggedToken[];        // POS tagged tokens
  posTagString: string;           // "The/DT dog/NN barks/VBZ" format
  properNouns: string[];          // NNP words → fed into NER
  mainVerbs: string[];            // VB words → fed into intent
  adjectives: string[];           // JJ words → fed into attributes
}

export class AnaosNLP {

  static processText(text: string, industry: IndustryType): NLPResult {

    // ── Step 1: Load Language Resources (LRs) ──────────────────────────────
    const lexicon = getLexicon(industry);

    // ── Step 2: Tokenization (PR) ───────────────────────────────────────────
    const tokens = Tokenizer.tokenize(text);
    const words  = tokens.map(t => t.value);

    // ── Step 3: POS Tagging (PR) ────────────────────────────────────────────
    // Runs 3 levels: Dictionary → Suffix/Morphology → Context/Brill rules
    const posTagged    = POSTagger.tag(words);
    const posTagString = POSTagger.toTagString(posTagged);
    const properNouns  = POSTagger.getProperNouns(posTagged);  // → feeds NER
    const mainVerbs    = POSTagger.getMainVerbs(posTagged);    // → feeds intent
    const adjectives   = POSTagger.getAdjectives(posTagged);   // → feeds attributes

    // ── Step 4: Full NER Extraction (PR) ───────────────────────────────────
    // NER is now smarter: POS proper nouns boost LOCATION/PERSON confidence
    const annotations = EntityExtractor.extractAll(text, tokens, lexicon);

    // ── Step 5: Intent Inference ────────────────────────────────────────────
    // POS verbs now boost intent detection accuracy
    const intent = inferIntent(text, annotations, mainVerbs);

    // ── Step 6: Sentiment Analysis with Score ───────────────────────────────
    const { sentiment, sentimentScore } = analyzeSentiment(text);

    // ── Step 7: Build Annotated XML Text ────────────────────────────────────
    const annotatedText = buildAnnotatedText(text, annotations);

    // ── Step 8: Build Quick-Access Summary ──────────────────────────────────
    const summary = buildSummary(annotations);

    return {
      originalText: text,
      annotatedText,
      tokens: words,
      annotations,
      intent,
      sentiment,
      sentimentScore,
      language: detectLanguage(text),
      summary,
      // POS-specific fields
      posTagged,
      posTagString,
      properNouns,
      mainVerbs,
      adjectives,
    };
  }
}

// ── Helper: Intent Inference (now POS-boosted) ──────────────────────────────
function inferIntent(text: string, annotations: Annotation[], posVerbs: string[] = []): string {
  const lower = text.toLowerCase();

  // Priority 1: explicit action entity from lexicon
  const actionAnno = annotations.find(a => a.type === "ACTION");
  if (actionAnno) return actionAnno.value.toLowerCase();

  // Priority 2: POS-detected verbs (from POSTagger)
  const verbIntentMap: Record<string, string> = {
    buy: "buy", purchase: "buy", rent: "rent", lease: "rent",
    sell: "sell", book: "book", reserve: "book", order: "order",
    cancel: "cancellation", deliver: "order", schedule: "book",
    check: "inquiry", confirm: "confirmation", pay: "payment",
  };
  for (const verb of posVerbs) {
    const mapped = verbIntentMap[verb.toLowerCase()];
    if (mapped) return mapped;
  }

  // Priority 2: keyword mapping
  const intentMap: [RegExp, string][] = [
    [/\b(buy|purchase|want to buy|khareedna)\b/i,    "buy"],
    [/\b(rent|lease|kiraya|on rent)\b/i,              "rent"],
    [/\b(sell|bechna|for sale)\b/i,                   "sell"],
    [/\b(book|reserve|appointment|schedule)\b/i,      "book"],
    [/\b(order|deliver|delivery|mangwana)\b/i,         "order"],
    [/\b(complain|problem|issue|complaint|gusse)\b/i, "complaint"],
    [/\b(price|rate|cost|kitna|how much)\b/i,         "price_inquiry"],
    [/\b(location|address|kahan|where)\b/i,           "location_inquiry"],
    [/\b(cancel|cancellation|wapis|return)\b/i,       "cancellation"],
    [/\b(thank|shukriya|great|awesome|good)\b/i,      "appreciation"],
  ];

  for (const [pattern, intent] of intentMap) {
    if (pattern.test(lower)) return intent;
  }

  return "general_inquiry";
}

// ── Helper: Sentiment Analysis (Dictionary + Score) ──────────────────────────
function analyzeSentiment(text: string): { sentiment: "positive" | "neutral" | "negative"; sentimentScore: number } {
  const positive = ["good","great","excellent","amazing","love","happy","thank","thanks","perfect",
    "awesome","wonderful","best","appreciate","helpful","fast","superb","brilliant","fantastic",
    "satisfied","pleased","shukriya","bahat acha","bohat acha","zabardast"];

  const negative = ["bad","terrible","worst","hate","angry","frustrated","disappointed","useless",
    "problem","issue","complain","broken","slow","rude","awful","horrible","pathetic",
    "naraz","gussa","bekaar","faltu","mushkil","pareshan"];

  const lower = text.toLowerCase();
  let score = 0;

  for (const word of positive) {
    if (lower.includes(word)) score += 1;
  }
  for (const word of negative) {
    if (lower.includes(word)) score -= 1;
  }

  // Normalize score to -1 to +1
  const maxPossible = Math.max(positive.length, negative.length);
  const normalized = Math.max(-1, Math.min(1, score / maxPossible));

  const sentiment =
    normalized > 0.05  ? "positive" :
    normalized < -0.05 ? "negative" :
    "neutral";

  return { sentiment, sentimentScore: parseFloat(normalized.toFixed(2)) };
}

// ── Helper: Build XML-Annotated Text ─────────────────────────────────────────
// e.g. "Ali lives in Lahore" → "<ENAMEX TYPE="PERSON">Ali</ENAMEX> lives in <ENAMEX TYPE="LOCATION">Lahore</ENAMEX>"
function buildAnnotatedText(text: string, annotations: Annotation[]): string {
  // Sort by start index descending so we can safely splice from the end
  const sorted = [...annotations]
    .filter(a => a.xmlTag)
    .sort((a, b) => b.start - a.start);

  let result = text;
  for (const anno of sorted) {
    if (!anno.xmlTag) continue;
    result = result.substring(0, anno.start) + anno.xmlTag + result.substring(anno.end);
  }
  return result;
}

// ── Helper: Build Summary Object ──────────────────────────────────────────────
function buildSummary(annotations: Annotation[]) {
  const pick = (type: string) =>
    [...new Set(annotations.filter(a => a.type === type).map(a => a.value))];

  return {
    persons:       pick("PERSON"),
    locations:     pick("LOCATION"),
    organizations: pick("ORGANIZATION"),
    money:         pick("MONEY"),
    dates:         [...pick("DATE"), ...pick("DAY"), ...pick("TIME")],
    products:      pick("PRODUCT"),
  };
}

// ── Helper: Basic Language Detection ─────────────────────────────────────────
function detectLanguage(text: string): string {
  const urduChars = /[\u0600-\u06FF]/;
  if (urduChars.test(text)) return "ur";

  const romanUrdu = /\b(?:hai|hain|mujhe|chahiye|kya|aur|yeh|woh|nahi|ap|aap|ky|kr|raha|rahi)\b/i;
  if (romanUrdu.test(text)) return "roman-ur";

  return "en";
}
