import { NextResponse } from "next/server";
import { AnaosNLP } from "@/lib/ai/pipeline/AnaosNLP";
import { DecisionEngine } from "@/lib/ai/pipeline/DecisionEngine";
import { PLATFORM_BLUEPRINT_SCHEMA, buildGenerationPrompt } from "@/lib/ai/prompts/blueprintPrompts";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // ─────────────────────────────────────────────────────────────────
    // STEP 1: Process via Anaos Classical NLP Pipeline (Fast & Free)
    // ─────────────────────────────────────────────────────────────────
    console.log("[Anaos Matrix] Running NLP Pipeline...");
    
    // We pass "general" as industry for now since we want the LLM to deduce specific industry
    const nlpResult = AnaosNLP.processText(prompt, "general" as any);
    
    // Determine high-level business action required
    const suggestedAction = DecisionEngine.determineAction(nlpResult);

    const nlpContext = {
      intent: nlpResult.intent,
      sentiment: nlpResult.sentiment,
      summary: nlpResult.summary,
      suggestedAction
    };

    // ─────────────────────────────────────────────────────────────────
    // STEP 2: Build the LLM Request Payload
    // ─────────────────────────────────────────────────────────────────
    const systemPrompt = PLATFORM_BLUEPRINT_SCHEMA;
    const userPrompt = buildGenerationPrompt(prompt, nlpContext);

    console.log("[Anaos Matrix] Calling LLM (Grok) with structured data...");

    // ─────────────────────────────────────────────────────────────────
    // STEP 3: MOCK LLM CALL (Replace with actual Grok/OpenAI fetch later)
    // ─────────────────────────────────────────────────────────────────
    // In production:
    // const response = await fetch('https://api.x.ai/v1/chat/completions', { ... })
    
    // For now, we simulate a 2-second LLM processing time and return a dynamic JSON
    await new Promise(resolve => setTimeout(resolve, 2000));

    // We dynamically generate the response based on the NLP context to simulate intelligence
    const isRealEstate = prompt.toLowerCase().includes("real estate") || prompt.toLowerCase().includes("plot");
    const isHospital = prompt.toLowerCase().includes("hospital") || prompt.toLowerCase().includes("clinic") || prompt.toLowerCase().includes("dentist");

    const industryName = isRealEstate ? "Real Estate" : isHospital ? "Healthcare" : "General Business";
    const agentRole = isRealEstate ? "Property Sales Bot" : isHospital ? "Appointment Booking Bot" : "Customer Support Bot";
    const crmCol = isRealEstate ? "Budget" : isHospital ? "Patient ID" : "Query Type";

    const generatedBlueprint = {
      platformName: `${industryName} Hub`,
      industry: industryName,
      agents: [
        {
          role: agentRole,
          type: "customer_facing",
          channels: ["WhatsApp", "Website Widget"],
          systemPrompt: `You are an expert ${agentRole}. Be polite, professional, and guide the user through their request.`
        }
      ],
      crmColumns: [
        { name: "Name", type: "text" },
        { name: "Phone Number", type: "text" },
        { name: crmCol, type: "text" }
      ],
      workflows: [
        { trigger: "New WhatsApp Message", action: `Run ${agentRole} & Update CRM` }
      ],
      suggestedIntegrations: ["WhatsApp Business API", "Google Calendar"]
    };

    // ─────────────────────────────────────────────────────────────────
    // STEP 4: Return Blueprint to Frontend
    // ─────────────────────────────────────────────────────────────────
    console.log("[Anaos Matrix] Blueprint Generated Successfully!");

    return NextResponse.json({
      success: true,
      nlpContext,      // We return this so the frontend can show the user how smart Anaos is
      blueprint: generatedBlueprint // The actual UI driving data
    });

  } catch (error: any) {
    console.error("[Anaos Matrix] Error generating platform:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
