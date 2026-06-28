import { prisma } from "@/lib/db";
import { generateConversationReply } from "@/lib/ai/conversation-reply";
import {
  addInboxMessage,
  getConversationHistory,
  markConversationOptedOut,
  resolveAccountIdFromWhatsApp,
  upsertInboxConversation,
} from "@/lib/inbox/store";
import { getWhatsAppAccountSettings, sendMetaReply } from "@/lib/whatsapp/meta";
import { handleInboundWhatsApp, type InboundWhatsAppMessage } from "@/lib/whatsapp/inbound";

export type ProcessInboundResult = {
  mode: "ai" | "workflow" | "none";
  sent: boolean;
  reply?: string | null;
  conversationId?: string;
};

/**
 * Workflow-first inbound handling:
 * 1. Save message to inbox
 * 2. If account has an active workflow with WhatsApp trigger → run WorkflowExecutor
 * 3. If no workflow → fall back to AI conversation reply
 * 4. If no AI → send generic fallback message
 */
export async function processInboundWhatsAppMessage(
  message: InboundWhatsAppMessage,
  meta?: { phoneNumberId?: string }
): Promise<ProcessInboundResult> {
  const accountId = await resolveAccountIdFromWhatsApp(meta?.phoneNumberId);
  if (!accountId) {
    console.error("[WhatsApp] No account for phone_number_id:", meta?.phoneNumberId);
    return { mode: "none", sent: false };
  }

  const workspace = await prisma.workspace.findFirst({
    where: { accountId },
    orderBy: { createdAt: "desc" },
  });

  // Save conversation + inbound message to inbox
  const conversation = await upsertInboxConversation({
    accountId,
    workspaceId: workspace?.id,
    contactPhone: message.phone,
    contactName: message.contactName,
  });

  await addInboxMessage({
    conversationId: conversation.id,
    direction: "inbound",
    body: message.messageText,
    source:
      message.contentType === "audio" || message.contentType === "voice"
        ? "voice"
        : message.contentType === "document"
          ? "file"
          : message.contentType === "image"
            ? "image"
            : "customer",
    incrementUnread: true,
  });

  // Handle opt-out keywords
  const stopWords = ["stop", "unsubscribe", "opt out", "opt-out", "optout"];
  if (stopWords.some((w) => message.messageText.trim().toLowerCase() === w)) {
    await markConversationOptedOut(conversation.id);
    return { mode: "none", sent: false, conversationId: conversation.id };
  }

  // If AI/automation is manually disabled for this conversation, do nothing
  if (!conversation.aiEnabled) {
    return { mode: "none", sent: false, conversationId: conversation.id };
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 1: WORKFLOW-FIRST
  // Try to find and run an active workflow with a WhatsApp trigger.
  // ─────────────────────────────────────────────────────────────────
  const workflowResult = await handleInboundWhatsApp(message);

  if (workflowResult.handled) {
    console.log(
      `[WhatsApp] WorkflowExecutor handled message (sent=${workflowResult.sent})`
    );

    // Save outbound reply to inbox if workflow produced one
    if (workflowResult.reply) {
      await addInboxMessage({
        conversationId: conversation.id,
        direction: "outbound",
        body: workflowResult.reply,
        source: "workflow",
      });
    }

    return {
      mode: "workflow",
      sent: workflowResult.sent ?? false,
      reply: workflowResult.reply ?? null,
      conversationId: conversation.id,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 2: AI FALLBACK
  // No active workflow found — use generic AI conversation reply.
  // ─────────────────────────────────────────────────────────────────
  console.log("[WhatsApp] No active workflow matched — falling back to AI reply.");

  const settings = await getWhatsAppAccountSettings(accountId);

  if (settings.aiAutoReply) {
    const history = await getConversationHistory(conversation.id, 12);
    const reply = await generateConversationReply({
      accountId,
      workspaceId: workspace?.id,
      contactName: message.contactName,
      messageText: message.messageText,
      history,
    });

    const delivery = await sendMetaReply(message.phone, reply, accountId, {
      preferVoice: false,
    });

    if (!delivery.sent) {
      console.error(
        "[WhatsApp] AI reply not delivered — check Phone number ID in Integrations → WhatsApp"
      );
    }

    await addInboxMessage({
      conversationId: conversation.id,
      direction: "outbound",
      body: delivery.sent
        ? delivery.channel === "voice" || delivery.channel === "both"
          ? `🔊 Voice reply: ${reply}`
          : reply
        : `[Could not deliver to WhatsApp] ${reply}`,
      source: delivery.sent
        ? delivery.channel === "voice" || delivery.channel === "both"
          ? "voice"
          : "ai"
        : "system",
    });

    return {
      mode: "ai",
      sent: delivery.sent,
      reply,
      conversationId: conversation.id,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 3: GENERIC FALLBACK
  // No workflow, no AI — send a polite holding message.
  // ─────────────────────────────────────────────────────────────────
  const fallback = `Thanks for contacting ${workspace?.name || "us"}! We received your message and will reply shortly.`;
  const delivery = await sendMetaReply(message.phone, fallback, accountId, {
    preferVoice: false,
  });

  if (delivery.sent) {
    await addInboxMessage({
      conversationId: conversation.id,
      direction: "outbound",
      body: fallback,
      source: "system",
    });
  }

  return {
    mode: "none",
    sent: delivery.sent,
    reply: fallback,
    conversationId: conversation.id,
  };
}
