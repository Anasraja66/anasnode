/**
 * DEPRECATED — WorkflowEngine (Old Stub)
 *
 * This file is kept only for backwards compatibility.
 * It was a 15-line stub that did nothing (just console.log).
 *
 * All code should now use WorkflowExecutor from @/lib/workflow/executor.
 *
 * If you see this import in your code:
 *   import { WorkflowEngine } from "@/lib/workflow/engine/executor"
 *
 * Replace it with:
 *   import { WorkflowExecutor } from "@/lib/workflow/executor"
 */

// Re-export the real executor so old imports don't crash
export { WorkflowExecutor as WorkflowEngine } from "@/lib/workflow/executor";
