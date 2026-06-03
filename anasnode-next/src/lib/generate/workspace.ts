export type GeneratedAutomation = {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  runs: number;
  lastRun: string;
};

export type GeneratedVariable = {
  key: string;
  value: string;
  confidence: number;
  ttl: string;
};

import { normalizeIndustryLabel } from "@/lib/industry/presets";

export type GeneratedWorkspace = {
  id: string;
  name: string;
  industry: string;
  slug: string;
  status: "draft" | "live";
  version: number;
  automations: GeneratedAutomation[];
  variables: GeneratedVariable[];
};

function extractName(prompt: string): string | null {
  const match = prompt.match(/(?:named|called|name is|brand is)\s+([A-Za-z0-9\s'&]+?)(?:\.|\b|$)/i);
  if (match?.[1]) return match[1].trim();

  const altMatch = prompt.match(
    /(?:run|own|manage)\s+(?:a|an)\s+([A-Za-z0-9\s'&]+?)(?:\s+(?:brokerage|restaurant|clinic|gym|salon|shop|store|business|brand))(?:\.|\b|$)/i
  );
  if (altMatch?.[1]) {
    const word = altMatch[1].trim();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  return null;
}

function extractAmount(prompt: string): string | null {
  const match = prompt.match(/(\$|£|€|aed|rs)?\s*([0-9]+(?:\.[0-9]+)?\s*(k|m|million|billion)?)/i);
  return match ? match[0].trim().toUpperCase() : null;
}

export function generateWorkspaceFromPrompt(prompt: string): GeneratedWorkspace {
  const cleanPrompt = prompt.toLowerCase();
  let industry = "General Business";
  let businessName = "Custom Workspace";
  let automations: GeneratedAutomation[] = [];
  let variables: GeneratedVariable[] = [];

  const has = (...keys: string[]) => keys.some((k) => cleanPrompt.includes(k));

  if (has("real estate", "property", "broker", "apartment", "house", "rent", "buy", "sell")) {
    industry = "Real Estate";
    businessName = extractName(prompt) || "Estate Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Lead Qualifier", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Viewing Scheduler Bot", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Listing Match Broadcast", type: "campaign", enabled: false, runs: 0, lastRun: "Never" },
    ];
    variables = [
      { key: "BUDGET_LIMIT", value: extractAmount(prompt) || "Flexible", confidence: 95, ttl: "30 days" },
      { key: "PROPERTY_TYPE", value: has("rent") ? "Rental" : "Purchase", confidence: 90, ttl: "30 days" },
      { key: "PREFERED_AREA", value: "Downtown", confidence: 85, ttl: "30 days" },
    ];
  } else if (has("restaurant", "food", "cafe", "dine", "eat", "order", "table", "menu")) {
    industry = "Restaurant";
    businessName = extractName(prompt) || "Bistro Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Smart Ordering", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Table Reservation Manager", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Weekly Specials Broadcast", type: "campaign", enabled: false, runs: 0, lastRun: "Never" },
    ];
    variables = [
      { key: "CRAVING", value: "Chef Special", confidence: 88, ttl: "7 days" },
      { key: "PARTY_SIZE", value: "2-4 People", confidence: 95, ttl: "7 days" },
    ];
  } else if (has("clinic", "doctor", "dentist", "patient", "health", "appointment", "medical")) {
    industry = "Clinic & Health";
    businessName = extractName(prompt) || "Care Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Appointment Booker", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Automated Visit Reminders", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Post-Treatment Checkup", type: "campaign", enabled: true, runs: 0, lastRun: "Never" },
    ];
    variables = [
      { key: "VISIT_REASON", value: "General Checkup", confidence: 92, ttl: "15 days" },
      { key: "PATIENT_TYPE", value: "Returning", confidence: 98, ttl: "365 days" },
    ];
  } else if (has("shop", "store", "e-commerce", "ecommerce", "cart", "shopify")) {
    industry = "E-Commerce";
    businessName = extractName(prompt) || "Cart Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Product Catalog", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Abandoned Cart Recovery", type: "campaign", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Order Tracking Alerts", type: "campaign", enabled: true, runs: 0, lastRun: "Never" },
    ];
    variables = [
      { key: "LAST_CART_VALUE", value: extractAmount(prompt) || "$45.00", confidence: 95, ttl: "7 days" },
      { key: "ABANDONED_ITEM", value: "Product in cart", confidence: 80, ttl: "7 days" },
    ];
  } else if (has("salon", "spa", "hair", "barber", "beauty")) {
    industry = "Salon & Beauty";
    businessName = extractName(prompt) || "Glow Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Styling Booker", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Stylist Slot Allocator", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
    ];
    variables = [
      { key: "TREATMENT", value: "Hair Cut & Wash", confidence: 96, ttl: "14 days" },
    ];
  } else {
    businessName = extractName(prompt) || "Anaos Workspace";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Support Responder", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Meeting Scheduler", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
    ];
    variables = [
      { key: "CUSTOMER_NEED", value: "General Inquiry", confidence: 85, ttl: "30 days" },
    ];
  }

  return {
    id: `ws-custom-${Date.now()}`,
    name: businessName,
    industry,
    slug: (businessName || "workspace").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    status: "draft",
    version: 1,
    automations,
    variables,
  };
}

export async function generateWorkspaceWithAI(prompt: string): Promise<GeneratedWorkspace | null> {
  if (!process.env.GROQ_API_KEY) return null;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Design a WhatsApp automation workspace. Return ONLY valid JSON:
{"name":"string","industry":"string","automations":[{"id":"a1","name":"string","type":"whatsapp_flow|calendar|campaign","enabled":true,"runs":0,"lastRun":"Never"}],"variables":[{"key":"UPPER","value":"string","confidence":90,"ttl":"30 days"}]}
Include 3-4 automations and 2-4 variables. No markdown.`,
          },
          { role: "user", content: `Business prompt: "${prompt}"` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const name = parsed.name || "Custom Workspace";
    return {
      id: `ws-custom-${Date.now()}`,
      name,
      industry: parsed.industry || "General Business",
      slug: (name || "workspace").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      status: "draft",
      version: 1,
      automations: parsed.automations || [],
      variables: parsed.variables || [],
    };
  } catch {
    return null;
  }
}

export async function resolveWorkspaceFromPrompt(prompt: string): Promise<GeneratedWorkspace> {
  const ai = await generateWorkspaceWithAI(prompt);
  const ws = ai ?? generateWorkspaceFromPrompt(prompt);
  return { ...ws, industry: normalizeIndustryLabel(ws.industry) };
}
