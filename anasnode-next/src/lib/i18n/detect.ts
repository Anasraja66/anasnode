import type { LanguageCode } from "@/lib/i18n/languages";

const ROMAN_URDU =
  /\b(kya|hai|aap|ap|mujhe|mny|nahi|nahin|ha|ho|sy|se|ka|ki|ke|ko|bhai|yar|acha|theek|salam|janab)\b/i;

const LATIN_HINTS: Partial<Record<LanguageCode, RegExp>> = {
  es: /\b(hola|gracias|precio|quiero|casa|habitaci[oó]n|d[ií]as|señor)\b/i,
  fr: /\b(bonjour|merci|prix|je|vous|maison|oui|non|monsieur)\b/i,
  de: /\b(hallo|danke|preis|ich|sie|haus|bitte|guten|möchte|wohnung|kaufen|mieten|schön|tag|guten tag|guten morgen|frau|herr|ja|nein|wie viel)\b/i,
  pt: /\b(ol[aá]|obrigad|pre[cç]o|quero|casa|bom dia)\b/i,
  it: /\b(ciao|grazie|prezzo|voglio|casa|buongiorno|signor|signora)\b/i,
  tr: /\b(merhaba|teşekkür|fiyat|evet|hayır|lütfen)\b/i,
  id: /\b(halo|terima kasih|harga|saya|ya|tidak)\b/i,
  ms: /\b(hai|terima kasih|harga|saya|rumah)\b/i,
  nl: /\b(hallo|dank|prijs|ik|ja|nee|goedemorgen)\b/i,
  pl: /\b(cze[sś][ćc]|dzi[eę]kuj[eę]|cena|tak|nie|proszę)\b/i,
  tl: /\b(kumusta|salamat|oo|hindi|po)\b/i,
  vi: /\b(xin chào|cảm ơn|giá|nhà|vâng|không)\b/i,
  sv: /\b(hej|tack|pris|jag|ja|nej|god morgon)\b/i,
  no: /\b(hei|takk|pris|jeg|ja|nei)\b/i,
  da: /\b(hej|tak|pris|jeg|ja|nej|godmorgen)\b/i,
  fi: /\b(hei|kiitos|hinta|minä|kyllä|ei)\b/i,
  ro: /\b(bună|mulțumesc|preț|da|nu|vă rog)\b/i,
  hu: /\b(szia|köszönöm|ár|igen|nem|kérem)\b/i,
  cs: /\b(ahoj|děkuji|cena|ano|ne|prosím)\b/i,
  sk: /\b(ahoj|ďakujem|cena|áno|nie|prosím)\b/i,
  hr: /\b(bok|hvala|cijena|da|ne|molim)\b/i,
  ca: /\b(hola|gràcies|preu|sí|no|bon dia)\b/i,
  sw: /\b(jambo|asante|bei|ndiyo|hapana)\b/i,
  uk: /\b(привіт|дякую|ціна|так|ні|будь ласка|добрий)\b/i,
};

function scriptDetect(text: string): LanguageCode | null {
  if (/[\u0590-\u05FF]/.test(text)) return "he";
  if (/[\u0600-\u06FF]/.test(text)) {
    if (/[\u0679\u0686\u0691\u06AF\u06BE\u06C1\u06CC\u06D2]/.test(text)) return "ur";
    if (/[\u067E\u0686\u06AF]/.test(text)) return "fa";
    return "ar";
  }
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u0A00-\u0A7F]/.test(text)) return "pa";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  if (/[\u0370-\u03FF]/.test(text)) return "el";
  if (/[\u0400-\u04FF]/.test(text)) {
    if (/[іїєґІЇЄҐ]/.test(text)) return "uk";
    if (/ъ|Ъ|щ|Щ/.test(text) && !/[іїєґ]/.test(text)) return "bg";
    return "ru";
  }
  if (/[\u0E00-\u0E7F]/.test(text)) return "th";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  if (/[\u3040-\u30FF]/.test(text)) return "ja";
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  return null;
}

function latinDetect(text: string): LanguageCode {
  if (ROMAN_URDU.test(text)) return "ur-Latn";
  let best: LanguageCode = "en";
  let bestScore = 0;
  for (const [code, re] of Object.entries(LATIN_HINTS) as [LanguageCode, RegExp][]) {
    const m = text.match(new RegExp(re.source, "gi"));
    const score = m?.length ?? 0;
    if (score > bestScore) {
      bestScore = score;
      best = code;
    }
  }
  return best;
}

export function detectCustomerLanguage(
  text: string,
  history: string[] = []
): LanguageCode {
  const sample = [text, ...history.slice(-4)].join(" ").trim();
  if (!sample) return "en";

  const fromScript = scriptDetect(sample);
  if (fromScript && fromScript !== "ar") return fromScript;
  if (fromScript === "ar" && !ROMAN_URDU.test(sample)) return "ar";

  if (/[a-zàèéìòùáíóúâêîôûäöüß]/i.test(sample) && !/[\u0600-\u06FF]/.test(sample)) {
    return latinDetect(sample);
  }

  if (fromScript === "ar") return "ar";
  return "en";
}
