import { Queue } from "bullmq";
import { connection } from "./connection";

export let workflowQueue: Queue;

// Lazy initialize to prevent Redis connection during Next.js build
function getQueue() {
  if (!workflowQueue) {
    workflowQueue = new Queue("workflow-execution", { connection: connection as any });
  }
  return workflowQueue;
}

export async function enqueueWorkflow(workflowId: string, triggerData: any) {
  const q = getQueue();
  return await q.add(
    "execute",
    { workflowId, triggerData },
    { 
      removeOnComplete: true, 
      removeOnFail: false,
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 }
    }
  );
}
