import { defaultOptOutLine } from "@/lib/broadcast/meta-policy";

export type GeneratedBroadcast = {
  name: string;
  bodyText: string;
  footerText: string;
  category: "marketing" | "utility";
  languageCode: string;
  dailyCap: number;
  audienceTags: string[];
  outside24h: boolean;
  optOutLine: string;
};

export async function generateBroadcastFromPrompt(
  prompt: string,
  workspaceName: string
): Promise<GeneratedBroadcast> {
  const fallback: GeneratedBroadcast = {
    name: `${workspaceName} broadcast`,
    bodyText: prompt.trim().slice(0, 900),
    footerText: workspaceName,
    category: "marketing",
    languageCode: "en",
    dailyCap: 250,
    audienceTags: [],
    outside24h: true,
    optOutLine: defaultOptOutLine("en"),
  };

  if (!process.env.GROQ_API_KEY) return fallback;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You design WhatsApp broadcast campaigns for Meta Cloud API.
Return JSON only:
{
  "name": "short campaign title",
  "bodyText": "main message, plain text, under 800 chars, professional",
  "footerText": "business name or short sign-off",
  "category": "marketing" or "utility",
  "languageCode": "en" or "ur" or "ar" etc,
  "dailyCap": number 50-1000,
  "audienceTags": ["tag1"] optional,
  "outside24h": true
}
Rules: include no emoji spam; message must work as a Meta template-style broadcast; marketing needs opt-out handled separately.`,
        },
        {
          role: "user",
          content: `Business: ${workspaceName}\nOwner request: ${prompt}`,
        },
      ],
    }),
  });

  if (!res.ok) return fallback;
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) return fallback;

  try {
    const p = JSON.parse(raw);
    const lang = String(p.languageCode || "en");
    return {
      name: String(p.name || fallback.name).slice(0, 120),
      bodyText: String(p.bodyText || fallback.bodyText).slice(0, 1024),
      footerText: String(p.footerText || workspaceName).slice(0, 60),
      category: p.category === "utility" ? "utility" : "marketing",
      languageCode: lang,
      dailyCap: Math.min(1000, Math.max(50, Number(p.dailyCap) || 250)),
      audienceTags: Array.isArray(p.audienceTags)
        ? p.audienceTags.map(String).slice(0, 5)
        : [],
      outside24h: p.outside24h !== false,
      optOutLine: defaultOptOutLine(lang),
    };
  } catch {
    return fallback;
  }
}
