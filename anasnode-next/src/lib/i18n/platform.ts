import {
  ALL_LANGUAGE_CODES,
  LANGUAGE_CATALOG,
  type LanguageCode,
} from "@/lib/i18n/languages";
import type { WorkspaceLanguageSettings } from "@/lib/i18n/settings";

/**
 * Platform rule: multilingual WhatsApp is for every business owner,
 * every industry preset, and customers in any country — not tied to one niche.
 */
export const PLATFORM_LANGUAGES = {
  count: LANGUAGE_CATALOG.length,
  shortLabel: `${LANGUAGE_CATALOG.length}+ languages`,
  whatsappLine:
    "On WhatsApp, Anaos detects the customer's language and replies the same way — text or voice.",
  onboardingLine:
    "Works for every industry and every country. Same on WhatsApp for any normal business.",
  settingsLine:
    "Platform-wide: real estate, clinic, restaurant, shop — customers write in any language.",
} as const;

/** Default for new workspaces: auto-detect, full catalog enabled. */
export function defaultPlatformLanguageSettings(): WorkspaceLanguageSettings {
  return {
    mode: "auto",
    enabled: [...ALL_LANGUAGE_CODES],
  };
}

/** Serialized JSON for Prisma `languageSettings` on create. */
export function defaultPlatformLanguageSettingsJson(): string {
  return JSON.stringify(defaultPlatformLanguageSettings());
}

/** Normalize saved settings so WhatsApp AI always has a valid global config. */
export function normalizePlatformLanguageSettings(
  settings: WorkspaceLanguageSettings
): WorkspaceLanguageSettings {
  const enabled = (settings.enabled || []).filter((c) =>
    ALL_LANGUAGE_CODES.includes(c as LanguageCode)
  ) as LanguageCode[];

  return {
    mode: settings.mode === "fixed" ? "fixed" : "auto",
    fixedLanguage: settings.fixedLanguage,
    enabled: enabled.length ? enabled : [...ALL_LANGUAGE_CODES],
  };
}
