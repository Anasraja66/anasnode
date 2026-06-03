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

    const executor = new WorkflowExecutor();
    await executor.execute(wf.id, triggerData);

    const execution = await prisma.workflowExecution.findFirst({
      where: { workflowId: wf.id },
      orderBy: { startedAt: "desc" },
    });

    let replyText: string | null = null;
    let alreadySent = false;

    if (execution) {
      try {
        const output = JSON.parse(execution.output || "{}");
        if (output.status === "sent") {
          alreadySent = true;
          replyText =
            typeof output.MESSAGE_SENT === "string" ? output.MESSAGE_SENT : null;
        } else {
          replyText =
            (typeof output.AI_RESPONSE === "string" && output.AI_RESPONSE) ||
            (typeof output.MESSAGE_SENT === "string" && output.MESSAGE_SENT) ||
            null;
        }
      } catch {
        /* ignore */
      }
    }

    if (alreadySent) {
      return {
        handled: true,
        workflowId: wf.id,
        reply: replyText,
        sent: true,
        mode: "executor" as const,
      };
    }

    if (replyText) {
      const sent = await sendMetaTextMessage(
        message.phone,
        replyText,
        wf.accountId
      );
      return {
        handled: true,
        workflowId: wf.id,
        reply: replyText,
        sent,
        mode: "executor" as const,
      };
    }

    return {
      handled: true,
      workflowId: wf.id,
      reply: null,
      sent: false,
      mode: "executor" as const,
    };
  }

  return { handled: false, mode: "none" as const };
}
