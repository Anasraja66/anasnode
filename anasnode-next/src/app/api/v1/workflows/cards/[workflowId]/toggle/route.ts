import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { WorkflowNode } from "@/lib/workflow/types";
import { getAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  try {
    const { workflowId } = await params;
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workflow = await prisma.workflow.findFirst({
      where: { id: workflowId, accountId },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const nextActiveState = !workflow.isActive;

    if (nextActiveState) {
      // Validate triggers and actions before allowing turn-on
      const nodes: WorkflowNode[] = JSON.parse(workflow.nodes || "[]");
      const triggers = nodes.filter(n => n.type.startsWith("trigger_"));
      const actions = nodes.filter(n => !n.type.startsWith("trigger_"));

      if (triggers.length === 0 || actions.length === 0) {
        return NextResponse.json({
          success: false,
          message: "Cannot activate: Canvas is incomplete. Make sure you have both triggers and actions configured in developer mode.",
        });
      }
    }

    // Toggle
    const updated = await prisma.workflow.update({
      where: { id: workflowId },
      data: { isActive: nextActiveState },
    });

    return NextResponse.json({
      success: true,
      isActive: updated.isActive,
      message: `Workflow state updated to ${updated.isActive ? "active" : "inactive"}.`,
    });
  } catch (error) {
    console.error("Toggle workflow card error:", error);
    return NextResponse.json({ error: "Failed to toggle workflow status" }, { status: 500 });
  }
}
