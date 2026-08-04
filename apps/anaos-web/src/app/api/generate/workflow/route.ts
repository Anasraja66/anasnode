import { NextResponse } from "next/server";
import { aiEngine } from "@/lib/ai/AnaosAIEngine";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { prompt, industry, documentText } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Prepare a combined prompt if industry is provided
    let finalPrompt = prompt;
    if (industry) {
      finalPrompt = `Industry: ${industry}\n\nTask: ${prompt}`;
    }

    // Call the Anaos AI Engine (which routes to Groq)
    const result = await aiEngine.generateWorkflow({
      prompt: finalPrompt,
      documentText,
      provider: "groq"
    });

    return NextResponse.json({
      success: true,
      data: result,
      workflowName: result.workflowName,
      features: result.features,
      workspace: result.workflow,
      nodes: result.workflow.nodes,
      edges: result.workflow.edges
    });

  } catch (error: any) {
    console.error("[GenerateWorkflowAPI] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate workflow" },
      { status: 500 }
    );
  }
}
