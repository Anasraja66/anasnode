import * as XLSX from "xlsx";
import { normalizePhone } from "@/lib/contacts/phone";
import { displayContactName, type ContactCustomFields } from "@/lib/contacts/profile";
import { PDFParse } from "pdf-parse";

export type ImportedContactRow = {
  phone: string;
  firstName: string;
  lastName: string;
  contactName: string;
  email: string;
  gender: string;
  tags: string[];
  customFields: ContactCustomFields;
};

export type ParseResult = {
  rows: ImportedContactRow[];
  columns: string[];
  skipped: number;
};

function normHeader(h: string): string {
  return h
    .replace(/\uFEFF/g, "")
    .toLowerCase()
    .trim()
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ");
}

function cellToString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.replace(/\uFEFF/g, "").trim();
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "";
    // Keep integer-like phone values stable when read from Excel.
    if (Number.isInteger(value)) return String(value);
    return String(value);
  }
  return String(value).trim();
}

const PHONE = new Set([
  "phone",
  "mobile",
  "whatsapp",
  "cell",
  "telephone",
  "tel",
  "phone number",
  "mobile number",
  "whatsapp number",
  "contact number",
  "number",
]);
const EMAIL = new Set(["email", "e mail", "mail", "email address"]);
const FIRST = new Set(["first name", "firstname", "first", "given name"]);
const LAST = new Set(["last name", "lastname", "last", "surname", "family name"]);
const FULL = new Set(["name", "full name", "contact name", "customer", "contact"]);
const TAGS = new Set(["tags", "tag", "labels", "segments", "segment"]);
const GENDER = new Set(["gender", "sex"]);

function splitRow(line: string): string[] {
  if (line.includes("\t")) return line.split("\t").map((c) => c.trim());
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function mapColumns(headers: string[]): {
  phone?: number;
  email?: number;
  first?: number;
  last?: number;
  full?: number;
  tags?: number;
  gender?: number;
  custom: Map<number, string>;
} {
  const custom = new Map<number, string>();
  let phone: number | undefined;
  let email: number | undefined;
  let first: number | undefined;
  let last: number | undefined;
  let full: number | undefined;
  let tags: number | undefined;
  let gender: number | undefined;

  headers.forEach((h, i) => {
    const n = normHeader(h);
    if (!n) return;
    if (PHONE.has(n) || n.includes("phone") || n.includes("mobile") || n.includes("whatsapp")) {
      if (phone === undefined) phone = i;
      return;
    }
    if (EMAIL.has(n) || n.includes("email")) {
      if (email === undefined) email = i;
      return;
    }
    if (FIRST.has(n)) {
      if (first === undefined) first = i;
      return;
    }
    if (LAST.has(n)) {
      if (last === undefined) last = i;
      return;
    }
    if (FULL.has(n)) {
      if (full === undefined) full = i;
      return;
    }
    if (TAGS.has(n)) {
      if (tags === undefined) tags = i;
      return;
    }
    if (GENDER.has(n)) {
      if (gender === undefined) gender = i;
      return;
    }
    custom.set(i, h.trim() || `field_${i}`);
  });

  return { phone, email, first, last, full, tags, gender, custom };
}

function rowFromCells(
  cells: string[],
  map: ReturnType<typeof mapColumns>,
  headers: string[]
): ImportedContactRow | null {
  const get = (i?: number) => (i !== undefined ? (cells[i] || "").trim() : "");

  let phone = "";
  if (map.phone !== undefined) phone = normalizePhone(get(map.phone));
  if (!phone) {
    for (let i = 0; i < cells.length; i++) {
      const maybe = normalizePhone(cells[i] || "");
      if (maybe.length >= 10) {
        phone = maybe;
        break;
      }
    }
  }
  if (!phone) return null;

  const email = get(map.email);
  const firstName = get(map.first);
  const lastName = get(map.last);
  let contactName = get(map.full);
  if (!contactName && (firstName || lastName)) {
    contactName = [firstName, lastName].filter(Boolean).join(" ");
  }

  const customFields: ContactCustomFields = {};
  map.custom.forEach((label, idx) => {
    const v = get(idx);
    if (v) customFields[label] = v;
  });

  for (let i = 0; i < cells.length; i++) {
    if (
      i === map.phone ||
      i === map.email ||
      i === map.first ||
      i === map.last ||
      i === map.full ||
      i === map.tags ||
      i === map.gender ||
      map.custom.has(i)
    ) {
      continue;
    }
    const v = get(i);
    if (!v) continue;
    const label = headers[i]?.trim() || `column_${i + 1}`;
    if (!customFields[label]) customFields[label] = v;
  }

  const tagRaw = get(map.tags);
  const tags = tagRaw
    ? tagRaw.split(/[;,|]/).map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const profile = {
    firstName,
    lastName,
    contactName,
    email,
    gender: get(map.gender),
    phone,
    customFields,
  };

  return {
    phone,
    firstName,
    lastName,
    contactName: displayContactName(profile),
    email,
    gender: profile.gender,
    tags,
    customFields,
  };
}

function looksLikeHeader(cells: string[]): boolean {
  const lower = cells.map((c) => normHeader(c));
  return lower.some(
    (c) =>
      PHONE.has(c) ||
      c.includes("phone") ||
      c.includes("email") ||
      FULL.has(c) ||
      FIRST.has(c) ||
      c === "name"
  );
}

/** CSV / TSV / paste from Google Sheets */
export function parseSpreadsheetText(text: string): ParseResult {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return { rows: [], columns: [], skipped: 0 };

  const table = lines.map((line) => splitRow(line).map(cellToString));
  let headers = table[0];
  let start = 0;
  if (looksLikeHeader(headers)) {
    start = 1;
  } else {
    headers = headers.map((_, i) =>
      i === 0 ? "name" : i === 1 ? "phone" : `column_${i + 1}`
    );
  }

  const map = mapColumns(headers);
  const rows: ImportedContactRow[] = [];
  let skipped = 0;

  for (let i = start; i < table.length; i++) {
    const row = rowFromCells(table[i], map, headers);
    if (row) rows.push(row);
    else skipped++;
  }

  return { rows, columns: headers, skipped };
}

/** .xlsx / .xls buffer */
export function parseSpreadsheetBuffer(buffer: Buffer, filename?: string): ParseResult {
  const wb = XLSX.read(buffer, { type: "buffer", raw: true });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return { rows: [], columns: [], skipped: 0 };

  const sheet = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  }) as unknown[][];

  if (data.length === 0) return { rows: [], columns: [], skipped: 0 };

  let headers = data[0].map(cellToString);
  let start = 0;
  if (looksLikeHeader(headers)) {
    start = 1;
  } else if (filename?.toLowerCase().endsWith(".xlsx")) {
    headers = headers.map((_, i) =>
      i === 0 ? "name" : i === 1 ? "phone" : `column_${i + 1}`
    );
  }

  const map = mapColumns(headers);
  const rows: ImportedContactRow[] = [];
  let skipped = 0;

  for (let i = start; i < data.length; i++) {
    const cells = data[i].map(cellToString);
    const row = rowFromCells(cells, map, headers);
    if (row) rows.push(row);
    else skipped++;
  }

  return { rows, columns: headers, skipped };
}

function parsePdfTextToRows(text: string): ParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const rows: ImportedContactRow[] = [];
  let skipped = 0;
  const phoneRegex = /(\+?\d[\d\s\-().]{7,}\d)/g;
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

  for (const line of lines) {
    const phones = [...line.matchAll(phoneRegex)].map((m) => normalizePhone(m[1]));
    const phone = phones.find((p) => p.length >= 8) || "";
    if (!phone) {
      skipped++;
      continue;
    }
    const email = line.match(emailRegex)?.[0] || "";
    const contactName = line
      .replace(phoneRegex, "")
      .replace(emailRegex, "")
      .replace(/[,:;|]+/g, " ")
      .trim()
      .slice(0, 120);

    rows.push({
      phone,
      firstName: "",
      lastName: "",
      contactName: displayContactName({ contactName: contactName || "Contact" }),
      email,
      gender: "",
      tags: [],
      customFields: {},
    });
  }

  return { rows, columns: ["name", "phone", "email"], skipped };
}

export function parseUpload(
  buffer: Buffer,
  filename: string,
  textFallback?: string
): ParseResult {
  const lower = filename.toLowerCase();
  if (
    lower.endsWith(".xlsx") ||
    lower.endsWith(".xls") ||
    lower.endsWith(".ods") ||
    lower.endsWith(".xlsm")
  ) {
    return parseSpreadsheetBuffer(buffer, filename);
  }
  if (lower.endsWith(".pdf")) {
    throw new Error("PDF_IMPORT_REQUIRES_ASYNC");
  }
  const text = textFallback ?? buffer.toString("utf-8");
  return parseSpreadsheetText(text);
}

export async function parseUploadAsync(
  buffer: Buffer,
  filename: string,
  textFallback?: string
): Promise<ParseResult> {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText().catch(() => null);
    return parsePdfTextToRows(result?.text || "");
  }
  return parseUpload(buffer, filename, textFallback);
}
