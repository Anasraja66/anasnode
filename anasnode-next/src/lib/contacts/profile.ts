export type ContactCustomFields = Record<string, string>;

export type ContactProfile = {
  firstName?: string;
  lastName?: string;
  contactName?: string;
  email?: string;
  gender?: string;
  phone?: string;
  customFields?: ContactCustomFields;
};

export function parseCustomFieldsJson(raw?: string | null): ContactCustomFields {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const out: ContactCustomFields = {};
      for (const [k, val] of Object.entries(v)) {
        if (val != null && String(val).trim()) out[k] = String(val).trim();
      }
      return out;
    }
  } catch {
    /* ignore */
  }
  return {};
}

export function customFieldsToJson(fields: ContactCustomFields): string {
  const clean: ContactCustomFields = {};
  for (const [k, v] of Object.entries(fields)) {
    const key = k.trim();
    if (key && v?.trim()) clean[key] = v.trim();
  }
  return JSON.stringify(clean);
}

export function displayContactName(p: ContactProfile): string {
  if (p.contactName?.trim()) return p.contactName.trim().slice(0, 120);
  const full = [p.firstName, p.lastName].filter(Boolean).join(" ").trim();
  return full.slice(0, 120) || "Contact";
}

/** Variables for broadcast / template text — ManyChat-style {{first_name}} */
export function contactTemplateVars(
  row: ContactProfile & { phone: string }
): Record<string, string> {
  const first = (row.firstName || "").trim();
  const last = (row.lastName || "").trim();
  const full = displayContactName(row);
  const vars: Record<string, string> = {
    first_name: first || full.split(/\s+/)[0] || "",
    last_name: last,
    full_name: full,
    name: full,
    email: (row.email || "").trim(),
    phone: row.phone,
    gender: (row.gender || "").trim(),
  };
  for (const [k, v] of Object.entries(row.customFields || {})) {
    const key = k.toLowerCase().replace(/\s+/g, "_");
    vars[key] = v;
  }
  return vars;
}

export function applyTemplateVars(
  text: string,
  vars: Record<string, string>
): string {
  let out = text;
  for (const [key, value] of Object.entries(vars)) {
    const patterns = [
      new RegExp(`\\{\\{\\s*${escapeReg(key)}\\s*\\}\\}`, "gi"),
      new RegExp(`\\{\\s*${escapeReg(key)}\\s*\\}`, "gi"),
    ];
    for (const re of patterns) {
      out = out.replace(re, value || "");
    }
  }
  return out;
}

function escapeReg(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
