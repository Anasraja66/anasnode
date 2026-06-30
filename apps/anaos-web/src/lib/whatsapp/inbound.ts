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

    // Phase 1 (Vercel): Run execution inline instead of via BullMQ
    const { WorkflowExecutor } = await import("@/lib/workflow/executor");
    const executor = new WorkflowExecutor();
    
    // Execute async in the background (already wrapped in after() in route.ts)
    await executor.execute(wf.id, triggerData);

    return {
      handled: true,
      workflowId: wf.id,
      reply: null as string | null, // Message will be sent by executor
      sent: false, // Executor handles sending
      mode: "executor" as const,
    };
  }

  return { handled: false, mode: "none" as const };
}
