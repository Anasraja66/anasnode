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
 * AI-first inbound handling: save to inbox, reply naturally, workflows optional fallback.
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

  const stopWords = ["stop", "unsubscribe", "opt out", "opt-out", "optout"];
  if (stopWords.some((w) => message.messageText.trim().toLowerCase() === w)) {
    await markConversationOptedOut(conversation.id);
    return { mode: "none", sent: false, conversationId: conversation.id };
  }

  const settings = await getWhatsAppAccountSettings(accountId);
  const aiFirst = process.env.ANAOS_AI_FIRST !== "false";

  if (!conversation.aiEnabled) {
    return { mode: "none", sent: false, conversationId: conversation.id };
  }

  if (aiFirst && settings.aiAutoReply) {
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
        "[WhatsApp] AI reply not delivered — check Phone number ID in Integrations → WhatsApp (Meta API Setup, not +1 555…)"
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

  const workflowResult = await handleInboundWhatsApp(message);

  if (workflowResult.reply && !workflowResult.sent) {
    const delivery = await sendMetaReply(message.phone, workflowResult.reply, accountId, {
      preferVoice: false,
    });
    const sent = delivery.sent;
    if (sent && workflowResult.reply) {
      await addInboxMessage({
        conversationId: conversation.id,
        direction: "outbound",
        body: workflowResult.reply,
        source: "workflow",
      });
    }
    return {
      mode: "workflow",
      sent,
      reply: workflowResult.reply,
      conversationId: conversation.id,
    };
  }

  if (workflowResult.sent && workflowResult.reply) {
    await addInboxMessage({
      conversationId: conversation.id,
      direction: "outbound",
      body: workflowResult.reply,
      source: "workflow",
    });
  }

  const sentWorkflow = workflowResult.sent ?? false;

  if (!sentWorkflow && !workflowResult.reply) {
    const fallback = `Thanks for contacting ${workspace?.name || "us"}! We received your message and will reply shortly.`;
    const delivery = await sendMetaReply(message.phone, fallback, accountId, {
      preferVoice: false,
    });
    const sent = delivery.sent;
    if (sent) {
      await addInboxMessage({
        conversationId: conversation.id,
        direction: "outbound",
        body: fallback,
        source: "system",
      });
    }
    return {
      mode: "none",
      sent,
      reply: fallback,
      conversationId: conversation.id,
    };
  }

  return {
    mode: workflowResult.handled ? "workflow" : "none",
    sent: sentWorkflow,
    reply: workflowResult.reply,
    conversationId: conversation.id,
  };
}
