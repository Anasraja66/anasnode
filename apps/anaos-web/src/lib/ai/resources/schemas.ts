/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Annotation Schemas — Full NER (Named Entity Recognition) Type System
 * Based on standard NER classification: ENAMEX + NUMEX + TIMEX
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── ENAMEX: Named Entity Types ──────────────────────────────────────────────
export type EnamexType =
  | "PERSON"        // Individual or group names (Ali, The Beatles)
  | "LOCATION"      // Cities, countries, rivers (Lahore, Pakistan)
  | "ORGANIZATION"  // Companies, agencies (Google, PIA, HEC)
  | "FACILITY"      // Man-made structures (Lahore Airport, LUMS)
  | "ARTIFACT"      // Created objects (Toyota Corolla, iPhone)
  | "LOCOMOTIVE";   // Transport devices (Boeing 747, Ship)

// ── NUMEX: Numerical Expression Types ───────────────────────────────────────
export type NumexType =
  | "MONEY"         // Currency amounts ($50, 5 lakh rupees)
  | "DISTANCE"      // Spatial measurement (10 km, 5 cm)
  | "QUANTITY"      // Weight/Volume (22 kg, 5 liters)
  | "COUNT"         // Countable items (12 students, 5 files)
  | "PERCENTAGE";   // Percentages (35%, 0.5 percent)

// ── TIMEX: Temporal Expression Types ────────────────────────────────────────
export type TimexType =
  | "DATE"          // Specific dates (August 15 1947, 2024-01-01)
  | "TIME"          // Clock times (9:30 am, 3 o'clock)
  | "DAY"           // Days of week / relative (Monday, tomorrow, today)
  | "MONTH"         // Month names (January, August)
  | "YEAR"          // Year references (1947, 2025)
  | "PERIOD"        // Duration (10 minutes, 17th century, 3 months)
  | "SPECIAL_DAY";  // Named occasions (Eid, Independence Day, Christmas)

// ── Misc Types ──────────────────────────────────────────────────────────────
export type MiscType =
  | "PRODUCT"       // Business product/service (plot, apartment, pizza)
  | "ACTION"        // Verb intent (buy, rent, book, order)
  | "ATTRIBUTE"     // Descriptive modifier (large, furnished, spicy)
  | "UNKNOWN";      // Fallback

export type EntityType = EnamexType | NumexType | TimexType | MiscType;

// ── NER Category Groups (for UI labeling / color coding) ───────────────────
export const NER_CATEGORY: Record<string, "ENAMEX" | "NUMEX" | "TIMEX" | "MISC"> = {
  PERSON: "ENAMEX", LOCATION: "ENAMEX", ORGANIZATION: "ENAMEX",
  FACILITY: "ENAMEX", ARTIFACT: "ENAMEX", LOCOMOTIVE: "ENAMEX",
  MONEY: "NUMEX", DISTANCE: "NUMEX", QUANTITY: "NUMEX",
  COUNT: "NUMEX", PERCENTAGE: "NUMEX",
  DATE: "TIMEX", TIME: "TIMEX", DAY: "TIMEX",
  MONTH: "TIMEX", YEAR: "TIMEX", PERIOD: "TIMEX", SPECIAL_DAY: "TIMEX",
  PRODUCT: "MISC", ACTION: "MISC", ATTRIBUTE: "MISC", UNKNOWN: "MISC",
};

// ── Annotation Interface ─────────────────────────────────────────────────────
export interface Annotation {
  id: string;
  type: EntityType;
  nerCategory: "ENAMEX" | "NUMEX" | "TIMEX" | "MISC"; // which top-level NER class
  start: number;    // Start char index in original text
  end: number;      // End char index in original text
  value: string;    // Extracted string
  confidence: number; // 0 to 1
  xmlTag?: string;  // Standard NER XML annotation e.g. <ENAMEX TYPE="PERSON">Ali</ENAMEX>
}

export interface DocumentAnnotation {
  originalText: string;
  annotatedText: string;  // text with XML NER tags inserted
  tokens: string[];
  annotations: Annotation[];
  intent: string;
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number; // -1 to +1
  language: string;
  summary: {            // quick-access summary of found entities
    persons: string[];
    locations: string[];
    organizations: string[];
    money: string[];
    dates: string[];
    products: string[];
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACTION RULES — Regex-based (Rule-Based NER approach)
// Covers: NUMEX (Money, Distance, Quantity, Count, %)
//         TIMEX (Time, Date, Day, Month, Year, Period, Special Day)
//         ENAMEX hints (Title-prefix rules: Dr., Mr., Mrs., CEO, Ltd.)
// ─────────────────────────────────────────────────────────────────────────────
export const EXTRACTION_RULES: { type: EntityType; pattern: RegExp }[] = [

  // ── NUMEX ─────────────────────────────────────────────────────────────────

  // MONEY: $50 / Rs. 50 / 50 lakh / 50k / PKR 5000 / 50,000 rupees
  {
    type: "MONEY",
    pattern: /(?:rs\.?|pkr|rupees?|\$|€|£|usd)?\s*\d+(?:,\d{3})*(?:\.\d+)?\s*(?:lakh|crore|billion|million|thousand|k|rupees?)?/gi,
  },

  // PERCENTAGE: 35% / 50 percent / 0.5 percent
  {
    type: "PERCENTAGE",
    pattern: /\d+(?:\.\d+)?\s*(?:%|percent)/gi,
  },

  // DISTANCE: 10 km / 5 miles / 200 meters / 3 cm
  {
    type: "DISTANCE",
    pattern: /\d+(?:\.\d+)?\s*(?:km|kilometers?|miles?|meters?|m|cm|centimeters?|feet|ft|inches?)/gi,
  },

  // QUANTITY: 22 kg / 5 liters / 3 tons / 500 grams / 220 volts
  {
    type: "QUANTITY",
    pattern: /\d+(?:\.\d+)?\s*(?:kg|kilograms?|grams?|g|liters?|litres?|l|ml|tons?|volts?|v|watts?|w)/gi,
  },

  // COUNT: 12 students / 5 files / 3 rooms (number + common count nouns)
  {
    type: "COUNT",
    pattern: /\d+\s*(?:students?|files?|rooms?|items?|units?|pieces?|cars?|people|persons?|members?|employees?|seats?|floors?)/gi,
  },

  // ── TIMEX ─────────────────────────────────────────────────────────────────

  // TIME: 9:30 am / 3 o'clock / 14:00
  {
    type: "TIME",
    pattern: /\b\d{1,2}:\d{2}(?:\s*(?:am|pm))?\b|\b\d{1,2}\s*o'clock\b|\b\d{1,2}\s*(?:am|pm)\b/gi,
  },

  // DATE: August 15 1947 / 15-08-1947 / 2024/01/15
  {
    type: "DATE",
    pattern: /\b\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}\b|\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?,?\s*\d{0,4}\b/gi,
  },

  // YEAR: standalone 4-digit years like 1947, 2025
  {
    type: "YEAR",
    pattern: /\b(?:19|20)\d{2}\b/g,
  },

  // MONTH: standalone month names
  {
    type: "MONTH",
    pattern: /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\b/gi,
  },

  // DAY: relative + weekday names
  {
    type: "DAY",
    pattern: /\b(?:today|tomorrow|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
  },

  // SPECIAL_DAY: major named days
  {
    type: "SPECIAL_DAY",
    pattern: /\b(?:eid(?:\s+ul\s+fitr|\s+ul\s+adha)?|independence\s+day|christmas|new\s+year|diwali|holi|easter|republic\s+day|gandhi\s+jayanti|rama\s+navami)\b/gi,
  },

  // PERIOD: 10 minutes / 3 months / 17th century
  {
    type: "PERIOD",
    pattern: /\d+\s*(?:second|seconds|minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)|\b\d+(?:st|nd|rd|th)\s+century\b/gi,
  },

  // ── ENAMEX Hints (Title-based Rule-Based NER) ─────────────────────────────

  // PERSON via title prefix: Dr. Ali / Mr. Khan / Mrs. Fatima / Prof. Ahmed
  {
    type: "PERSON",
    pattern: /\b(?:dr\.?|mr\.?|mrs\.?|ms\.?|prof\.?|sir|eng\.?)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g,
  },

  // ORGANIZATION via suffix: Google Ltd. / XYZ Corp / PIA Airlines
  {
    type: "ORGANIZATION",
    pattern: /\b[A-Z][A-Za-z&.\s]{1,30}(?:Ltd\.?|LLC|Corp\.?|Inc\.?|Co\.?|Group|Foundation|Authority|University|Institute|Hospital|Academy|Airlines?|Bank|Motors?)\b/g,
  },
];
