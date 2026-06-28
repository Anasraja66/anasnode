/**
 * Instagram DM inbound message parser
 * Meta sends Instagram messages with object: "instagram"
 */

export type ParsedInstagramMessage = {
  senderId: string;       // Instagram user PSID
  contactName: string;
  messageText: string;
  contentType: "text" | "image" | "video" | "audio" | "sticker" | "unsupported";
  igMessageId?: string;
};

type MetaIgMessage = {
  mid?: string;
  text?: string;
  attachments?: Array<{
    type: string;
    payload?: { url?: string };
  }>;
};

type MetaIgEntry = {
  id: string;
  messaging?: Array<{
    sender?: { id?: string };
    recipient?: { id?: string };
    timestamp?: number;
    message?: MetaIgMessage;
  }>;
};

export function parseInstagramInbound(
  body: { entry?: MetaIgEntry[] }
): ParsedInstagramMessage | null {
  const entry = body.entry?.[0];
  const event = entry?.messaging?.[0];
  if (!event) return null;

  const senderId = event.sender?.id;
  if (!senderId) return null;

  const msg = event.message;
  if (!msg) return null;

  // Text message
  if (msg.text) {
    return {
      senderId,
      contactName: `IG User ${senderId.slice(-4)}`,
      messageText: msg.text,
      contentType: "text",
      igMessageId: msg.mid,
    };
  }

  // Attachment (image, video, audio, sticker)
  const attachment = msg.attachments?.[0];
  if (attachment) {
    const type = attachment.type as ParsedInstagramMessage["contentType"];
    const labels: Record<string, string> = {
      image: "📷 Customer sent a photo via Instagram.",
      video: "🎬 Customer sent a video via Instagram.",
      audio: "🎤 Customer sent an audio message via Instagram.",
      sticker: "😊 Customer sent a sticker via Instagram.",
    };
    return {
      senderId,
      contactName: `IG User ${senderId.slice(-4)}`,
      messageText: labels[type] || `[Unsupported Instagram attachment: ${type}]`,
      contentType: ["image", "video", "audio", "sticker"].includes(type) ? type : "unsupported",
      igMessageId: msg.mid,
    };
  }

  return null;
}
