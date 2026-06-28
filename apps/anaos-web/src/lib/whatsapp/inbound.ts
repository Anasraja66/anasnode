import { prisma } from "@/lib/db";
import { WorkflowExecutor } from "@/lib/workflow/executor";
import { NodeType, WorkflowNode } from "@/lib/workflow/types";
import { sendMetaTextMessage } from "@/lib/whatsapp/meta";

export type InboundWhatsAppMessage = {
  phone: string;
  contactName: string;
  messageText: string;
  contentType?: string;
  waMessageId?: string;
};

/**
 * Run the first matching active WhatsApp-triggered workflow.
 * Returns reply text if executor produced one and Meta send status.
 */
export async function handleInboundWhatsApp(message: InboundWhatsAppMessage) {
  const activeWorkflows = await prisma.workflow.findMany({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });

  const triggerData = {
    phone: message.phone,
    contactPhone: message.phone,
    contactName: message.contactName,
    name: message.contactName,
    message: message.messageText,
    contactId: message.phone,
  };

  for (const wf of activeWorkflows) {
    let nodes: WorkflowNode[] = [];
    try {
      nodes = JSON.parse(wf.nodes || "[]");
    } catch {
      continue;
    }

    const hasWhatsAppTrigger = nodes.some(
      (n) => n.type === NodeType.TRIGGER_WHATSAPP
    );
    if (!hasWhatsAppTrigger) continue;

    // Phase 2.2: Event-Driven execution via BullMQ
    const { enqueueWorkflow } = await import("@/lib/queue/publisher");
    await enqueueWorkflow(wf.id, triggerData);

    return {
      handled: true,
      workflowId: wf.id,
      reply: null as string | null, // Message will be sent by background worker
      sent: false, // Background worker handles this
      mode: "executor" as const,
    };
  }

  return { handled: false, mode: "none" as const };
}
