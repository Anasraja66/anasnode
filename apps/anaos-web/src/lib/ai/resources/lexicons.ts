export type IndustryType = "real-estate" | "restaurant" | "clinic" | "retail" | "general";

export interface Lexicon {
  entities: {
    product: string[];
    action: string[];
    location: string[];
    attributes: string[];
  };
}

export const LEXICONS: Record<IndustryType, Lexicon> = {
  "real-estate": {
    entities: {
      product: ["apartment", "flat", "plot", "house", "villa", "shop", "office", "property"],
      action: ["buy", "sell", "rent", "lease", "visit", "viewing", "tour", "book"],
      location: ["islamabad", "lahore", "karachi", "rawalpindi", "peshawar", "multan", "dha", "bahria", "f-11", "gulberg"],
      attributes: ["marla", "kanal", "sqft", "bedroom", "bhk", "bathroom", "furnished", "portion"]
    }
  },
  "restaurant": {
    entities: {
      product: ["pizza", "burger", "pasta", "biryani", "karahi", "menu", "drink", "deal", "platter", "steak"],
      action: ["order", "book", "reserve", "table", "dine-in", "delivery", "takeaway", "cancel"],
      location: ["branch", "outlet", "f-7", "mm alam", "dha", "gulshan"],
      attributes: ["spicy", "normal", "large", "medium", "small", "veg", "non-veg", "deal 1"]
    }
  },
  "clinic": {
    entities: {
      product: ["appointment", "checkup", "consultation", "test", "xray", "ultrasound", "blood test", "report"],
      action: ["book", "schedule", "cancel", "reschedule", "meet", "visit", "consult"],
      location: ["clinic", "hospital", "ward", "room", "lab"],
      attributes: ["urgent", "emergency", "morning", "evening", "doctor", "specialist"]
    }
  },
  "retail": {
    entities: {
      product: ["shirt", "shoes", "dress", "bag", "watch", "perfume", "jacket", "jeans", "suit"],
      action: ["buy", "order", "return", "exchange", "refund", "delivery"],
      location: ["store", "mall", "outlet", "online"],
      attributes: ["size", "color", "small", "medium", "large", "xl", "sale", "discount"]
    }
  },
  "general": {
    entities: {
      product: ["product", "item", "service"],
      action: ["buy", "inquiry", "support", "help", "refund"],
      location: ["office", "online"],
      attributes: ["price", "cost", "detail"]
    }
  }
};

/**
 * Returns the relevant lexicon for a given industry, defaulting to 'general'.
 */
export function getLexicon(industry: string): Lexicon {
  const key = industry.toLowerCase() as IndustryType;
  return LEXICONS[key] || LEXICONS["general"];
}
