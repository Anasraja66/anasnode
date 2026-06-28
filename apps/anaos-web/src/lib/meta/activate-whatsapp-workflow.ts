import { prisma } from "@/lib/db";
import { NodeType, type WorkflowNode } from "@/lib/workflow/types";

export async function activateDefaultWhatsAppWorkflow(
  accountId: string
): Promise<string | null> {
  const workflows = await prisma.workflow.findMany({
    where: { accountId },
    orderBy: { updatedAt: "desc" },
  });

  for (const wf of workflows) {
    let nodes: WorkflowNode[] = [];
    try {
      nodes = JSON.parse(wf.nodes || "[]");
    } catch {
      continue;
    }
    if (!nodes.some((n) => n.type === NodeType.TRIGGER_WHATSAPP)) continue;

    await prisma.workflow.update({
      where: { id: wf.id },
      data: { isActive: true },
    });
    return wf.id;
  }

  return null;
}
