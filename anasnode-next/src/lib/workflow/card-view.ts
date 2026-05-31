import { prisma } from "../db";
import { NodeType, WorkflowNode } from "./types";

interface WorkflowCard {
  id: string;
  title: string;
  description: string;
  icon: string; // trigger type icon name e.g. "message", "zap", "clock"
  isActive: boolean;
  runs: number;
  successRate: number;
  lastRun: string | null;
  toggleUrl: string;
}

export async function getWorkflowCards(workspaceId: string): Promise<WorkflowCard[]> {
  const workflows = await prisma.workflow.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" }
  });

  return workflows.map(wf => {
    const nodes: WorkflowNode[] = JSON.parse(wf.nodes || "[]");
    const stats = JSON.parse(wf.stats || "{\"runs\":0,\"success\":0,\"failed\":0}");
    
    const runs = stats.runs || 0;
    const success = stats.success || 0;
    const successRate = runs > 0 ? Math.round((success / runs) * 100) : 100;

    return {
      id: wf.id,
      title: wf.name,
      description: generateDescription(nodes),
      icon: getIconForTrigger(nodes),
      isActive: wf.isActive,
      runs: runs,
      successRate: successRate,
      lastRun: wf.lastRunAt ? new Date(wf.lastRunAt).toLocaleDateString() : null,
      toggleUrl: `/api/v1/workflows/${wf.id}/activate`
    };
  });
}

// Convert developer canvas nodes into a simple plain English sentence
export function generateDescription(nodes: WorkflowNode[]): string {
  if (nodes.length === 0) return "No actions configured.";

  const stepDescriptions: string[] = [];

  // Find trigger node first
  const triggerNode = nodes.find(n => n.type.startsWith("trigger_"));
  if (triggerNode) {
    stepDescriptions.push(getTriggerDescription(triggerNode.type));
  }

  // Gather other action nodes in the flow sequential order
  const actionNodes = nodes.filter(n => !n.type.startsWith("trigger_"));
  
  // Sort them loosely based on edges outputs connections if possible, or position x
  const sortedActions = [...actionNodes].sort((a, b) => a.position.x - b.position.x);

  // Take first 3 actions to prevent massive descriptions
  const displayedActions = sortedActions.slice(0, 3);
  displayedActions.forEach(act => {
    stepDescriptions.push(getActionDescription(act.type));
  });

  if (actionNodes.length > 3) {
    stepDescriptions.push("and more");
  }

  return stepDescriptions.join(" → ");
}

function getTriggerDescription(type: NodeType): string {
  switch (type) {
    case NodeType.TRIGGER_WHATSAPP:
      return "When WhatsApp received";
    case NodeType.TRIGGER_INSTAGRAM:
      return "When Instagram DM received";
    case NodeType.TRIGGER_WEBHOOK:
      return "When Webhook triggered";
    case NodeType.TRIGGER_SCHEDULE:
      return "On timer schedule";
    case NodeType.TRIGGER_FORM:
      return "When Form submitted";
    case NodeType.TRIGGER_SHOPIFY:
      return "When Shopify action occurs";
    default:
      return "When Triggered";
  }
}

function getActionDescription(type: NodeType): string {
  switch (type) {
    case NodeType.AI_RESPOND:
      return "AI answers contextually";
    case NodeType.AI_CLASSIFY:
      return "AI classifies message category";
    case NodeType.AI_EXTRACT:
      return "AI extracts context variables";
    case NodeType.SEND_WHATSAPP:
    case NodeType.SEND_WHATSAPP_BUTTONS:
    case NodeType.SEND_WHATSAPP_LIST:
      return "Send WhatsApp reply";
    case NodeType.SEND_INSTAGRAM_DM:
      return "Send Instagram DM";
    case NodeType.SEND_EMAIL:
      return "Send email confirmation";
    case NodeType.ANAMIND_SET:
      return "Save data to AnasMind";
    case NodeType.CRM_CREATE_CONTACT:
    case NodeType.CRM_UPDATE_CONTACT:
      return "Sync CRM contact profile";
    case NodeType.GOOGLE_CALENDAR:
      return "Book calendar slot";
    case NodeType.HTTP_REQUEST:
      return "Sync external APIs";
    case NodeType.WAIT:
      return "Wait delay";
    default:
      return "Execute action";
  }
}

function getIconForTrigger(nodes: WorkflowNode[]): string {
  const trigger = nodes.find(n => n.type.startsWith("trigger_"));
  if (!trigger) return "zap"; // default

  switch (trigger.type) {
    case NodeType.TRIGGER_WHATSAPP:
    case NodeType.TRIGGER_INSTAGRAM:
      return "message";
    case NodeType.TRIGGER_SCHEDULE:
      return "clock";
    case NodeType.TRIGGER_WEBHOOK:
      return "webhook";
    case NodeType.TRIGGER_FORM:
      return "file-text";
    default:
      return "zap";
  }
}
