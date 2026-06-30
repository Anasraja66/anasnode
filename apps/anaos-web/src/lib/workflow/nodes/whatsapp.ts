import { INodeHandler } from "../engine/registry";
import { WorkflowNode, ExecutionContext, NodeResult } from "../types";
import { evaluateExpression } from "../engine/evaluator";
import { sendMetaTextMessage } from "@/lib/whatsapp/meta";

export class SendWhatsAppNode implements INodeHandler {
  async execute(node: WorkflowNode, ctx: ExecutionContext): Promise<NodeResult> {
    const config = node.config || {};
    
    // Evaluate expressions in the message
    const rawMessage = config.message || config.template || "";
    const resolvedMessage = evaluateExpression(rawMessage, ctx);
    
    // The phone number usually comes from the trigger context or the contact profile
    const phone = ctx.triggerData?.phone || ctx.anamind?.phone;
    
    if (!phone) {
      throw new Error("Cannot send WhatsApp message: No phone number found in context.");
    }
    
    // Call external API (Meta)
    try {
      const responseId = await sendMetaTextMessage(
        ctx.accountId,
        phone,
        resolvedMessage
      );
      
      return {
        output: { success: true, messageId: responseId, sentText: resolvedMessage },
        nextNodeIds: node.outputs,
      };
    } catch (error: any) {
      throw new Error(`WhatsApp Send Failed: ${error.message}`);
    }
  }
}
