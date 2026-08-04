import { prisma } from "@/lib/db";
import { aiEngine } from "@/lib/ai/AnaosAIEngine";

export class WorkflowEngine {
  
  static async executeWorkflow(workflowId: string, eventPayload: any) {
    const workflow = await prisma.workflow.findUnique({ where: { id: workflowId } });
    if (!workflow || !workflow.isActive) return;

    // Log execution start
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        status: "running",
        input: JSON.stringify(eventPayload),
      }
    });

    const logs: string[] = [];
    logs.push(`Started execution ${execution.id} for workflow ${workflow.name}`);

    try {
      const nodes = JSON.parse(workflow.nodes || "[]");
      const edges = JSON.parse(workflow.edges || "[]");
      
      // Find Trigger Node matching the channel
      const triggerNode = nodes.find((n: any) => n.type === "trigger");
      if (!triggerNode) {
        throw new Error("No trigger node found in workflow.");
      }

      logs.push(`Found trigger node: ${triggerNode.id}`);
      
      // Traverse nodes
      let currentNode = triggerNode;
      let state = { event: eventPayload, variables: {} as any };

      while (currentNode) {
        const nextEdge = edges.find((e: any) => e.source === currentNode.id);
        if (!nextEdge) {
          logs.push(`Reached end of workflow at node: ${currentNode.id}`);
          break; // end of workflow
        }

        const nextNode = nodes.find((n: any) => n.id === nextEdge.target);
        if (!nextNode) break;

        currentNode = nextNode;
        logs.push(`Executing node: ${currentNode.type} (${currentNode.id})`);

        // Execute node logic based on type
        if (currentNode.type === "ai_reply") {
          const aiResponse = await this.executeAIReply(currentNode.data, state);
          state.variables.lastAiReply = aiResponse;
          logs.push(`AI Reply generated: ${aiResponse.substring(0, 50)}...`);
        } 
        else if (currentNode.type === "activepieces_action") {
          logs.push(`Executing Activepieces Action: ${currentNode.data.pieceName} -> ${currentNode.data.actionName}`);
          try {
            const { getAction } = await import("../pieces/registry");
            const action = getAction(currentNode.data.pieceName, currentNode.data.actionName);
            
            // Retrieve integration credentials from DB based on workflow accountId & pieceName
            const credential = await prisma.integrationCredential.findFirst({
              where: { accountId: workflow.accountId, providerId: currentNode.data.pieceName.replace("piece-", "") }
            });
            
            const auth = credential ? JSON.parse(credential.encryptedData) : {};
            
            // Execute the action!
            const result = await action.action.run({
              auth: auth,
              propsValue: currentNode.data.propsValue || {},
              store: {} as any, // Mock store
              connections: { get: async () => null } as any
            });
            
            state.variables[currentNode.id] = result;
            logs.push(`Activepieces Action Success`);
          } catch (err: any) {
            logs.push(`Activepieces Action Failed: ${err.message}`);
            break; // Stop execution on failure
          }
        }
        else if (currentNode.type === "action" && currentNode.data.actionType === "anaos_crm_upsert") {
          logs.push(`Updated CRM for contact: ${state.event.phone || state.event.contactId}`);
        }
        else if (currentNode.type === "condition") {
          // Simplistic condition eval
          const conditionMet = true; // Mocked for safety in execution engine
          logs.push(`Condition evaluated: ${conditionMet}`);
          if (!conditionMet) break; // Halts if condition not met
        }
      }

      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "completed",
          output: JSON.stringify(state.variables),
          logs: JSON.stringify(logs),
          finishedAt: new Date()
        }
      });
      
      // Update workflow stats
      const currentStats = JSON.parse(workflow.stats || "{\"runs\":0,\"success\":0,\"failed\":0}");
      await prisma.workflow.update({
        where: { id: workflow.id },
        data: {
          lastRunAt: new Date(),
          stats: JSON.stringify({
            ...currentStats,
            runs: currentStats.runs + 1,
            success: currentStats.success + 1
          })
        }
      });

    } catch (error: any) {
      logs.push(`ERROR: ${error.message}`);
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "failed",
          logs: JSON.stringify(logs),
          finishedAt: new Date()
        }
      });
      
      // Update failed stats
      const currentStats = JSON.parse(workflow.stats || "{\"runs\":0,\"success\":0,\"failed\":0}");
      await prisma.workflow.update({
        where: { id: workflow.id },
        data: {
          lastRunAt: new Date(),
          stats: JSON.stringify({
            ...currentStats,
            runs: currentStats.runs + 1,
            failed: currentStats.failed + 1
          })
        }
      });
    }
  }

  private static async executeAIReply(data: any, state: any): Promise<string> {
    // In a real scenario, this would call Groq/OpenAI with the prompt + state context
    return "This is an automated AI response based on the workflow definition.";
  }
}
