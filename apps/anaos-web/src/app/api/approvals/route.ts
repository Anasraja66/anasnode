import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendMetaTextMessage } from "@/lib/whatsapp/meta";
import { sendTwilioMessage } from "@/lib/messaging/twilio";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");
    
    if (!accountId) return NextResponse.json({ error: "Missing accountId" }, { status: 400 });

    const approvals = await prisma.pendingAction.findMany({
      where: { accountId, status: "pending" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ approvals });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, action, accountId } = await req.json();

    if (!id || !action || !accountId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pending = await prisma.pendingAction.findUnique({ where: { id } });
    if (!pending || pending.accountId !== accountId) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    if (action === "reject") {
      await prisma.pendingAction.update({
        where: { id },
        data: { status: "rejected" }
      });
      return NextResponse.json({ success: true, status: "rejected" });
    }

    if (action === "approve") {
      // Execute the actual action based on channel and payload
      let payload;
      try {
         payload = JSON.parse(pending.payload || "{}");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch(e) {
         payload = {};
      }
      
      let sent = false;

      if (pending.channel === "whatsapp" && pending.actionType === "send_message") {
        sent = await sendMetaTextMessage(pending.contactPhone!, payload.body, accountId);
      } else if (pending.channel === "whatsapp" && pending.actionType === "send_buttons") {
        sent = await sendMetaTextMessage(pending.contactPhone!, payload.body, accountId); // Fallback to text for now
      } else if (pending.channel === "sms") {
        sent = await sendTwilioMessage(pending.contactPhone!, payload.body, accountId);
      } else if (pending.channel === "voice") {
        const { dispatchVapiCall } = await import("@/lib/voice/vapi");
        const { deductCredits } = await import("@/lib/billing/credits");
        await deductCredits(accountId, 15, "voice_call_minute", "Vapi.ai outbound call (Approved)");
        
        const res = await dispatchVapiCall({
          phoneNumberId: process.env.VAPI_PHONE_ID || "",
          customerNumber: pending.contactPhone!,
          assistantPrompt: payload.prompt,
          firstMessage: payload.firstMessage
        });
        sent = !!res.callId;
      }

      // Update status
      await prisma.pendingAction.update({
        where: { id },
        data: { status: sent ? "approved" : "failed" }
      });

      return NextResponse.json({ success: sent, status: sent ? "approved" : "failed" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Approval error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
