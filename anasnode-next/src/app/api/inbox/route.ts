import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { addInboxMessage } from "@/lib/inbox/store";
import { parseTagsJson, tagsToJson } from "@/lib/inbox/tags";
import { parseCustomFieldsJson } from "@/lib/contacts/profile";
import { sendMetaTextMessage } from "@/lib/whatsapp/meta";

export const dynamic = "force-dynamic";

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function mapConversation(c: {
  id: string;
  contactName: string;
  contactPhone: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  customFields: string;
  channel: string;
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  tags: string;
  optedOut: boolean;
  aiEnabled: boolean;
  lastInboundAt: Date | null;
}) {
  return {
    id: c.id,
    contactName: c.contactName,
    contactPhone: c.contactPhone,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    gender: c.gender,
    customFields: parseCustomFieldsJson(c.customFields),
    channel: c.channel,
    lastMessage: c.lastMessage,
    lastMessageAt: c.lastMessageAt,
    unreadCount: c.unreadCount,
    tags: parseTagsJson(c.tags),
    optedOut: c.optedOut,
    aiEnabled: c.aiEnabled,
    timeLabel: formatRelative(c.lastMessageAt),
    lastInboundAt: c.lastInboundAt?.toISOString() ?? null,
  };
}

export async function GET(request: Request) {
  try {
    const accountId = await requireAccountId();
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const q = searchParams.get("q")?.trim().toLowerCase();
    const unreadOnly = searchParams.get("unread") === "1";

    if (conversationId) {
      const conversation = await prisma.inboxConversation.findFirst({
        where: { id: conversationId, accountId },
      });
      if (!conversation) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      const messages = await prisma.inboxMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        take: 200,
      });

      await prisma.inboxConversation.update({
        where: { id: conversationId },
        data: { unreadCount: 0 },
      });

      return NextResponse.json({
        success: true,
        conversation: mapConversation(conversation),
        messages,
      });
    }

    const conversations = await prisma.inboxConversation.findMany({
      where: {
        accountId,
        ...(unreadOnly ? { unreadCount: { gt: 0 } } : {}),
        ...(q
          ? {
              OR: [
                { contactName: { contains: q } },
                { contactPhone: { contains: q } },
                { lastMessage: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: { lastMessageAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      conversations: conversations.map(mapConversation),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("inbox GET:", error);
    return NextResponse.json({ error: "Failed to load inbox" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const accountId = await requireAccountId();
    const body = await request.json();
    const conversationId = String(body.conversationId || "");
    if (!conversationId) {
      return NextResponse.json({ error: "conversationId required" }, { status: 400 });
    }

    const existing = await prisma.inboxConversation.findFirst({
      where: { id: conversationId, accountId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data: {
      aiEnabled?: boolean;
      unreadCount?: number;
      contactName?: string;
      tags?: string;
      optedOut?: boolean;
    } = {};

    if (body.aiEnabled !== undefined) data.aiEnabled = Boolean(body.aiEnabled);
    if (body.markUnread === true) data.unreadCount = (existing.unreadCount || 0) + 1;
    if (body.markRead === true) data.unreadCount = 0;
    if (body.contactName !== undefined) data.contactName = String(body.contactName).slice(0, 120);
    if (body.tags !== undefined) {
      const tags = Array.isArray(body.tags)
        ? body.tags
        : String(body.tags).split(",").map((t: string) => t.trim());
      data.tags = tagsToJson(tags.map(String));
    }
    if (body.optedOut !== undefined) data.optedOut = Boolean(body.optedOut);

    const conversation = await prisma.inboxConversation.update({
      where: { id: conversationId },
      data,
    });

    return NextResponse.json({
      success: true,
      conversation: mapConversation(conversation),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const accountId = await requireAccountId();
    const body = await request.json();
    const conversationId = String(body.conversationId || "");
    const text = String(body.text || "").trim();

    if (!conversationId || !text) {
      return NextResponse.json({ error: "conversationId and text required" }, { status: 400 });
    }

    const conversation = await prisma.inboxConversation.findFirst({
      where: { id: conversationId, accountId },
    });
    if (!conversation) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const sent = await sendMetaTextMessage(
      conversation.contactPhone,
      text,
      accountId
    );

    await addInboxMessage({
      conversationId,
      direction: "outbound",
      body: sent ? text : `[Not delivered] ${text}`,
      source: sent ? "agent" : "system",
    });

    return NextResponse.json({ success: true, sent });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("inbox POST:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
