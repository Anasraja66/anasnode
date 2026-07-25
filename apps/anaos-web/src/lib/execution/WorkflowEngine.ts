import { aiEngine } from "../ai/AnaosAIEngine";

export interface ExecutionContext {
  workflowId: string;
  triggerPayload: any;
  variables: Record<string, any>;
  logs: any[];
}

export class WorkflowEngine {
  
  async execute(nodes: any[], edges: any[], context: ExecutionContext) {
    console.log(`[WorkflowEngine] Starting execution for workflow: ${context.workflowId}`);
    
    // Find the trigger node (usually has no incoming edges, or is explicitly typed as trigger)
    let triggerNode = nodes.find(n => n.type === 'trigger' || n.type === 'trigger_webhook' || n.id.toLowerCase().includes('trigger'));
    
    // If no explicit trigger, just start at the first node
    if (!triggerNode && nodes.length > 0) {
      triggerNode = nodes[0];
    }

    if (!triggerNode) {
      return { success: false, error: "No starting node found in workflow." };
    }

    let currentNode = triggerNode;
    let maxSteps = 50; // Prevent infinite loops
    let steps = 0;

    context.logs.push({ step: "START", nodeId: currentNode.id, timestamp: new Date() });

    while (currentNode && steps < maxSteps) {
      steps++;
      
      try {
        await this.executeNode(currentNode, context);
      } catch (error: any) {
        context.logs.push({ step: "ERROR", nodeId: currentNode.id, error: error.message, timestamp: new Date() });
        return { success: false, logs: context.logs, error: error.message };
      }

      // Find the next node
      const outgoingEdges = edges.filter(e => e.source === currentNode.id);
      
      if (outgoingEdges.length === 0) {
        // End of workflow
        break;
      } else if (outgoingEdges.length === 1) {
        // Simple linear progression
        currentNode = nodes.find(n => n.id === outgoingEdges[0].target);
      } else {
        // Branching logic (Condition nodes)
        // For V1, we just take the first path if it's not a condition node
        if (currentNode.type === 'condition') {
          // Implement condition evaluation here in the future
          currentNode = nodes.find(n => n.id === outgoingEdges[0].target); // Default to first for now
        } else {
          currentNode = nodes.find(n => n.id === outgoingEdges[0].target);
        }
      }
    }

    context.logs.push({ step: "END", timestamp: new Date() });
    console.log(`[WorkflowEngine] Completed execution for workflow: ${context.workflowId}`);
    
    return { success: true, logs: context.logs, variables: context.variables };
  }

  private async executeNode(node: any, context: ExecutionContext) {
    const nodeType = node.type || "unknown";
    const nodeData = node.data || {};
    
    context.logs.push({ step: "EXECUTE_NODE", nodeId: node.id, type: nodeType, timestamp: new Date() });

    switch (nodeType) {
      case 'trigger':
      case 'trigger_webhook':
        // Trigger nodes just pass the payload into variables
        context.variables['trigger'] = context.triggerPayload;
        break;
      
      case 'ai':
      case 'ai_reply':
      case 'ai_agent':
        // Call the Anaos AI Engine
        const systemPrompt = nodeData.config?.system_prompt || nodeData.description || "You are an AI assistant processing a workflow step.";
        const userPrompt = JSON.stringify(context.variables['trigger'] || "Process this task.");
        
        try {
          // Use our engine to do a quick completion (even if it's just text generation, we can re-use the engine or just use fetch directly if needed. Since AnaosAIEngine currently expects to return JSON workflows, we might need a general `generateText` method. For now, we will simulate it or use it.)
          // Assuming AnaosAIEngine will have a general completion method later.
          const responseText = "AI Response generated for: " + userPrompt;
          context.variables[node.id] = { response: responseText };
          context.logs.push({ step: "AI_RESULT", nodeId: node.id, result: responseText });
        } catch (e) {
          console.error("AI Error", e);
        }
        break;

      case 'action':
      case 'send_message':
      case 'http_request':
        // Simulate sending a message or making an HTTP request
        console.log(`[WorkflowEngine] Executing Action: ${nodeData.title || nodeData.label}`);
        context.logs.push({ step: "ACTION_EXECUTED", nodeId: node.id, action: nodeData.title || nodeData.label });
        break;

      case 'condition':
        // Evaluate condition
        context.logs.push({ step: "CONDITION_EVALUATED", nodeId: node.id });
        break;

      default:
        // Generic node execution
        context.logs.push({ step: "GENERIC_EXECUTION", nodeId: node.id });
        break;
    }
  }
}

export const workflowEngine = new WorkflowEngine();
