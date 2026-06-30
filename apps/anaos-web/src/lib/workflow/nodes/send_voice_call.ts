import { INodeHandler } from "../engine/registry";
import { WorkflowNode, ExecutionContext, NodeResult } from "../types";
import { evaluateExpression } from "../engine/evaluator";

export class SendVoiceCallNode implements INodeHandler {
  async execute(node: WorkflowNode, ctx: ExecutionContext): Promise<NodeResult> {
    const config = node.config || {};
    
    // Evaluate expressions for phone number and Retell agent ID
    const phone = evaluateExpression(config.phone || "{{phone}}", ctx);
    const agentId = evaluateExpression(config.agentId || "", ctx);
    const retellApiKey = process.env.RETELL_API_KEY;

    if (!phone) {
      throw new Error("Cannot initiate Voice Call: No phone number found in context.");
    }
    
    if (!agentId) {
      throw new Error("Cannot initiate Voice Call: No Retell Agent ID provided.");
    }

    if (!retellApiKey) {
      throw new Error("RETELL_API_KEY is not configured.");
    }

    try {
      const response = await fetch("https://api.retellai.com/v2/create-phone-call", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${retellApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_number: process.env.RETELL_FROM_NUMBER || "",
          to_number: phone,
          retell_llm_dynamic_variables: {
            customer_name: ctx.triggerData?.name || "Customer",
            context_data: JSON.stringify(ctx.variables)
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Retell API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // We suspend the execution here. 
      // The workflow will resume when Retell sends a webhook (call_ended event).
      // The webhook handler will look up the executionId and call workflowScheduler.resumeExecution.
      return {
        output: { 
          _suspendExecution: true,
          _resumeNodeId: node.id, 
          callId: data.call_id,
          status: "call_initiated"
        },
        nextNodeIds: node.outputs,
      };
    } catch (error: any) {
      throw new Error(`Voice Call Failed: ${error.message}`);
    }
  }
}
