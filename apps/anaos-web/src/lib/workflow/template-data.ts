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
  // 1. Marketing / Sales
  {
    id: "fb-wa-crm",
    name: "Facebook Lead to WhatsApp & CRM",
    description: "Capture new Facebook Leads via Webhook, immediately send a WhatsApp Welcome message, and save them to the CRM as a New Lead.",
    industry: "MARKETING / SALES",
    nodes: [
      { id: "trigger-1", type: "trigger_webhook", x: 100, y: 200, config: {} },
      { id: "action-1", type: "action_send_whatsapp", x: 400, y: 150, config: {} },
      { id: "action-2", type: "action_hubspot", x: 400, y: 250, config: {} }
    ],
    edges: [
      { id: "e1", source: "trigger-1", target: "action-1" },
      { id: "e2", source: "trigger-1", target: "action-2" }
    ]
  },
  // 2. Service / Salon
  {
    id: "ig-dm-booking",
    name: "Instagram DM AI Booking",
    description: "When someone DMs on Instagram, use AI to answer queries and automatically book them onto Google Calendar.",
    industry: "SERVICE / SALON",
    nodes: [
      { id: "trigger-2", type: "trigger_instagram", x: 100, y: 200, config: {} },
      { id: "logic-1", type: "logic_ai_agent", x: 400, y: 200, config: {} },
      { id: "action-3", type: "action_google_calendar", x: 700, y: 200, config: {} }
    ],
    edges: [
      { id: "e3", source: "trigger-2", target: "logic-1" },
      { id: "e4", source: "logic-1", target: "action-3" }
    ]
  },
  // 3. Consulting
  {
    id: "meeting-reminder",
    name: "Meeting Reminder Email & WA",
    description: "Trigger a workflow 24 hours before a Google Calendar event, sending an Email and WhatsApp reminder to the attendee.",
    industry: "CONSULTING",
    nodes: [
      { id: "t3", type: "trigger_schedule", x: 100, y: 200, config: {} },
      { id: "a4", type: "action_send_email", x: 400, y: 150, config: {} },
      { id: "a5", type: "action_send_whatsapp", x: 400, y: 250, config: {} }
    ],
    edges: [
      { id: "e5", source: "t3", target: "a4" },
      { id: "e6", source: "t3", target: "a5" }
    ]
  },
  // 4. E-Commerce
  {
    id: "shopify-order-alert",
    name: "Shopify Order Fulfilled Alert",
    description: "When an order is placed on Shopify, automatically send a confirmation email, and notify the warehouse team via Webhook.",
    industry: "E-COMMERCE",
    nodes: [
      { id: "t4", type: "trigger_webhook", x: 100, y: 200, config: {} },
      { id: "a6", type: "action_send_email", x: 400, y: 150, config: {} },
      { id: "a7", type: "action_http_request", x: 400, y: 250, config: {} }
    ],
    edges: [
      { id: "e7", source: "t4", target: "a6" },
      { id: "e8", source: "t4", target: "a7" }
    ]
  },
  // 5. General Business
  {
    id: "form-to-db",
    name: "Form Submit to Database & Reply",
    description: "Capture website form submissions, save them directly to external Database/Sheets via HTTP Request, and send a Thank You email.",
    industry: "GENERAL BUSINESS",
    nodes: [
      { id: "t5", type: "trigger_webhook", x: 100, y: 200, config: {} },
      { id: "a8", type: "action_http_request", x: 400, y: 150, config: {} },
      { id: "a9", type: "action_send_email", x: 400, y: 250, config: {} }
    ],
    edges: [
      { id: "e9", source: "t5", target: "a8" },
      { id: "e10", source: "t5", target: "a9" }
    ]
  },
  // 6. SaaS / Software
  {
    id: "user-onboarding-drip",
    name: "User Onboarding Drip Campaign",
    description: "When a new user signs up (Webhook), wait 1 day, send a tutorial email. Wait 3 days, check if active, and send follow-up.",
    industry: "SAAS / SOFTWARE",
    nodes: [
      { id: "t6", type: "trigger_webhook", x: 50, y: 200, config: {} },
      { id: "logic-wait-1", type: "logic_wait", x: 250, y: 200, config: {} },
      { id: "email-1", type: "action_send_email", x: 450, y: 200, config: {} },
      { id: "logic-wait-2", type: "logic_wait", x: 650, y: 200, config: {} },
      { id: "email-2", type: "action_send_email", x: 850, y: 200, config: {} }
    ],
    edges: [
      { id: "e11", source: "t6", target: "logic-wait-1" },
      { id: "e12", source: "logic-wait-1", target: "email-1" },
      { id: "e13", source: "email-1", target: "logic-wait-2" },
      { id: "e14", source: "logic-wait-2", target: "email-2" }
    ]
  },
  // 7. Customer Support
  {
    id: "support-ticket-routing",
    name: "AI Support Ticket Routing",
    description: "Receive customer email, use AI to classify intent (Refund, Bug, Inquiry), and route to the correct department via Slack/Webhook.",
    industry: "CUSTOMER SUPPORT",
    nodes: [
      { id: "t7", type: "trigger_webhook", x: 50, y: 200, config: {} },
      { id: "ai-classifier", type: "logic_ai_agent", x: 300, y: 200, config: {} },
      { id: "condition-route", type: "logic_condition", x: 550, y: 200, config: {} },
      { id: "notify-support", type: "action_http_request", x: 800, y: 100, config: {} },
      { id: "notify-sales", type: "action_http_request", x: 800, y: 300, config: {} }
    ],
    edges: [
      { id: "e15", source: "t7", target: "ai-classifier" },
      { id: "e16", source: "ai-classifier", target: "condition-route" },
      { id: "e17", source: "condition-route", target: "notify-support" },
      { id: "e18", source: "condition-route", target: "notify-sales" }
    ]
  },
  // 8. Real Estate
  {
    id: "real-estate-inquiry",
    name: "Property Inquiry Auto-Responder",
    description: "When a lead asks about a property via WhatsApp, fetch details from the database and reply instantly with a brochure link.",
    industry: "REAL ESTATE",
    nodes: [
      { id: "t8", type: "trigger_whatsapp", x: 100, y: 200, config: {} },
      { id: "db-fetch", type: "action_postgres", x: 400, y: 200, config: {} },
      { id: "wa-reply", type: "action_send_whatsapp", x: 700, y: 200, config: {} }
    ],
    edges: [
      { id: "e19", source: "t8", target: "db-fetch" },
      { id: "e20", source: "db-fetch", target: "wa-reply" }
    ]
  },
  // 9. Finance / Accounting
  {
    id: "invoice-reminder",
    name: "Automated Invoice Reminders",
    description: "Check pending invoices daily. If overdue, send an email to the client and notify the accountant via Slack/Webhook.",
    industry: "FINANCE",
    nodes: [
      { id: "t9", type: "trigger_schedule", x: 100, y: 200, config: {} },
      { id: "db-check", type: "action_postgres", x: 350, y: 200, config: {} },
      { id: "client-email", type: "action_send_email", x: 650, y: 150, config: {} },
      { id: "team-notify", type: "action_http_request", x: 650, y: 250, config: {} }
    ],
    edges: [
      { id: "e21", source: "t9", target: "db-check" },
      { id: "e22", source: "db-check", target: "client-email" },
      { id: "e23", source: "db-check", target: "team-notify" }
    ]
  },
  // 10. Education
  {
    id: "course-enrollment",
    name: "New Student Enrollment Flow",
    description: "When a student enrolls via Stripe/Webhook, generate a certificate PDF (HTTP), and send a Welcome WhatsApp message.",
    industry: "EDUCATION",
    nodes: [
      { id: "t10", type: "trigger_webhook", x: 100, y: 200, config: {} },
      { id: "gen-pdf", type: "action_http_request", x: 400, y: 200, config: {} },
      { id: "wa-welcome", type: "action_send_whatsapp", x: 700, y: 200, config: {} }
    ],
    edges: [
      { id: "e24", source: "t10", target: "gen-pdf" },
      { id: "e25", source: "gen-pdf", target: "wa-welcome" }
    ]
  },
  // 11. HR / Recruitment
  {
    id: "candidate-screening",
    name: "AI Candidate Resume Screener",
    description: "Receive resumes via Email, extract text, use AI to score them against job requirements, and move them in the CRM.",
    industry: "HR & RECRUITMENT",
    nodes: [
      { id: "t11", type: "trigger_webhook", x: 100, y: 200, config: {} },
      { id: "ai-screener", type: "logic_ai_agent", x: 400, y: 200, config: {} },
      { id: "crm-update", type: "action_hubspot", x: 700, y: 200, config: {} }
    ],
    edges: [
      { id: "e26", source: "t11", target: "ai-screener" },
      { id: "e27", source: "ai-screener", target: "crm-update" }
    ]
  },
  // 12. Events / Webinars
  {
    id: "webinar-followup",
    name: "Webinar Post-Event Follow-up",
    description: "After a webinar ends, wait 2 hours, filter attendees who stayed > 30 mins, and send them a special offer email.",
    industry: "EVENTS",
    nodes: [
      { id: "t12", type: "trigger_schedule", x: 50, y: 200, config: {} },
      { id: "wait-2h", type: "logic_wait", x: 250, y: 200, config: {} },
      { id: "get-attendees", type: "action_http_request", x: 450, y: 200, config: {} },
      { id: "filter-active", type: "logic_condition", x: 650, y: 200, config: {} },
      { id: "send-offer", type: "action_send_email", x: 850, y: 200, config: {} }
    ],
    edges: [
      { id: "e28", source: "t12", target: "wait-2h" },
      { id: "e29", source: "wait-2h", target: "get-attendees" },
      { id: "e30", source: "get-attendees", target: "filter-active" },
      { id: "e31", source: "filter-active", target: "send-offer" }
    ]
  },
  // 13. Health & Wellness
  {
    id: "appointment-confirmation",
    name: "Clinic Appointment Confirmation",
    description: "Send an automated WhatsApp message to confirm an appointment. If user replies 'Cancel', update Google Calendar.",
    industry: "HEALTHCARE",
    nodes: [
      { id: "t13", type: "trigger_schedule", x: 100, y: 200, config: {} },
      { id: "wa-ask", type: "action_send_whatsapp", x: 350, y: 200, config: {} },
      { id: "wait-reply", type: "logic_wait", x: 600, y: 200, config: {} },
      { id: "cal-update", type: "action_google_calendar", x: 850, y: 200, config: {} }
    ],
    edges: [
      { id: "e32", source: "t13", target: "wa-ask" },
      { id: "e33", source: "wa-ask", target: "wait-reply" },
      { id: "e34", source: "wait-reply", target: "cal-update" }
    ]
  },
  // 14. Personal Productivity
  {
    id: "daily-digest",
    name: "AI Daily Briefing & Tasks",
    description: "Every morning at 8 AM, fetch calendar events, summarize emails via AI, and send a daily digest to WhatsApp.",
    industry: "PRODUCTIVITY",
    nodes: [
      { id: "t14", type: "trigger_schedule", x: 100, y: 200, config: {} },
      { id: "get-cal", type: "action_google_calendar", x: 350, y: 150, config: {} },
      { id: "ai-summarize", type: "logic_ai_agent", x: 600, y: 200, config: {} },
      { id: "wa-digest", type: "action_send_whatsapp", x: 850, y: 200, config: {} }
    ],
    edges: [
      { id: "e35", source: "t14", target: "get-cal" },
      { id: "e36", source: "get-cal", target: "ai-summarize" },
      { id: "e37", source: "ai-summarize", target: "wa-digest" }
    ]
  },
  // 15. E-Commerce (Abandoned Cart)
  {
    id: "abandoned-cart-recovery",
    name: "Abandoned Cart Recovery Sequence",
    description: "When a cart is abandoned, wait 1 hour, send a reminder email. Wait 1 day, send a WhatsApp message with a 10% discount.",
    industry: "E-COMMERCE",
    nodes: [
      { id: "t15", type: "trigger_webhook", x: 50, y: 200, config: {} },
      { id: "wait-1h", type: "logic_wait", x: 250, y: 200, config: {} },
      { id: "email-remind", type: "action_send_email", x: 450, y: 200, config: {} },
      { id: "wait-1d", type: "logic_wait", x: 650, y: 200, config: {} },
      { id: "wa-discount", type: "action_send_whatsapp", x: 850, y: 200, config: {} }
    ],
    edges: [
      { id: "e38", source: "t15", target: "wait-1h" },
      { id: "e39", source: "wait-1h", target: "email-remind" },
      { id: "e40", source: "email-remind", target: "wait-1d" },
      { id: "e41", source: "wait-1d", target: "wa-discount" }
    ]
  }
];
