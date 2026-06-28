import { prisma } from "../db";
import { decrypt } from "../crypto";
import { ExecutionContext } from "./types";

// Helper to replace template variables in prompts like {{BUDGET}} or {{name}}
export function resolveTemplate(template: string, ctx: ExecutionContext): string {
  if (!template) return "";
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    // Check runtime local variables first, then persistent AnasMind variables, then initial triggerData
    if (ctx.variables && ctx.variables[key] !== undefined) return String(ctx.variables[key]);
    if (ctx.anamind && ctx.anamind[key] !== undefined) return String(ctx.anamind[key]);
    if (ctx.triggerData && ctx.triggerData[key] !== undefined) return String(ctx.triggerData[key]);
    return match; // return fallback if not resolved
  });
}

interface LLMRequest {
  provider: 'openai' | 'claude' | 'gemini' | 'custom';
  model: string;
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
  credentialId?: string | null;
  accountId: string;
}

export async function executeLLMCompletion({
  provider,
  model,
  systemPrompt,
  userMessage,
  maxTokens = 500,
  temperature = 0.7,
  credentialId,
  accountId
}: LLMRequest): Promise<string> {
  let apiKey = "";
  let baseUrl = "";

  // 1. Resolve credentials
  if (credentialId) {
    const cred = await prisma.integrationCredential.findFirst({
      where: { id: credentialId, accountId },
    });
    if (cred) {
      try {
        const decrypted = JSON.parse(decrypt(cred.credentials));
        apiKey = decrypted.apiKey;
        baseUrl = decrypted.baseUrl || "";
      } catch (e) {
        console.error("Failed to decrypt credentials", e);
      }
    }
  }

  // 2. Fallback to platform environment keys if credentials not specified
  if (!apiKey) {
    if (provider === "openai") apiKey = process.env.OPENAI_API_KEY || "";
    else if (provider === "claude") apiKey = process.env.ANTHROPIC_API_KEY || "";
    else if (provider === "gemini") apiKey = process.env.GEMINI_API_KEY || "";
  }

  // 3. Smart developer Mock fallback if no API key is configured
  if (!apiKey && provider !== "custom") {
    console.warn(`[AI CLIENT] No API key found for ${provider}. Returning mock response.`);
    return mockLLMResponse(provider, model, systemPrompt, userMessage);
  }

  // 4. Invoke APIs using native fetch
  try {
    if (provider === "openai" || provider === "custom") {
      const url = baseUrl ? `${baseUrl}/chat/completions` : "https://api.openai.com/v1/chat/completions";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: model || "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenAI API error (${res.status}): ${errText}`);
      }

      const json = await res.json();
      return json.choices?.[0]?.message?.content || "";
    }

    if (provider === "claude") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model || "claude-3-5-sonnet-20241022",
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }],
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Anthropic API error (${res.status}): ${errText}`);
      }

      const json = await res.json();
      return json.content?.[0]?.text || "";
    }

    if (provider === "gemini") {
      const geminiModel = model || "gemini-1.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt ? `System settings: ${systemPrompt}\n\n` : ""}User prompt: ${userMessage}` }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature,
          }
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errText}`);
      }

      const json = await res.json();
      return json.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    throw new Error(`Unsupported provider: ${provider}`);
  } catch (error: any) {
    console.error("LLM completion call failed:", error);
    // Return graceful mock fallback instead of hard-failing in dev
    return `[Fallback Response due to: ${error.message}] ${mockLLMResponse(provider, model, systemPrompt, userMessage)}`;
  }
}

// Generate high-fidelity realistic responses matching prompts for mock testing
function mockLLMResponse(provider: string, model: string, system: string, user: string): string {
  const p = user.toLowerCase();
  const s = system.toLowerCase();
  
  if (p.includes("budget") || s.includes("budget") || s.includes("real estate")) {
    return "Budget AED 2.2M, Location Dubai Marina, Bedrooms 3 BHK. Leads qualified and matched to property viewing schedule.";
  }
  if (p.includes("menu") || s.includes("menu") || s.includes("restaurant")) {
    return "Menu order confirmed: 1x Truffle Pasta, 1x Olive Focaccia, total AED 145. Triggering delivery scheduling flow.";
  }
  if (p.includes("appointment") || s.includes("dentist") || s.includes("clinic")) {
    return "Appointment confirmed for Dentist General Checkup on Saturday at 2:00 PM. Sending SMS reminder.";
  }
  if (p.includes("gym") || s.includes("fitness") || s.includes("class")) {
    return "Membership confirmed. Session slot locked for HIIT Workout on Monday 6:00 PM.";
  }
  return `This is a mock AI assistant response from Anaos.io engine (${provider}/${model}). Received prompt: "${user.slice(0, 40)}..."`;
}
