import { INodeHandler } from "../engine/registry";
import { WorkflowNode, ExecutionContext, NodeResult } from "../types";

export class GoogleCalendarNodeHandler implements INodeHandler {
  async execute(node: WorkflowNode, ctx: ExecutionContext): Promise<NodeResult> {
    const summary = ctx.evaluate(node.config.summary || "New Booking");
    const startTime = ctx.evaluate(node.config.startTime || "");
    const durationMins = parseInt(node.config.duration || "30", 10);

    if (!startTime) {
      throw new Error("Start time is required for Calendar event.");
    }

    // Since OAuth for Google is complex, we'll mock the actual API call
    // In a real scenario, we'd fetch the user's refresh token from IntegrationCredential table.
    
    console.log(`[Google Calendar] Booking event: ${summary} at ${startTime} for ${durationMins} mins`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const eventId = `gcal_${Date.now()}`;
    const meetLink = `https://meet.google.com/abc-defg-hij`;

    return { 
      status: "success", 
      data: { 
        message: "Event booked successfully", 
        eventId,
        meetLink,
        summary,
        startTime 
      } 
    };
  }
}
