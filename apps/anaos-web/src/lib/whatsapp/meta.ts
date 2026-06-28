/**
 * WhatsApp Meta Cloud API — platform env or per-account encrypted credentials.
 */

import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { validatePhoneNumberId } from "@/lib/whatsapp/credentials";

export interface MetaMessagePayload {
  messaging_product: "whatsapp";
  to: string;
  type: "text" | "audio" | "interactive";
  text?: { body: string };
  audio?: { id: string };
  interactive?: unknown;
}

export type WhatsAppCredentials = {
  accessToken: string;
  phoneNumberId: string;
};

export type WhatsAppAccountSettings = {
  aiAutoReply: boolean;
  displayPhone?: string;
  businessName?: string;
};

export async function getWhatsAppAccountSettings(
  accountId?: string | null
): Promise<WhatsAppAccountSettings> {
  const defaults: WhatsAppAccountSettings = { aiAutoReply: true };

  if (!accountId) return defaults;

  const cred = await prisma.integrationCredential.findFirst({
    where: { accountId, type: "whatsapp", isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (!cred) return defaults;

  try {
    const parsed = JSON.parse(decrypt(cred.credentials));
    return {
      aiAutoReply: parsed.aiAutoReply !== false,
      displayPhone: parsed.displayPhone,
      businessName: parsed.businessName,
    };
  } catch {
    return defaults;
  }
}

export async function resolveWhatsAppCredentials(
  accountId?: string | null
): Promise<WhatsAppCredentials | null> {
  if (accountId) {
    const cred = await prisma.integrationCredential.findFirst({
      where: { accountId, type: "whatsapp", isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (cred) {
      try {
        const parsed = JSON.parse(decrypt(cred.credentials));
        const accessToken = parsed.accessToken || parsed.apiKey;
        const rawId = String(parsed.phoneNumberId || "");
        const check = validatePhoneNumberId(rawId);
        if (!check.ok) {
          console.error("[WhatsApp] Invalid phoneNumberId in DB:", check.error);
          return null;
        }
        if (accessToken && check.normalized) {
          return { accessToken, phoneNumberId: check.normalized };
        }
      } catch (e) {
        console.error("Failed to decrypt WhatsApp credentials:", e);
      }
    }
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (accessToken && phoneNumberId) {
    return { accessToken, phoneNumberId };
  }

  return null;
}

export async function uploadWhatsAppMedia(
  buffer: Buffer,
  mimeType: string,
  accountId?: string | null
): Promise<string | null> {
  const creds = await resolveWhatsAppCredentials(accountId);
  if (!creds) return null;

  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("type", mimeType);
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  form.append(
    "file",
    blob,
    mimeType.includes("mpeg") ? "reply.mp3" : "reply.audio"
  );

  try {
    const res = await fetch(
      `https://graph.facebook.com/v23.0/${creds.phoneNumberId}/media`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${creds.accessToken}` },
        body: form,
      }
    );
    const data = await res.json();
    if (!res.ok || !data.id) {
      console.error("[WhatsApp] media upload failed:", JSON.stringify(data));
      return null;
    }
    return data.id as string;
  } catch (e) {
    console.error("[WhatsApp] media upload error:", e);
    return null;
  }
}

export async function sendMetaAudioMessage(
  to: string,
  audioBuffer: Buffer,
  accountId?: string | null,
  mimeType = "audio/mpeg"
): Promise<boolean> {
  const mediaId = await uploadWhatsAppMedia(audioBuffer, mimeType, accountId);
  if (!mediaId) return false;

  const creds = await resolveWhatsAppCredentials(accountId);
  if (!creds) return false;

  const payload: MetaMessagePayload = {
    messaging_product: "whatsapp",
    to,
    type: "audio",
    audio: { id: mediaId },
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${creds.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${creds.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.error("Meta WhatsApp audio error:", JSON.stringify(data, null, 2));
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to send WhatsApp audio:", error);
    return false;
  }
}

/**
 * Send WhatsApp reply. Text is sent first (reliable); voice is optional add-on.
 */
export async function sendMetaReply(
  to: string,
  text: string,
  accountId: string | null | undefined,
  options: { preferVoice?: boolean }
): Promise<{ sent: boolean; channel: "voice" | "text" | "both" | "none" }> {
  const preferVoice = options.preferVoice ?? false;
  const voiceMode = process.env.ANAOS_VOICE_REPLY || "text";

  const textOk = await sendMetaTextMessage(to, text, accountId);
  if (!textOk) {
    console.error("[WhatsApp] text send failed for", to.slice(-4));
    return { sent: false, channel: "none" };
  }

  const wantsVoice =
    preferVoice && voiceMode !== "text" && voiceMode !== "false";

  if (!wantsVoice) {
    console.log("[WhatsApp] delivered text to", to.slice(-4));
    return { sent: true, channel: "text" };
  }

  const { synthesizeSpeech, isTtsAvailable } = await import("@/lib/ai/speech");
  if (!isTtsAvailable()) {
    return { sent: true, channel: "text" };
  }

  const audio = await synthesizeSpeech(text);
  if (!audio) {
    console.warn("[WhatsApp] TTS skipped — customer already got text");
    return { sent: true, channel: "text" };
  }

  const voiceOk = await sendMetaAudioMessage(to, audio, accountId, "audio/mpeg");
  if (voiceOk) {
    console.log("[WhatsApp] delivered text + voice to", to.slice(-4));
    return { sent: true, channel: "both" };
  }

  console.warn("[WhatsApp] voice upload failed — text already sent");
  return { sent: true, channel: "text" };
}

export async function sendMetaTextMessage(
  to: string,
  text: string,
  accountId?: string | null
): Promise<boolean> {
  const creds = await resolveWhatsAppCredentials(accountId);

  if (!creds) {
    console.error("WhatsApp credentials not configured for account:", accountId);
    return false;
  }

  const url = `https://graph.facebook.com/v23.0/${creds.phoneNumberId}/messages`;

  const payload: MetaMessagePayload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: text },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Meta WhatsApp API error:", JSON.stringify(data, null, 2));
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    return false;
  }
}
