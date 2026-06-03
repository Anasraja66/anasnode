import { resolveWhatsAppCredentials } from "@/lib/whatsapp/meta";

const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v21.0";

export async function downloadWhatsAppMedia(
  mediaId: string,
  accountId?: string | null
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const creds = await resolveWhatsAppCredentials(accountId);
  if (!creds) return null;

  const metaRes = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${mediaId}`,
    { headers: { Authorization: `Bearer ${creds.accessToken}` } }
  );
  const meta = await metaRes.json();
  if (!metaRes.ok || !meta.url) {
    console.error("[WhatsApp media] meta fetch failed:", meta);
    return null;
  }

  const fileRes = await fetch(meta.url, {
    headers: { Authorization: `Bearer ${creds.accessToken}` },
  });
  if (!fileRes.ok) return null;

  const arrayBuffer = await fileRes.arrayBuffer();
  const mimeType =
    (meta.mime_type as string) || fileRes.headers.get("content-type") || "audio/ogg";

  return { buffer: Buffer.from(arrayBuffer), mimeType };
}
