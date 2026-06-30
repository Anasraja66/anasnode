import { prisma } from "../db";
import { WorkflowExecutor } from "./executor";
import { WorkflowNode } from "./types";

// In development, scale 1 minute of delay into 500ms so wait steps can be tested instantly.
// In production, 1 minute of delay maps to 60000ms.
const DELAY_MULTIPLIER = process.env.NODE_ENV === "development" ? 500 : 60000;

class WorkflowSchedulerService {
  private activeTimeouts: Record<string, NodeJS.Timeout> = {};
  private activeIntervals: Record<string, NodeJS.Timeout> = {};

  // Register a wait resume task
  scheduleWaitResume(executionId: string, nextNodeId: string, delayMinutes: number) {
    const taskId = `${executionId}-${nextNodeId}`;
    
    // Clear existing if duplicate
    if (this.activeTimeouts[taskId]) {
      clearTimeout(this.activeTimeouts[taskId]);
    }

    const delayMs = delayMinutes * DELAY_MULTIPLIER;
    console.log(`[SCHEDULER] Scheduled resume for execution ${executionId} at node ${nextNodeId} in ${delayMs}ms (delay: ${delayMinutes} min).`);

    this.activeTimeouts[taskId] = setTimeout(async () => {
      try {
        await this.resumeExecution(executionId, nextNodeId);
      } catch (e) {
        console.error(`[SCHEDULER] Failed to resume execution ${executionId}:`, e);
      } finally {
        delete this.activeTimeouts[taskId];
      }
    }, delayMs);
  }

  // Resume the workflow execution at the designated wait action target node
  async resumeExecution(executionId: string, nextNodeId: string) {
    console.log(`[SCHEDULER] Resuming execution ${executionId} at node ${nextNodeId}...`);

    const execution = await prisma.workflowExecution.findUnique({
      where: { id: executionId },
    });

    if (!execution || execution.status !== "running") {
      console.warn(`[SCHEDULER] Execution ${executionId} is no longer running or not found. Cannot resume.`);
      return;
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id: execution.workflowId },
    });

    if (!workflow) {
      console.error(`[SCHEDULER] Workflow ${execution.workflowId} not found.`);
      return;
    }

    const nodes: WorkflowNode[] = JSON.parse(workflow.nodes || "[]");
    const edges: any[] = JSON.parse(workflow.edges || "[]");
    const nextNode = nodes.find(n => n.id === nextNodeId);

    if (!nextNode) {
      console.error(`[SCHEDULER] Resume node ${nextNodeId} not found in workflow.`);
      return;
    }

    // Reconstruct context variables
    const ctx = {
      executionId,
      workflowId: workflow.id,
      accountId: workflow.accountId,
      contactId: execution.contactId,
      variables: JSON.parse(execution.output || "{}"),
      nodeData: {}, // Hydrated on-demand if resuming mid-flow
      anamind: {
        name: "Customer",
        phone: "+1234567890"
      },
      triggerData: JSON.parse(execution.input || "{}"),
      logs: JSON.parse(execution.logs || "[]"),
      mode: (workflow.mode as "draft" | "autopilot") || "draft",
    };

    const startTime = Date.now();
    const executor = new WorkflowExecutor();
    
    try {
      // Begin executing downstream actions from the next node
      await executor.executeNode(nextNode, ctx, nodes, edges);

      const duration = Date.now() - startTime;
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          status: "success",
          output: JSON.stringify(ctx.variables),
          logs: JSON.stringify(ctx.logs),
          finishedAt: new Date(),
          duration: (execution.duration || 0) + duration,
        }
      });
      console.log(`[SCHEDULER] Execution ${executionId} resumed and completed successfully.`);
    } catch (error: any) {
      console.error(`[SCHEDULER] Execution ${executionId} resumed but failed:`, error);
      const duration = Date.now() - startTime;
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          status: "failed",
          logs: JSON.stringify([
            ...ctx.logs,
            {
              nodeId: "scheduler",
              type: nextNode.type,
              startedAt: Date.now(),
              status: "failed" as const,
              error: error.message || String(error)
            }
          ]),
          finishedAt: new Date(),
          duration: (execution.duration || 0) + duration,
        }
      });
    }
  }

  // Register cron triggers loop for TRIGGER_SCHEDULE nodes when a workflow is activated
  registerCronTrigger(workflowId: string, cronSchedule: string) {
    if (this.activeIntervals[workflowId]) {
      clearInterval(this.activeIntervals[workflowId]);
    }

    // Simple mapping: every_hour -> 60 min, every_day -> 1440 min, every_week -> 10080 min
    // scaled for testing in dev mode
    let intervalMinutes = 60;
    if (cronSchedule === "every_day") intervalMinutes = 1440;
    else if (cronSchedule === "every_week") intervalMinutes = 10080;

    const intervalMs = intervalMinutes * DELAY_MULTIPLIER;
    console.log(`[SCHEDULER] Registered cron interval trigger for workflow ${workflowId} running every ${intervalMs}ms.`);

    this.activeIntervals[workflowId] = setInterval(async () => {
      try {
        console.log(`[SCHEDULER] Triggering scheduled cron run for workflow ${workflowId}...`);
        const executor = new WorkflowExecutor();
        await executor.execute(workflowId, {
          type: "scheduled",
          runAt: new Date().toISOString(),
        });
      } catch (e) {
        console.error(`[SCHEDULER] Scheduled trigger run failed for workflow ${workflowId}:`, e);
      }
    }, intervalMs);
  }

  // Remove interval loop when workflow is deactivated
  unregisterCronTrigger(workflowId: string) {
    if (this.activeIntervals[workflowId]) {
      clearInterval(this.activeIntervals[workflowId]);
      delete this.activeIntervals[workflowId];
      console.log(`[SCHEDULER] Unregistered cron trigger for workflow ${workflowId}.`);
    }
  }
}

export const workflowScheduler = new WorkflowSchedulerService();
