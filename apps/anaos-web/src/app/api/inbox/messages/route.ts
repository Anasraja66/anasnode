import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });
    }

    const messages = await prisma.inboxMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 100, // Load last 100 messages
    });

    // Mark as read
    await prisma.inboxConversation.update({
      where: { id: conversationId },
      data: { unreadCount: 0 }
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Inbox messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
