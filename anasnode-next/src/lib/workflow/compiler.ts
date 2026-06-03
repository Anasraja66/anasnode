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
  "general business": "real-estate-lead-qualifier",
};

export function pickTemplateId(industry: string, prompt: string): string {
  const key = industry.toLowerCase();
  if (INDUSTRY_TEMPLATE_MAP[key]) return INDUSTRY_TEMPLATE_MAP[key];

  const p = prompt.toLowerCase();
  if (p.includes("shopify") || p.includes("cart") || p.includes("ecommerce")) {
    return "ecommerce-cart-recovery";
  }
  if (p.includes("restaurant") || p.includes("food")) return "restaurant-order-bot";
  if (p.includes("clinic") || p.includes("dentist") || p.includes("health"))
    return "clinic-appointment";
  if (p.includes("salon") || p.includes("spa")) return "salon-booking";

  return "real-estate-lead-qualifier";
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
    workflowDescription: `Compiled from prompt for ${workspace.name} (${workspace.industry})`,
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
