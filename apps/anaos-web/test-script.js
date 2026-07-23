const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const accountId = "some-account-id"; // We don't have a specific accountId, so we will just query one
    const w = await prisma.workspace.findFirst();
    if (!w) {
      console.log("No workspaces found");
      return;
    }
    console.log("Found workspace:", w);

    const dbWorkflows = await prisma.workflow.findMany({
      where: { workspaceId: w.id },
      orderBy: { createdAt: "desc" },
    });

    for (const wf of dbWorkflows) {
      console.log("Workflow:", wf.id);
      let nodes = [];
      try {
        nodes = JSON.parse(wf.nodes || "[]");
      } catch (e) {
        console.error("Error parsing nodes for wf", wf.id, e);
      }
    }
    console.log("Done");
  } catch(e) {
    console.error("Crash:", e);
  }
}
test();
