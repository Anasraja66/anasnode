import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" }); // fallback

import { resolveWorkspaceFromPrompt } from "./src/lib/generate/workspace";

async function main() {
  const prompt = "I need to approach property owners in UAE and handle their replies using AI";
  console.log("Testing Prompt:", prompt);
  
  const result = await resolveWorkspaceFromPrompt(prompt);
  console.log("\n--- GENERATED WORKSPACE ---\n");
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
