import { Readable } from "stream";
import { detectCustomerLanguage } from "@/lib/i18n/detect";
import { getLanguageDef } from "@/lib/i18n/languages";

const MAX_TTS_CHARS = 450;
let ttsBroken = false;

/** Voice replies off by default — set ANAOS_VOICE_REPLY=voice_match later. */
export function isTtsAvailable(): boolean {
  const mode = process.env.ANAOS_VOICE_REPLY || "text";
  if (mode === "text" || mode === "false" || mode === "text_first") return false;
  if (process.env.ANAOS_TTS_DISABLED === "true") return false;
  return !ttsBroken;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pickVoice(text: string): string {
  const code = detectCustomerLanguage(text);
  return getLanguageDef(code).ttsVoice;
}

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

/** Free neural TTS → MP3 buffer for WhatsApp voice notes. */
export async function synthesizeSpeech(text: string): Promise<Buffer | null> {
  if (!isTtsAvailable()) return null;

  const clean = escapeXml(text.trim().slice(0, MAX_TTS_CHARS));
  if (!clean) return null;

  try {
    const { MsEdgeTTS, OUTPUT_FORMAT } = await import("edge-tts-node");
    const tts = new MsEdgeTTS({});
    await tts.setMetadata(
      pickVoice(text),
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
    );
    const stream = tts.toStream(clean);
    const buffer = await streamToBuffer(stream);
    return buffer.length > 0 ? buffer : null;
  } catch (e) {
    ttsBroken = true;
    console.error("[speech] TTS failed (disabled until restart):", e);
    return null;
  }
}

export function shouldReplyWithVoice(_contentType?: string): boolean {
  const mode = process.env.ANAOS_VOICE_REPLY || "text";
  if (mode === "all" || mode === "true" || mode === "voice_match") {
    return _contentType === "audio" || _contentType === "voice";
  }
  return false;
}
