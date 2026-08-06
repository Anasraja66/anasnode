import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Auth check should go here in real app.
    // We assume the user has access.

    // Check if workflow exists
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      select: { id: true, name: true }
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    // Fetch executions ordered by most recent first
    const executions = await prisma.workflowExecution.findMany({
      where: { workflowId: id },
      orderBy: { startedAt: 'desc' },
      take: 50 // last 50 runs for MVP
    });

    return NextResponse.json({
      success: true,
      workflow,
      executions
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Failed to fetch workflow logs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
