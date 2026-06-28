import { NextResponse } from "next/server";
import { NeuralClassifier } from "@/lib/ai/pipeline/NeuralEmbedding";
import { AnaosNLP } from "@/lib/ai/pipeline/AnaosNLP";
import { WorkflowData } from "@/components/workflow/WorkflowCanvas";

export const dynamic = "force-dynamic";

// ── Node position layout helper ───────────────────────────────────────────────
// Auto-layout nodes left-to-right with smart vertical branching
function pos(col: number, row = 0) {
  return { x: 80 + col * 220, y: 150 + row * 130 };
}

// ── Industry → Default Workflow Templates ─────────────────────────────────────
function getTemplateWorkflow(industry: string, intent: string): WorkflowData {
  const id = () => `n-${Math.random().toString(36).slice(2, 8)}`;

  switch (industry) {
    case "restaurant": {
      const n1 = id(), n2 = id(), n3 = id(), n4 = id(), n5 = id(), n6 = id(), n7 = id();
      return {
        nodes: [
          { id: n1, type: "trigger",      label: "Customer Messages",    ...pos(0),    config: { event: "WhatsApp Message" } },
          { id: n2, type: "ai_reply",     label: "Understand Request",   ...pos(1),    config: { tone: "Friendly", system_prompt: "You are a restaurant assistant. Identify if customer wants to order food, book a table, or ask about menu." } },
          { id: n3, type: "condition",    label: "Order or Booking?",    ...pos(2),    config: { field: "message_text", operator: "contains", value: "order" } },
          { id: n4, type: "send_message", label: "Send Menu",            ...pos(3, -1), config: { message: "🍽️ Here's our menu! What would you like to order?\n\n1. Biryani - Rs. 350\n2. Karahi - Rs. 550\n3. Burger - Rs. 250\n\nReply with item number to order!", channel: "Same as trigger" } },
          { id: n5, type: "send_message", label: "Table Booking",        ...pos(3, 1),  config: { message: "📅 I'll book a table for you! Please share:\n1. Date & Time\n2. Number of guests", channel: "Same as trigger" } },
          { id: n6, type: "add_tag",      label: "Tag Customer",         ...pos(4, -1), config: { tag: "restaurant-customer" } },
          { id: n7, type: "end",          label: "Done",                 ...pos(5),    config: {} },
        ],
        edges: [
          { id: "e1", from: n1, to: n2 },
          { id: "e2", from: n2, to: n3 },
          { id: "e3", from: n3, to: n4 },
          { id: "e4", from: n3, to: n5 },
          { id: "e5", from: n4, to: n6 },
          { id: "e6", from: n6, to: n7 },
          { id: "e7", from: n5, to: n7 },
        ],
      };
    }

    case "real_estate": {
      const n1 = id(), n2 = id(), n3 = id(), n4 = id(), n5 = id(), n6 = id(), n7 = id(), n8 = id();
      return {
        nodes: [
          { id: n1, type: "trigger",      label: "Lead Arrives",         ...pos(0),    config: { event: "WhatsApp Message" } },
          { id: n2, type: "ai_reply",     label: "Qualify Lead",         ...pos(1),    config: { tone: "Professional", system_prompt: "You are a real estate agent assistant. Ask the customer about: 1) Budget 2) Property type (rent/buy) 3) Location preference 4) Size (marla/sqft)" } },
          { id: n3, type: "condition",    label: "High Value Lead?",     ...pos(2),    config: { field: "budget", operator: "greater_than", value: "5000000" } },
          { id: n4, type: "send_message", label: "Premium Listings",     ...pos(3, -1), config: { message: "🏠 Excellent! Based on your budget, I have some premium properties:\n\n1. DHA Phase 5 - 10 Marla\n2. Bahria Town - 1 Kanal\n\nWould you like to schedule a viewing?", channel: "Same as trigger" } },
          { id: n5, type: "send_message", label: "Standard Listings",    ...pos(3, 1),  config: { message: "🏡 Great! Here are properties matching your requirements. Our agent will contact you shortly with details.", channel: "Same as trigger" } },
          { id: n6, type: "add_tag",      label: "Hot Lead Tag",         ...pos(4, -1), config: { tag: "hot-lead" } },
          { id: n7, type: "http_request", label: "Notify Agent",         ...pos(4, -1), config: { url: "https://your-crm.com/api/leads", method: "POST", body: '{"source":"whatsapp","status":"hot"}' } },
          { id: n8, type: "end",          label: "Done",                 ...pos(5),    config: {} },
        ],
        edges: [
          { id: "e1", from: n1, to: n2 },
          { id: "e2", from: n2, to: n3 },
          { id: "e3", from: n3, to: n4 },
          { id: "e4", from: n3, to: n5 },
          { id: "e5", from: n4, to: n6 },
          { id: "e6", from: n6, to: n7 },
          { id: "e7", from: n7, to: n8 },
          { id: "e8", from: n5, to: n8 },
        ],
      };
    }

    case "clinic": {
      const n1 = id(), n2 = id(), n3 = id(), n4 = id(), n5 = id(), n6 = id();
      return {
        nodes: [
          { id: n1, type: "trigger",      label: "Patient Messages",     ...pos(0),    config: { event: "WhatsApp Message" } },
          { id: n2, type: "ai_reply",     label: "Understand Need",      ...pos(1),    config: { tone: "Professional", system_prompt: "You are a clinic receptionist AI. Help patients book appointments, answer questions about services, and provide clinic timings. Always ask for: patient name, complaint, preferred date/time." } },
          { id: n3, type: "condition",    label: "Urgent Case?",         ...pos(2),    config: { field: "message_text", operator: "contains", value: "emergency" } },
          { id: n4, type: "send_message", label: "Emergency Response",   ...pos(3, -1), config: { message: "🚨 For emergencies, please call: +92-XXX-XXXXXXX\n\nOr visit us immediately at: [Clinic Address]", channel: "Same as trigger" } },
          { id: n5, type: "send_message", label: "Book Appointment",     ...pos(3, 1),  config: { message: "📅 I'll book your appointment!\n\nAvailable slots:\n• Morning: 9am - 12pm\n• Evening: 5pm - 8pm\n\nWhich time works for you?", channel: "Same as trigger" } },
          { id: n6, type: "end",          label: "Done",                 ...pos(4),    config: {} },
        ],
        edges: [
          { id: "e1", from: n1, to: n2 },
          { id: "e2", from: n2, to: n3 },
          { id: "e3", from: n3, to: n4 },
          { id: "e4", from: n3, to: n5 },
          { id: "e5", from: n4, to: n6 },
          { id: "e6", from: n5, to: n6 },
        ],
      };
    }

    case "ecommerce": {
      const n1 = id(), n2 = id(), n3 = id(), n4 = id(), n5 = id(), n6 = id(), n7 = id();
      return {
        nodes: [
          { id: n1, type: "trigger",      label: "Customer Message",     ...pos(0),    config: { event: "WhatsApp Message" } },
          { id: n2, type: "ai_reply",     label: "Understand Request",   ...pos(1),    config: { tone: "Friendly", system_prompt: "You are an e-commerce support assistant. Help customers with: order status, product catalog, returns, and payment issues." } },
          { id: n3, type: "condition",    label: "Order Issue?",         ...pos(2),    config: { field: "message_text", operator: "contains", value: "order" } },
          { id: n4, type: "send_message", label: "Order Status",         ...pos(3, -1), config: { message: "📦 Let me check your order status! Please share your order number.", channel: "Same as trigger" } },
          { id: n5, type: "send_message", label: "Product Catalog",      ...pos(3, 1),  config: { message: "🛍️ Welcome! Here are our top products:\n\n1. Product A - Rs. 1500\n2. Product B - Rs. 2000\n\nView full catalog: [link]", channel: "Same as trigger" } },
          { id: n6, type: "add_tag",      label: "Tag Buyer",            ...pos(4, -1), config: { tag: "returning-customer" } },
          { id: n7, type: "end",          label: "Done",                 ...pos(5),    config: {} },
        ],
        edges: [
          { id: "e1", from: n1, to: n2 },
          { id: "e2", from: n2, to: n3 },
          { id: "e3", from: n3, to: n4 },
          { id: "e4", from: n3, to: n5 },
          { id: "e5", from: n4, to: n6 },
          { id: "e6", from: n6, to: n7 },
          { id: "e7", from: n5, to: n7 },
        ],
      };
    }

    case "education": {
      const n1 = id(), n2 = id(), n3 = id(), n4 = id(), n5 = id();
      return {
        nodes: [
          { id: n1, type: "trigger",      label: "Student/Parent Msgs",  ...pos(0),    config: { event: "WhatsApp Message" } },
          { id: n2, type: "ai_reply",     label: "Answer Query",         ...pos(1),    config: { tone: "Professional", system_prompt: "You are an educational institute assistant. Answer questions about admissions, fee structure, courses, and schedules." } },
          { id: n3, type: "condition",    label: "Admission Inquiry?",   ...pos(2),    config: { field: "message_text", operator: "contains", value: "admission" } },
          { id: n4, type: "send_message", label: "Admission Info",       ...pos(3, -1), config: { message: "📚 Admissions are open!\n\nPrograms available:\n• Matric\n• FSc\n• O/A Levels\n\nFee: Rs. XXXX/month\n\nCall us: +92-XXX-XXXXXXX", channel: "Same as trigger" } },
          { id: n5, type: "end",          label: "Done",                 ...pos(4),    config: {} },
        ],
        edges: [
          { id: "e1", from: n1, to: n2 },
          { id: "e2", from: n2, to: n3 },
          { id: "e3", from: n3, to: n4 },
          { id: "e4", from: n4, to: n5 },
          { id: "e5", from: n3, to: n5 },
        ],
      };
    }

    default: {
      // Generic business workflow
      const n1 = id(), n2 = id(), n3 = id(), n4 = id(), n5 = id();
      return {
        nodes: [
          { id: n1, type: "trigger",      label: "Customer Messages",    ...pos(0),    config: { event: "WhatsApp Message" } },
          { id: n2, type: "ai_reply",     label: "AI Understands",       ...pos(1),    config: { tone: "Friendly", system_prompt: "You are a helpful business assistant. Understand what the customer needs and respond appropriately." } },
          { id: n3, type: "condition",    label: "Needs Human?",         ...pos(2),    config: { field: "message_text", operator: "contains", value: "speak to" } },
          { id: n4, type: "send_message", label: "Human Handoff",        ...pos(3, -1), config: { message: "I'll connect you with our team shortly! ⏳", channel: "Same as trigger" } },
          { id: n5, type: "end",          label: "Done",                 ...pos(4),    config: {} },
        ],
        edges: [
          { id: "e1", from: n1, to: n2 },
          { id: "e2", from: n2, to: n3 },
          { id: "e3", from: n3, to: n4 },
          { id: "e4", from: n4, to: n5 },
          { id: "e5", from: n3, to: n5 },
        ],
      };
    }
  }
}

// ── Grok-powered smart workflow generator ─────────────────────────────────────
async function generateWithGrok(
  prompt: string,
  industry: string,
  intent: string,
  entities: Record<string, string[]>
): Promise<WorkflowData | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are Anaos — an expert automation workflow designer.

Generate a visual workflow with NODES and EDGES for a business automation.

## Pre-Analysis from our AI engine:
- Industry: ${industry}
- Intent: ${intent}
- Key entities: ${JSON.stringify(entities)}

## Node Types allowed:
- "trigger"      → Starts the flow (WhatsApp Message, Instagram DM, Facebook Message, Schedule)
- "ai_reply"     → AI processes and replies to customer
- "condition"    → IF/ELSE branch (fields: message_text, tag, budget, opt_out)
- "send_message" → Send text to customer
- "wait"         → Delay (minutes, hours, days)
- "http_request" → Call external API
- "add_tag"      → Label a contact
- "end"          → End the flow

## Layout Rules:
- Start X at 80, increment by 220 for each column
- Y: 150 for main path, 80 for upper branch, 280 for lower branch
- Max 8 nodes, max 10 edges

## Output (ONLY valid JSON):
{
  "workflowName": "Descriptive name for this workflow",
  "nodes": [
    {"id":"n1","type":"trigger","label":"Short label","x":80,"y":150,"config":{"event":"WhatsApp Message"}},
    {"id":"n2","type":"ai_reply","label":"Short label","x":300,"y":150,"config":{"tone":"Friendly","system_prompt":"Your role here"}},
    {"id":"n3","type":"condition","label":"Short label","x":520,"y":150,"config":{"field":"message_text","operator":"contains","value":"keyword"}},
    {"id":"n4","type":"send_message","label":"Short label","x":740,"y":80,"config":{"message":"Your message here","channel":"Same as trigger"}},
    {"id":"n5","type":"end","label":"Done","x":960,"y":150,"config":{}}
  ],
  "edges": [
    {"id":"e1","from":"n1","to":"n2"},
    {"id":"e2","from":"n2","to":"n3"}
  ]
}

Rules:
- Labels max 20 chars
- system_prompt: explain the AI's role clearly
- Messages: include actual useful content, emojis OK
- Always start with trigger, always end with end node`,
          },
          {
            role: "user",
            content: `Business description: "${prompt}"\n\nGenerate the perfect automation workflow.`,
          },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (!parsed.nodes || !parsed.edges) return null;

    return {
      nodes: parsed.nodes,
      edges: parsed.edges,
    };
  } catch (e) {
    console.error("[WorkflowGenerator] Grok error:", e);
    return null;
  }
}

// ── UI Features Mapping ───────────────────────────────────────────────────────
function getFeaturesForIndustry(industry: string) {
  if (industry === "ecommerce") {
    return [
      { category: "AI WHATSAPP AGENT", title: "Order Confirmation", description: "Shopify support & product discovery bot.", defaultOn: true },
      { category: "AUTONOMOUS SCHEDULER", title: "Appointment Scheduling", description: "Shipping updates & scheduled delivery support.", defaultOn: true },
      { category: "WORKFLOW AUTOMATOR", title: "Promotional Campaign", description: "Abandoned cart recovery & smart promotions.", defaultOn: false },
    ];
  } else if (industry === "real_estate") {
    return [
      { category: "AI WHATSAPP AGENT", title: "Lead Qualification", description: "Instantly qualifies inbound property inquiries.", defaultOn: true },
      { category: "WORKFLOW AUTOMATOR", title: "Agent Handoff", description: "Routes hot leads to the right sales agent.", defaultOn: true },
      { category: "AUTONOMOUS SCHEDULER", title: "Viewing Scheduler", description: "Books property viewing appointments automatically.", defaultOn: false },
    ];
  } else if (industry === "clinic") {
    return [
      { category: "AUTONOMOUS SCHEDULER", title: "Appointment Booking", description: "Handles patient scheduling and reminders.", defaultOn: true },
      { category: "AI WHATSAPP AGENT", title: "Patient Support", description: "Answers FAQs about timings and services.", defaultOn: true },
      { category: "WORKFLOW AUTOMATOR", title: "Follow-up System", description: "Post-consultation care and feedback collection.", defaultOn: false },
    ];
  }
  
  return [
    { category: "AI WHATSAPP AGENT", title: "Customer Support", description: "24/7 intelligent answering for your business.", defaultOn: true },
    { category: "WORKFLOW AUTOMATOR", title: "Lead Routing", description: "Capture and route incoming messages.", defaultOn: true },
    { category: "AUTONOMOUS SCHEDULER", title: "Meeting Scheduler", description: "Book meetings without human intervention.", defaultOn: false },
  ];
}

// ── Main API Handler ──────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Step 1: Neural classification
    const neural = NeuralClassifier.classify(prompt);

    // Step 2: NLP extraction
    const nlp = AnaosNLP.processText(prompt, "general" as any);

    // Step 3: Try Grok first (smartest result)
    const grokWorkflow = await generateWithGrok(
      prompt,
      neural.label,
      nlp.intent,
      nlp.summary as Record<string, string[]>
    );

    // Step 4: Fallback to template if Grok fails
    const workflow = grokWorkflow ?? getTemplateWorkflow(neural.industry, nlp.intent);

    // Step 5: Generate workflow name
    const workflowName = `${neural.emoji} ${neural.label} Automation`;

    // Step 6: Generate UI Features mapping for the Preview Modal
    const features = getFeaturesForIndustry(neural.industry);

    return NextResponse.json({
      success: true,
      workflowName,
      industry: neural.label,
      confidence: neural.confidencePct,
      source: grokWorkflow ? "ai" : "template",
      workflow,
      features,
    });
  } catch (error) {
    console.error("[WorkflowGenerator] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
