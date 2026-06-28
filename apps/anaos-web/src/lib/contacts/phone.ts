import { parsePhoneNumberFromString } from "libphonenumber-js";

function expandScientific(raw: string): string {
  const m = raw.trim().match(/^([+-]?\d+(?:\.\d+)?)[eE]([+-]?\d+)$/);
  if (!m) return raw;
  const mantissa = m[1];
  const exponent = Number(m[2]);
  if (!Number.isFinite(exponent)) return raw;

  const sign = mantissa.startsWith("-") ? "-" : "";
  const unsigned = mantissa.replace(/^[+-]/, "");
  const dot = unsigned.indexOf(".");
  const digits = unsigned.replace(".", "");
  const decimalPos = dot === -1 ? digits.length : dot;
  const newPos = decimalPos + exponent;

  let out = "";
  if (newPos <= 0) {
    out = `0.${"0".repeat(Math.abs(newPos))}${digits}`;
  } else if (newPos >= digits.length) {
    out = `${digits}${"0".repeat(newPos - digits.length)}`;
  } else {
    out = `${digits.slice(0, newPos)}.${digits.slice(newPos)}`;
  }
  return `${sign}${out}`;
}

export function normalizePhone(raw: string): string {
  const base = expandScientific(
    String(raw ?? "")
      .replace(/\uFEFF/g, "")
      .replace(/^["']|["']$/g, "")
      .trim()
  );

  let plusPrefixed = base.startsWith("+") || base.startsWith("00");
  let digits = base.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
    plusPrefixed = true;
  }

  if (digits.length < 8) return "";

  const normalized = plusPrefixed ? `+${digits}` : `+${digits}`;
  const parsed = parsePhoneNumberFromString(normalized);
  if (parsed && parsed.isValid()) return parsed.number;
  return normalized;
}
