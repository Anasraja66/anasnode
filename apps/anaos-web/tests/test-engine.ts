import { prisma } from "../src/lib/db";
import { WorkflowEngine } from "../src/lib/workflow/engine";

async function runTest() {
  console.log("🚀 Starting AnaOS Workflow Engine Test...");

  try {
    // 1. Setup a test Account & Workspace if not exists
    let account = await prisma.account.findFirst();
    if (!account) {
      account = await prisma.account.create({
        data: { email: "test@anaos.ai", name: "Test Account" }
      });
      console.log("Created Test Account:", account.id);
    }

    let workspace = await prisma.workspace.findFirst({ where: { accountId: account.id } });
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { accountId: account.id, name: "Test Workspace", slug: "test-workspace", industry: "Other" }
      });
      console.log("Created Test Workspace:", workspace.id);
    }

    // 2. Define a Dummy Workflow Graph
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
            text: "Hello from AnaOS test workflow!" 
          } 
        } 
      }
    ];

    const edges = [
      { id: "edge-1", source: "node-1", target: "node-2" },
      { id: "edge-2", source: "node-2", target: "node-3" }
    ];

    // 3. Create the Workflow in DB
    const workflow = await prisma.workflow.create({
      data: {
        accountId: account.id,
        workspaceId: workspace.id,
        name: "Test Slack & AI Workflow",
        isActive: true,
        nodes: JSON.stringify(nodes),
        edges: JSON.stringify(edges)
      }
    });
    console.log("Created Test Workflow:", workflow.id);

    // 4. Execute the Workflow with a fake WhatsApp incoming message event!
    console.log("⚡ Triggering Workflow...");
    const payload = { phone: "+1234567890", message: "Hi, I need help!" };
    await WorkflowEngine.executeWorkflow(workflow.id, payload);

    // 5. Fetch Execution Logs
    const execution = await prisma.workflowExecution.findFirst({
      where: { workflowId: workflow.id },
      orderBy: { startedAt: 'desc' }
    });

    console.log("\n✅ Execution Completed!");
    console.log("Status:", execution?.status);
    console.log("Logs:", JSON.parse(execution?.logs || "[]").join("\n"));
    console.log("Output Variables:", JSON.parse(execution?.output || "{}"));

  } catch (error) {
    console.error("Test Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
