import { INodeHandler } from "../engine/registry";
import { WorkflowNode, ExecutionContext, NodeResult } from "../types";
import { evaluateExpression } from "../engine/evaluator";
import { sendTwilioMessage } from "@/lib/whatsapp/twilio";

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
    
    // Call external API (Twilio)
    try {
      const responseId = await sendTwilioMessage(
        phone,
        resolvedMessage,
        true // isWhatsApp = true
      );
      
      return {
        output: { success: true, messageId: responseId, sentText: resolvedMessage },
        nextNodeIds: node.outputs,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`WhatsApp Send Failed: ${error.message}`);
    }
  }
}
