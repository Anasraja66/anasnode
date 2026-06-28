/**
 * Transcribe voice notes via Groq Whisper (same key as chat).
 */
export async function transcribeAudioBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<string | null> {
  if (!process.env.GROQ_API_KEY) return null;

  const ext =
    mimeType.includes("mpeg") || mimeType.includes("mp3")
      ? "mp3"
      : mimeType.includes("mp4")
        ? "mp4"
        : mimeType.includes("wav")
          ? "wav"
          : "ogg";

  const form = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  form.append("file", blob, `voice.${ext}`);
  form.append("model", "whisper-large-v3");
  form.append("response_format", "text");

  try {
    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: form,
    });

    if (!res.ok) {
      console.error("[transcribe] Groq error:", await res.text());
      return null;
    }

    const text = (await res.text()).trim();
    return text || null;
  } catch (e) {
    console.error("[transcribe]", e);
    return null;
  }
}
