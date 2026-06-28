import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { WorkflowNode } from "@/lib/workflow/types";
import { getAccountId } from "@/lib/auth/session";

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

    const workflow = await prisma.workflow.findFirst({
      where: { id, accountId },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const nodes: WorkflowNode[] = JSON.parse(workflow.nodes || "[]");

    // VALIDATION: At least one trigger and one action node
    const triggers = nodes.filter(n => n.type.startsWith("trigger_"));
    const actions = nodes.filter(n => !n.type.startsWith("trigger_"));

    if (triggers.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Activation failed: Workflow must have at least one Trigger node (e.g. WhatsApp Trigger).",
      });
    }

    if (actions.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Activation failed: Workflow must have at least one Action node (e.g. Send WhatsApp or AI Respond).",
      });
    }

    // Activate
    const updated = await prisma.workflow.update({
      where: { id },
      data: { isActive: true },
    });

    return NextResponse.json({
      success: true,
      isActive: true,
      message: `Workflow "${updated.name}" is now live!`,
    });
  } catch (error: any) {
    console.error("Workflow activation error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
