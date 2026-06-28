import { Worker } from "bullmq";
import { connection } from "./connection";
import { WorkflowExecutor } from "../workflow/executor";

export const workflowWorker = new Worker(
  "workflow-execution",
  async (job) => {
    const { workflowId, triggerData } = job.data;
    console.log(`Executing workflow job ${job.id} for workflow ${workflowId}`);
    
    const executor = new WorkflowExecutor();
    await executor.execute(workflowId, triggerData);
  },
  { 
    connection: connection as any,
    concurrency: 5 // Process 5 workflows concurrently
  }
);

workflowWorker.on("completed", (job) => {
  console.log(`Workflow job ${job.id} has completed successfully.`);
});

workflowWorker.on("failed", (job, err) => {
  console.error(`Workflow job ${job?.id} has failed: ${err.message}`);
});
