import { INodeHandler } from "../engine/registry";
import { WorkflowNode, ExecutionContext, NodeResult } from "../types";
import { evaluateExpression } from "../engine/evaluator";

export class ShopifyNodeHandler implements INodeHandler {
  async execute(node: WorkflowNode, ctx: ExecutionContext): Promise<NodeResult> {
    const action = node.config.action || "get_order";
    const orderId = evaluateExpression(node.config.orderId || "", ctx);

    const shopifyStoreUrl = process.env.SHOPIFY_STORE_URL;
    const shopifyAccessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (!shopifyStoreUrl || !shopifyAccessToken) {
      console.log(`[Mock Shopify] Action: ${action} | OrderId: ${orderId}`);
      // Mock response
      return { 
        output: {
          status: "success", 
          data: { 
            orderStatus: "Shipped", 
            trackingNumber: "TRK123456789", 
            courier: "FedEx" 
          } 
        },
        nextNodeIds: node.outputs || []
      };
    }

    if (action === "get_order") {
      if (!orderId) throw new Error("Order ID is required");

      const response = await fetch(`https://${shopifyStoreUrl}/admin/api/2024-01/orders/${orderId}.json`, {
        headers: {
          "X-Shopify-Access-Token": shopifyAccessToken,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order from Shopify");
      }

      const data = await response.json();
      return { output: { status: "success", data: data.order }, nextNodeIds: node.outputs || [] };
    }

    throw new Error(`Unsupported Shopify action: ${action}`);
  }
}
