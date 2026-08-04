import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { WorkflowEngine } from "@/lib/workflow/engine";

export async function GET() {
  console.log("🚀 Starting AnaOS Workflow Engine Test from API...");

  try {
    if (!prisma) return NextResponse.json({ error: "No DB" }, { status: 500 });

    let account = await prisma.account.findFirst();
    if (!account) {
      account = await prisma.account.create({
        data: { email: "test@anaos.ai", name: "Test Account" }
      });
    }

    let workspace = await prisma.workspace.findFirst({ where: { accountId: account.id } });
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { accountId: account.id, name: "Test Workspace", slug: "test-workspace", industry: "Other" }
      });
    }

    // Dummy Workflow Graph
    const nodes = [
      { id: "node-1", type: "trigger", data: { channel: "whatsapp" } },
      { id: "node-2", type: "ai_reply", data: { systemPrompt: "You are a helpful assistant." } },
      { 
        id: "node-3", 
        type: "activepieces_action", 
        data: { 
          pieceName: "piece-slack", 
          actionName: "send_channel_message", 
          propsValue: { 
            channel: "#general", 
            text: "Hello from AnaOS test workflow API route!" 
          } 
        } 
      }
    ];

    const edges = [
      { id: "edge-1", source: "node-1", target: "node-2" },
      { id: "edge-2", source: "node-2", target: "node-3" }
    ];

    const workflow = await prisma.workflow.create({
      data: {
        accountId: account.id,
        workspaceId: workspace.id,
        name: "API Test Workflow",
        isActive: true,
        nodes: JSON.stringify(nodes),
        edges: JSON.stringify(edges)
      }
    });

    const payload = { phone: "+1234567890", message: "Hi, test me!" };
    await WorkflowEngine.executeWorkflow(workflow.id, payload);

    const execution = await prisma.workflowExecution.findFirst({
      where: { workflowId: workflow.id },
      orderBy: { startedAt: 'desc' }
    });

    return NextResponse.json({
      status: execution?.status,
      logs: JSON.parse(execution?.logs || "[]"),
      output: JSON.parse(execution?.output || "{}")
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
