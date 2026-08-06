import Database from "better-sqlite3";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env");
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      const k = l.slice(0, i).trim();
      let v = l.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1);
      return [k, v];
    })
);

function decrypt(encryptedJson) {
  const rawKey = env.ENCRYPTION_KEY || "anaos_secret_encryption_key_32_bytes";
  const key = Buffer.from(rawKey.slice(0, 32).padEnd(32, "a"), "utf8");
  const { iv, authTag, encrypted } = JSON.parse(encryptedJson);
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
}

const db = new Database(path.join(process.cwd(), "dev.db"));
const rows = db
  .prepare(
    "SELECT id, accountId, type, isActive FROM integration_credentials WHERE type='whatsapp' ORDER BY createdAt DESC"
  )
  .all();

for (const row of rows) {
  const full = db
    .prepare("SELECT credentials FROM integration_credentials WHERE id = ?")
    .get(row.id);
  let parsed = {};
  try {
    parsed = JSON.parse(decrypt(full.credentials));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    console.log("row", row.id, "decrypt failed");
    continue;
  }
  const id = String(parsed.phoneNumberId || "");
  const bad =
    id.includes("+") ||
    /\s/.test(id) ||
    (id.replace(/\D/g, "").length >= 10 && id.replace(/\D/g, "").length <= 11);
  console.log(
    JSON.stringify({
      accountId: row.accountId,
      phoneNumberId: id,
      displayPhone: parsed.displayPhone,
      hasToken: Boolean(parsed.accessToken),
      invalid: bad,
      aiAutoReply: parsed.aiAutoReply !== false,
    })
  );
}
