import { WorkflowNode, ExecutionContext, NodeResult } from "../types";

export interface INodeHandler {
  execute(node: WorkflowNode, ctx: ExecutionContext): Promise<NodeResult>;
}

export class NodeRegistry {
  private handlers: Map<string, INodeHandler> = new Map();

  register(type: string, handler: INodeHandler) {
    this.handlers.set(type, handler);
  }

  getHandler(type: string): INodeHandler {
    const handler = this.handlers.get(type);
    if (!handler) {
      throw new Error(`No handler registered for node type: ${type}`);
    }
    return handler;
  }
}

export const globalRegistry = new NodeRegistry();
