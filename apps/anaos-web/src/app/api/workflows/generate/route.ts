import { NextResponse } from "next/server";
import { executeLLMCompletion } from "@/lib/workflow/ai-client";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemPrompt = `
You are AnaOS AI, an expert automation workflow compiler similar to n8n AI.
The user will provide a prompt describing an automation flow.
You must output a strictly valid JSON object representing the workflow graph.
Do not output any markdown formatting, only raw JSON.

The JSON schema must be:
{
  "nodes": [
    { "id": "uuid", "type": "trigger_whatsapp" | "send_whatsapp" | "condition" | "ai_respond" | "send_voice_call" | "wait", "name": "string", "position": { "x": number, "y": number }, "config": { ... }, "outputs": ["uuid_of_next_node"] }
  ],
  "edges": [
    { "id": "uuid", "source": "node_id", "target": "node_id", "sourceHandle": "branch_name_or_index" }
  ]
}

Example Prompt: "When I get a WhatsApp message, use AI to classify it. If it's a booking, wait 5 mins and reply."
Example Output: (Strict JSON)
`;

    // Use the internal AI client we already have mapped in the project
    const jsonString = await executeLLMCompletion({
      provider: "claude", // or openai
      model: "claude-3-5-sonnet-20240620",
      systemPrompt,
      userMessage: prompt,
      maxTokens: 2000,
      temperature: 0.1, // Strict determinism
      credentialId: "", // Assume system API keys are used for this builder tool
      accountId: "system",
    });

    const parsedWorkflow = JSON.parse(jsonString.trim().replace(/^```json/, "").replace(/```$/, ""));
    return NextResponse.json({ workflow: parsedWorkflow });
  } catch (error: any) {
    console.error("AI Workflow Generation Error:", error);
    return NextResponse.json({ error: "Failed to compile workflow", details: error.message }, { status: 500 });
  }
}
