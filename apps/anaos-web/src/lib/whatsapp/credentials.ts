/** Meta Cloud API Phone Number ID — numeric only (from API Setup, not the +1… display number). */
export function normalizePhoneNumberId(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function validatePhoneNumberId(raw: string): {
  ok: boolean;
  normalized: string;
  error?: string;
} {
  const normalized = normalizePhoneNumberId(raw);

  if (!normalized) {
    return {
      ok: false,
      normalized,
      error: "Phone number ID is required.",
    };
  }

  if (raw.includes("+") || /\s/.test(raw.trim())) {
    return {
      ok: false,
      normalized,
      error:
        "You entered a phone number (e.g. +1 555…). Copy Phone number ID from Meta → WhatsApp → API Setup — it is a long number with no + sign (example: 1181035561752559).",
    };
  }

  if (normalized.length >= 10 && normalized.length <= 11) {
    return {
      ok: false,
      normalized,
      error:
        `You entered ${normalized.length} digits — that looks like a phone number (+1 555… or 92…). In Meta → WhatsApp → API Setup copy “Phone number ID” (usually 15–16 digits, e.g. 1181035561752559). Put your + number in “Display phone” only.`,
    };
  }

  if (normalized.length < 12 || normalized.length > 20) {
    return {
      ok: false,
      normalized,
      error:
        normalized.length === 0
          ? "Phone number ID is required."
          : `Phone number ID has ${normalized.length} digits — need 12–20 from Meta API Setup (not App ID, not your mobile number).`,
    };
  }

  return { ok: true, normalized };
}
