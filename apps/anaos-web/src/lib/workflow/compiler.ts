import { prisma } from "@/lib/db";
import {
  GeneratedWorkspace,
  resolveWorkspaceFromPrompt,
} from "@/lib/generate/workspace";
import { normalizeIndustryLabel } from "@/lib/industry/presets";
import { defaultPlatformLanguageSettingsJson } from "@/lib/i18n/platform";
import { TEMPLATES } from "./templates";
import { NodeType, WorkflowEdge, WorkflowNode } from "./types";

const INDUSTRY_TEMPLATE_MAP: Record<string, string> = {
  // Middle East / Global
  "real estate": "real-estate-lead-qualifier",
  restaurant: "restaurant-order-bot",
  "restaurant & cafe": "restaurant-order-bot",
  clinic: "clinic-appointment",
  "clinic & health": "clinic-appointment",
  healthcare: "clinic-appointment",
  "healthcare & wellness": "clinic-appointment",
  health: "clinic-appointment",
  "e-commerce": "ecommerce-cart-recovery",
  ecommerce: "ecommerce-cart-recovery",
  "online store": "ecommerce-cart-recovery",
  "salon & beauty": "salon-booking",
  salon: "salon-booking",
  fitness: "restaurant-order-bot",
  "gym & fitness": "restaurant-order-bot",
  "general business": "lead-followup-sequence",

  // U.S. Market Verticals
  hvac: "missed-call-textback",
  "hvac & plumbing": "missed-call-textback",
  plumbing: "missed-call-textback",
  electrician: "missed-call-textback",
  "home services": "missed-call-textback",
  contractor: "missed-call-textback",
  roofing: "missed-call-textback",
  landscaping: "missed-call-textback",
  "pest control": "missed-call-textback",
  cleaning: "missed-call-textback",
  "cleaning service": "missed-call-textback",
  "auto repair": "missed-call-textback",
  automotive: "missed-call-textback",
  insurance: "lead-followup-sequence",
  mortgage: "lead-followup-sequence",
  "financial services": "lead-followup-sequence",
  accounting: "payment-reminder",
  bookkeeping: "payment-reminder",
  legal: "quote-followup",
  "law firm": "quote-followup",
  consulting: "quote-followup",
  marketing: "quote-followup",
  "digital agency": "quote-followup",
  dentist: "review-request",
  dental: "review-request",
  "dental clinic": "clinic-appointment",
  optometrist: "clinic-appointment",
  veterinary: "clinic-appointment",
  vet: "clinic-appointment",
  "physical therapy": "clinic-appointment",
  chiropractor: "clinic-appointment",
  "med spa": "salon-booking",
  spa: "salon-booking",
  barbershop: "salon-booking",
  photography: "quote-followup",
  "event planning": "quote-followup",
  catering: "quote-followup",
  florist: "lead-followup-sequence",
  "retail store": "review-request",
  retail: "review-request",
};


export function pickTemplateId(industry: string, prompt: string): string {
  const key = industry.toLowerCase();
  if (INDUSTRY_TEMPLATE_MAP[key]) return INDUSTRY_TEMPLATE_MAP[key];

  const p = prompt.toLowerCase();

  // E-commerce
  if (p.includes("shopify") || p.includes("cart") || p.includes("ecommerce") || p.includes("abandoned")) {
    return "ecommerce-cart-recovery";
  }

  // Food & Restaurant
  if (p.includes("restaurant") || p.includes("food") || p.includes("order") || p.includes("menu")) {
    return "restaurant-order-bot";
  }

  // Health & Medical
  if (p.includes("clinic") || p.includes("dentist") || p.includes("doctor") || p.includes("appointment") || p.includes("patient")) {
    return "clinic-appointment";
  }

  // Beauty & Wellness
  if (p.includes("salon") || p.includes("spa") || p.includes("barber") || p.includes("beauty") || p.includes("nail")) {
    return "salon-booking";
  }

  // U.S. Home Services (Missed Call Text-Back)
  if (
    p.includes("hvac") || p.includes("plumb") || p.includes("electric") ||
    p.includes("roof") || p.includes("contractor") || p.includes("landscap") ||
    p.includes("pest") || p.includes("clean") || p.includes("handyman") ||
    p.includes("missed call") || p.includes("missed calls") || p.includes("text back")
  ) {
    return "missed-call-textback";
  }

  // Payment / Invoice
  if (p.includes("invoice") || p.includes("payment") || p.includes("overdue") || p.includes("reminder") || p.includes("billing")) {
    return "payment-reminder";
  }

  // Review / Reputation
  if (p.includes("review") || p.includes("google review") || p.includes("yelp") || p.includes("reputation")) {
    return "review-request";
  }

  // Quote / Proposal
  if (p.includes("quote") || p.includes("proposal") || p.includes("estimate") || p.includes("follow up") || p.includes("follow-up")) {
    return "quote-followup";
  }

  // Lead Follow-Up (default for sales/service businesses)
  if (p.includes("lead") || p.includes("sales") || p.includes("prospect") || p.includes("customer")) {
    return "lead-followup-sequence";
  }

  return "lead-followup-sequence";
}


function cloneNodes(nodes: WorkflowNode[]): WorkflowNode[] {
  return JSON.parse(JSON.stringify(nodes)) as WorkflowNode[];
}

function customizeNodes(
  nodes: WorkflowNode[],
  ctx: { businessName: string; industry: string; prompt: string }
): WorkflowNode[] {
  const biz = ctx.businessName;
  const ind = ctx.industry;

  return nodes.map((node) => {
    const config = { ...node.config };

    if (
      node.type === NodeType.AI_RESPOND ||
      node.type === NodeType.AI_GENERATE_CONTENT ||
      node.type === NodeType.AI_CLASSIFY ||
      node.type === NodeType.AI_EXTRACT
    ) {
      if (typeof config.systemPrompt === "string") {
        config.systemPrompt = config.systemPrompt
          .replace(/Marina Realty/gi, biz)
          .replace(/CareDental/gi, biz)
          .replace(/Glow Salon/gi, biz);
        if (!config.systemPrompt.includes(biz)) {
          config.systemPrompt = `You represent "${biz}" (${ind}). ${config.systemPrompt}`;
        }
      }
      if (typeof config.userMessage === "string" && !config.userMessage.includes("{{message}}")) {
        config.userMessage = "Customer sent: {{message}}";
      }
    }

    if (node.type === NodeType.SEND_WHATSAPP && typeof config.template === "string") {
      config.template = config.template.replace(/\{\{contactName\}\}/g, "{{contactName}}");
    }

    return { ...node, config };
  });
}

export type CompileResult = {
  templateId: string;
  workspace: GeneratedWorkspace;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflowName: string;
  workflowDescription: string;
};

export async function compileAutomationFromPrompt(
  prompt: string,
  existingWorkspace?: GeneratedWorkspace
): Promise<CompileResult> {
  const workspace = existingWorkspace ?? (await resolveWorkspaceFromPrompt(prompt));
  const templateId = pickTemplateId(workspace.industry, prompt);
  const template = TEMPLATES.find((t) => t.id === templateId);

  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const nodes = customizeNodes(cloneNodes(template.nodes), {
    businessName: workspace.name,
    industry: workspace.industry,
    prompt,
  });

  const primaryAutomation =
    workspace.automations.find((a) => a.type === "whatsapp_flow") ||
    workspace.automations[0];

  return {
    templateId,
    workspace,
    nodes,
    edges: JSON.parse(JSON.stringify(template.edges)) as WorkflowEdge[],
    workflowName: primaryAutomation?.name || template.name,
    workflowDescription: prompt,
  };
}

export async function saveCompiledAutomation(
  accountId: string,
  prompt: string,
  options: {
    workspace?: GeneratedWorkspace;
    activate?: boolean;
    workspaceId?: string;
  } = {}
) {
  const compiled = await compileAutomationFromPrompt(prompt, options.workspace);
  compiled.workspace.industry = normalizeIndustryLabel(compiled.workspace.industry);

  let workspaceId = options.workspaceId;
  let dbWorkspace;

  if (workspaceId) {
    dbWorkspace = await prisma.workspace.findFirst({
      where: { id: workspaceId, accountId },
    });
  }

  if (!dbWorkspace) {
    dbWorkspace = await prisma.workspace.create({
      data: {
        accountId,
        name: compiled.workspace.name,
        industry: compiled.workspace.industry,
        slug: compiled.workspace.slug,
        status: options.activate ? "live" : "draft",
        languageSettings: defaultPlatformLanguageSettingsJson(),
      },
    });
    workspaceId = dbWorkspace.id;
  } else {
    await prisma.workspace.update({
      where: { id: dbWorkspace.id },
      data: {
        name: compiled.workspace.name,
        industry: compiled.workspace.industry,
        slug: compiled.workspace.slug,
        status: options.activate ? "live" : dbWorkspace.status,
      },
    });
  }

  const variableKeys = compiled.workspace.variables.map((v) => v.key);

  const workflow = await prisma.workflow.create({
    data: {
      accountId,
      workspaceId: workspaceId!,
      name: compiled.workflowName,
      description: compiled.workflowDescription,
      nodes: JSON.stringify(compiled.nodes),
      edges: JSON.stringify(compiled.edges),
      variables: JSON.stringify(variableKeys),
      stats: JSON.stringify({ runs: 0, success: 0, failed: 0 }),
      isActive: !!options.activate,
    },
  });

  return {
    compiled,
    workspace: dbWorkspace,
    workflow: {
      ...workflow,
      nodes: compiled.nodes,
      edges: compiled.edges,
      stats: { runs: 0, success: 0, failed: 0 },
    },
  };
}
