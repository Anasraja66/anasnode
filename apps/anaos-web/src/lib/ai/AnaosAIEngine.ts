import OpenAI from "openai";

export type AIProvider = "groq" | "openai" | "anaos_internal";

export interface GenerateWorkflowParams {
  prompt: string;
  documentText?: string;
  provider?: AIProvider;
}

export class AnaosAIEngine {
  private groqClient: OpenAI | null = null;
  private openaiClient: OpenAI | null = null;

  constructor() {
    if (process.env.GROQ_API_KEY) {
      this.groqClient = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
      });
    }

    if (process.env.OPENAI_API_KEY) {
      this.openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async generateWorkflow({ prompt, documentText, provider = "groq" }: GenerateWorkflowParams) {
    let client = this.groqClient;
    let model = "llama-3.3-70b-versatile"; // Excellent for fast, complex JSON generation

    // Route to appropriate model
    if (provider === "openai" || (!this.groqClient && this.openaiClient)) {
      client = this.openaiClient;
      model = "gpt-4o";
    } else if (provider === "anaos_internal") {
      // Future logic for Anaos's own self-hosted or fine-tuned model
      // For now, it delegates to the fastest available
      client = this.groqClient || this.openaiClient;
    }

    if (!client) {
      throw new Error("No AI provider configured. Please set GROQ_API_KEY or OPENAI_API_KEY in .env.local");
    }

    const systemPrompt = `You are AnaOS AI Engine, an expert automation workflow architect.
Your task is to take a user's prompt (and optional document context) and generate a valid JSON workflow for a Node-based editor like React Flow.
The JSON must have this exact structure:
{
  "workflowName": "string",
  "nodes": [
    {
      "id": "string (e.g. node_1)",
      "type": "string (trigger, action, ai, condition)",
      "position": { "x": number, "y": number },
      "data": {
        "title": "string",
        "description": "string",
        "icon": "string (e.g. MessageSquare, Mail, Zap, Bot, Globe)",
        "provider": "string (e.g. whatsapp, openai, shopify)"
      }
    }
  ],
  "edges": [
    {
      "id": "string",
      "source": "string (source node id)",
      "target": "string (target node id)",
      "animated": boolean
    }
  ]
}

Rules:
1. Lay out nodes horizontally (increase x by 300 for each step) or vertically.
2. Return ONLY valid JSON.
3. Incorporate any details from the document if provided.`;

    const userContent = documentText 
      ? `Document Context:\n${documentText}\n\nUser Request: ${prompt}`
      : `User Request: ${prompt}`;

    try {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2, // Low temperature for deterministic JSON structure
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("AI returned empty response");
      }

      const parsed = JSON.parse(content);
      
      // Ensure expected fields exist
      if (!parsed.nodes || !parsed.edges) {
        throw new Error("AI failed to generate valid nodes and edges array");
      }

      return {
        workflowName: parsed.workflowName || "AI Generated Workflow",
        workflow: {
          nodes: parsed.nodes,
          edges: parsed.edges
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        features: parsed.nodes.map((n: any) => ({
          category: n.type === 'trigger' ? 'Trigger' : (n.type === 'action' ? 'Automation' : 'Logic'),
          title: n.data?.title || "Workflow Step",
          description: n.data?.description || `AI-powered step using ${n.data?.provider || 'built-in capabilities'}.`,
          defaultOn: true
        }))
      };

    } catch (error) {
      console.error("[AnaosAIEngine] Generate Workflow Error:", error);
      throw error;
    }
  }
}

export const aiEngine = new AnaosAIEngine();
