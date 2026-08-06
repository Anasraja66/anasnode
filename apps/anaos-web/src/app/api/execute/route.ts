import { NextResponse } from "next/server";
import { workflowEngine } from "@/lib/execution/WorkflowEngine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { workflowId, nodes, edges, payload } = body;

    if (!nodes || !edges) {
      return NextResponse.json({ error: "Missing nodes or edges" }, { status: 400 });
    }

    const context = {
      workflowId: workflowId || "test-workflow",
      triggerPayload: payload || {},
      variables: {},
      logs: []
    };

    // Execute the workflow
    const result = await workflowEngine.execute(nodes, edges, context);

    return NextResponse.json({
      success: result.success,
      logs: result.logs,
      variables: result.variables
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[ExecutionAPI] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute workflow" },
      { status: 500 }
    );
  }
}
