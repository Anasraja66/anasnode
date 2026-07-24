import { INodeHandler } from "../engine/registry";
import { WorkflowNode, ExecutionContext, NodeResult } from "../types";
import { evaluateExpression } from "../engine/evaluator";
import prisma from "@/lib/db";

export class GoogleCalendarNodeHandler implements INodeHandler {
  async execute(node: WorkflowNode, ctx: ExecutionContext): Promise<NodeResult> {
    const summary = evaluateExpression(node.config.summary || "New Booking", ctx);
    const startTimeStr = evaluateExpression(node.config.startTime || "", ctx);
    const durationMins = parseInt(node.config.duration || "30", 10);

    if (!startTimeStr) {
      throw new Error("Start time is required for Calendar event.");
    }

    // Try to parse the start time
    const startAt = new Date(startTimeStr);
    if (isNaN(startAt.getTime())) {
      throw new Error(`Invalid start time format: ${startTimeStr}`);
    }

    const endAt = new Date(startAt.getTime() + durationMins * 60000);

    console.log(`[Google Calendar] Booking event: ${summary} at ${startAt.toISOString()} for ${durationMins} mins`);
    
    // Simulate API delay for realism in Sandbox mode
    await new Promise(resolve => setTimeout(resolve, 800));

    // Fallback names/phones from execution context
    const contactPhone = ctx.triggerData?.phone || ctx.variables?.phone || "Unknown";
    const contactName = ctx.triggerData?.name || ctx.variables?.name || "Customer";
    const channel = ctx.triggerData?.channel || "workflow";

    // Save BookingEvent to database
    const booking = await prisma.bookingEvent.create({
      data: {
        accountId: ctx.accountId,
        contactPhone,
        contactName,
        title: summary,
        startAt,
        endAt,
        channel,
        status: "confirmed",
        notes: `Automatically booked via AnaOS Workflow ${ctx.workflowId}`,
      }
    });

    const meetLink = `https://meet.google.com/sandbox-booking`;

    return { 
      output: {
        status: "success", 
        data: { 
          message: "Event booked successfully", 
          eventId: booking.id,
          meetLink
        }
      },
      nextNodeIds: node.outputs || []
    };
  }
}
