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
  // ── 1. SOCIAL MEDIA & CRM (Facebook, Instagram, WhatsApp) ──
  {
    id: "fb-lead-to-whatsapp",
    name: "Facebook Lead to WhatsApp & CRM",
    description: "Capture new Facebook Leads via Webhook, immediately send a WhatsApp Welcome message, and save them to the CRM as a New Deal.",
    industry: "Marketing / Sales",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_WEBHOOK,
        name: "Facebook Lead Webhook",
        position: { x: 50, y: 150 },
        config: { method: "POST", path: "/webhook/fb-lead" },
        inputs: [],
        outputs: ["node-2"]
      },
      {
        id: "node-2",
        type: NodeType.SEND_WHATSAPP,
        name: "Welcome WhatsApp",
        position: { x: 300, y: 150 },
        config: { template: "Hi {{body.first_name}}, thanks for your interest in our Facebook ad! A representative will call you shortly." },
        inputs: ["node-1"],
        outputs: ["node-3"]
      },
      {
        id: "node-3",
        type: NodeType.CRM_CREATE_CONTACT,
        name: "Save Lead to CRM",
        position: { x: 550, y: 150 },
        config: { name_field: "{{body.first_name}} {{body.last_name}}", phone_field: "{{body.phone}}" },
        inputs: ["node-2"],
        outputs: ["node-4"]
      },
      {
        id: "node-4",
        type: NodeType.NOTIFY_TEAM,
        name: "Notify Sales Team",
        position: { x: 800, y: 150 },
        config: { channel: "WhatsApp", message: "New Facebook Lead: {{body.first_name}} ({{body.phone}})" },
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
  
  // ── 2. INSTAGRAM AI AUTOMATION ──
  {
    id: "ig-dm-auto-book",
    name: "Instagram DM AI Booking",
    description: "When someone DMs on Instagram, use AI to answer queries and automatically book them onto Google Calendar.",
    industry: "Service / Salon",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_INSTAGRAM,
        name: "Instagram DM Received",
        position: { x: 50, y: 150 },
        config: { keyword: "any", matchType: "any" },
        inputs: [],
        outputs: ["node-2"]
      },
      {
        id: "node-2",
        type: NodeType.AI_RESPOND,
        name: "AI Booking Assistant",
        position: { x: 300, y: 150 },
        config: { 
          provider: "claude", 
          systemPrompt: "You are an Instagram assistant. Help the user book a session and extract their preferred date/time.",
          userMessage: "{{message}}"
        },
        inputs: ["node-1"],
        outputs: ["node-3"]
      },
      {
        id: "node-3",
        type: NodeType.SEND_INSTAGRAM_DM,
        name: "Reply on Instagram",
        position: { x: 550, y: 150 },
        config: { message: "{{AI_RESPONSE}}" },
        inputs: ["node-2"],
        outputs: ["node-4"]
      },
      {
        id: "node-4",
        type: NodeType.GOOGLE_CALENDAR,
        name: "Book Google Calendar",
        position: { x: 800, y: 150 },
        config: { action: "Book Event", summary: "IG Booking: {{contactName}}", startTime: "{{EXTRACTED_TIME}}" },
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

  // ── 3. EMAIL & CALENDAR AUTOMATION ──
  {
    id: "email-calendar-reminder",
    name: "Meeting Reminder Email & WA",
    description: "Trigger a workflow 24 hours before a Google Calendar event, sending an Email and WhatsApp reminder to the attendee.",
    industry: "Consulting",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_SCHEDULE,
        name: "Daily Check",
        position: { x: 50, y: 150 },
        config: { cron: "0 8 * * *" },
        inputs: [],
        outputs: ["node-2"]
      },
      {
        id: "node-2",
        type: NodeType.GOOGLE_CALENDAR,
        name: "Get Tomorrow's Events",
        position: { x: 300, y: 150 },
        config: { action: "Find Slot", summary: "Fetch events for next 24h" },
        inputs: ["node-1"],
        outputs: ["node-3"]
      },
      {
        id: "node-3",
        type: NodeType.SEND_EMAIL,
        name: "Send Email Reminder",
        position: { x: 550, y: 50 },
        config: { to: "{{event.attendee_email}}", subject: "Reminder: Our meeting tomorrow", body: "Hi, just a reminder for our meeting at {{event.time}}." },
        inputs: ["node-2"],
        outputs: []
      },
      {
        id: "node-4",
        type: NodeType.SEND_WHATSAPP,
        name: "Send WA Reminder",
        position: { x: 550, y: 250 },
        config: { template: "Hi! Friendly reminder for our meeting tomorrow at {{event.time}}." },
        inputs: ["node-2"],
        outputs: []
      }
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-2", target: "node-4" }
    ]
  },

  // ── 4. SHOPIFY E-COMMERCE NOTIFICATIONS ──
  {
    id: "shopify-order-alerts",
    name: "Shopify Order Fulfilled Alert",
    description: "When an order is placed on Shopify, automatically send a confirmation email, and notify the warehouse team via Webhook.",
    industry: "E-Commerce",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_SHOPIFY,
        name: "Shopify New Order",
        position: { x: 50, y: 150 },
        config: { event: "order_placed" },
        inputs: [],
        outputs: ["node-2"]
      },
      {
        id: "node-2",
        type: NodeType.SEND_EMAIL,
        name: "Email Receipt",
        position: { x: 300, y: 150 },
        config: { to: "{{customer.email}}", subject: "Order Confirmation #{{order.id}}", body: "Thank you for your purchase of {{order.total_price}}!" },
        inputs: ["node-1"],
        outputs: ["node-3"]
      },
      {
        id: "node-3",
        type: NodeType.HTTP_REQUEST,
        name: "Notify Warehouse API",
        position: { x: 550, y: 150 },
        config: { url: "https://warehouse.local/api/new-order", method: "POST", body: "{\"order_id\": \"{{order.id}}\"}" },
        inputs: ["node-2"],
        outputs: []
      }
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" }
    ]
  },

  // ── 5. FORM SUBMISSION TO GOOGLE SHEETS ──
  {
    id: "form-to-sheets",
    name: "Form Submit to Database & Reply",
    description: "Capture website form submissions, save them directly to external Database/Sheets via HTTP Request, and send a Thank You SMS/WhatsApp.",
    industry: "General Business",
    nodes: [
      {
        id: "node-1",
        type: NodeType.TRIGGER_FORM,
        name: "Website Form Submit",
        position: { x: 50, y: 150 },
        config: { formId: "contact-us" },
        inputs: [],
        outputs: ["node-2"]
      },
      {
        id: "node-2",
        type: NodeType.HTTP_REQUEST,
        name: "Save to Google Sheets",
        position: { x: 300, y: 150 },
        config: { url: "https://api.sheetson.com/v2/sheets/Contact", method: "POST", body: "{\"Name\": \"{{name}}\", \"Email\": \"{{email}}\"}" },
        inputs: ["node-1"],
        outputs: ["node-3"]
      },
      {
        id: "node-3",
        type: NodeType.SEND_WHATSAPP,
        name: "Send Thank You WA",
        position: { x: 550, y: 150 },
        config: { template: "Hi {{name}}, we received your query! Our team will contact you at {{email}}." },
        inputs: ["node-2"],
        outputs: []
      }
    ],
    edges: [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" }
    ]
  }
];
