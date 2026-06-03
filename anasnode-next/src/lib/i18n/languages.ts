export type LanguageCode =
  | "en"
  | "ar"
  | "ur"
  | "ur-Latn"
  | "hi"
  | "bn"
  | "pa"
  | "ta"
  | "te"
  | "mr"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "it"
  | "tr"
  | "id"
  | "ms"
  | "ru"
  | "uk"
  | "zh"
  | "ja"
  | "ko"
  | "th"
  | "vi"
  | "tl"
  | "fa"
  | "nl"
  | "pl"
  | "sv"
  | "no"
  | "da"
  | "fi"
  | "el"
  | "he"
  | "cs"
  | "ro"
  | "hu"
  | "sk"
  | "hr"
  | "bg"
  | "ca"
  | "sw";

export type LanguageDef = {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
  region: string;
  ttsVoice: string;
};

/** Popular languages shown first in settings UI */
const POPULAR_ORDER: LanguageCode[] = [
  "en",
  "de",
  "it",
  "es",
  "fr",
  "ar",
  "ur-Latn",
  "ur",
  "hi",
  "pt",
  "zh",
  "tr",
  "ru",
];

const CATALOG_ENTRIES: LanguageDef[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧", region: "Global", ttsVoice: "en-US-JennyNeural" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪", region: "Europe", ttsVoice: "de-DE-KatjaNeural" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦", region: "Middle East", ttsVoice: "ar-AE-FatimaNeural" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", flag: "🇵🇰", region: "South Asia", ttsVoice: "ur-PK-UzmaNeural" },
  { code: "ur-Latn", label: "Roman Urdu", nativeLabel: "Roman Urdu", flag: "🇵🇰", region: "South Asia", ttsVoice: "ur-PK-AsadNeural" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳", region: "South Asia", ttsVoice: "hi-IN-SwaraNeural" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🇧🇩", region: "South Asia", ttsVoice: "bn-IN-TanishaaNeural" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", flag: "🇮🇳", region: "South Asia", ttsVoice: "pa-IN-VaaniNeural" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", flag: "🇮🇳", region: "South Asia", ttsVoice: "ta-IN-PallaviNeural" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు", flag: "🇮🇳", region: "South Asia", ttsVoice: "te-IN-ShrutiNeural" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", flag: "🇮🇳", region: "South Asia", ttsVoice: "mr-IN-AarohiNeural" },
  { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸", region: "Europe / Americas", ttsVoice: "es-ES-ElviraNeural" },
  { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷", region: "Europe / Africa", ttsVoice: "fr-FR-DeniseNeural" },
  { code: "it", label: "Italian", nativeLabel: "Italiano", flag: "🇮🇹", region: "Europe", ttsVoice: "it-IT-ElsaNeural" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", flag: "🇧🇷", region: "Europe / Americas", ttsVoice: "pt-BR-FranciscaNeural" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands", flag: "🇳🇱", region: "Europe", ttsVoice: "nl-NL-ColetteNeural" },
  { code: "pl", label: "Polish", nativeLabel: "Polski", flag: "🇵🇱", region: "Europe", ttsVoice: "pl-PL-ZofiaNeural" },
  { code: "sv", label: "Swedish", nativeLabel: "Svenska", flag: "🇸🇪", region: "Europe", ttsVoice: "sv-SE-SofieNeural" },
  { code: "no", label: "Norwegian", nativeLabel: "Norsk", flag: "🇳🇴", region: "Europe", ttsVoice: "nb-NO-PernilleNeural" },
  { code: "da", label: "Danish", nativeLabel: "Dansk", flag: "🇩🇰", region: "Europe", ttsVoice: "da-DK-ChristelNeural" },
  { code: "fi", label: "Finnish", nativeLabel: "Suomi", flag: "🇫🇮", region: "Europe", ttsVoice: "fi-FI-SelmaNeural" },
  { code: "el", label: "Greek", nativeLabel: "Ελληνικά", flag: "🇬🇷", region: "Europe", ttsVoice: "el-GR-AthinaNeural" },
  { code: "cs", label: "Czech", nativeLabel: "Čeština", flag: "🇨🇿", region: "Europe", ttsVoice: "cs-CZ-VlastaNeural" },
  { code: "ro", label: "Romanian", nativeLabel: "Română", flag: "🇷🇴", region: "Europe", ttsVoice: "ro-RO-AlinaNeural" },
  { code: "hu", label: "Hungarian", nativeLabel: "Magyar", flag: "🇭🇺", region: "Europe", ttsVoice: "hu-HU-NoemiNeural" },
  { code: "sk", label: "Slovak", nativeLabel: "Slovenčina", flag: "🇸🇰", region: "Europe", ttsVoice: "sk-SK-ViktoriaNeural" },
  { code: "hr", label: "Croatian", nativeLabel: "Hrvatski", flag: "🇭🇷", region: "Europe", ttsVoice: "hr-HR-GabrijelaNeural" },
  { code: "bg", label: "Bulgarian", nativeLabel: "Български", flag: "🇧🇬", region: "Europe", ttsVoice: "bg-BG-KalinaNeural" },
  { code: "ca", label: "Catalan", nativeLabel: "Català", flag: "🇪🇸", region: "Europe", ttsVoice: "ca-ES-JoanaNeural" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "🇷🇺", region: "Europe / Asia", ttsVoice: "ru-RU-SvetlanaNeural" },
  { code: "uk", label: "Ukrainian", nativeLabel: "Українська", flag: "🇺🇦", region: "Europe", ttsVoice: "uk-UA-PolinaNeural" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe", flag: "🇹🇷", region: "Europe / Middle East", ttsVoice: "tr-TR-EmelNeural" },
  { code: "fa", label: "Persian", nativeLabel: "فارسی", flag: "🇮🇷", region: "Middle East", ttsVoice: "fa-IR-DilaraNeural" },
  { code: "he", label: "Hebrew", nativeLabel: "עברית", flag: "🇮🇱", region: "Middle East", ttsVoice: "he-IL-HilaNeural" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", flag: "🇨🇳", region: "East Asia", ttsVoice: "zh-CN-XiaoxiaoNeural" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵", region: "East Asia", ttsVoice: "ja-JP-NanamiNeural" },
  { code: "ko", label: "Korean", nativeLabel: "한국어", flag: "🇰🇷", region: "East Asia", ttsVoice: "ko-KR-SunHiNeural" },
  { code: "th", label: "Thai", nativeLabel: "ไทย", flag: "🇹🇭", region: "Southeast Asia", ttsVoice: "th-TH-PremwadeeNeural" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳", region: "Southeast Asia", ttsVoice: "vi-VN-HoaiMyNeural" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", flag: "🇮🇩", region: "Southeast Asia", ttsVoice: "id-ID-GadisNeural" },
  { code: "ms", label: "Malay", nativeLabel: "Bahasa Melayu", flag: "🇲🇾", region: "Southeast Asia", ttsVoice: "ms-MY-YasminNeural" },
  { code: "tl", label: "Filipino", nativeLabel: "Filipino", flag: "🇵🇭", region: "Southeast Asia", ttsVoice: "fil-PH-BlessicaNeural" },
  { code: "sw", label: "Swahili", nativeLabel: "Kiswahili", flag: "🇰🇪", region: "Africa", ttsVoice: "sw-KE-ZuriNeural" },
];

export const LANGUAGE_CATALOG: LanguageDef[] = [
  ...POPULAR_ORDER.map(
    (code) => CATALOG_ENTRIES.find((l) => l.code === code)!
  ).filter(Boolean),
  ...CATALOG_ENTRIES.filter((l) => !POPULAR_ORDER.includes(l.code)),
];

export const ALL_LANGUAGE_CODES = LANGUAGE_CATALOG.map((l) => l.code);

export const DEFAULT_ENABLED_LANGUAGES: LanguageCode[] = [...ALL_LANGUAGE_CODES];

export function getLanguageDef(code: string): LanguageDef {
  return LANGUAGE_CATALOG.find((l) => l.code === code) || LANGUAGE_CATALOG[0];
}
