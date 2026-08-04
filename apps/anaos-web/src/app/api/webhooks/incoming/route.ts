import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { WorkflowEngine } from "@/lib/workflow/engine";

// Webhook receiver for third-party platforms (WhatsApp, Facebook, etc.)
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    // E.g. { source: 'whatsapp', accountId: 'uuid', message: 'Hello', from: '123456789' }
    
    // Validate basic payload
    if (!payload.accountId || !payload.source) {
      return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // Upsert conversation to log the inbound message in CRM/Inbox
    const conversation = await prisma.inboxConversation.upsert({
      where: {
        accountId_channel_contactPhone: {
          accountId: payload.accountId,
          channel: payload.source,
          contactPhone: payload.from || "unknown"
        }
      },
      update: {
        lastMessage: payload.message || "Media received",
        lastMessageAt: new Date(),
        lastInboundAt: new Date(),
        unreadCount: { increment: 1 }
      },
      create: {
        accountId: payload.accountId,
        channel: payload.source,
        contactPhone: payload.from || "unknown",
        contactName: payload.contactName || "Unknown Contact",
        lastMessage: payload.message || "Media received",
        lastMessageAt: new Date(),
        lastInboundAt: new Date(),
        unreadCount: 1
      }
    });

    await prisma.inboxMessage.create({
      data: {
        conversationId: conversation.id,
        direction: "inbound",
        body: payload.message || "",
        source: "customer"
      }
    });

    // Find active workflows for this account and channel
    const activeWorkflows = await prisma.workflow.findMany({
      where: {
        accountId: payload.accountId,
        isActive: true
      }
    });

    // Process the event through the workflow engine asynchronously
    // In production, this might be pushed to a Redis Queue (BullMQ) or AWS SQS.
    activeWorkflows.forEach(workflow => {
      // Basic check: Ensure workflow definition has a trigger for this channel
      const definition = workflow.definition || "{}";
      if (definition.includes(payload.source) || definition.includes("all")) {
        // Run engine in background without blocking response
        WorkflowEngine.executeWorkflow(workflow.id, payload).catch(err => {
          console.error(`Workflow ${workflow.id} execution failed:`, err);
        });
      }
    });

    return NextResponse.json({ success: true, message: "Webhook received and processing started." });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
