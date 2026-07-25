import { WorkflowNode, WorkflowEdge } from "./types";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export const TEMPLATES: WorkflowTemplate[] = [
  // --- Templates matching the "Industries.tsx" Showcase ---

  {
    id: "wa-lead-responder",
    name: "WhatsApp Lead Responder",
    description: "Instantly capture, qualify, and sync inbound leads to Google Sheets or CRMs.",
    industry: "REAL ESTATE & AGENCIES",
    nodes: [
      { id: "t1", type: "trigger_whatsapp", x: 50, y: 200, config: {} },
      { id: "ai-qualify", type: "logic_ai_agent", x: 300, y: 200, config: {} },
      { id: "cond", type: "logic_condition", x: 550, y: 200, config: {} },
      { id: "sync-crm", type: "action_hubspot", x: 800, y: 150, config: {} },
      { id: "sync-sheets", type: "action_http_request", x: 800, y: 250, config: {} } // representing Google Sheets
    ],
    edges: [
      { id: "e1", source: "t1", target: "ai-qualify" },
      { id: "e2", source: "ai-qualify", target: "cond" },
      { id: "e3", source: "cond", target: "sync-crm" },
      { id: "e4", source: "cond", target: "sync-sheets" }
    ]
  },
  
  {
    id: "abandoned-cart-recoverer",
    name: "Abandoned Cart Recoverer",
    description: "Send automated WhatsApp/SMS checkout reminders and recover lost sales.",
    industry: "E-COMMERCE & RETAIL",
    nodes: [
      { id: "t2", type: "trigger_webhook", x: 50, y: 200, config: {} }, // Webhook from Shopify/WooCommerce
      { id: "wait-1h", type: "logic_wait", x: 300, y: 200, config: {} },
      { id: "send-wa", type: "action_send_whatsapp", x: 550, y: 200, config: {} },
      { id: "wait-24h", type: "logic_wait", x: 800, y: 200, config: {} },
      { id: "send-email", type: "action_send_email", x: 1050, y: 200, config: {} }
    ],
    edges: [
      { id: "e5", source: "t2", target: "wait-1h" },
      { id: "e6", source: "wait-1h", target: "send-wa" },
      { id: "e7", source: "send-wa", target: "wait-24h" },
      { id: "e8", source: "wait-24h", target: "send-email" }
    ]
  },

  {
    id: "google-reviews-collector",
    name: "Google Reviews Collector",
    description: "Auto-trigger review requests post-delivery and filter out negative feedback.",
    industry: "RESTAURANTS & HOSPITALITY",
    nodes: [
      { id: "t3", type: "trigger_webhook", x: 50, y: 200, config: {} }, // Delivery confirmed
      { id: "wait", type: "logic_wait", x: 250, y: 200, config: {} }, // Wait 1 day
      { id: "ask-review", type: "action_send_whatsapp", x: 450, y: 200, config: {} },
      { id: "ai-sentiment", type: "logic_ai_agent", x: 650, y: 200, config: {} },
      { id: "cond-rating", type: "logic_condition", x: 850, y: 200, config: {} },
      { id: "send-public-link", type: "action_send_whatsapp", x: 1050, y: 150, config: {} }, // 5 stars
      { id: "internal-feedback", type: "action_http_request", x: 1050, y: 250, config: {} } // 1-3 stars, alert team
    ],
    edges: [
      { id: "e9", source: "t3", target: "wait" },
      { id: "e10", source: "wait", target: "ask-review" },
      { id: "e11", source: "ask-review", target: "ai-sentiment" },
      { id: "e12", source: "ai-sentiment", target: "cond-rating" },
      { id: "e13", source: "cond-rating", target: "send-public-link" },
      { id: "e14", source: "cond-rating", target: "internal-feedback" }
    ]
  },

  {
    id: "ai-helpdesk-bot",
    name: "AI Helpdesk Support Bot",
    description: "Resolve 90% of business FAQs 24/7 trained on your PDFs, docs & URLs.",
    industry: "AGENCIES & TECH STARTUPS",
    nodes: [
      { id: "t4", type: "trigger_email", x: 100, y: 200, config: {} },
      { id: "ai-agent", type: "logic_ai_agent", x: 400, y: 200, config: {} }, // Reads docs and answers
      { id: "cond-resolved", type: "logic_condition", x: 700, y: 200, config: {} },
      { id: "reply-customer", type: "action_send_email", x: 950, y: 150, config: {} },
      { id: "escalate-human", type: "action_http_request", x: 950, y: 250, config: {} }
    ],
    edges: [
      { id: "e15", source: "t4", target: "ai-agent" },
      { id: "e16", source: "ai-agent", target: "cond-resolved" },
      { id: "e17", source: "cond-resolved", target: "reply-customer" },
      { id: "e18", source: "cond-resolved", target: "escalate-human" }
    ]
  },

  {
    id: "wa-ordering-booking",
    name: "WhatsApp Ordering & Booking",
    description: "Let users view menus, select services, and place orders directly in chat.",
    industry: "RESTAURANTS & HOSPITALITY",
    nodes: [
      { id: "t5", type: "trigger_whatsapp", x: 100, y: 200, config: {} },
      { id: "ai-menu", type: "logic_ai_agent", x: 350, y: 200, config: {} },
      { id: "process-order", type: "action_postgres", x: 600, y: 200, config: {} },
      { id: "confirm-wa", type: "action_send_whatsapp", x: 850, y: 200, config: {} }
    ],
    edges: [
      { id: "e19", source: "t5", target: "ai-menu" },
      { id: "e20", source: "ai-menu", target: "process-order" },
      { id: "e21", source: "process-order", target: "confirm-wa" }
    ]
  },

  {
    id: "billing-stripe-sync",
    name: "Billing & Stripe Sync",
    description: "Automatically generate, send, and track PDF invoices upon payment/sale.",
    industry: "AGENCIES & TECH STARTUPS",
    nodes: [
      { id: "t6", type: "trigger_webhook", x: 100, y: 200, config: {} }, // Stripe Payment Success
      { id: "gen-pdf", type: "action_http_request", x: 350, y: 200, config: {} },
      { id: "send-invoice", type: "action_send_email", x: 600, y: 200, config: {} },
      { id: "sync-db", type: "action_postgres", x: 850, y: 200, config: {} }
    ],
    edges: [
      { id: "e22", source: "t6", target: "gen-pdf" },
      { id: "e23", source: "gen-pdf", target: "send-invoice" },
      { id: "e24", source: "send-invoice", target: "sync-db" }
    ]
  },

  // --- Templates matching the "IndustrySection.tsx" Showcase ---

  {
    id: "ecommerce-receipt-delivery",
    name: "Automated Receipt & Upsell",
    description: "Recover lost carts over WhatsApp, automate receipt delivery, and boost Google reviews post-purchase.",
    industry: "E-COMMERCE & RETAIL",
    nodes: [
      { id: "t7", type: "trigger_webhook", x: 50, y: 200, config: {} },
      { id: "send-receipt", type: "action_send_email", x: 300, y: 150, config: {} },
      { id: "wait-days", type: "logic_wait", x: 300, y: 250, config: {} },
      { id: "send-upsell", type: "action_send_whatsapp", x: 550, y: 250, config: {} }
    ],
    edges: [
      { id: "e25", source: "t7", target: "send-receipt" },
      { id: "e26", source: "t7", target: "wait-days" },
      { id: "e27", source: "wait-days", target: "send-upsell" }
    ]
  },

  {
    id: "realestate-tour-booking",
    name: "Property Tour Coordinator",
    description: "Qualify inbound property inquiries, share listing PDF brochures, and coordinate tours on your calendar.",
    industry: "REAL ESTATE & AGENCIES",
    nodes: [
      { id: "t8", type: "trigger_whatsapp", x: 100, y: 200, config: {} },
      { id: "ai-qualify-2", type: "logic_ai_agent", x: 350, y: 200, config: {} },
      { id: "book-calendar", type: "action_google_calendar", x: 600, y: 200, config: {} },
      { id: "send-brochure", type: "action_send_email", x: 850, y: 200, config: {} }
    ],
    edges: [
      { id: "e28", source: "t8", target: "ai-qualify-2" },
      { id: "e29", source: "ai-qualify-2", target: "book-calendar" },
      { id: "e30", source: "book-calendar", target: "send-brochure" }
    ]
  },

  {
    id: "health-booking-reminders",
    name: "Patient Booking Reminders",
    description: "Send automated booking reminders, followup instructions, and coordinate patient surveys securely.",
    industry: "HEALTHCARE & WELLNESS",
    nodes: [
      { id: "t9", type: "trigger_schedule", x: 100, y: 200, config: {} },
      { id: "get-appts", type: "action_postgres", x: 350, y: 200, config: {} },
      { id: "send-wa-remind", type: "action_send_whatsapp", x: 600, y: 200, config: {} },
      { id: "wait-post-appt", type: "logic_wait", x: 850, y: 200, config: {} },
      { id: "send-survey", type: "action_send_email", x: 1100, y: 200, config: {} }
    ],
    edges: [
      { id: "e31", source: "t9", target: "get-appts" },
      { id: "e32", source: "get-appts", target: "send-wa-remind" },
      { id: "e33", source: "send-wa-remind", target: "wait-post-appt" },
      { id: "e34", source: "wait-post-appt", target: "send-survey" }
    ]
  },

  {
    id: "logistics-dispatch-alerts",
    name: "Automated Dispatch Alerts",
    description: "Send automated dispatch alerts, share real-time tracking links, and trigger invoices upon delivery.",
    industry: "LOGISTICS & DISPATCH",
    nodes: [
      { id: "t10", type: "trigger_webhook", x: 100, y: 200, config: {} }, // Status updated in ERP
      { id: "cond-status", type: "logic_condition", x: 350, y: 200, config: {} },
      { id: "send-tracking", type: "action_send_whatsapp", x: 600, y: 100, config: {} }, // If Dispatched
      { id: "trigger-invoice", type: "action_http_request", x: 600, y: 300, config: {} }  // If Delivered
    ],
    edges: [
      { id: "e35", source: "t10", target: "cond-status" },
      { id: "e36", source: "cond-status", target: "send-tracking" },
      { id: "e37", source: "cond-status", target: "trigger-invoice" }
    ]
  },

  {
    id: "agency-onboarding",
    name: "Client Onboarding Checklist",
    description: "Automate onboarding checklists, generate Stripe billing invoices, and sync databases instantly.",
    industry: "AGENCIES & TECH STARTUPS",
    nodes: [
      { id: "t11", type: "trigger_webhook", x: 50, y: 200, config: {} }, // New Client Signed
      { id: "create-invoice", type: "action_http_request", x: 250, y: 200, config: {} }, // Stripe
      { id: "send-welcome", type: "action_send_email", x: 450, y: 200, config: {} },
      { id: "setup-workspace", type: "action_http_request", x: 650, y: 200, config: {} }, // Setup Folders/Slack
      { id: "notify-team", type: "action_send_whatsapp", x: 850, y: 200, config: {} }
    ],
    edges: [
      { id: "e38", source: "t11", target: "create-invoice" },
      { id: "e39", source: "create-invoice", target: "send-welcome" },
      { id: "e40", source: "send-welcome", target: "setup-workspace" },
      { id: "e41", source: "setup-workspace", target: "notify-team" }
    ]
  },

  {
    id: "restaurant-table-booking",
    name: "Automated Table Booking",
    description: "Provide interactive WhatsApp menus, automate table bookings, and dispatch live order statuses.",
    industry: "RESTAURANTS & HOSPITALITY",
    nodes: [
      { id: "t12", type: "trigger_whatsapp", x: 100, y: 200, config: {} },
      { id: "ai-check-avail", type: "logic_ai_agent", x: 350, y: 200, config: {} },
      { id: "book-table", type: "action_postgres", x: 600, y: 200, config: {} },
      { id: "confirm-booking", type: "action_send_whatsapp", x: 850, y: 200, config: {} }
    ],
    edges: [
      { id: "e42", source: "t12", target: "ai-check-avail" },
      { id: "e43", source: "ai-check-avail", target: "book-table" },
      { id: "e44", source: "book-table", target: "confirm-booking" }
    ]
  }

];
