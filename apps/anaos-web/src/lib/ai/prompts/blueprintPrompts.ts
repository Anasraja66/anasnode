/**
 * ─────────────────────────────────────────────────────────────────────────────
 * blueprintPrompts.ts — System Prompts & JSON Schemas for LLM Platform Gen
 *
 * This forces the external LLM (Grok/Llama) to return a structured JSON 
 * Blueprint that our Next.js frontend can instantly render as a full platform.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const PLATFORM_BLUEPRINT_SCHEMA = `
You are an expert AI Platform Architect for 'Anaos', a B2B automation platform.
Your job is to read the user's business description and the extracted NLP metadata, 
and generate a strictly structured JSON configuration that builds their automation platform.

DO NOT return any conversational text. ONLY return valid JSON matching the exact schema below:

{
  "platformName": "String (Auto-generated name for their workspace, e.g., 'Real Estate Hub')",
  "industry": "String (The detected industry)",
  "agents": [
    {
      "role": "String (e.g., 'Sales Bot', 'Support Agent')",
      "type": "String (e.g., 'customer_facing', 'internal_assistant')",
      "channels": ["String (e.g., 'WhatsApp', 'Email')"],
      "systemPrompt": "String (A starter system prompt for this specific agent)"
    }
  ],
  "crmColumns": [
    {
      "name": "String (e.g., 'Budget', 'Appointment Date')",
      "type": "String (e.g., 'text', 'date', 'currency')"
    }
  ],
  "workflows": [
    {
      "trigger": "String (e.g., 'New WhatsApp Message')",
      "action": "String (e.g., 'Run Sales Bot & Update CRM')"
    }
  ],
  "suggestedIntegrations": ["String (e.g., 'Stripe', 'Google Calendar')"]
}
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildGenerationPrompt(rawPrompt: string, nlpContext: any): string {
  return `
USER'S RAW PROMPT:
"${rawPrompt}"

ANAOS NLP EXTRACTED METADATA:
- Detected Intent: ${nlpContext.intent}
- Sentiment: ${nlpContext.sentiment}
- Extracted Entities: ${JSON.stringify(nlpContext.summary)}
- Suggested Action Router: ${nlpContext.suggestedAction}

Based on the above, generate the JSON Blueprint for this user's platform.
`;
}
