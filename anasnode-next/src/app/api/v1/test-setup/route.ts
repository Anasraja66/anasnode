import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createWorkflowFromTemplate } from "@/lib/workflow/templates";
import { WorkflowExecutor } from "@/lib/workflow/executor";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("[INTEGRATION TEST] Initializing test-setup run...");

    // 1. Seed mock Account in SQLite
    const account = await prisma.account.upsert({
      where: { email: "tester@anaos.io" },
      update: {},
      create: {
        id: "acc-tester-123",
        email: "tester@anaos.io",
        name: "Q/A Integration Tester",
      }
    });

    // 2. Seed mock Workspace
    const workspace = await prisma.workspace.upsert({
      where: { id: "ws-tester-123" },
      update: {},
      create: {
        id: "ws-tester-123",
        accountId: account.id,
        name: "Test Medical Clinic",
        industry: "Clinic",
        slug: "test-medical-clinic",
        status: "live",
      }
    });

    // 3. Load and instantiate "Clinic Appointment Booker" template
    console.log("[INTEGRATION TEST] Loading clinic blueprint from templates...");
    const templateResult = await createWorkflowFromTemplate(
      "clinic-appointment",
      workspace.id,
      account.id,
      { name: "Live Clinic Booker", description: "Automated dental checkup scheduler" }
    );

    const workflowId = templateResult.workflow.id;

    // 4. Activate the workflow
    console.log("[INTEGRATION TEST] Activating workflow...");
    await prisma.workflow.update({
      where: { id: workflowId },
      data: { isActive: true },
    });

    // 5. Trigger end-to-end dry-run
    console.log("[INTEGRATION TEST] Executing dry-run with mock WhatsApp input...");
    const executor = new WorkflowExecutor();
    
    const triggerData = {
      contactId: "ct-anas-007",
      contactName: "Muhammad Anas Raja",
      contactPhone: "+92 300 7654321",
      message: "Hey! I want to book a teeth checkup appointment.",
    };

    await executor.execute(workflowId, triggerData);

    // 6. Fetch generated execution and logs
    const execution = await prisma.workflowExecution.findFirst({
      where: { workflowId },
      orderBy: { startedAt: "desc" },
    });

    if (!execution) {
      return NextResponse.json({
        success: false,
        error: "Execution was not successfully recorded in the SQLite database."
      });
    }

    const logsParsed = JSON.parse(execution.logs || "[]");
    const outputParsed = JSON.parse(execution.output || "{}");

    console.log(`[INTEGRATION TEST] Complete! Status: ${execution.status}, Logs count: ${logsParsed.length}`);

    return NextResponse.json({
      success: true,
      message: "Embedded Visual Workflow Engine validated successfully!",
      seeding: {
        accountId: account.id,
        workspaceId: workspace.id,
        workflowId,
      },
      execution: {
        id: execution.id,
        status: execution.status,
        durationMs: execution.duration,
        input: JSON.parse(execution.input || "{}"),
        output: outputParsed,
        logs: logsParsed,
      }
    });

  } catch (error: any) {
    console.error("[INTEGRATION TEST] Failed:", error);
    return NextResponse.json({
      success: false,
      error: error.message || String(error),
    }, { status: 500 });
  }
}
