import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log("[VOICE_WEBHOOK] Received payload:", JSON.stringify(payload, null, 2));

    // Vapi sends different types of messages to the webhook URL.
    const message = payload.message;

    if (!message) {
      return NextResponse.json({ error: "No message found in payload" }, { status: 400 });
    }

    // 1. Handle Vapi Tool Calls (Functions like booking an appointment)
    if (message.type === "tool-calls") {
      const toolCalls = message.toolCalls || [];
      const toolResponses = [];

      for (const call of toolCalls) {
        const functionName = call.function?.name;
        const args = call.function?.arguments;

        console.log(`[VOICE_WEBHOOK] Tool call requested: ${functionName}`, args);

        if (functionName === "book_appointment") {
          // TODO: Actually book in database
          toolResponses.push({
            toolCallId: call.id,
            result: "Appointment successfully booked for " + (args.time || "the requested time"),
          });
        } else if (functionName === "check_availability") {
          toolResponses.push({
            toolCallId: call.id,
            result: "Available slots: 2 PM, 4 PM tomorrow.",
          });
        } else {
          toolResponses.push({
            toolCallId: call.id,
            result: "Function not found or not supported.",
          });
        }
      }

      return NextResponse.json({
        results: toolResponses,
      });
    }

    // 2. Handle End of Call Report (Post-Call Automations)
    if (message.type === "end-of-call-report") {
      const summary = message.summary || "No summary provided.";
      const transcript = message.transcript || "";
      const customerNumber = message.call?.customer?.number || message.call?.customer?.identifier;
      const durationSeconds = message.call?.durationSeconds || 60;
      const callDurationMinutes = Math.ceil(durationSeconds / 60);

      console.log(`[VOICE_WEBHOOK] Call ended. Summary: ${summary}`);

      if (customerNumber) {
        // Find the conversation to associate this call
        let conv = await prisma.inboxConversation.findFirst({
          where: { contactPhone: customerNumber }
        });

        if (conv) {
          const accountId = conv.accountId;

          // Deduct Credits dynamically based on duration (10 credits / minute)
          try {
            const { deductCredits } = await import("@/lib/billing/credits");
            await deductCredits(accountId, 10 * callDurationMinutes, "voice_call_minute", `Vapi.ai inbound/outbound call (${callDurationMinutes}m)`, message.call?.id);
          } catch (e) {
            console.error("[VOICE_WEBHOOK] Failed to deduct credits", e);
          }

          // If the conversation isn't a voice channel, let's just log it in the existing WhatsApp/primary channel conversation
          // Save summary to Inbox
          await prisma.inboxMessage.create({
            data: {
              conversationId: conv.id,
              direction: "inbound",
              source: "voice",
              body: `📞 **Call Ended (${callDurationMinutes} min)**\n\n**Summary:**\n${summary}\n\n**Transcript Preview:**\n${transcript.substring(0, 300)}...`
            }
          });
          
          await prisma.inboxConversation.update({
            where: { id: conv.id },
            data: { lastMessageAt: new Date(), unreadCount: { increment: 1 } }
          });
        }
      }

      return NextResponse.json({ success: true });
    }

    // 3. Fallback for other message types (status updates, etc.)
    return NextResponse.json({ success: true, message: "Acknowledged" });
    
  } catch (error) {
    console.error("[VOICE_WEBHOOK_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
