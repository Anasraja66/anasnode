/** WhatsApp Cloud API broadcast rules (owner-friendly summaries). */

export type BroadcastCategory = "marketing" | "utility" | "authentication";

export const META_BROADCAST_RULES = [
  "Outside the 24-hour chat window you must use an approved message template (not free text).",
  "Every marketing broadcast should include a clear opt-out (e.g. Reply STOP).",
  "Only message contacts who opted in to WhatsApp from your business.",
  "Respect daily sending limits for your Meta tier (start low, increase gradually).",
  "High block/report rates can reduce your quality rating and limit sending.",
] as const;

/** Conservative default caps per day by tier hint. */
export const DAILY_LIMIT_PRESETS = [
  { label: "Safe start (50/day)", value: 50 },
  { label: "Growing (250/day)", value: 250 },
  { label: "Scale (1,000/day)", value: 1000 },
] as const;

export function defaultOptOutLine(lang = "en"): string {
  if (lang.startsWith("ur") || lang === "hi") {
    return "Opt out: reply STOP.";
  }
  return "To stop messages, reply STOP.";
}

export function buildTemplateBody(params: {
  body: string;
  footer?: string;
  optOut?: string;
}): string {
  const parts = [params.body.trim()];
  if (params.footer?.trim()) parts.push(params.footer.trim());
  if (params.optOut?.trim()) parts.push(params.optOut.trim());
  return parts.join("\n\n");
}

export function validateCampaignForSend(c: {
  bodyText: string;
  outside24h: boolean;
  optedOutExcluded: boolean;
}): { ok: boolean; warnings: string[] } {
  const warnings: string[] = [];
  if (!c.bodyText.trim()) warnings.push("Message body is empty.");
  if (c.outside24h) {
    warnings.push(
      "Sending outside 24h window — use a Meta-approved template name in production."
    );
  }
  if (c.bodyText.length > 1024) warnings.push("Body is very long; Meta may reject it.");
  return { ok: warnings.length === 0, warnings };
}
