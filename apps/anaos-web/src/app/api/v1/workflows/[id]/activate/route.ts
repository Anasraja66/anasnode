import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import { WorkflowService } from "@/lib/services/workflow.service";
import { handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workflow = await WorkflowService.activate(accountId, id);

    return NextResponse.json({
      success: true,
      isActive: workflow.isActive,
      message: `Workflow "${workflow.name}" is now live!`,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Workflow activation error:", error);
    return handleApiError(error);
  }
}
