import { executeLLMCompletion } from "@/lib/workflow/ai-client";

export interface ExtractedLeadPreferences {
  budgetMin?: number;
  budgetMax?: number;
  preferredArea?: string;
  preferredType?: string; // apartment, villa, townhouse, commercial
  bedrooms?: number;
  intent?: "buy" | "rent" | "sell" | "other";
}

const EXTRACTOR_SYSTEM_PROMPT = `You are a Real Estate NLP Extractor.
Extract the property preferences from the user's message.
Return ONLY valid JSON matching this schema:
{
  "budgetMin": number | null,
  "budgetMax": number | null,
  "preferredArea": string | null, // e.g., "Downtown Dubai", "Marina"
  "preferredType": "apartment" | "villa" | "townhouse" | "commercial" | null,
  "bedrooms": number | null,
  "intent": "buy" | "rent" | "sell" | "other" | null
}
Rules:
- For budget, convert millions to actual numbers (e.g. "2 million" -> 2000000).
- If only one budget is given, set budgetMax.
- Be concise. If an entity is not found, leave it as null.
- No markdown formatting or extra text.
`;

export async function extractLeadPreferences(
  message: string,
  accountId: string
): Promise<ExtractedLeadPreferences> {
  try {
    const response = await executeLLMCompletion({
      provider: "openai",
      model: "gpt-4o",
      systemPrompt: EXTRACTOR_SYSTEM_PROMPT,
      userMessage: message,
      accountId,
      maxTokens: 150,
      temperature: 0.1, // Strict extraction
    });

    let jsonStr = response.trim();
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    const parsed = JSON.parse(jsonStr);

    return {
      budgetMin: parsed.budgetMin || undefined,
      budgetMax: parsed.budgetMax || undefined,
      preferredArea: parsed.preferredArea || undefined,
      preferredType: parsed.preferredType || undefined,
      bedrooms: parsed.bedrooms || undefined,
      intent: parsed.intent || undefined,
    };
  } catch (err) {
    console.error("[LeadExtractor] Failed to extract preferences:", err);
    return {}; // Return empty on failure
  }
}
