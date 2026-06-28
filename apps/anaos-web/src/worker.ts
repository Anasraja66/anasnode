import "dotenv/config";
import { workflowWorker } from "./lib/queue/worker";

console.log("AnaOS Background Worker started...");
console.log(`Listening to queue: ${workflowWorker.name}`);

// Keep the process alive
process.on("SIGINT", async () => {
  console.log("Shutting down worker...");
  await workflowWorker.close();
  process.exit(0);
});
