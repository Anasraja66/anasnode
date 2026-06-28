import { transcribeAudioBuffer } from "@/lib/ai/transcribe";
import { downloadWhatsAppMedia } from "@/lib/whatsapp/media";
import type { InboundWhatsAppMessage } from "@/lib/whatsapp/inbound";

type MetaMessage = {
  id?: string;
  type?: string;
  from?: string;
  text?: { body?: string };
  audio?: { id?: string; mime_type?: string };
  voice?: { id?: string; mime_type?: string };
  image?: { id?: string; caption?: string; mime_type?: string };
  document?: {
    id?: string;
    caption?: string;
    filename?: string;
    mime_type?: string;
  };
  video?: { id?: string; caption?: string };
  button?: { text?: string };
  interactive?: { button_reply?: { title?: string }; list_reply?: { title?: string } };
};

export type ParsedInbound = InboundWhatsAppMessage & {
  contentType: string;
  waMessageId?: string;
};

/**
 * Turn any WhatsApp webhook message into text the AI can understand.
 */
export async function parseWhatsAppInboundMessage(
  message: MetaMessage,
  contactName: string,
  accountId?: string
): Promise<ParsedInbound | null> {
  const phone = message.from;
  if (!phone) return null;

  const type = message.type || "unknown";
  const waMessageId = message.id;

  if (type === "text" && message.text?.body) {
    const body = message.text.body.trim();
    const hasLink = /https?:\/\//i.test(body);
    return {
      phone,
      contactName,
      messageText: body,
      contentType: hasLink ? "link" : "text",
      waMessageId,
    };
  }

  if (type === "button" && message.button?.text) {
    return {
      phone,
      contactName,
      messageText: message.button.text,
      contentType: "button",
      waMessageId,
    };
  }

  if (type === "interactive") {
    const title =
      message.interactive?.button_reply?.title ||
      message.interactive?.list_reply?.title;
    if (title) {
      return {
        phone,
        contactName,
        messageText: title,
        contentType: "interactive",
        waMessageId,
      };
    }
  }

  if (type === "audio" || type === "voice") {
    const mediaId = message.audio?.id || message.voice?.id;
    if (!mediaId) {
      return {
        phone,
        contactName,
        messageText: "[Voice message — could not read audio]",
        contentType: "audio",
        waMessageId,
      };
    }

    const media = await downloadWhatsAppMedia(mediaId, accountId);
    let transcript: string | null = null;
    if (media) {
      transcript = await transcribeAudioBuffer(media.buffer, media.mimeType);
    }

    const messageText = transcript
      ? `🎤 Voice: ${transcript}`
      : "[Voice message — please type your question if I missed it]";

    return {
      phone,
      contactName,
      messageText,
      contentType: "audio",
      waMessageId,
    };
  }

  if (type === "image" && message.image?.id) {
    const caption = message.image.caption?.trim();
    return {
      phone,
      contactName,
      messageText: caption
        ? `📷 Photo: ${caption}`
        : "📷 Customer sent a photo — ask what they want help with regarding this image.",
      contentType: "image",
      waMessageId,
    };
  }

  if (type === "document" && message.document?.id) {
    const name = message.document.filename || "file";
    const caption = message.document.caption?.trim();
    return {
      phone,
      contactName,
      messageText: caption
        ? `📎 File (${name}): ${caption}`
        : `📎 Customer sent a file: ${name}. Acknowledge it and ask what they need.`,
      contentType: "document",
      waMessageId,
    };
  }

  if (type === "video") {
    const caption = message.video?.caption?.trim();
    return {
      phone,
      contactName,
      messageText: caption ? `🎬 Video: ${caption}` : "🎬 Customer sent a video.",
      contentType: "video",
      waMessageId,
    };
  }

  return {
    phone,
    contactName,
    messageText:
      "[Unsupported message type — please send text or a voice note and we will help you.]",
    contentType: type,
    waMessageId,
  };
}
