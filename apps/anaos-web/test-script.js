const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getRequiredIntegrations(nodes) {
  const reqs = new Set();
  for (const n of nodes) {
    const type = n.type;
    if (
      type === "trigger_whatsapp" ||
      type === "send_whatsapp" ||
      type === "send_whatsapp_buttons" ||
      type === "send_whatsapp_list"
    ) {
      reqs.add("whatsapp");
    }
    if (type === "trigger_instagram" || type === "send_instagram_dm") {
      reqs.add("instagram");
    }
    if (type === "trigger_shopify" || type === "shopify_order") {
      reqs.add("shopify");
    }
    if (type === "google_calendar") {
      reqs.add("google_calendar");
    }
    if (type === "send_email") {
      reqs.add("smtp");
    }
  }
  if (reqs.size === 0) {
    reqs.add("whatsapp");
  }
  return Array.from(reqs);
}

async function test() {
  try {
    const w = await prisma.workspace.findFirst();
    if (!w) return;

    const dbWorkflows = await prisma.workflow.findMany({
      where: { workspaceId: w.id },
      orderBy: { createdAt: "desc" },
    });

    for (const wf of dbWorkflows) {
      console.log("Processing wf:", wf.id);
      let nodes = [];
      let edges = [];
      try {
        if (wf.definition) {
          const def = JSON.parse(wf.definition);
          nodes = Array.isArray(def?.nodes) ? def.nodes : [];
          edges = Array.isArray(def?.edges) ? def.edges : [];
        } else {
          const parsedNodes = JSON.parse(wf.nodes || "[]");
          nodes = Array.isArray(parsedNodes) ? parsedNodes : [];
        }
      } catch (e) {
         console.log("Parse error", e.message);
      }
      getRequiredIntegrations(nodes);
    }
    
    console.log("Success! No crash on workflows.");
  } catch(e) {
    console.error("Crash:", e);
  } finally {
    await prisma.$disconnect();
  }
}
test();
