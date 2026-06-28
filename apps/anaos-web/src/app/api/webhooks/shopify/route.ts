import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { WorkflowExecutor } from "@/lib/workflow/executor";
import { NodeType, WorkflowNode } from "@/lib/workflow/types";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function verifyShopifyHmac(rawBody: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret || !hmacHeader) return process.env.NODE_ENV === "development";

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

/**
 * Shopify webhooks → active workflows with trigger_shopify
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const hmac = request.headers.get("x-shopify-hmac-sha256");
    const topic = request.headers.get("x-shopify-topic") || "unknown";
    const shopDomain = request.headers.get("x-shopify-shop-domain") || "";

    if (!verifyShopifyHmac(rawBody, hmac)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    const activeWorkflows = await prisma.workflow.findMany({
      where: { isActive: true },
      include: { workspace: true },
    });

    let handled = 0;

    for (const wf of activeWorkflows) {
      let nodes: WorkflowNode[] = [];
      try {
        nodes = JSON.parse(wf.nodes || "[]");
      } catch {
        continue;
      }

      if (!nodes.some((n) => n.type === NodeType.TRIGGER_SHOPIFY)) continue;

      const phone =
        payload.phone ||
        payload.customer?.phone ||
        payload.billing_address?.phone ||
        null;

      const triggerData = {
        event: topic,
        shop: shopDomain,
        message: `Shopify event: ${topic}`,
        contactName:
          payload.customer?.first_name ||
          payload.email?.split("@")?.[0] ||
          "Shopify Customer",
        phone: phone || "",
        contactPhone: phone || "",
        cart_item: payload.line_items?.[0]?.title || payload.name || "Item",
        order_id: String(payload.id || payload.order_id || ""),
        raw: payload,
      };

      const executor = new WorkflowExecutor();
      await executor.execute(wf.id, triggerData);
      handled++;
    }

    return NextResponse.json({
      success: true,
      topic,
      shop: shopDomain,
      workflowsTriggered: handled,
    });
  } catch (error) {
    console.error("Shopify webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
