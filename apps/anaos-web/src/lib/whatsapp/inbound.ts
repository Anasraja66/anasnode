/**
 * WhatsApp Inbound Message Handler
 *
 * Called by processInboundWhatsAppMessage when a new WhatsApp message arrives.
 * Finds the matching active workflow for THIS account and runs it.
 *
 * Key fix: filters by accountId so one account's workflow cannot
 * accidentally handle another account's messages (multi-tenant safety).
 */

import { prisma } from "@/lib/db";
import { WorkflowExecutor } from "@/lib/workflow/executor";
import { NodeType } from "@/lib/workflow/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface InboundWhatsAppMessage {
  phone: string;
  contactName: string;
  messageText: string;
  contentType?: string;
  waMessageId?: string;
}

export interface InboundHandleResult {
  handled: boolean;
  mode: "executor" | "none";
  workflowId?: string;
  reply: string | null;
  sent: boolean;
}

// ── Main Export ───────────────────────────────────────────────────────────────

/**
 * Find and run the first active WhatsApp-triggered workflow for this account.
 *
 * Returns { handled: true } if a workflow was found and started.
 * Returns { handled: false } if no workflow matches (caller should use AI fallback).
 */
export async function handleInboundWhatsApp(
  message: InboundWhatsAppMessage,
  accountId: string
): Promise<InboundHandleResult> {
  // Only fetch workflows belonging to this specific account
  const activeWorkflows = await prisma.workflow.findMany({
    where: {
      isActive: true,
      accountId, // ← tenant isolation: only this account's workflows
    },
    orderBy: { updatedAt: "desc" },
  });

  if (activeWorkflows.length === 0) {
    return { handled: false, mode: "none", reply: null, sent: false };
  }

  // Build the trigger payload — matches what executor expects
  const triggerData = {
    phone: message.phone,
    contactPhone: message.phone,
    contactName: message.contactName,
    name: message.contactName,
    message: message.messageText,
    contactId: message.phone,
    waMessageId: message.waMessageId,
    contentType: message.contentType,
  };

  // Find the first workflow that has a WhatsApp trigger node
  for (const workflow of activeWorkflows) {
    let nodes: any[] = [];

    try {
      nodes = JSON.parse(workflow.nodes || "[]");
    } catch {
      console.warn(`[WhatsApp Inbound] Skipping workflow ${workflow.id} — invalid nodes JSON`);
      continue;
    }

    const hasWhatsAppTrigger = nodes.some(
      (node: any) => node.type === NodeType.TRIGGER_WHATSAPP
    );

    if (!hasWhatsAppTrigger) continue;

    console.log(
      `[WhatsApp Inbound] Running workflow "${workflow.name}" (${workflow.id}) for account ${accountId}`
    );

    // Execute in the current async context
    // (the caller's after() already runs this in the background)
    const executor = new WorkflowExecutor();
    await executor.execute(workflow.id, triggerData);

    return {
      handled: true,
      mode: "executor",
      workflowId: workflow.id,
      reply: null, // executor handles sending the reply directly
      sent: false, // executor handles this
    };
  }

  // No workflow with a WhatsApp trigger found
  return { handled: false, mode: "none", reply: null, sent: false };
}
