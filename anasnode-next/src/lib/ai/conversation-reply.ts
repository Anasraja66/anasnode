import { prisma } from "@/lib/db";
import { enrichMessageWithLinks } from "@/lib/ai/fetch-link";
import { buildHumanPersona } from "@/lib/ai/human-persona";
import { detectCustomerLanguage } from "@/lib/i18n/detect";
import { getLanguageDef } from "@/lib/i18n/languages";
import { buildLanguageRule, replyViolatesLanguage } from "@/lib/i18n/prompt";
import {
  parseLanguageSettings,
  resolveReplyLanguage,
} from "@/lib/i18n/settings";

export async function generateConversationReply(params: {
  accountId: string;
  workspaceId?: string;
  contactName: string;
  messageText: string;
  history: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  const workspace = params.workspaceId
    ? await prisma.workspace.findFirst({
        where: { id: params.workspaceId, accountId: params.accountId },
        select: {
          id: true,
          name: true,
          industry: true,
          languageSettings: true,
        },
      })
    : await prisma.workspace.findFirst({
        where: { accountId: params.accountId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          industry: true,
          languageSettings: true,
        },
      });

  const workspaceName = workspace?.name || "Your Business";
  const industry = workspace?.industry || "Business";

  const workflows = workspace
    ? await prisma.workflow.findMany({
        where: { workspaceId: workspace.id, isActive: true },
        select: { name: true, description: true },
      })
    : [];

  const automationHints =
    workflows.length > 0
      ? workflows.map((w) => `- ${w.name}`).join("\n")
      : "- Answer questions helpfully\n- Do not confirm orders unless customer clearly asks to order";

  const historyText = params.history.map((h) => h.content);
  const detected = detectCustomerLanguage(params.messageText, historyText);
  const langSettings = parseLanguageSettings(workspace?.languageSettings);
  const replyLang = resolveReplyLanguage(detected, langSettings);
  const langDef = getLanguageDef(replyLang);

  const fallback =
    replyLang === "ur-Latn"
      ? `Salam ${params.contactName}! ${workspaceName} se hoon — batao kya help chahiye?`
      : replyLang === "ar"
        ? `مرحباً ${params.contactName}! كيف يمكنني مساعدتك من ${workspaceName}؟`
        : `Hi ${params.contactName}! Thanks for messaging ${workspaceName}. How can I help you today?`;

  if (!process.env.GROQ_API_KEY) return fallback;

  const enrichedMessage = await enrichMessageWithLinks(params.messageText);
  const languageRule = buildLanguageRule(replyLang);

  const system = `${buildHumanPersona({
    workspaceName,
    industry,
    contactName: params.contactName,
    languageRule,
  })}

Extra rules:
- Voice messages show as "🎤 Voice: …" — answer what they said in voice.
- Use [Link info] when present. If link is unclear, ask them to describe the property or send the photo on WhatsApp.
- Do NOT auto-confirm orders/bookings unless they clearly ask.
- No bullet lists or formal emails — this is WhatsApp.

Background automations (context only):
${automationHints}`;

  const historyMessages = params.history.slice(-10).map((h) => ({
    role: h.role,
    content: h.content.replace(/^🎤 Voice:\s*/i, "").slice(0, 500),
  }));

  const messages = [
    { role: "system" as const, content: system },
    ...historyMessages,
    {
      role: "user" as const,
      content: enrichedMessage,
    },
  ];

  try {
    let text = await callGroq(messages);
    if (text && replyViolatesLanguage(text, replyLang)) {
      text = await callGroq([
        ...messages,
        { role: "assistant", content: text },
        {
          role: "user",
          content: `Rewrite your last reply in ${langDef.label} only. Same meaning, casual WhatsApp tone.`,
        },
      ]);
    }
    return text || fallback;
  } catch {
    return fallback;
  }
}

async function callGroq(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<string | null> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.82,
      max_tokens: 320,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}
