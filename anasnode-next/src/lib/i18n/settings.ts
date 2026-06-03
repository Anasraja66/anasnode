import {
  ALL_LANGUAGE_CODES,
  DEFAULT_ENABLED_LANGUAGES,
  type LanguageCode,
} from "@/lib/i18n/languages";
import {
  defaultPlatformLanguageSettings,
  normalizePlatformLanguageSettings,
} from "@/lib/i18n/platform";

export type WorkspaceLanguageSettings = {
  /** auto = reply in customer's language; fixed = always one language */
  mode: "auto" | "fixed";
  fixedLanguage?: LanguageCode;
  /** Empty = all languages allowed */
  enabled: LanguageCode[];
};

export const DEFAULT_LANGUAGE_SETTINGS: WorkspaceLanguageSettings =
  defaultPlatformLanguageSettings();

export function parseLanguageSettings(raw?: string | null): WorkspaceLanguageSettings {
  if (!raw || raw.trim() === "") {
    return defaultPlatformLanguageSettings();
  }
  try {
    const parsed = JSON.parse(raw) as WorkspaceLanguageSettings;
    return normalizePlatformLanguageSettings(parsed);
  } catch {
    return defaultPlatformLanguageSettings();
  }
}

export function serializeLanguageSettings(s: WorkspaceLanguageSettings): string {
  return JSON.stringify(s);
}

/** Pick reply language from settings + detection. */
export function resolveReplyLanguage(
  detected: LanguageCode,
  settings: WorkspaceLanguageSettings
): LanguageCode {
  if (settings.mode === "fixed" && settings.fixedLanguage) {
    return settings.fixedLanguage;
  }
  if (settings.enabled.length && !settings.enabled.includes(detected)) {
    return settings.enabled[0] || "en";
  }
  return detected;
}
