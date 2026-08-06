import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { workflowScheduler } from "@/lib/workflow/scheduler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body.event; // e.g. "call_ended", "call_analyzed"
    const callData = body.call;
    const callId = callData?.call_id;

    if (!callId) {
      return NextResponse.json({ error: "No call_id provided" }, { status: 400 });
    }

    if (event === "call_analyzed" || event === "call_ended") {
      // Find the execution that was suspended waiting for this call
      // In a real robust system, we would save the executionId mapping somewhere,
      // For now, we search pending executions where output contains the callId
      const executions = await prisma.workflowExecution.findMany({
        where: { status: "running" }
      });

      let targetExecution = null;
      let resumeNodeId = null;

      for (const exec of executions) {
        if (!exec.output) continue;
        try {
          const outObj = JSON.parse(exec.output);
          // Look for any node output that has callId and suspended state
          for (const key in outObj) {
            const nodeOut = outObj[key]?.output;
            if (nodeOut && nodeOut._suspendExecution && nodeOut.callId === callId) {
              targetExecution = exec;
              resumeNodeId = nodeOut._resumeNodeId;
              
              // Hydrate the output with the call analysis
              nodeOut.transcript = callData.transcript;
              nodeOut.recording_url = callData.recording_url;
              nodeOut.analysis = callData.call_analysis;
              break;
            }
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch(e) {}
        if (targetExecution) break;
      }

      if (targetExecution && resumeNodeId) {
        // Save the hydrated transcript back before resuming
        await prisma.workflowExecution.update({
          where: { id: targetExecution.id },
          data: { output: JSON.stringify(JSON.parse(targetExecution.output || "{}")) }
        });

        // Resume Execution downstream
        workflowScheduler.resumeExecution(targetExecution.id, resumeNodeId);
      }
    }

    return NextResponse.json({ received: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Retell Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
