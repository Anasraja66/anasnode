import { Queue } from "bullmq";
import { connection } from "./connection";

export let workflowQueue: Queue;

// Lazy initialize to prevent Redis connection during Next.js build
function getQueue() {
  if (!workflowQueue) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workflowQueue = new Queue("workflow-execution", { connection: connection as any });
  }
  return workflowQueue;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
