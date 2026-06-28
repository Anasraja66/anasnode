import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAccountId } from "@/lib/auth/session";
import { sendMetaTextMessage } from "@/lib/whatsapp/meta";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accountId = await requireAccountId();

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { payloadOverride } = await req.json();

    const action = await prisma.pendingAction.findUnique({
      where: { id },
    });

    if (!action || action.accountId !== accountId) {
      return NextResponse.json({ success: false, error: "Action not found" }, { status: 404 });
    }

    // Execute the action based on type
    const payload = JSON.parse(action.payload);
    const bodyToSend = payloadOverride || payload.body;

    let success = false;
    if (action.channel === "whatsapp" && action.contactPhone) {
      if (action.actionType === "send_message" || action.actionType === "send_buttons") {
        // If it's buttons, bodyToSend could actually be the entire string including buttons.
        success = await sendMetaTextMessage(action.contactPhone, bodyToSend, action.accountId);
      }
    } else {
      // Simulate success for other channels for now
      console.log(`[APPROVAL EXECUTED] channel=${action.channel} to=${action.contactPhone} payload=${bodyToSend}`);
      success = true;
    }

    if (success) {
      await prisma.pendingAction.update({
        where: { id },
        data: { status: "approved" },
      });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Failed to execute action" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("POST /api/v1/pending-actions/[id]/approve error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
