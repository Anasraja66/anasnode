import OpenAI from "openai";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { zodResponseFormat } from "openai/helpers/zod";
import { WorkspaceBlueprintSchema, WorkspaceBlueprint } from "./types";

// Create client conditionally so it doesn't crash during build if env var is missing
const getOpenAIClient = () => {
  if (!process.env.GROQ_API_KEY) {
    console.warn("Missing GROQ_API_KEY, falling back to mock generator");
    return null;
  }
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
};

export async function generateBlueprint(
  prompt: string
): Promise<WorkspaceBlueprint> {
  const openai = getOpenAIClient();

  if (!openai) {
    // Mock response if no API key is provided
    return {
      industryName: "Real Estate (Mock)",
      agentPersona:
        "You are an AI consultant for this Real Estate agency. Help clients find properties, ask for their budget, and save their contact details. Keep replies concise and professional.",
      knowledgeBaseCategories: ["Ready Properties", "Off-plan Projects", "FAQs"],
      customFields: [
        { name: "budget", type: "string", description: "The client's budget" },
        { name: "location", type: "string", description: "Preferred property location" },
        { name: "bedrooms", type: "string", description: "Number of bedrooms required" },
      ],
      workflowSuggestions: [
        {
          name: "WhatsApp Lead Capture",
          description: "Instantly reply to WhatsApp leads and save them to the CRM",
          triggerType: "trigger_whatsapp",
        },
        {
          name: "Follow-up Sequence",
          description: "Follow up with unresponsive leads after 24 hours",
          triggerType: "trigger_stage_changed",
        },
      ],
    };
  }

  const completion = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are AnaOS, an enterprise-grade AI Operating System generator. 
Your job is to read the user's business description (prompt) and generate a comprehensive Workspace Blueprint for their CRM, AI Agent, and Knowledge Base.
Ensure the terminology fits their specific industry (e.g., UAE Real Estate, US Healthcare, etc.).
You MUST return ONLY valid JSON matching this structure:
{
  "industryName": "string",
  "agentPersona": "string",
  "knowledgeBaseCategories": ["string", "string", "string"],
  "customFields": [{ "name": "string", "type": "string", "description": "string" }],
  "workflowSuggestions": [{ "name": "string", "description": "string", "triggerType": "string" }]
}`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error("Failed to get response from Groq");
  }

  const parsed = JSON.parse(content);
  return WorkspaceBlueprintSchema.parse(parsed);
}
