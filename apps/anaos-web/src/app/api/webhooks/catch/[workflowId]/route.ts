import { NextResponse } from "next/server";
import { WorkflowEngine } from "@/lib/workflow/engine/executor";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  try {
    const { workflowId } = await params;
    
    let bodyData: any = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      bodyData = await request.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text();
      const searchParams = new URLSearchParams(text);
      for (const [key, value] of searchParams.entries()) {
        bodyData[key] = value;
      }
    } else {
      bodyData = { text: await request.text() };
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    if (!workflow.isActive) {
      return NextResponse.json({ error: "Workflow is disabled" }, { status: 400 });
    }

    console.log(`[Universal Webhook] Triggering workflow ${workflowId} with payload:`, bodyData);

    const engine = new WorkflowEngine(workflowId, workflow.accountId);
    
    // Pass the incoming payload as trigger context so variables like {{$json.myVar}} can resolve
    engine.run(bodyData).catch(err => {
      console.error(`Workflow ${workflowId} execution failed from webhook:`, err);
    });

    return NextResponse.json({ 
      success: true, 
      message: "Workflow execution started",
      workflowId
    });
  } catch (error: any) {
    console.error("Universal Webhook Catch Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
