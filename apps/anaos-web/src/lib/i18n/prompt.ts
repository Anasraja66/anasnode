import type { LanguageCode } from "@/lib/i18n/languages";
import { getLanguageDef } from "@/lib/i18n/languages";

export function buildLanguageRule(replyLang: LanguageCode): string {
  const def = getLanguageDef(replyLang);

  const rules: Partial<Record<LanguageCode, string>> = {
    en: `Reply in natural English (international, simple words).`,
    "ur-Latn": `Reply in ROMAN URDU only (Latin letters, casual WhatsApp style). Never use Urdu/Arabic script.`,
    ur: `Reply in Urdu script (اردو). Natural and polite.`,
    ar: `Reply in Modern Standard Arabic (العربية). Natural WhatsApp tone.`,
    hi: `Reply in Hindi (हिन्दी).`,
    bn: `Reply in Bengali (বাংলা).`,
    pa: `Reply in Punjabi (ਪੰਜਾਬੀ).`,
    ta: `Reply in Tamil (தமிழ்).`,
    te: `Reply in Telugu (తెలుగు).`,
    mr: `Reply in Marathi (मराठी).`,
    es: `Reply in Spanish (Español).`,
    fr: `Reply in French (Français).`,
    de: `Reply in German (Deutsch) — natural, friendly Sie or du matching the customer. Like a local agent on WhatsApp.`,
    pt: `Reply in Portuguese (Português).`,
    it: `Reply in Italian (Italiano) — warm, natural, like a local agent.`,
    tr: `Reply in Turkish (Türkçe).`,
    id: `Reply in Indonesian (Bahasa Indonesia).`,
    ms: `Reply in Malay (Bahasa Melayu).`,
    ru: `Reply in Russian (Русский).`,
    uk: `Reply in Ukrainian (Українська).`,
    zh: `Reply in Chinese (中文, simplified).`,
    ja: `Reply in Japanese (日本語).`,
    ko: `Reply in Korean (한국어).`,
    th: `Reply in Thai (ไทย).`,
    vi: `Reply in Vietnamese (Tiếng Việt).`,
    tl: `Reply in Filipino / Tagalog.`,
    fa: `Reply in Persian (فارسی).`,
    he: `Reply in Hebrew (עברית).`,
    nl: `Reply in Dutch (Nederlands).`,
    pl: `Reply in Polish (Polski).`,
    sv: `Reply in Swedish (Svenska).`,
    no: `Reply in Norwegian (Norsk).`,
    da: `Reply in Danish (Dansk).`,
    fi: `Reply in Finnish (Suomi).`,
    el: `Reply in Greek (Ελληνικά).`,
    cs: `Reply in Czech (Čeština).`,
    ro: `Reply in Romanian (Română).`,
    hu: `Reply in Hungarian (Magyar).`,
    sk: `Reply in Slovak (Slovenčina).`,
    hr: `Reply in Croatian (Hrvatski).`,
    bg: `Reply in Bulgarian (Български).`,
    ca: `Reply in Catalan (Català).`,
    sw: `Reply in Swahili (Kiswahili).`,
  };

  const rule =
    rules[replyLang] ||
    `Reply in ${def.nativeLabel} (${def.label}). Natural WhatsApp tone, native-level.`;

  return `LANGUAGE (critical): Customer expects ${def.nativeLabel}. ${rule} Do not mix other languages unless they switch.`;
}

export function replyViolatesLanguage(reply: string, expected: LanguageCode): boolean {
  if (expected === "ur-Latn" && /[\u0600-\u06FF]/.test(reply)) return true;
  if (expected === "en" && /[\u0600-\u06FF\u4E00-\u9FFF]/.test(reply)) return false;
  return false;
}
