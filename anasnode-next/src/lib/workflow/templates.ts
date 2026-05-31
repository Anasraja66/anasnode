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
  }
];

export async function createWorkflowFromTemplate(
  templateId: string,
  workspaceId: string,
  customizations?: { name?: string; description?: string }
) {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const mockAccountId = "acc-default-user";

  const workflow = await prisma.workflow.create({
    data: {
      accountId: mockAccountId,
      workspaceId,
      name: customizations?.name || template.name,
      description: customizations?.description || template.description,
      nodes: JSON.stringify(template.nodes),
      edges: JSON.stringify(template.edges),
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
