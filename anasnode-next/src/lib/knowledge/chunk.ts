const MAX_CHUNK_CHARS = 900;
const MIN_CHUNK_CHARS = 120;
const OVERLAP_CHARS = 120;

export function chunkText(input: string): string[] {
  const text = input.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const paras = text
    .split(/\n{2,}/g)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let buffer = "";

  const flush = () => {
    const b = buffer.trim();
    buffer = "";
    if (!b) return;
    if (b.length >= MIN_CHUNK_CHARS || chunks.length === 0) chunks.push(b.slice(0, MAX_CHUNK_CHARS));
  };

  for (const p of paras) {
    if (!buffer) {
      buffer = p;
      continue;
    }
    if (buffer.length + 1 + p.length <= MAX_CHUNK_CHARS) {
      buffer = `${buffer}\n${p}`;
      continue;
    }
    flush();
    if (p.length > MAX_CHUNK_CHARS) {
      let i = 0;
      while (i < p.length) {
        const slice = p.slice(i, i + MAX_CHUNK_CHARS);
        if (slice.trim()) chunks.push(slice.trim());
        i += MAX_CHUNK_CHARS - OVERLAP_CHARS;
      }
      continue;
    }
    buffer = p;
  }

  flush();
  return chunks.slice(0, 64);
}

