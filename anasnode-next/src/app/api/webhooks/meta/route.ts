/**
 * Unified Meta Webhook — handles WhatsApp, Instagram, Facebook Messenger
 * All 3 platforms use the same webhook URL configured in Meta App Dashboard
 *
 * body.object determines the channel:
 *   "whatsapp_business_account" → WhatsApp
 *   "instagram"                 → Instagram DM
 *   "page"                      → Facebook Messenger
 */

import { after, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateConversationReply } from "@/lib/ai/conversation-reply";
import {
  addInboxMessage,
  getConversationHistory,
  upsertInboxConversation,
} from "@/lib/inbox/store";
import { resolveAccountIdFromWhatsApp } from "@/lib/inbox/store";
import { parseWhatsAppInboundMessage } from "@/lib/whatsapp/parse-inbound";
import { processInboundWhatsAppMessage } from "@/lib/whatsapp/process-inbound";
import { parseInstagramInbound } from "@/lib/instagram/parse-inbound";
import { getInstagramCredentials, sendInstagramReply } from "@/lib/instagram/send-reply";
import { parseFacebookInbound } from "@/lib/facebook/parse-inbound";
import { getFacebookCredentials, sendFacebookReply } from "@/lib/facebook/send-reply";

export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "anaos_secret_verify_token";

// ─── Webhook Verification (GET) ───────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// ─── Message Handler (POST) ───────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const objectType = body.object as string;

    // ── WhatsApp ──────────────────────────────────────────────────────────────
    if (objectType === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const val = change?.value;
      if (!val?.messages?.length) {
        return NextResponse.json({ success: true, message: "Acknowledged" });
      }

      const message = val.messages[0];
      const senderName = val.contacts?.[0]?.profile?.name || "Customer";
      const phoneNumberId = val.metadata?.phone_number_id as string | undefined;
      const accountId = await resolveAccountIdFromWhatsApp(phoneNumberId);
      const parsed = await parseWhatsAppInboundMessage(message, senderName, accountId);

      if (!parsed) return NextResponse.json({ success: true, message: "No parseable content" });

      after(async () => {
        try {
          await processInboundWhatsAppMessage(parsed, { phoneNumberId });
        } catch (err) {
          console.error("[Meta/WA] background process failed:", err);
        }
      });

      return NextResponse.json({ success: true, queued: true });
    }

    // ── Instagram DM ──────────────────────────────────────────────────────────
    if (objectType === "instagram") {
      const parsed = parseInstagramInbound(body);
      if (!parsed) return NextResponse.json({ success: true });

      after(async () => {
        try {
          await processMetaChannelMessage({
            senderId: parsed.senderId,
            contactName: parsed.contactName,
            messageText: parsed.messageText,
            channel: "instagram",
            sendReply: async (text, accountId) => {
              const creds = await getInstagramCredentials(accountId);
              if (!creds) return false;
              const result = await sendInstagramReply(parsed.senderId, text, creds.pageAccessToken);
              return result.sent;
            },
          });
        } catch (err) {
          console.error("[Meta/IG] background process failed:", err);
        }
      });

      return NextResponse.json({ success: true, queued: true });
    }

    // ── Facebook Messenger ────────────────────────────────────────────────────
    if (objectType === "page") {
      const parsed = parseFacebookInbound(body);
      if (!parsed) return NextResponse.json({ success: true });

      after(async () => {
        try {
          await processMetaChannelMessage({
            senderId: parsed.senderId,
            contactName: parsed.contactName,
            messageText: parsed.messageText,
            channel: "facebook",
            sendReply: async (text, accountId) => {
              const creds = await getFacebookCredentials(accountId);
              if (!creds) return false;
              const result = await sendFacebookReply(parsed.senderId, text, creds.pageAccessToken);
              return result.sent;
            },
          });
        } catch (err) {
          console.error("[Meta/FB] background process failed:", err);
        }
      });

      return NextResponse.json({ success: true, queued: true });
    }

    return NextResponse.json({ success: true, message: "Unhandled object type" });
  } catch (error) {
    console.error("[Meta webhook] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── Shared processing for Instagram and Facebook ────────────────────────────
async function processMetaChannelMessage({
  senderId,
  contactName,
  messageText,
  channel,
  sendReply,
}: {
  senderId: string;
  contactName: string;
  messageText: string;
  channel: "instagram" | "facebook";
  sendReply: (text: string, accountId: string) => Promise<boolean>;
}) {
  // Use senderId as "phone" for non-WhatsApp channels
  const contactPhone = `${channel}:${senderId}`;

  // Find first account with this integration active
  const cred = await prisma.integrationCredential.findFirst({
    where: { type: channel, isActive: true },
    select: { accountId: true },
  });

  if (!cred) {
    console.warn(`[Meta/${channel}] No active credential found`);
    return;
  }

  const { accountId } = cred;
  const workspace = await prisma.workspace.findFirst({
    where: { accountId },
    orderBy: { createdAt: "desc" },
  });

  const conversation = await upsertInboxConversation({
    accountId,
    workspaceId: workspace?.id,
    contactPhone,
    contactName,
    channel,
  });

  await addInboxMessage({
    conversationId: conversation.id,
    direction: "inbound",
    body: messageText,
    source: "customer",
    incrementUnread: true,
  });

  if (!conversation.aiEnabled) return;

  const history = await getConversationHistory(conversation.id, 12);
  const reply = await generateConversationReply({
    accountId,
    workspaceId: workspace?.id,
    contactName,
    messageText,
    history,
  });

  const sent = await sendReply(reply, accountId);

  await addInboxMessage({
    conversationId: conversation.id,
    direction: "outbound",
    body: sent ? reply : `[Could not deliver via ${channel}] ${reply}`,
    source: sent ? "ai" : "system",
  });

  console.log(`[Meta/${channel}] replied to ${senderId}: ${reply.slice(0, 60)}`);
}
