import { INodeHandler } from "../engine/registry";
import { WorkflowNode, ExecutionContext, NodeResult } from "../types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { evaluateExpression } from "../engine/evaluator";

export class WaitNode implements INodeHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(node: WorkflowNode, ctx: ExecutionContext): Promise<NodeResult> {
    const config = node.config || {};
    const duration = parseInt(config.duration || "1", 10);
    const unit = config.unit || "minutes";
    
    let ms = duration * 60 * 1000;
    if (unit === "hours") ms *= 60;
    if (unit === "days") ms *= 60 * 24;
    
    const resumeAt = new Date(Date.now() + ms).toISOString();
    
    // Instead of pausing the thread (which blocks Vercel/VPS resources),
    // we return a SUSPEND signal for the executor to halt and serialize state.
    return {
      output: { 
        _suspendExecution: true, 
        _resumeAt: resumeAt,
        _resumeNodeId: node.id,
        waited_for: `${duration} ${unit}`
      },
      nextNodeIds: node.outputs, // This will be used when we resume
    };
  }
}
