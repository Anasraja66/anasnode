import { NextRequest, NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { PendingActionService } from "@/lib/services/pending-action.service";
import { handleApiError } from "@/lib/errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const accountId = await requireAccountId();
    const actions = await PendingActionService.list(accountId);
    return NextResponse.json({ success: true, actions });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("GET /api/v1/pending-actions error:", error);
    return handleApiError(error);
  }
}
