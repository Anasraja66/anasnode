/**
 * POST /api/webhooks/catch/[workflowId]
 *
 * Universal inbound webhook — any external service can POST here
 * to trigger a specific workflow by ID.
 *
 * Use cases:
 *  - Shopify order → trigger ecommerce workflow
 *  - Typeform/Google Form submission → trigger lead workflow
 *  - Custom app events → trigger any automation
 *
 * The full request body is passed as trigger data so workflow nodes
 * can access {{fieldName}} variables from the payload.
 *
 * Security: workflow must be active and exist.
 * No auth required (this is a public webhook endpoint by design).
 */

import { after, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { WorkflowExecutor } from "@/lib/workflow/executor";

export const dynamic = "force-dynamic";

// ── Body Parsers ──────────────────────────────────────────────────────────────

/** Parse request body into a plain object regardless of Content-Type */
async function parseRequestBody(request: Request): Promise<Record<string, any>> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await request.text();
    const entries = new URLSearchParams(text);
    const obj: Record<string, string> = {};
    for (const [key, value] of entries.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  // Treat anything else as raw text
  const text = await request.text();
  return { rawBody: text };
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workflowId: string }> }
): Promise<NextResponse> {
  try {
    const { workflowId } = await params;

    // Load and validate the workflow
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      select: { id: true, name: true, accountId: true, isActive: true },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    if (!workflow.isActive) {
      return NextResponse.json(
        { error: "Workflow is not active" },
        { status: 400 }
      );
    }

    // Parse the webhook payload
    const bodyData = await parseRequestBody(request);

    // Add standard trigger metadata
    const triggerData = {
      ...bodyData,
      _webhookSource: "catch",
      _workflowId: workflowId,
      _receivedAt: new Date().toISOString(),
    };

    console.log(
      `[Webhook:catch] Triggering "${workflow.name}" (${workflowId}) from external webhook`
    );

    // Execute in background — respond to caller immediately
    // This is important: external services expect a fast response
    after(async () => {
      try {
        const executor = new WorkflowExecutor();
        await executor.execute(workflowId, triggerData);
      } catch (err: any) {
        console.error(
          `[Webhook:catch] Workflow ${workflowId} execution failed:`,
          err.message
        );
      }
    });

    return NextResponse.json({
      success: true,
      message: "Workflow triggered",
      workflowId,
    });
  } catch (error: any) {
    console.error("[Webhook:catch] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
