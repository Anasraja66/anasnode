import Database from "better-sqlite3";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const tunnelUrl = process.argv[2];
if (!tunnelUrl) {
  console.error("Usage: node scripts/setup-tunnel.mjs https://xxx.trycloudflare.com");
  process.exit(1);
}

const webhookUrl = `${tunnelUrl.replace(/\/$/, "")}/api/webhooks/whatsapp`;
const verifyToken = "anaos_secret_verify_token";

const envPath = path.join(process.cwd(), ".env");
let envText = fs.readFileSync(envPath, "utf8");
const setEnv = (key, val) => {
  const line = `${key}="${val}"`;
  if (envText.match(new RegExp(`^${key}=`, "m"))) {
    envText = envText.replace(new RegExp(`^${key}=.*$`, "m"), line);
  } else {
    envText += `\n${line}`;
  }
};
setEnv("PUBLIC_WEBHOOK_URL", tunnelUrl);
setEnv("WHATSAPP_VERIFY_TOKEN", verifyToken);
fs.writeFileSync(envPath, envText.trim() + "\n");
fs.writeFileSync(
  path.join(process.cwd(), "tunnel-url.txt"),
  `${tunnelUrl}\n${webhookUrl}\n`
);

const env = Object.fromEntries(
  envText
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
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "hex"));
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
}

const db = new Database(path.join(process.cwd(), "dev.db"));
const row = db
  .prepare(
    "SELECT credentials FROM integration_credentials WHERE type='whatsapp' AND isActive=1 ORDER BY createdAt DESC LIMIT 1"
  )
  .get();
if (!row) {
  console.log("No WhatsApp credentials — saved tunnel URL only");
  console.log("WEBHOOK", webhookUrl);
  process.exit(0);
}

const creds = JSON.parse(decrypt(row.credentials));
const token = creds.accessToken;

async function main() {
  const challengeRes = await fetch(
    `${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=anaos_ok`
  );
  const challengeBody = await challengeRes.text();
  console.log("Local verify test:", challengeRes.status, challengeBody);

  const appRes = await fetch(
    `https://graph.facebook.com/v23.0/app?access_token=${token}`
  );
  const appData = await appRes.json();
  console.log("App lookup:", JSON.stringify(appData));

  if (appData.id) {
    const subRes = await fetch(
      `https://graph.facebook.com/v23.0/${appData.id}/subscriptions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          object: "whatsapp_business_account",
          callback_url: webhookUrl,
          verify_token: verifyToken,
          fields: ["messages"],
          access_token: token,
        }),
      }
    );
    const subData = await subRes.json();
    console.log("Webhook subscribe:", subRes.status, JSON.stringify(subData));
  }

  const wabaRes = await fetch(
    `https://graph.facebook.com/v23.0/${creds.phoneNumberId}?fields=whatsapp_business_account&access_token=${token}`
  );
  const wabaData = await wabaRes.json();
  console.log("WABA:", JSON.stringify(wabaData));

  console.log("\nDone. Webhook URL for Meta:\n", webhookUrl);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
