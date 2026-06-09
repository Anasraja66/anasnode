const GOOGLE_DOC_ID_RE = /docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/i;

export function extractGoogleDocId(url: string): string | null {
  const m = url.match(GOOGLE_DOC_ID_RE);
  return m?.[1] ? String(m[1]) : null;
}

export async function fetchGoogleDocText(url: string): Promise<string> {
  const docId = extractGoogleDocId(url);
  if (!docId) {
    throw new Error("Unsupported URL. Please provide a Google Docs document link.");
  }

  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(exportUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AnaosBot/1.0)",
        Accept: "text/plain,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Failed to fetch Google Doc (${res.status}). ${body.slice(0, 200)}`);
    }

    const text = await res.text();
    const trimmed = text.replace(/\r\n/g, "\n").trim();
    if (!trimmed) throw new Error("Google Doc appears empty or not publicly accessible.");
    if (trimmed.length > 180_000) return trimmed.slice(0, 180_000);
    return trimmed;
  } finally {
    clearTimeout(timer);
  }
}

