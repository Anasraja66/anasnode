import { NextRequest, NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { PendingActionService } from "@/lib/services/pending-action.service";
import { handleApiError } from "@/lib/errors";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accountId = await requireAccountId();
    const { id } = await params;

    await PendingActionService.getById(accountId, id);
    await PendingActionService.reject(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/v1/pending-actions/[id]/reject error:", error);
    return handleApiError(error);
  }
}
