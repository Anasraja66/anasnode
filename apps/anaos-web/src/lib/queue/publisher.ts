import { Queue } from "bullmq";
import { connection } from "./connection";

export const workflowQueue = new Queue("workflow-execution", { connection: connection as any });

export async function enqueueWorkflow(workflowId: string, triggerData: any) {
  return await workflowQueue.add(
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
