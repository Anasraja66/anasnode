import { NextRequest, NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { PendingActionService } from "@/lib/services/pending-action.service";
import { sendMetaTextMessage } from "@/lib/whatsapp/meta";
import { handleApiError } from "@/lib/errors";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accountId = await requireAccountId();
    const { id } = await params;
    const { payloadOverride } = await req.json();

    const action = await PendingActionService.getById(accountId, id);
    const payload = JSON.parse(action.payload);
    const bodyToSend = payloadOverride || payload.body;

    let success = false;
    if (action.channel === "whatsapp" && action.contactPhone) {
      if (action.actionType === "send_message" || action.actionType === "send_buttons") {
        success = await sendMetaTextMessage(action.contactPhone, bodyToSend, action.accountId);
      }
    } else {
      console.log(`[APPROVAL EXECUTED] channel=${action.channel} to=${action.contactPhone} payload=${bodyToSend}`);
      success = true;
    }

    if (success) {
      await PendingActionService.approve(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Failed to execute action" }, { status: 500 });
  } catch (error: any) {
    console.error("POST /api/v1/pending-actions/[id]/approve error:", error);
    return handleApiError(error);
  }
}
