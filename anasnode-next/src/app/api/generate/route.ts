import { NextResponse } from "next/server";

// Dynamic generator based on the prompt keywords
function generateWorkspaceFromPrompt(prompt: string) {
  const cleanPrompt = prompt.toLowerCase();
  
  // 1. Detect industry & business name
  let industry = "General Business";
  let businessName = "Custom Workspace";
  let automations: any[] = [];
  let variables: any[] = [];

  // Helper to check keywords
  const has = (...keys: string[]) => keys.some(k => cleanPrompt.includes(k));

  if (has("real estate", "property", "broker", "apartment", "house", "rent", "buy", "sell")) {
    industry = "Real Estate";
    businessName = extractName(prompt) || "Estate Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Lead Qualifier", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Viewing Scheduler Bot", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Listing Match Broadcast", type: "campaign", enabled: false, runs: 0, lastRun: "Never" }
    ];
    variables = [
      { key: "BUDGET_LIMIT", value: extractAmount(prompt) || "Flexible", confidence: 95, ttl: "30 days" },
      { key: "PROPERTY_TYPE", value: has("rent") ? "Rental" : "Purchase", confidence: 90, ttl: "30 days" },
      { key: "PREFERED_AREA", value: "Downtown", confidence: 85, ttl: "30 days" }
    ];
  } else if (has("restaurant", "food", "cafe", "dine", "eat", "order", "table", "menu")) {
    industry = "Restaurant";
    businessName = extractName(prompt) || "Bistro Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Smart Ordering", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Table Reservation Manager", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Weekly Specials Broadcast", type: "campaign", enabled: false, runs: 0, lastRun: "Never" },
      { id: "a-custom-4", name: "Diner Review Collector", type: "campaign", enabled: true, runs: 0, lastRun: "Never" }
    ];
    variables = [
      { key: "CRAVING", value: "Chef Special", confidence: 88, ttl: "7 days" },
      { key: "PARTY_SIZE", value: "2-4 People", confidence: 95, ttl: "7 days" }
    ];
  } else if (has("clinic", "doctor", "dentist", "patient", "health", "appointment", "medical")) {
    industry = "Clinic";
    businessName = extractName(prompt) || "Care Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Appointment Booker", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Automated Visit Reminders", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Post-Treatment Checkup", type: "campaign", enabled: true, runs: 0, lastRun: "Never" }
    ];
    variables = [
      { key: "VISIT_REASON", value: "General Checkup", confidence: 92, ttl: "15 days" },
      { key: "PATIENT_TYPE", value: "Returning", confidence: 98, ttl: "365 days" }
    ];
  } else if (has("gym", "fitness", "workout", "trainer", "member", "class", "personal training")) {
    industry = "Fitness";
    businessName = extractName(prompt) || "Fit Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Class Booker", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "PT Session Scheduler", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Membership Renewal Alert", type: "campaign", enabled: true, runs: 0, lastRun: "Never" }
    ];
    variables = [
      { key: "GOAL", value: "Weight Loss / Strength", confidence: 85, ttl: "90 days" },
      { key: "MEMBERSHIP_TIER", value: "Standard Monthly", confidence: 95, ttl: "30 days" }
    ];
  } else if (has("salon", "spa", "hair", "cut", "style", "barber", "beauty")) {
    industry = "Salon & Beauty";
    businessName = extractName(prompt) || "Glow Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Styling Booker", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Stylist Slot Allocator", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Loyalty Discount Drips", type: "campaign", enabled: false, runs: 0, lastRun: "Never" }
    ];
    variables = [
      { key: "STYLIST_PREF", value: "Senior Stylist", confidence: 90, ttl: "60 days" },
      { key: "TREATMENT", value: "Hair Cut & Wash", confidence: 96, ttl: "14 days" }
    ];
  } else if (has("shop", "store", "buy", "sell", "product", "e-commerce", "ecommerce", "cart")) {
    industry = "E-Commerce";
    businessName = extractName(prompt) || "Cart Flow";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Product Catalog", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Abandoned Cart Recovery", type: "campaign", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Order Tracking Alerts", type: "campaign", enabled: true, runs: 0, lastRun: "Never" }
    ];
    variables = [
      { key: "LAST_CART_VALUE", value: extractAmount(prompt) || "$45.00", confidence: 95, ttl: "7 days" },
      { key: "ABANDONED_ITEM", value: "Sneakers / Apparel", confidence: 80, ttl: "7 days" }
    ];
  } else {
    // General Business fallback
    businessName = extractName(prompt) || "AnasNode Workspace";
    automations = [
      { id: "a-custom-1", name: "WhatsApp Support Responder", type: "whatsapp_flow", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-2", name: "Meeting Scheduler", type: "calendar", enabled: true, runs: 0, lastRun: "Never" },
      { id: "a-custom-3", name: "Customer Feedback Loop", type: "campaign", enabled: true, runs: 0, lastRun: "Never" }
    ];
    variables = [
      { key: "CUSTOMER_NEED", value: "General Inquiry", confidence: 85, ttl: "30 days" },
      { key: "RESPONSE_PRIORITY", value: "Normal", confidence: 90, ttl: "7 days" }
    ];
  }

  return {
    id: `ws-custom-${Date.now()}`,
    name: businessName,
    industry: industry,
    slug: businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    status: "draft" as const,
    version: 1,
    automations,
    variables
  };
}

// Helper to extract a business name from prompt (e.g. "I run a gym named FitLife" -> "FitLife")
function extractName(prompt: string): string | null {
  const match = prompt.match(/(?:named|called|name is|brand is)\s+([A-Za-z0-9\s'&]+?)(?:\.|\b|$)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Try extracting capitalized words after "I run a" or "I own a"
  const altMatch = prompt.match(/(?:run|own|manage)\s+(?:a|an)\s+([A-Za-z0-9\s'&]+?)(?:\s+(?:brokerage|restaurant|clinic|gym|salon|shop|store|business|brand))(?:\.|\b|$)/i);
  if (altMatch && altMatch[1]) {
    const word = altMatch[1].trim();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  
  return null;
}

// Helper to extract amounts (e.g. $100, 2.2M)
function extractAmount(prompt: string): string | null {
  const match = prompt.match(/(\$|£|€|aed|rs)?\s*([0-9]+(?:\.[0-9]+)?\s*(k|m|million|billion)?)/i);
  return match ? match[0].trim().toUpperCase() : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const workspace = generateWorkspaceFromPrompt(prompt);
    
    return NextResponse.json({
      success: true,
      workspace
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
