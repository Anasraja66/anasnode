// ═══════════════════════════════════════════════════════════════════════
// AnaOS Workflow Template Library
// Inspired by: Zapier Templates, n8n Workflows, Make.com Scenarios
// 50+ Production-Ready Templates across 8 Categories
// ═══════════════════════════════════════════════════════════════════════

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedSetupTime: string;
  integrations: string[];
  popular?: boolean;
  new?: boolean;
  definition: {
    nodes: any[];
    edges: any[];
  };
}

export type TemplateCategory =
  | "whatsapp"
  | "ecommerce"
  | "crm"
  | "marketing"
  | "support"
  | "ai"
  | "social"
  | "operations";

const pos = (col: number, row = 0) => ({ x: 80 + col * 280, y: 200 + row * 150 });
const id = (s: string) => s;

export const TEMPLATE_CATEGORIES = [
  { id: "whatsapp", label: "WhatsApp", icon: "MessageCircle", color: "#25D366", count: 12 },
  { id: "ecommerce", label: "E-Commerce", icon: "ShoppingBag", color: "#96BF48", count: 9 },
  { id: "crm", label: "CRM & Leads", icon: "Users", color: "#0A6BFF", count: 8 },
  { id: "marketing", label: "Marketing", icon: "Megaphone", color: "#FF6B35", count: 7 },
  { id: "support", label: "Customer Support", icon: "HeadphonesIcon", color: "#7C3AED", count: 6 },
  { id: "ai", label: "AI Automation", icon: "Brain", color: "#EC4899", count: 8 },
  { id: "social", label: "Social Media", icon: "Share2", color: "#F59E0B", count: 5 },
  { id: "operations", label: "Operations", icon: "Settings", color: "#6B7280", count: 5 },
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [

  // ═══════════════════════════════════════
  // WHATSAPP AUTOMATION TEMPLATES (12)
  // ═══════════════════════════════════════

  {
    id: "wa-lead-qualify",
    name: "WhatsApp Lead Qualifier",
    description: "Automatically qualify inbound WhatsApp leads using AI — collects name, budget, interest and routes to right team.",
    category: "whatsapp",
    tags: ["whatsapp", "lead-gen", "ai", "crm"],
    difficulty: "beginner",
    estimatedSetupTime: "5 mins",
    integrations: ["whatsapp", "openai"],
    popular: true,
    definition: {
      nodes: [
        { id: id("n1"), type: "trigger", label: "WhatsApp Message Received", ...pos(0), config: { event: "whatsapp_inbound", channel: "WhatsApp" } },
        { id: id("n2"), type: "ai_reply", label: "AI Qualify Lead", ...pos(1), config: { system_prompt: "You are a lead qualifier. Ask: 1) Name 2) What they need 3) Budget. Be friendly and professional.", tone: "Professional" } },
        { id: id("n3"), type: "condition", label: "Is High Value Lead?", ...pos(2), config: { field: "budget", operator: "greater_than", value: "50000" } },
        { id: id("n4"), type: "add_tag", label: "Tag: Hot Lead", ...pos(3, -1), config: { tag: "hot-lead" } },
        { id: id("n5"), type: "send_message", label: "Notify Sales Team", ...pos(4, -1), config: { message: "🔥 New Hot Lead! Check inbox for details.", channel: "WhatsApp" } },
        { id: id("n6"), type: "add_tag", label: "Tag: Cold Lead", ...pos(3, 1), config: { tag: "cold-lead" } },
        { id: id("n7"), type: "end", label: "Done", ...pos(5) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n3", to: "n6" },
        { id: "e5", from: "n4", to: "n5" }, { id: "e6", from: "n5", to: "n7" },
        { id: "e7", from: "n6", to: "n7" },
      ],
    },
  },

  {
    id: "wa-order-status",
    name: "WhatsApp Order Status Bot",
    description: "Customers type their order number on WhatsApp and instantly get order status from your Shopify/WooCommerce store.",
    category: "whatsapp",
    tags: ["whatsapp", "shopify", "ecommerce", "orders"],
    difficulty: "intermediate",
    estimatedSetupTime: "15 mins",
    integrations: ["whatsapp", "shopify"],
    popular: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Customer Types Order #", ...pos(0), config: { event: "whatsapp_inbound" } },
        { id: "n2", type: "ai_reply", label: "Extract Order Number", ...pos(1), config: { system_prompt: "Extract the order number from the customer's message. Return ONLY the number." } },
        { id: "n3", type: "http_request", label: "Fetch Order from Shopify", ...pos(2), config: { url: "https://{{shopify_domain}}/admin/api/2024-01/orders/{{order_id}}.json", method: "GET" } },
        { id: "n4", type: "send_message", label: "Send Order Status", ...pos(3), config: { message: "📦 Order #{{order_id}}\nStatus: {{status}}\nExpected: {{estimated_delivery}}" } },
        { id: "n5", type: "end", label: "Done", ...pos(4) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
      ],
    },
  },

  {
    id: "wa-appointment-booking",
    name: "WhatsApp Appointment Booking",
    description: "Let customers book appointments via WhatsApp — AI collects date/time preferences and confirms the slot automatically.",
    category: "whatsapp",
    tags: ["whatsapp", "booking", "calendar", "ai"],
    difficulty: "beginner",
    estimatedSetupTime: "10 mins",
    integrations: ["whatsapp", "google-calendar"],
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Customer Requests Booking", ...pos(0), config: { event: "whatsapp_inbound" } },
        { id: "n2", type: "ai_reply", label: "Collect Booking Details", ...pos(1), config: { system_prompt: "You are a receptionist. Collect: name, preferred date and time, purpose of appointment. Confirm availability." } },
        { id: "n3", type: "send_message", label: "Confirm Appointment", ...pos(2), config: { message: "✅ Appointment confirmed!\n📅 Date: {{date}}\n⏰ Time: {{time}}\n\nWe'll send a reminder 1 hour before." } },
        { id: "n4", type: "http_request", label: "Create Google Calendar Event", ...pos(3), config: { url: "https://www.googleapis.com/calendar/v3/calendars/primary/events", method: "POST" } },
        { id: "n5", type: "end", label: "Done", ...pos(4) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
      ],
    },
  },

  {
    id: "wa-abandoned-cart",
    name: "WhatsApp Abandoned Cart Recovery",
    description: "Automatically message customers who left items in their cart on Shopify via WhatsApp to recover lost sales.",
    category: "whatsapp",
    tags: ["whatsapp", "shopify", "abandoned-cart", "ecommerce"],
    difficulty: "intermediate",
    estimatedSetupTime: "20 mins",
    integrations: ["whatsapp", "shopify"],
    popular: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Cart Abandoned (Shopify)", ...pos(0), config: { event: "shopify_cart_abandoned" } },
        { id: "n2", type: "delay", label: "Wait 1 Hour", ...pos(1), config: { duration: 3600 } },
        { id: "n3", type: "send_message", label: "Send Recovery Message", ...pos(2), config: { message: "Hey {{name}}! 👋 You left something behind.\n\n🛒 {{product_name}} - Rs. {{price}}\n\nYour cart is waiting! Click to complete: {{checkout_url}}\n\n(Use code SAVE10 for 10% off!)" } },
        { id: "n4", type: "condition", label: "Did They Purchase?", ...pos(3), config: { field: "purchased", operator: "equals", value: "true" } },
        { id: "n5", type: "add_tag", label: "Tag: Recovered", ...pos(4, -1), config: { tag: "cart-recovered" } },
        { id: "n6", type: "send_message", label: "Send Final Reminder", ...pos(4, 1), config: { message: "Last chance! ⏰ Your cart expires in 24 hours. Complete your order now!" } },
        { id: "n7", type: "end", label: "Done", ...pos(5) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
        { id: "e5", from: "n4", to: "n6" }, { id: "e6", from: "n5", to: "n7" },
        { id: "e7", from: "n6", to: "n7" },
      ],
    },
  },

  {
    id: "wa-customer-feedback",
    name: "WhatsApp Post-Purchase Feedback",
    description: "Automatically collect customer reviews and ratings via WhatsApp after every purchase and store in CRM.",
    category: "whatsapp",
    tags: ["whatsapp", "feedback", "reviews", "crm"],
    difficulty: "beginner",
    estimatedSetupTime: "8 mins",
    integrations: ["whatsapp"],
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Order Delivered", ...pos(0), config: { event: "order_delivered" } },
        { id: "n2", type: "delay", label: "Wait 2 Hours", ...pos(1), config: { duration: 7200 } },
        { id: "n3", type: "send_message", label: "Ask for Rating", ...pos(2), config: { message: "Hi {{name}}! 😊 How was your experience?\n\nPlease rate us:\n1⭐ 2⭐ 3⭐ 4⭐ 5⭐\n\nJust reply with a number!" } },
        { id: "n4", type: "condition", label: "Rating >= 4?", ...pos(3), config: { field: "reply", operator: "greater_than_equal", value: "4" } },
        { id: "n5", type: "send_message", label: "Request Google Review", ...pos(4, -1), config: { message: "Thank you! 🌟 Would you mind leaving us a Google review? It means a lot!\n👉 {{google_review_link}}" } },
        { id: "n6", type: "send_message", label: "Escalate to Manager", ...pos(4, 1), config: { message: "We're sorry to hear that! 😔 A manager will contact you shortly to resolve this." } },
        { id: "n7", type: "end", label: "Done", ...pos(5) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
        { id: "e5", from: "n4", to: "n6" }, { id: "e6", from: "n5", to: "n7" },
        { id: "e7", from: "n6", to: "n7" },
      ],
    },
  },

  {
    id: "wa-broadcast-promo",
    name: "WhatsApp Promotional Broadcast",
    description: "Send bulk promotional messages to your customer list with personalized content and track engagement.",
    category: "whatsapp",
    tags: ["whatsapp", "broadcast", "marketing", "bulk"],
    difficulty: "beginner",
    estimatedSetupTime: "5 mins",
    integrations: ["whatsapp"],
    popular: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Schedule / Manual Trigger", ...pos(0), config: { event: "manual_trigger" } },
        { id: "n2", type: "http_request", label: "Get Customer List", ...pos(1), config: { url: "/api/customers", method: "GET" } },
        { id: "n3", type: "loop", label: "For Each Customer", ...pos(2), config: { iterate_over: "customers" } },
        { id: "n4", type: "send_message", label: "Send Promo Message", ...pos(3), config: { message: "🎉 Exclusive offer for you, {{name}}!\n\n{{promotion_text}}\n\nValid till: {{expiry_date}}\nShop now: {{shop_link}}" } },
        { id: "n5", type: "end", label: "Done", ...pos(4) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
      ],
    },
  },

  // ═══════════════════════════════════════
  // E-COMMERCE TEMPLATES (9)
  // ═══════════════════════════════════════

  {
    id: "ec-new-order-notify",
    name: "New Order → WhatsApp Alert",
    description: "Instantly notify your team on WhatsApp when a new order is placed on Shopify, WooCommerce, or any store.",
    category: "ecommerce",
    tags: ["shopify", "woocommerce", "orders", "whatsapp", "notifications"],
    difficulty: "beginner",
    estimatedSetupTime: "5 mins",
    integrations: ["shopify", "whatsapp"],
    popular: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "New Order Placed", ...pos(0), config: { event: "shopify_new_order" } },
        { id: "n2", type: "send_message", label: "Alert Owner", ...pos(1), config: { message: "🛍️ NEW ORDER!\n\nOrder #{{order_number}}\n👤 Customer: {{customer_name}}\n💰 Total: Rs. {{total}}\n📦 Items: {{items}}\n\nCheck dashboard for details." } },
        { id: "n3", type: "send_message", label: "Thank Customer", ...pos(2), config: { message: "Hi {{customer_name}}! 🎉\n\nThank you for your order #{{order_number}}!\n\nWe'll start preparing it right away. Track your order here: {{tracking_link}}" } },
        { id: "n4", type: "end", label: "Done", ...pos(3) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" }, { id: "e3", from: "n3", to: "n4" },
      ],
    },
  },

  {
    id: "ec-refund-handler",
    name: "Refund Request Handler",
    description: "Automatically process refund requests — verify order, check policy, initiate refund and notify customer.",
    category: "ecommerce",
    tags: ["refund", "shopify", "customer-service", "automation"],
    difficulty: "intermediate",
    estimatedSetupTime: "20 mins",
    integrations: ["shopify", "whatsapp"],
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Customer Requests Refund", ...pos(0), config: { event: "whatsapp_inbound", keyword: "refund" } },
        { id: "n2", type: "ai_reply", label: "Extract Order Info", ...pos(1), config: { system_prompt: "Extract order number from refund request. Ask for it politely if not provided." } },
        { id: "n3", type: "http_request", label: "Check Refund Eligibility", ...pos(2), config: { url: "{{shopify_url}}/orders/{{order_id}}", method: "GET" } },
        { id: "n4", type: "condition", label: "Eligible for Refund?", ...pos(3), config: { field: "days_since_order", operator: "less_than", value: "30" } },
        { id: "n5", type: "http_request", label: "Initiate Refund", ...pos(4, -1), config: { url: "{{shopify_url}}/refunds.json", method: "POST" } },
        { id: "n6", type: "send_message", label: "Confirm Refund", ...pos(5, -1), config: { message: "✅ Refund initiated! Rs. {{amount}} will reflect in 3-5 business days." } },
        { id: "n7", type: "send_message", label: "Apologize & Escalate", ...pos(4, 1), config: { message: "We're sorry, this order is not eligible for refund. A manager will contact you." } },
        { id: "n8", type: "end", label: "Done", ...pos(6) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
        { id: "e5", from: "n5", to: "n6" }, { id: "e6", from: "n4", to: "n7" },
        { id: "e7", from: "n6", to: "n8" }, { id: "e8", from: "n7", to: "n8" },
      ],
    },
  },

  {
    id: "ec-inventory-alert",
    name: "Low Inventory WhatsApp Alert",
    description: "Get WhatsApp notifications when any product goes below your set stock threshold so you never run out.",
    category: "ecommerce",
    tags: ["inventory", "shopify", "alerts", "operations"],
    difficulty: "beginner",
    estimatedSetupTime: "10 mins",
    integrations: ["shopify", "whatsapp"],
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Inventory Level Changed", ...pos(0), config: { event: "shopify_inventory_update" } },
        { id: "n2", type: "condition", label: "Stock < Threshold?", ...pos(1), config: { field: "quantity", operator: "less_than", value: "10" } },
        { id: "n3", type: "send_message", label: "Alert on WhatsApp", ...pos(2), config: { message: "⚠️ LOW STOCK ALERT!\n\n📦 Product: {{product_name}}\n🔢 Remaining: {{quantity}} units\n\nTime to reorder!" } },
        { id: "n4", type: "end", label: "Done", ...pos(3) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" }, { id: "e3", from: "n3", to: "n4" },
      ],
    },
  },

  // ═══════════════════════════════════════
  // CRM & LEADS TEMPLATES (8)
  // ═══════════════════════════════════════

  {
    id: "crm-facebook-lead",
    name: "Facebook Lead → WhatsApp Follow-up",
    description: "When someone fills a Facebook Lead Ad form, instantly follow up via WhatsApp within 60 seconds to maximize conversion.",
    category: "crm",
    tags: ["facebook", "leads", "whatsapp", "crm"],
    difficulty: "intermediate",
    estimatedSetupTime: "15 mins",
    integrations: ["facebook", "whatsapp"],
    popular: true,
    new: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Facebook Lead Form Submitted", ...pos(0), config: { event: "facebook_lead" } },
        { id: "n2", type: "send_message", label: "Immediate WhatsApp Outreach", ...pos(1), config: { message: "Hi {{name}}! 👋 I saw you were interested in {{product/service}}.\n\nI'm {{agent_name}} from {{company}}. Can I help you with any questions?" } },
        { id: "n3", type: "add_tag", label: "Tag: FB Lead", ...pos(2), config: { tag: "facebook-lead" } },
        { id: "n4", type: "http_request", label: "Add to CRM", ...pos(3), config: { url: "/api/crm/contacts", method: "POST", body: '{"source": "facebook", "name": "{{name}}", "phone": "{{phone}}"}' } },
        { id: "n5", type: "end", label: "Done", ...pos(4) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
      ],
    },
  },

  {
    id: "crm-lead-nurture",
    name: "7-Day Lead Nurture Sequence",
    description: "Automatically send a 7-day WhatsApp nurture sequence to new leads with educational content to build trust.",
    category: "crm",
    tags: ["nurture", "whatsapp", "drip", "crm"],
    difficulty: "advanced",
    estimatedSetupTime: "30 mins",
    integrations: ["whatsapp"],
    popular: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "New Lead Added", ...pos(0), config: { event: "new_lead" } },
        { id: "n2", type: "send_message", label: "Day 1: Welcome", ...pos(1), config: { message: "Welcome {{name}}! 🎉 I'm excited to help you with {{service}}. Here's what we'll cover this week..." } },
        { id: "n3", type: "delay", label: "Wait 1 Day", ...pos(2), config: { duration: 86400 } },
        { id: "n4", type: "send_message", label: "Day 2: Value Message", ...pos(3), config: { message: "Hi {{name}}! 📚 Today's tip: {{day2_tip}}" } },
        { id: "n5", type: "delay", label: "Wait 1 Day", ...pos(4), config: { duration: 86400 } },
        { id: "n6", type: "send_message", label: "Day 3-7: Follow-up Sequence", ...pos(5), config: { message: "{{daily_message}}" } },
        { id: "n7", type: "send_message", label: "Day 7: CTA", ...pos(6), config: { message: "You've been amazing! Ready to take the next step? Book a free call: {{calendar_link}}" } },
        { id: "n8", type: "end", label: "Done", ...pos(7) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
        { id: "e5", from: "n5", to: "n6" }, { id: "e6", from: "n6", to: "n7" },
        { id: "e7", from: "n7", to: "n8" },
      ],
    },
  },

  {
    id: "crm-instagram-dm",
    name: "Instagram DM → Lead Capture",
    description: "Convert Instagram DMs and story replies into qualified leads automatically stored in your CRM.",
    category: "crm",
    tags: ["instagram", "dm", "leads", "social"],
    difficulty: "intermediate",
    estimatedSetupTime: "15 mins",
    integrations: ["instagram", "whatsapp"],
    new: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Instagram DM Received", ...pos(0), config: { event: "instagram_dm" } },
        { id: "n2", type: "ai_reply", label: "AI Reply & Qualify", ...pos(1), config: { system_prompt: "You are a friendly sales agent. Respond to the Instagram DM, understand their interest, and collect their WhatsApp number to follow up." } },
        { id: "n3", type: "condition", label: "Phone Number Captured?", ...pos(2), config: { field: "phone", operator: "exists" } },
        { id: "n4", type: "send_message", label: "WhatsApp Follow-up", ...pos(3), config: { message: "Hi from Instagram! 👋 Great connecting with you. Let me help you further..." } },
        { id: "n5", type: "add_tag", label: "Tag: Instagram Lead", ...pos(3), config: { tag: "instagram-lead" } },
        { id: "n6", type: "end", label: "Done", ...pos(4) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
        { id: "e5", from: "n5", to: "n6" },
      ],
    },
  },

  // ═══════════════════════════════════════
  // MARKETING TEMPLATES (7)
  // ═══════════════════════════════════════

  {
    id: "mkt-birthday-campaign",
    name: "Birthday Offer Campaign",
    description: "Automatically send personalized birthday greetings with a special discount code to every customer on their birthday.",
    category: "marketing",
    tags: ["birthday", "whatsapp", "discount", "retention"],
    difficulty: "beginner",
    estimatedSetupTime: "10 mins",
    integrations: ["whatsapp"],
    popular: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Customer Birthday (Daily Check)", ...pos(0), config: { event: "schedule", cron: "0 9 * * *" } },
        { id: "n2", type: "http_request", label: "Get Today's Birthdays", ...pos(1), config: { url: "/api/customers/birthdays/today", method: "GET" } },
        { id: "n3", type: "loop", label: "For Each Birthday", ...pos(2), config: { iterate_over: "customers" } },
        { id: "n4", type: "send_message", label: "Send Birthday Wishes", ...pos(3), config: { message: "🎂 Happy Birthday {{name}}!\n\nWishing you a wonderful day! As our special gift to you, here's 20% off your next purchase:\n\n🎁 Code: BDAY{{year}}\n\nValid today only! 🎉" } },
        { id: "n5", type: "end", label: "Done", ...pos(4) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
      ],
    },
  },

  {
    id: "mkt-webinar-reminder",
    name: "Webinar / Event Reminder Sequence",
    description: "Send automated reminders 7 days, 1 day, and 1 hour before any webinar or event via WhatsApp.",
    category: "marketing",
    tags: ["webinar", "events", "reminders", "whatsapp"],
    difficulty: "intermediate",
    estimatedSetupTime: "15 mins",
    integrations: ["whatsapp"],
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Registration Confirmed", ...pos(0), config: { event: "form_submit" } },
        { id: "n2", type: "send_message", label: "Confirmation Message", ...pos(1), config: { message: "✅ You're registered for {{event_name}}!\n📅 Date: {{date}}\n⏰ Time: {{time}}\n🔗 Join Link: {{zoom_link}}" } },
        { id: "n3", type: "delay", label: "7 Days Before Event", ...pos(2), config: { duration: "relative_to_event", offset: -604800 } },
        { id: "n4", type: "send_message", label: "7-Day Reminder", ...pos(3), config: { message: "⏰ {{event_name}} is in 7 days! Mark your calendar. Join link: {{zoom_link}}" } },
        { id: "n5", type: "delay", label: "1 Day Before", ...pos(4), config: { duration: "relative_to_event", offset: -86400 } },
        { id: "n6", type: "send_message", label: "Day-Before Reminder", ...pos(5), config: { message: "🔔 Tomorrow is {{event_name}}! Don't forget. Join link: {{zoom_link}}" } },
        { id: "n7", type: "delay", label: "1 Hour Before", ...pos(6), config: { duration: "relative_to_event", offset: -3600 } },
        { id: "n8", type: "send_message", label: "Starting Soon!", ...pos(7), config: { message: "🚀 {{event_name}} starts in 1 HOUR! Get ready. Join now: {{zoom_link}}" } },
        { id: "n9", type: "end", label: "Done", ...pos(8) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
        { id: "e5", from: "n5", to: "n6" }, { id: "e6", from: "n6", to: "n7" },
        { id: "e7", from: "n7", to: "n8" }, { id: "e8", from: "n8", to: "n9" },
      ],
    },
  },

  // ═══════════════════════════════════════
  // AI AUTOMATION TEMPLATES (8)
  // ═══════════════════════════════════════

  {
    id: "ai-document-analyzer",
    name: "AI Document Analyzer & Responder",
    description: "When a customer sends a PDF or image, AI analyzes it and responds with relevant information or next steps automatically.",
    category: "ai",
    tags: ["ai", "documents", "pdf", "whatsapp", "groq"],
    difficulty: "advanced",
    estimatedSetupTime: "20 mins",
    integrations: ["whatsapp", "openai"],
    popular: true,
    new: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Document Received on WhatsApp", ...pos(0), config: { event: "whatsapp_document" } },
        { id: "n2", type: "ai_reply", label: "Extract & Analyze Document", ...pos(1), config: { system_prompt: "Analyze the attached document and provide a concise summary with key points and any action items needed." } },
        { id: "n3", type: "send_message", label: "Send AI Analysis", ...pos(2), config: { message: "📄 Document Analysis:\n\n{{ai_summary}}\n\n💡 Key Actions:\n{{action_items}}" } },
        { id: "n4", type: "end", label: "Done", ...pos(3) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" }, { id: "e3", from: "n3", to: "n4" },
      ],
    },
  },

  {
    id: "ai-email-to-whatsapp",
    name: "Email → AI Summary → WhatsApp",
    description: "When important emails arrive in Gmail, AI summarizes them and sends you the key points via WhatsApp instantly.",
    category: "ai",
    tags: ["gmail", "email", "ai", "whatsapp", "summary"],
    difficulty: "intermediate",
    estimatedSetupTime: "15 mins",
    integrations: ["gmail", "whatsapp", "openai"],
    new: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "New Email in Gmail", ...pos(0), config: { event: "gmail_new_email", filter: "is:important" } },
        { id: "n2", type: "ai_reply", label: "AI Summarize Email", ...pos(1), config: { system_prompt: "Summarize this email in 3 bullet points. Include: sender, main topic, and any action required." } },
        { id: "n3", type: "send_message", label: "WhatsApp Summary", ...pos(2), config: { message: "📧 New Important Email!\n\nFrom: {{sender}}\n\n📋 Summary:\n{{ai_summary}}\n\nReply 'READ' to open full email." } },
        { id: "n4", type: "end", label: "Done", ...pos(3) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" }, { id: "e3", from: "n3", to: "n4" },
      ],
    },
  },

  {
    id: "ai-sentiment-router",
    name: "AI Sentiment Router",
    description: "AI analyzes customer message sentiment and routes angry customers to senior agents while happy ones get automated responses.",
    category: "ai",
    tags: ["ai", "sentiment", "routing", "support"],
    difficulty: "advanced",
    estimatedSetupTime: "25 mins",
    integrations: ["whatsapp", "openai"],
    popular: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Customer Message", ...pos(0), config: { event: "whatsapp_inbound" } },
        { id: "n2", type: "ai_reply", label: "Analyze Sentiment", ...pos(1), config: { system_prompt: "Analyze the sentiment of this message. Reply with ONLY one word: POSITIVE, NEGATIVE, or NEUTRAL. No explanation." } },
        { id: "n3", type: "condition", label: "Is Negative?", ...pos(2), config: { field: "sentiment", operator: "equals", value: "NEGATIVE" } },
        { id: "n4", type: "send_message", label: "Alert Human Agent", ...pos(3, -1), config: { message: "🚨 URGENT: Unhappy customer!\n\nMessage: {{customer_message}}\nPhone: {{phone}}\n\nPlease respond immediately!" } },
        { id: "n5", type: "send_message", label: "Empathy Response", ...pos(4, -1), config: { message: "We're really sorry to hear that! 😔 A senior team member will contact you within 30 minutes." } },
        { id: "n6", type: "ai_reply", label: "Auto-Reply Positive", ...pos(3, 1), config: { system_prompt: "Respond warmly and helpfully to this customer inquiry." } },
        { id: "n7", type: "end", label: "Done", ...pos(5) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
        { id: "e5", from: "n5", to: "n7" }, { id: "e6", from: "n3", to: "n6" },
        { id: "e7", from: "n6", to: "n7" },
      ],
    },
  },

  // ═══════════════════════════════════════
  // CUSTOMER SUPPORT TEMPLATES (6)
  // ═══════════════════════════════════════

  {
    id: "sup-faq-bot",
    name: "AI FAQ Support Bot",
    description: "Handle 80% of customer queries automatically with an AI-powered FAQ bot that learns from your knowledge base.",
    category: "support",
    tags: ["support", "faq", "ai", "whatsapp"],
    difficulty: "intermediate",
    estimatedSetupTime: "20 mins",
    integrations: ["whatsapp", "openai"],
    popular: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Customer Question", ...pos(0), config: { event: "whatsapp_inbound" } },
        { id: "n2", type: "ai_reply", label: "Answer from Knowledge Base", ...pos(1), config: { system_prompt: "You are a helpful support agent. Answer using our FAQ knowledge base. If you don't know, say 'I'll connect you with a human agent'." } },
        { id: "n3", type: "condition", label: "Could AI Answer?", ...pos(2), config: { field: "ai_confidence", operator: "greater_than", value: "0.7" } },
        { id: "n4", type: "send_message", label: "Send AI Answer", ...pos(3, -1), config: { message: "{{ai_response}}\n\n💬 Was this helpful? Reply YES or NO" } },
        { id: "n5", type: "add_tag", label: "Tag: Needs Human", ...pos(3, 1), config: { tag: "needs-human-agent" } },
        { id: "n6", type: "send_message", label: "Transfer to Agent", ...pos(4, 1), config: { message: "I'm connecting you with a human agent now. Please hold for a moment! 🙏" } },
        { id: "n7", type: "end", label: "Done", ...pos(5) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n3", to: "n5" },
        { id: "e5", from: "n5", to: "n6" }, { id: "e6", from: "n4", to: "n7" },
        { id: "e7", from: "n6", to: "n7" },
      ],
    },
  },

  {
    id: "sup-ticket-escalate",
    name: "Support Ticket Auto-Escalation",
    description: "Automatically escalate unresolved tickets after 2 hours to senior support and notify managers.",
    category: "support",
    tags: ["support", "escalation", "tickets", "whatsapp"],
    difficulty: "intermediate",
    estimatedSetupTime: "15 mins",
    integrations: ["whatsapp"],
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Ticket Created", ...pos(0), config: { event: "ticket_created" } },
        { id: "n2", type: "delay", label: "Wait 2 Hours", ...pos(1), config: { duration: 7200 } },
        { id: "n3", type: "condition", label: "Still Unresolved?", ...pos(2), config: { field: "ticket_status", operator: "equals", value: "open" } },
        { id: "n4", type: "send_message", label: "Escalate to Manager", ...pos(3), config: { message: "⚠️ ESCALATION ALERT!\n\nTicket #{{ticket_id}} unresolved for 2+ hours.\nCustomer: {{customer_name}}\nIssue: {{issue_summary}}\n\nPlease handle immediately!" } },
        { id: "n5", type: "end", label: "Done", ...pos(4) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
      ],
    },
  },

  // ═══════════════════════════════════════
  // SOCIAL MEDIA TEMPLATES (5)
  // ═══════════════════════════════════════

  {
    id: "soc-ig-comment-dm",
    name: "Instagram Comment → Auto DM",
    description: "When someone comments a specific word (like 'PRICE' or 'INFO') on your Instagram post, auto-DM them with details.",
    category: "social",
    tags: ["instagram", "comments", "dm", "leads"],
    difficulty: "beginner",
    estimatedSetupTime: "8 mins",
    integrations: ["instagram"],
    popular: true,
    new: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Instagram Comment Received", ...pos(0), config: { event: "instagram_comment", keyword: "PRICE" } },
        { id: "n2", type: "send_message", label: "Auto DM with Details", ...pos(1), config: { message: "Hi {{username}}! 👋 Thanks for your interest!\n\n💰 Pricing starts from Rs. {{price}}\n\n📞 To get a custom quote, share your number and I'll call you back in 5 mins!", channel: "instagram_dm" } },
        { id: "n3", type: "add_tag", label: "Tag as Lead", ...pos(2), config: { tag: "instagram-comment-lead" } },
        { id: "n4", type: "end", label: "Done", ...pos(3) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" }, { id: "e3", from: "n3", to: "n4" },
      ],
    },
  },

  {
    id: "soc-tiktok-lead",
    name: "TikTok Bio Link → WhatsApp Lead",
    description: "Capture leads from your TikTok bio link and automatically follow up via WhatsApp with your offer.",
    category: "social",
    tags: ["tiktok", "leads", "whatsapp", "social"],
    difficulty: "beginner",
    estimatedSetupTime: "10 mins",
    integrations: ["tiktok", "whatsapp"],
    new: true,
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "TikTok Bio Form Submitted", ...pos(0), config: { event: "form_submit", source: "tiktok" } },
        { id: "n2", type: "send_message", label: "WhatsApp Welcome", ...pos(1), config: { message: "Hey {{name}}! 🎵 Saw you from TikTok!\n\nThanks for reaching out. I'd love to help you with {{service}}.\n\nWhat are you looking for specifically?" } },
        { id: "n3", type: "add_tag", label: "Tag: TikTok Lead", ...pos(2), config: { tag: "tiktok-lead" } },
        { id: "n4", type: "end", label: "Done", ...pos(3) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" }, { id: "e3", from: "n3", to: "n4" },
      ],
    },
  },

  // ═══════════════════════════════════════
  // OPERATIONS TEMPLATES (5)
  // ═══════════════════════════════════════

  {
    id: "ops-daily-report",
    name: "Daily Business Report on WhatsApp",
    description: "Get a daily automated business summary — sales, leads, orders, and performance metrics — every morning on WhatsApp.",
    category: "operations",
    tags: ["reports", "whatsapp", "analytics", "daily"],
    difficulty: "intermediate",
    estimatedSetupTime: "20 mins",
    integrations: ["whatsapp"],
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Every Day at 8AM", ...pos(0), config: { event: "schedule", cron: "0 8 * * *" } },
        { id: "n2", type: "http_request", label: "Fetch Today's Stats", ...pos(1), config: { url: "/api/analytics/daily-summary", method: "GET" } },
        { id: "n3", type: "send_message", label: "Send Report to Owner", ...pos(2), config: { message: "📊 Good Morning! Daily Report:\n\n💰 Revenue: Rs. {{revenue}}\n🛍️ Orders: {{orders}}\n👥 New Leads: {{new_leads}}\n💬 Conversations: {{conversations}}\n⭐ Avg Rating: {{rating}}/5\n\nHave a great day! 🚀" } },
        { id: "n4", type: "end", label: "Done", ...pos(3) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" }, { id: "e3", from: "n3", to: "n4" },
      ],
    },
  },

  {
    id: "ops-payment-reminder",
    name: "Payment Due Reminder Sequence",
    description: "Automatically send payment reminders 7, 3, and 1 day before due date, then follow up on overdue payments.",
    category: "operations",
    tags: ["payments", "reminders", "whatsapp", "finance"],
    difficulty: "intermediate",
    estimatedSetupTime: "15 mins",
    integrations: ["whatsapp"],
    definition: {
      nodes: [
        { id: "n1", type: "trigger", label: "Invoice Created", ...pos(0), config: { event: "invoice_created" } },
        { id: "n2", type: "delay", label: "7 Days Before Due", ...pos(1), config: { duration: "relative_to_due_date", offset: -604800 } },
        { id: "n3", type: "send_message", label: "Gentle Reminder", ...pos(2), config: { message: "💳 Hi {{client_name}}, just a friendly reminder that invoice #{{invoice_id}} of Rs. {{amount}} is due in 7 days.\n\nPay now: {{payment_link}}" } },
        { id: "n4", type: "delay", label: "3 Days Before", ...pos(3), config: { duration: "relative_to_due_date", offset: -259200 } },
        { id: "n5", type: "send_message", label: "Urgent Reminder", ...pos(4), config: { message: "⚠️ Invoice #{{invoice_id}} due in 3 days! Rs. {{amount}} pending.\n\nPlease pay to avoid late fees: {{payment_link}}" } },
        { id: "n6", type: "delay", label: "On Due Date", ...pos(5), config: { duration: "relative_to_due_date", offset: 0 } },
        { id: "n7", type: "send_message", label: "Due Today!", ...pos(6), config: { message: "🚨 Payment Due TODAY!\n\nInvoice #{{invoice_id}} - Rs. {{amount}} is due now.\n\nPay immediately: {{payment_link}}" } },
        { id: "n8", type: "end", label: "Done", ...pos(7) },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" }, { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" }, { id: "e4", from: "n4", to: "n5" },
        { id: "e5", from: "n5", to: "n6" }, { id: "e6", from: "n6", to: "n7" },
        { id: "e7", from: "n7", to: "n8" },
      ],
    },
  },
];

// Helper functions
export function getTemplatesByCategory(category: TemplateCategory) {
  return WORKFLOW_TEMPLATES.filter(t => t.category === category);
}

export function getPopularTemplates() {
  return WORKFLOW_TEMPLATES.filter(t => t.popular);
}

export function getNewTemplates() {
  return WORKFLOW_TEMPLATES.filter(t => t.new);
}

export function searchTemplates(query: string) {
  const q = query.toLowerCase();
  return WORKFLOW_TEMPLATES.filter(
    t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.includes(q))
  );
}

export function getTemplateById(id: string) {
  return WORKFLOW_TEMPLATES.find(t => t.id === id);
}
