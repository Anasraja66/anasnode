import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { WorkflowExecutor } from "@/lib/workflow/executor";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mockAccountId = "acc-default-user";
    const body = await request.json();
    const { testInput = {} } = body;

    const workflow = await prisma.workflow.findFirst({
      where: { id, accountId: mockAccountId },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    // Initialize triggers mock params if empty
    const triggerData = {
      contactId: "test-contact-123",
      contactName: "Muhammad Anas",
      contactPhone: "+92 300 1234567",
      message: "I want to schedule an appointment for my clinic visit.",
      ...testInput
    };

    console.log(`[TEST DRY-RUN] Starting dry-run for workflow: ${workflow.name} (id: ${id})`);
    
    // Create executor instance and run
    const executor = new WorkflowExecutor();
    await executor.execute(id, triggerData);

    // Fetch the latest execution generated for verification
    const latestExecution = await prisma.workflowExecution.findFirst({
      where: { workflowId: id },
      orderBy: { startedAt: "desc" },
    });

    if (!latestExecution) {
      return NextResponse.json({ success: false, error: "Execution failed to generate run log." });
    }

    return NextResponse.json({
      success: true,
      execution: {
        id: latestExecution.id,
        status: latestExecution.status,
        input: JSON.parse(latestExecution.input || "{}"),
        output: JSON.parse(latestExecution.output || "{}"),
        logs: JSON.parse(latestExecution.logs || "[]"),
        startedAt: latestExecution.startedAt,
        finishedAt: latestExecution.finishedAt,
        duration: latestExecution.duration,
      }
    });

  } catch (error: any) {
    console.error("Workflow dry-run test error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
