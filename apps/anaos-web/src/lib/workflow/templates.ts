import { prisma } from "../db";
import { NodeType, WorkflowNode, WorkflowEdge } from "./types";

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export const TEMPLATES: WorkflowTemplate[] = [
  {
    id: "real-estate-lead-qualifier",
    name: "Real Estate Lead Qualifier",
    description: "Qualify home buyer budgets, capture location preferences, and automatically schedule viewing sessions on calendar.",
    industry: "Real Estate",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_WHATSAPP,
        name: "WhatsApp Message Trigger",
        position: { x: 50, y: 150 },
        config: { keyword: "hi", matchType: "any" },
        inputs: [],
        outputs: ["node-2"]
      },
      {
        id: "node-2",
        type: NodeType.AI_RESPOND,
        name: "AI Welcome Responder",
        position: { x: 250, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          systemPrompt: "You are a warm receptionist for Marina Realty brokerage in Dubai. Ask the customer what their budget limit is for a new home purchase.",
          userMessage: "Customer sent: {{message}}"
        },
        inputs: ["node-1"],
        outputs: ["node-3"]
      },
      {
        id: "node-3",
        type: NodeType.AI_EXTRACT,
        name: "Extract Budget & Area",
        position: { x: 450, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          schema: ["BUDGET", "LOCATION"]
        },
        inputs: ["node-2"],
        outputs: ["node-4"]
      },
      {
        id: "node-4",
        type: NodeType.ANAMIND_SET,
        name: "Pin Budget to Profile",
        position: { x: 650, y: 150 },
        config: {
          variableKey: "BUDGET",
          variableValue: "{{BUDGET}}"
        },
        inputs: ["node-3"],
        outputs: ["node-5"]
      },
      {
        id: "node-5",
        type: NodeType.GOOGLE_CALENDAR,
        name: "Schedule Viewing on Calendar",
        position: { x: 850, y: 150 },
        config: {
          summary: "Property Viewing - {{contactName}} (Budget: {{BUDGET}})",
          startTime: "Saturday 2:00 PM"
        },
        inputs: ["node-4"],
        outputs: []
      }
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
      { id: "e4", source: "node-4", target: "node-5" }
    ]
  },
  {
    id: "restaurant-order-bot",
    name: "Restaurant Smart Order Bot",
    description: "Present menu options, confirm dining orders, save to CRM, and automatically send a review campaign 1 hour later.",
    industry: "Restaurant",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_WHATSAPP,
        name: "WhatsApp Menu Request",
        position: { x: 50, y: 150 },
        config: { keyword: "menu", matchType: "contains" },
        inputs: [],
        outputs: ["node-2"]
      },
      {
        id: "node-2",
        type: NodeType.SEND_WHATSAPP_BUTTONS,
        name: "Present Menu Categories",
        position: { x: 240, y: 150 },
        config: {
          content: "Welcome to Olive & Oak! What would you like to order today?",
          buttons: ["Pasta Specials", "Stone Oven Pizza", "Daily Beverages"]
        },
        inputs: ["node-1"],
        outputs: ["node-3"]
      },
      {
        id: "node-3",
        type: NodeType.AI_RESPOND,
        name: "AI Order Confirmer",
        position: { x: 440, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          systemPrompt: "Confirm the customer's food items and thank them. Calculate a friendly delivery ETA.",
          userMessage: "Customer chose menu item: {{message}}"
        },
        inputs: ["node-2"],
        outputs: ["node-4"]
      },
      {
        id: "node-4",
        type: NodeType.CRM_CREATE_DEAL,
        name: "Create CRM Dining Deal",
        position: { x: 640, y: 150 },
        config: {
          stage: "Order Placed",
          amount: "AED 120.00"
        },
        inputs: ["node-3"],
        outputs: ["node-5"]
      },
      {
        id: "node-5",
        type: NodeType.WAIT,
        name: "Wait 1 Hour",
        position: { x: 840, y: 150 },
        config: { minutes: 60 },
        inputs: ["node-4"],
        outputs: ["node-6"]
      },
      {
        id: "node-6",
        type: NodeType.SEND_WHATSAPP,
        name: "Request Dining Feedback",
        position: { x: 1040, y: 150 },
        config: {
          template: "Hi {{contactName}}, how was your dining experience at Olive & Oak? Leave a review: https://google.com/review"
        },
        inputs: ["node-5"],
        outputs: []
      }
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
      { id: "e4", source: "node-4", target: "node-5" },
      { id: "e5", source: "node-5", target: "node-6" }
    ]
  },
  {
    id: "clinic-appointment",
    name: "Clinic Appointment Booker",
    description: "Qualify clinical checkup reasons, present open slots, book to Google Calendar, and send a custom reminder 1 hour before.",
    industry: "Clinic",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_WHATSAPP,
        name: "WhatsApp Booking Intent",
        position: { x: 50, y: 150 },
        config: { keyword: "book", matchType: "contains" },
        inputs: [],
        outputs: ["node-2"]
      },
      {
        id: "node-2",
        type: NodeType.AI_RESPOND,
        name: "Ask Checkup Reason",
        position: { x: 240, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          systemPrompt: "You are the automated booking assistant for CareDental clinic. Politely ask the patient what symptom or treatment they are booking for.",
          userMessage: "Patient said: {{message}}"
        },
        inputs: ["node-1"],
        outputs: ["node-3"]
      },
      {
        id: "node-3",
        type: NodeType.AI_EXTRACT,
        name: "Extract Visit Reason",
        position: { x: 440, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          schema: ["VISIT_REASON"]
        },
        inputs: ["node-2"],
        outputs: ["node-4"]
      },
      {
        id: "node-4",
        type: NodeType.ANAMIND_SET,
        name: "Pin Visit Reason",
        position: { x: 640, y: 150 },
        config: {
          variableKey: "VISIT_REASON",
          variableValue: "{{VISIT_REASON}}"
        },
        inputs: ["node-3"],
        outputs: ["node-5"]
      },
      {
        id: "node-5",
        type: NodeType.GOOGLE_CALENDAR,
        name: "Create Dental Booking",
        position: { x: 840, y: 150 },
        config: {
          summary: "Dental Booking - {{contactName}} (Reason: {{VISIT_REASON}})",
          startTime: "Tomorrow 11:00 AM"
        },
        inputs: ["node-4"],
        outputs: ["node-6"]
      },
      {
        id: "node-6",
        type: NodeType.WAIT,
        name: "Wait Until Pre-Visit (50 min)",
        position: { x: 1040, y: 150 },
        config: { minutes: 50 },
        inputs: ["node-5"],
        outputs: ["node-7"]
      },
      {
        id: "node-7",
        type: NodeType.SEND_WHATSAPP,
        name: "Send Pre-Visit Reminder",
        position: { x: 1240, y: 150 },
        config: {
          template: "Hi {{contactName}}, reminder: your booking at CareDental ({{VISIT_REASON}}) is scheduled in 10 minutes. See you soon!"
        },
        inputs: ["node-6"],
        outputs: []
      }
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
      { id: "e4", source: "node-4", target: "node-5" },
      { id: "e5", source: "node-5", target: "node-6" },
      { id: "e6", source: "node-6", target: "node-7" }
    ]
  },
  {
    id: "ecommerce-cart-recovery",
    name: "E-Commerce Cart Recovery",
    description: "Monitor Shopify abandoned checkouts, wait 2 hours, craft an AI personalized offer, and trigger direct WhatsApp discounts.",
    industry: "E-Commerce",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_SHOPIFY,
        name: "Shopify Abandoned Checkout",
        position: { x: 50, y: 150 },
        config: { event: "cart_abandoned" },
        inputs: [],
        outputs: ["node-2"]
      },
      {
        id: "node-2",
        type: NodeType.WAIT,
        name: "Wait 2 Hours",
        position: { x: 240, y: 150 },
        config: { minutes: 120 },
        inputs: ["node-1"],
        outputs: ["node-3"]
      },
      {
        id: "node-3",
        type: NodeType.AI_GENERATE_CONTENT,
        name: "Personalize Offer Copy",
        position: { x: 440, y: 150 },
        config: {
          provider: "openai",
          model: "gpt-4o",
          systemPrompt: "You are a customer loyalty assistant for a popular online shop. Draft a short, encouraging WhatsApp offer giving the customer a 10% discount code: SAVE10. Keep it friendly.",
          userMessage: "Customer name: {{contactName}}, left cart item: {{cart_item}}"
        },
        inputs: ["node-2"],
        outputs: ["node-4"]
      },
      {
        id: "node-4",
        type: NodeType.SEND_WHATSAPP,
        name: "Send Recovery WhatsApp",
        position: { x: 640, y: 150 },
        config: {
          template: "{{AI_RESPONSE}}"
        },
        inputs: ["node-3"],
        outputs: []
      }
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" }
    ]
  },
  {
    id: "salon-booking",
    name: "Salon Slot Booker",
    description: "Capture stylist allocation, check session availability, book to calendar, and alert customer 30 minutes before appointment.",
    industry: "Salon",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_WHATSAPP,
        name: "WhatsApp Salon Trigger",
        position: { x: 50, y: 150 },
        config: { keyword: "hair", matchType: "contains" },
        inputs: [],
        outputs: ["node-2"]
      },
      {
        id: "node-2",
        type: NodeType.SEND_WHATSAPP_BUTTONS,
        name: "Ask Styling Preferences",
        position: { x: 240, y: 150 },
        config: {
          content: "Welcome to Glow Salon! Please select your treatment preference:",
          buttons: ["Hair Cut & Styling", "Spa Facial", "Nail Treatment"]
        },
        inputs: ["node-1"],
        outputs: ["node-3"]
      },
      {
        id: "node-3",
        type: NodeType.HTTP_REQUEST,
        name: "Query Open Stylist Slots",
        position: { x: 440, y: 150 },
        config: {
          url: "https://httpbin.org/post",
          method: "POST",
          headers: "{\"Content-Type\":\"application/json\"}",
          body: "{\"check\":\"availability\",\"service\":\"{{message}}\"}"
        },
        inputs: ["node-2"],
        outputs: ["node-4"]
      },
      {
        id: "node-4",
        type: NodeType.GOOGLE_CALENDAR,
        name: "Schedule Salon Slot",
        position: { x: 640, y: 150 },
        config: {
          summary: "Salon Slot - {{contactName}} (Style: {{message}})",
          startTime: "Today 4:00 PM"
        },
        inputs: ["node-3"],
        outputs: ["node-5"]
      },
      {
        id: "node-5",
        type: NodeType.WAIT,
        name: "Wait Until Pre-Visit (30 min)",
        position: { x: 840, y: 150 },
        config: { minutes: 30 },
        inputs: ["node-4"],
        outputs: ["node-6"]
      },
      {
        id: "node-6",
        type: NodeType.SEND_WHATSAPP,
        name: "Send Styling Reminder",
        position: { x: 1040, y: 150 },
        config: {
          template: "Hi {{contactName}}, your Glow styling slot is starting in 30 minutes! See you soon."
        },
        inputs: ["node-5"],
        outputs: []
      }
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
      { id: "e4", source: "node-4", target: "node-5" },
      { id: "e5", source: "node-5", target: "node-6" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // U.S. MARKET TEMPLATES
  // ─────────────────────────────────────────────────────────────────

  {
    id: "missed-call-textback",
    name: "Missed Call Text-Back",
    description: "When a customer calls and no one answers, automatically send them a WhatsApp/SMS message within 60 seconds so you never lose a lead.",
    industry: "General Business",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_WHATSAPP,
        name: "Missed Call Trigger",
        position: { x: 50, y: 150 },
        config: { keyword: "missed_call", matchType: "system_event" },
        inputs: [],
        outputs: ["node-2"],
      },
      {
        id: "node-2",
        type: NodeType.AI_RESPOND,
        name: "AI Text-Back Message",
        position: { x: 280, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          systemPrompt:
            "You are a friendly business assistant. A customer just called and no one was available to answer. Send a warm, professional text-back message letting them know you saw their call and will get back to them shortly. Ask how you can help them today. Keep it under 3 sentences.",
          userMessage: "Customer {{contactName}} just called and no one answered. Send them a text-back.",
        },
        inputs: ["node-1"],
        outputs: ["node-3"],
      },
      {
        id: "node-3",
        type: NodeType.SEND_WHATSAPP,
        name: "Send Text-Back",
        position: { x: 520, y: 150 },
        config: { template: "{{AI_RESPONSE}}" },
        inputs: ["node-2"],
        outputs: ["node-4"],
      },
      {
        id: "node-4",
        type: NodeType.ANAMIND_SET,
        name: "Tag as Missed Call",
        position: { x: 760, y: 150 },
        config: { variableKey: "LEAD_SOURCE", variableValue: "missed_call" },
        inputs: ["node-3"],
        outputs: [],
      },
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
    ],
  },

  {
    id: "lead-followup-sequence",
    name: "New Lead Follow-Up Sequence",
    description: "Capture a new lead and automatically follow up at 1 hour, 24 hours, and 72 hours with personalized messages to maximize conversion.",
    industry: "General Business",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_WHATSAPP,
        name: "New Lead Message",
        position: { x: 50, y: 150 },
        config: { keyword: "any", matchType: "any" },
        inputs: [],
        outputs: ["node-2"],
      },
      {
        id: "node-2",
        type: NodeType.AI_EXTRACT,
        name: "Extract Lead Info",
        position: { x: 260, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          schema: ["NAME", "INTEREST", "BUDGET"],
          userMessage: "{{message}}",
        },
        inputs: ["node-1"],
        outputs: ["node-3"],
      },
      {
        id: "node-3",
        type: NodeType.ANAMIND_SET,
        name: "Save Lead Profile",
        position: { x: 470, y: 150 },
        config: { variableKey: "INTEREST", variableValue: "{{INTEREST}}" },
        inputs: ["node-2"],
        outputs: ["node-4"],
      },
      {
        id: "node-4",
        type: NodeType.AI_RESPOND,
        name: "Immediate Welcome Reply",
        position: { x: 680, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          systemPrompt:
            "You are a friendly sales assistant. A new lead just reached out. Welcome them warmly, acknowledge what they're interested in, and let them know someone will be in touch. Keep it short and professional.",
          userMessage: "New lead: {{contactName}} is interested in {{INTEREST}}",
        },
        inputs: ["node-3"],
        outputs: ["node-5"],
      },
      {
        id: "node-5",
        type: NodeType.SEND_WHATSAPP,
        name: "Send Welcome Message",
        position: { x: 900, y: 150 },
        config: { template: "{{AI_RESPONSE}}" },
        inputs: ["node-4"],
        outputs: ["node-6"],
      },
      {
        id: "node-6",
        type: NodeType.WAIT,
        name: "Wait 1 Hour",
        position: { x: 1100, y: 150 },
        config: { minutes: 60 },
        inputs: ["node-5"],
        outputs: ["node-7"],
      },
      {
        id: "node-7",
        type: NodeType.SEND_WHATSAPP,
        name: "1-Hour Follow-Up",
        position: { x: 1300, y: 150 },
        config: {
          template:
            "Hi {{contactName}}! Just checking in — do you have any questions about {{INTEREST}}? I'm here to help. 😊",
        },
        inputs: ["node-6"],
        outputs: [],
      },
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
      { id: "e4", source: "node-4", target: "node-5" },
      { id: "e5", source: "node-5", target: "node-6" },
      { id: "e6", source: "node-6", target: "node-7" },
    ],
  },

  {
    id: "payment-reminder",
    name: "Invoice Payment Reminder",
    description: "Automatically send polite payment reminders when an invoice is overdue. Reduces collection time and awkward phone calls.",
    industry: "General Business",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_WEBHOOK,
        name: "Invoice Overdue Trigger",
        position: { x: 50, y: 150 },
        config: { event: "invoice.overdue" },
        inputs: [],
        outputs: ["node-2"],
      },
      {
        id: "node-2",
        type: NodeType.AI_RESPOND,
        name: "Draft Friendly Reminder",
        position: { x: 280, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          systemPrompt:
            "You are a polite billing assistant. Draft a friendly but clear payment reminder message. Mention the invoice is overdue, include the amount if available. Keep a professional and warm tone — not aggressive. Under 4 sentences.",
          userMessage:
            "Customer {{contactName}} has an overdue invoice for {{invoice_amount}}. Invoice number: {{invoice_id}}.",
        },
        inputs: ["node-1"],
        outputs: ["node-3"],
      },
      {
        id: "node-3",
        type: NodeType.SEND_WHATSAPP,
        name: "Send Payment Reminder",
        position: { x: 520, y: 150 },
        config: { template: "{{AI_RESPONSE}}" },
        inputs: ["node-2"],
        outputs: ["node-4"],
      },
      {
        id: "node-4",
        type: NodeType.WAIT,
        name: "Wait 3 Days",
        position: { x: 760, y: 150 },
        config: { minutes: 4320 },
        inputs: ["node-3"],
        outputs: ["node-5"],
      },
      {
        id: "node-5",
        type: NodeType.SEND_WHATSAPP,
        name: "Second Reminder",
        position: { x: 1000, y: 150 },
        config: {
          template:
            "Hi {{contactName}}, just a gentle follow-up on the outstanding invoice. Please let us know if you have any questions or need to discuss payment options. Thank you! 🙏",
        },
        inputs: ["node-4"],
        outputs: [],
      },
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
      { id: "e4", source: "node-4", target: "node-5" },
    ],
  },

  {
    id: "review-request",
    name: "Customer Review Request",
    description: "After a service or purchase is complete, automatically ask happy customers for a Google or Yelp review to build your online reputation.",
    industry: "General Business",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_WEBHOOK,
        name: "Service Completed Trigger",
        position: { x: 50, y: 150 },
        config: { event: "service.completed" },
        inputs: [],
        outputs: ["node-2"],
      },
      {
        id: "node-2",
        type: NodeType.WAIT,
        name: "Wait 2 Hours (Let Them Settle)",
        position: { x: 260, y: 150 },
        config: { minutes: 120 },
        inputs: ["node-1"],
        outputs: ["node-3"],
      },
      {
        id: "node-3",
        type: NodeType.AI_RESPOND,
        name: "Personalized Review Ask",
        position: { x: 470, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          systemPrompt:
            "You are a friendly customer success assistant. Draft a warm, non-pushy message asking the customer to leave a Google review. Mention that it only takes 30 seconds and helps the business a lot. Include a placeholder [REVIEW_LINK] for the actual link. Keep it genuine.",
          userMessage:
            "Customer {{contactName}} just completed their service/purchase. Ask them for a review.",
        },
        inputs: ["node-2"],
        outputs: ["node-4"],
      },
      {
        id: "node-4",
        type: NodeType.SEND_WHATSAPP,
        name: "Send Review Request",
        position: { x: 700, y: 150 },
        config: { template: "{{AI_RESPONSE}}" },
        inputs: ["node-3"],
        outputs: [],
      },
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
    ],
  },

  {
    id: "quote-followup",
    name: "Quote / Proposal Follow-Up",
    description: "After sending a quote or proposal, automatically follow up at the right time to answer questions and close the deal before the customer goes elsewhere.",
    industry: "General Business",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_WEBHOOK,
        name: "Quote Sent Trigger",
        position: { x: 50, y: 150 },
        config: { event: "quote.sent" },
        inputs: [],
        outputs: ["node-2"],
      },
      {
        id: "node-2",
        type: NodeType.ANAMIND_SET,
        name: "Save Quote Details",
        position: { x: 270, y: 150 },
        config: { variableKey: "QUOTE_AMOUNT", variableValue: "{{quote_amount}}" },
        inputs: ["node-1"],
        outputs: ["node-3"],
      },
      {
        id: "node-3",
        type: NodeType.WAIT,
        name: "Wait 2 Days",
        position: { x: 490, y: 150 },
        config: { minutes: 2880 },
        inputs: ["node-2"],
        outputs: ["node-4"],
      },
      {
        id: "node-4",
        type: NodeType.AI_RESPOND,
        name: "Craft Follow-Up Message",
        position: { x: 710, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          systemPrompt:
            "You are a professional sales assistant. Draft a short, confident follow-up message for a quote that was sent 2 days ago. Express that you are checking in, and mention you are happy to answer any questions or adjust the scope if needed. Do not be pushy — be helpful and curious.",
          userMessage:
            "Following up on a quote sent to {{contactName}} for {{QUOTE_AMOUNT}}. Haven't heard back yet.",
        },
        inputs: ["node-3"],
        outputs: ["node-5"],
      },
      {
        id: "node-5",
        type: NodeType.SEND_WHATSAPP,
        name: "Send Quote Follow-Up",
        position: { x: 940, y: 150 },
        config: { template: "{{AI_RESPONSE}}" },
        inputs: ["node-4"],
        outputs: [],
      },
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
      { id: "e4", source: "node-4", target: "node-5" },
    ],
  },

  // -- AI COLD CALLING TEMPLATE --------------------------------------
  {
    id: "cold-calling",
    name: "AI Cold Calling Campaign",
    description: "Outbound AI voice calls to contacts. After each call, sends a WhatsApp follow-up and books a meeting automatically.",
    industry: "General Business",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_SCHEDULE,
        name: "Call Campaign Start",
        position: { x: 50, y: 150 },
        config: { cron: "0 10 * * 1-5" },
        inputs: [],
        outputs: ["node-2"],
      },
      {
        id: "node-2",
        type: NodeType.ANAMIND_SET,
        name: "Tag as Cold Call Lead",
        position: { x: 250, y: 150 },
        config: { variableKey: "LEAD_SOURCE", variableValue: "cold_call_campaign" },
        inputs: ["node-1"],
        outputs: ["node-3"],
      },
      {
        id: "node-3",
        type: NodeType.SEND_VOICE_CALL,
        name: "AI Outbound Voice Call",
        position: { x: 450, y: 150 },
        config: {
          voiceProvider: "eleven_labs",
          firstMessage: "Hi, this is an AI assistant. Do you have 2 minutes?",
          prompt: "You are a professional AI calling agent. Introduce the business, qualify interest, and book a meeting. Keep it under 3 minutes. Be respectful.",
        },
        inputs: ["node-2"],
        outputs: ["node-4"],
      },
      {
        id: "node-4",
        type: NodeType.WAIT,
        name: "Wait 5 Minutes After Call",
        position: { x: 650, y: 150 },
        config: { minutes: 5 },
        inputs: ["node-3"],
        outputs: ["node-5"],
      },
      {
        id: "node-5",
        type: NodeType.AI_RESPOND,
        name: "Write WhatsApp Follow-Up",
        position: { x: 850, y: 150 },
        config: {
          provider: "claude",
          model: "claude-3-5-sonnet",
          systemPrompt: "Write a short WhatsApp follow-up after a cold call. Thank them for their time. Include a soft call to action. Under 4 lines.",
          userMessage: "Contact: {{contactName}}. Just completed cold call.",
        },
        inputs: ["node-4"],
        outputs: ["node-6"],
      },
      {
        id: "node-6",
        type: NodeType.SEND_WHATSAPP,
        name: "Send WhatsApp Follow-Up",
        position: { x: 1050, y: 150 },
        config: { template: "{{AI_RESPONSE}}" },
        inputs: ["node-5"],
        outputs: ["node-7"],
      },
      {
        id: "node-7",
        type: NodeType.GOOGLE_CALENDAR,
        name: "Book Meeting Slot",
        position: { x: 1250, y: 150 },
        config: { summary: "Meeting with {{contactName}}", startTime: "Tomorrow 11:00 AM" },
        inputs: ["node-6"],
        outputs: [],
      },
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
      { id: "e4", source: "node-4", target: "node-5" },
      { id: "e5", source: "node-5", target: "node-6" },
      { id: "e6", source: "node-6", target: "node-7" },
    ],
  },];

export async function createWorkflowFromTemplate(
  templateId: string,
  workspaceId: string,
  accountId: string,
  customizations?: { name?: string; description?: string }
) {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const workflow = await prisma.workflow.create({
    data: {
      accountId,
      workspaceId,
      name: customizations?.name || template.name,
      description: customizations?.description || template.description,
      definition: JSON.stringify({ nodes: template.nodes, edges: template.edges, viewport: { x: 0, y: 0, zoom: 1 } }),
      variables: JSON.stringify(template.nodes.filter(n => n.type === NodeType.ANAMIND_SET).map(n => n.config.variableKey || "")),
      stats: JSON.stringify({ runs: 0, success: 0, failed: 0 }),
      isActive: false
    }
  });

  return {
    success: true,
    workflow: {
      ...workflow,
      nodes: template.nodes,
      edges: template.edges,
      stats: { runs: 0, success: 0, failed: 0 }
    }
  };
}
