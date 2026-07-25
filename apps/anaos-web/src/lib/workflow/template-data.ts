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

,

  // --- ORIGINAL TEMPLATES KEEPING AS REQUESTED ---

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
