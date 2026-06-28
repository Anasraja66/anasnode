/**
 * Facebook Messenger reply sender via Meta Graph API
 */

export async function sendFacebookReply(
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
          message: { text: text.slice(0, 2000) },
          messaging_type: "RESPONSE",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[Facebook] Send reply failed:", err);
      return { sent: false, error: JSON.stringify(err) };
    }

    return { sent: true };
  } catch (err) {
    console.error("[Facebook] sendFacebookReply error:", err);
    return { sent: false, error: String(err) };
  }
}

/**
 * Load Facebook Page Access Token from integration credentials
 */
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

export async function getFacebookCredentials(
  accountId: string
): Promise<{ pageAccessToken: string; pageId: string } | null> {
  const cred = await prisma.integrationCredential.findFirst({
    where: { accountId, type: "facebook", isActive: true },
  });
  if (!cred) return null;

  try {
    const decrypted = JSON.parse(decrypt(cred.credentials));
    return {
      pageAccessToken: decrypted.pageAccessToken || decrypted.access_token || "",
      pageId: decrypted.pageId || decrypted.page_id || "",
    };
  } catch (e) {
    console.error("[Facebook] Failed to decrypt credentials:", e);
    return null;
  }
}
