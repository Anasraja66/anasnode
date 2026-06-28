/**
 * Facebook Messenger inbound message parser
 * Meta sends FB Messenger messages with object: "page"
 */

export type ParsedFacebookMessage = {
  senderId: string;       // Facebook user PSID
  contactName: string;
  messageText: string;
  contentType: "text" | "image" | "video" | "audio" | "file" | "sticker" | "unsupported";
  fbMessageId?: string;
};

type MetaFbMessage = {
  mid?: string;
  text?: string;
  sticker_id?: string;
  attachments?: Array<{
    type: string;
    payload?: { url?: string; sticker_id?: number };
  }>;
};

type MetaFbEntry = {
  id: string;
  messaging?: Array<{
    sender?: { id?: string };
    recipient?: { id?: string };
    timestamp?: number;
    message?: MetaFbMessage;
    postback?: { title?: string; payload?: string };
  }>;
};

export function parseFacebookInbound(
  body: { entry?: MetaFbEntry[] }
): ParsedFacebookMessage | null {
  const entry = body.entry?.[0];
  const event = entry?.messaging?.[0];
  if (!event) return null;

  const senderId = event.sender?.id;
  if (!senderId) return null;

  // Postback (button click)
  if (event.postback?.title) {
    return {
      senderId,
      contactName: `FB User ${senderId.slice(-4)}`,
      messageText: event.postback.title,
      contentType: "text",
      fbMessageId: undefined,
    };
  }

  const msg = event.message;
  if (!msg) return null;

  // Text message
  if (msg.text) {
    return {
      senderId,
      contactName: `FB User ${senderId.slice(-4)}`,
      messageText: msg.text,
      contentType: "text",
      fbMessageId: msg.mid,
    };
  }

  // Sticker
  if (msg.sticker_id) {
    return {
      senderId,
      contactName: `FB User ${senderId.slice(-4)}`,
      messageText: "😊 Customer sent a sticker via Facebook Messenger.",
      contentType: "sticker",
      fbMessageId: msg.mid,
    };
  }

  // Attachments
  const attachment = msg.attachments?.[0];
  if (attachment) {
    const type = attachment.type as ParsedFacebookMessage["contentType"];
    const labels: Record<string, string> = {
      image: "📷 Customer sent a photo via Facebook Messenger.",
      video: "🎬 Customer sent a video via Facebook Messenger.",
      audio: "🎤 Customer sent a voice note via Facebook Messenger.",
      file: "📎 Customer sent a file via Facebook Messenger.",
    };
    return {
      senderId,
      contactName: `FB User ${senderId.slice(-4)}`,
      messageText: labels[type] || `[Unsupported attachment: ${type}]`,
      contentType: ["image", "video", "audio", "file"].includes(type) ? type : "unsupported",
      fbMessageId: msg.mid,
    };
  }

  return null;
}
