const URL_RE = /https?:\/\/[^\s<>"']+/gi;
const MAX_BYTES = 120_000;
const TIMEOUT_MS = 12_000;

export function extractUrls(text: string): string[] {
  const matches = text.match(URL_RE) || [];
  return [...new Set(matches.map((u) => u.replace(/[.,;:!?)]+$/, "")))].slice(0, 2);
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html: string, property: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const m = html.match(re);
  if (m?.[1]) return m[1].trim();
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    "i"
  );
  const m2 = html.match(re2);
  return m2?.[1]?.trim() || null;
}

export async function fetchLinkPreview(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AnaosBot/1.0; +https://anaos.app)",
        Accept: "text/html,application/xhtml+xml,image/*,*/*;q=0.8",
      },
    });

    clearTimeout(timer);

    const type = res.headers.get("content-type") || "";
    const finalUrl = res.url || url;

    if (type.includes("image/")) {
      return `Shared image link (${type.split(";")[0]}). Ask what they like about it or offer to help with that property/listing.`;
    }

    if (!type.includes("text/html") && !type.includes("application/xhtml")) {
      return `Shared link opens as ${type.split(";")[0]}. Ask the customer what they want regarding this link.`;
    }

    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) {
      return `Link points to a large page (${finalUrl}). Ask customer to describe what they see or send screenshots.`;
    }

    const html = new TextDecoder("utf-8", { fatal: false }).decode(buf);
    const title =
      metaContent(html, "og:title") ||
      metaContent(html, "twitter:title") ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();
    const desc =
      metaContent(html, "og:description") ||
      metaContent(html, "twitter:description") ||
      metaContent(html, "description");
    const image = metaContent(html, "og:image");

    const bits: string[] = [`Link: ${finalUrl}`];
    if (title) bits.push(`Title: ${title}`);
    if (desc) bits.push(`About: ${desc.slice(0, 400)}`);
    if (image) bits.push(`Image: ${image}`);
    if (!title && !desc) {
      const text = stripHtml(html).slice(0, 300);
      if (text) bits.push(`Page text: ${text}`);
    }

    return bits.join(" | ");
  } catch (e) {
    console.warn("[fetch-link]", url, e);
    if (url.includes("google") || url.includes("goo.gl")) {
      return `Google share link (${url}). It may be a photo or listing — ask what property or image they mean and if they can send the photo directly on WhatsApp.`;
    }
    return `Could not load link (${url}). Ask customer to describe the listing or resend the photo here on WhatsApp.`;
  }
}

export async function enrichMessageWithLinks(text: string): Promise<string> {
  const urls = extractUrls(text);
  if (!urls.length) return text;

  const previews: string[] = [];
  for (const url of urls) {
    const preview = await fetchLinkPreview(url);
    if (preview) previews.push(preview);
  }

  if (!previews.length) return text;

  return `${text}\n\n[Link info for you — use this to help the customer, do NOT say "link nahi khul raha"]:\n${previews.join("\n")}`;
}
