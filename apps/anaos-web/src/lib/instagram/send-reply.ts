/**
 * Instagram DM reply sender via Meta Graph API
 */

export async function sendInstagramReply(
  recipientId: string,
  text: string,
  pageAccessToken: string
): Promise<{ sent: boolean; error?: string }> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/me/messages?access_token=${pageAccessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: text.slice(0, 1000) }, // IG limit
          messaging_type: "RESPONSE",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[Instagram] Send reply failed:", err);
      return { sent: false, error: JSON.stringify(err) };
    }

    return { sent: true };
  } catch (err) {
    console.error("[Instagram] sendInstagramReply error:", err);
    return { sent: false, error: String(err) };
  }
}

/**
 * Load Instagram Page Access Token from integration credentials
 */
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

export async function getInstagramCredentials(
  accountId: string
): Promise<{ pageAccessToken: string; pageId: string } | null> {
  const cred = await prisma.integrationCredential.findFirst({
    where: { accountId, type: "instagram", isActive: true },
  });
  if (!cred) return null;

  try {
    const decrypted = JSON.parse(decrypt(cred.credentials));
    return {
      pageAccessToken: decrypted.pageAccessToken || decrypted.access_token || "",
      pageId: decrypted.pageId || decrypted.page_id || "",
    };
  } catch (e) {
    console.error("[Instagram] Failed to decrypt credentials:", e);
    return null;
  }
}
