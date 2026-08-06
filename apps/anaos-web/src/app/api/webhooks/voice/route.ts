/**
 * POST /api/webhooks/voice
 *
 * Vapi.ai sends events to this URL during and after AI phone calls.
 * We handle three event types:
 *
 *   1. "tool-calls"        — AI wants to call a function (e.g. book_appointment)
 *   2. "end-of-call-report" — Call finished: save transcript, deduct credits
 *   3. Everything else     — Acknowledge and ignore
 *
 * All tool call results must be returned in the same HTTP response
 * (Vapi waits for us before continuing the call).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deductCredits } from "@/lib/billing/credits";

export const dynamic = "force-dynamic";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ToolCall {
  id: string;
  function: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arguments: Record<string, any>;
  };
}

interface VapiMessage {
  type: string;
  toolCalls?: ToolCall[];
  summary?: string;
  transcript?: string;
  call?: {
    id?: string;
    durationSeconds?: number;
    customer?: {
      number?: string;
      identifier?: string;
    };
  };
}

interface ToolResult {
  toolCallId: string;
  result: string;
}

// ── Tool Call Handlers ────────────────────────────────────────────────────────

/**
 * Book an appointment for a contact and save it to the database.
 * The AI calls this during a voice call when the customer wants to book.
 */
async function handleBookAppointment(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: Record<string, any>,
  customerPhone: string
): Promise<string> {
  const title = args.title || args.service || "Appointment";
  const startAt = args.time || args.startTime || args.datetime;
  const notes = args.notes || args.reason || "";

  if (!startAt) {
    return "I could not book the appointment because no time was provided. Please try again.";
  }

  // Parse the date — AI sometimes sends natural language, sometimes ISO
  let startDate: Date;
  try {
    startDate = new Date(startAt);
    if (isNaN(startDate.getTime())) throw new Error("invalid date");
  } catch {
    return `Could not parse the time "${startAt}". Please ask the customer to confirm a specific date and time.`;
  }

  // End time defaults to 1 hour after start
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  // Find the account that owns this conversation
  const conversation = await prisma.inboxConversation.findFirst({
    where: { contactPhone: customerPhone },
    select: { accountId: true, contactName: true },
  });

  if (!conversation) {
    return `Appointment noted for ${startDate.toDateString()}, but I could not save it to the system. Our team will follow up.`;
  }

  // Save booking to DB
  const booking = await prisma.bookingEvent.create({
    data: {
      accountId: conversation.accountId,
      contactPhone: customerPhone,
      contactName: conversation.contactName || "Customer",
      title,
      startAt: startDate,
      endAt: endDate,
      notes,
      channel: "voice",
      status: "confirmed",
    },
  });

  console.log(`[Voice] Booking created: ${booking.id} for ${customerPhone} at ${startDate.toISOString()}`);

  return `Appointment confirmed! "${title}" has been booked for ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString()}. A confirmation will be sent shortly.`;
}

/**
 * Check available slots (basic implementation — returns next 3 days).
 * In production this would query a real calendar.
 */
async function handleCheckAvailability(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: Record<string, any>
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const date = args.date || args.preferredDate;

  // For now we return a simple message — connect to Google Calendar for real slots
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const day2 = new Date();
  day2.setDate(day2.getDate() + 2);

  return [
    `Here are our available slots:`,
    `- ${tomorrow.toDateString()}: 10:00 AM, 2:00 PM, 4:00 PM`,
    `- ${day2.toDateString()}: 9:00 AM, 11:00 AM, 3:00 PM`,
    `Which time works best for you?`,
  ].join(" ");
}

/** Dispatch a tool call to the right handler function */
async function dispatchToolCall(
  call: ToolCall,
  customerPhone: string
): Promise<ToolResult> {
  const name = call.function.name;
  const args = call.function.arguments;

  console.log(`[Voice] Tool call: ${name}`, args);

  let result: string;

  if (name === "book_appointment") {
    result = await handleBookAppointment(args, customerPhone);
  } else if (name === "check_availability") {
    result = await handleCheckAvailability(args);
  } else {
    console.warn(`[Voice] Unknown tool: ${name}`);
    result = `The function "${name}" is not available right now. Please have our team follow up.`;
  }

  return { toolCallId: call.id, result };
}

// ── End of Call Handler ───────────────────────────────────────────────────────

/**
 * Called when a Vapi call ends.
 * Saves the transcript to the inbox and deducts credits.
 */
async function handleEndOfCall(message: VapiMessage): Promise<void> {
  const summary = message.summary || "No summary provided.";
  const transcript = message.transcript || "";
  const customerPhone = (
    message.call?.customer?.number ||
    message.call?.customer?.identifier ||
    ""
  ).replace("+", "");
  const durationSeconds = message.call?.durationSeconds || 60;
  const callId = message.call?.id || "";

  // Calculate cost: 10 credits per minute, minimum 1 minute
  const callMinutes = Math.max(1, Math.ceil(durationSeconds / 60));
  const creditCost = callMinutes * 10;

  console.log(`[Voice] Call ended — phone=${customerPhone} duration=${durationSeconds}s credits=${creditCost}`);

  if (!customerPhone) {
    console.warn("[Voice] No customer phone in end-of-call report");
    return;
  }

  // Find the conversation for this customer
  const conversation = await prisma.inboxConversation.findFirst({
    where: { contactPhone: customerPhone },
  });

  if (!conversation) {
    console.warn(`[Voice] No conversation for phone: ${customerPhone}`);
    return;
  }

  const accountId = conversation.accountId;

  // Deduct credits for the call duration
  try {
    await deductCredits(
      accountId,
      creditCost,
      "voice_call_minute",
      `AI call (${callMinutes} min)`,
      callId
    );
  } catch (err) {
    console.error("[Voice] Credit deduction failed:", err);
    // Do not throw — still save the transcript
  }

  // Save call summary to inbox
  const transcriptPreview = transcript.slice(0, 400);
  const messageBody = [
    `📞 **Call Ended** (${callMinutes} min)`,
    ``,
    `**Summary:** ${summary}`,
    transcriptPreview ? `\n**Transcript:**\n${transcriptPreview}...` : "",
  ].join("\n");

  await prisma.inboxMessage.create({
    data: {
      conversationId: conversation.id,
      direction: "inbound",
      source: "voice",
      body: messageBody,
    },
  });

  // Mark conversation as having new unread message
  await prisma.inboxConversation.update({
    where: { id: conversation.id },
    data: {
      lastMessage: `📞 Call ended (${callMinutes} min)`,
      lastMessageAt: new Date(),
      unreadCount: { increment: 1 },
    },
  });
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload = await request.json();
    const message: VapiMessage = payload.message;

    if (!message) {
      return NextResponse.json({ error: "No message in payload" }, { status: 400 });
    }

    // Extract customer phone from top-level or nested in call
    const customerPhone = (
      payload.call?.customer?.number ||
      message.call?.customer?.number ||
      ""
    ).replace("+", "");

    // Handle tool calls (AI wants to call a function during the call)
    if (message.type === "tool-calls") {
      const toolCalls: ToolCall[] = message.toolCalls || [];

      const results = await Promise.all(
        toolCalls.map((call) => dispatchToolCall(call, customerPhone))
      );

      // Must return results in this exact format for Vapi to continue the call
      return NextResponse.json({ results });
    }

    // Handle end of call (save transcript, deduct credits)
    if (message.type === "end-of-call-report") {
      await handleEndOfCall(message);
      return NextResponse.json({ success: true });
    }

    // All other message types (status updates, etc.) — just acknowledge
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Voice] Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
