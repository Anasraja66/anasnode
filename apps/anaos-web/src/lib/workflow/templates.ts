import { prisma } from "../db";
import { TEMPLATES } from "./template-data";
export { TEMPLATES } from "./template-data";

export async function createWorkflowFromTemplate(
  templateId: string,
  workspaceId: string,
  accountId: string,
  overrides?: { name?: string; description?: string }
) {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template with id ${templateId} not found`);
  }
  
  const definition = JSON.stringify({ nodes: template.nodes, edges: template.edges });
  
  const workflow = await prisma.workflow.create({
    data: {
      name: overrides?.name || template.name,
      description: overrides?.description || template.description,
      workspaceId,
      accountId,
      isActive: false,
      definition,
    },
  });
  
  return { success: true, workflow };
}
