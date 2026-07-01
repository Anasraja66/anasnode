import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendTwilioMessage } from "@/lib/whatsapp/twilio";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { conversationId, body } = await request.json();

    if (!conversationId || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conversation = await prisma.inboxConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // 1. Send via Twilio
    try {
      await sendTwilioMessage(conversation.contactPhone, body, conversation.channel === "whatsapp");
    } catch (apiError: any) {
      console.error("Failed to send message via Twilio:", apiError);
      return NextResponse.json({ error: `Failed to send message: ${apiError.message}` }, { status: 502 });
    }

    // 2. Save to Database
    const message = await prisma.inboxMessage.create({
      data: {
        conversationId,
        direction: "outbound",
        body,
        source: "agent",
      },
    });

    // 3. Update Conversation last message
    await prisma.inboxConversation.update({
      where: { id: conversationId },
      data: {
        lastMessage: body,
        lastMessageAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Inbox send error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
