import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { executeLLMCompletion } from "@/lib/workflow/ai-client";
import { enqueueWorkflow } from "@/lib/queue/publisher";
import { NodeType } from "@/lib/workflow/types";

export async function POST(req: Request) {
  try {
    // For SendGrid Inbound Parse, the payload is often FormData (multipart/form-data)
    // For simplicity in MVP, we accept JSON or Form
    let textBody = "";
    let toEmail = "";
    
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      textBody = body.text || body.html || "";
      toEmail = body.to || "";
    } else {
      const formData = await req.formData();
      textBody = (formData.get("text") as string) || "";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      toEmail = (formData.get("to") as string) || "";
    }

    if (!textBody) {
      return NextResponse.json({ error: "No email body provided" }, { status: 400 });
    }

    // Identify the account based on the receiving email address (e.g. calls@marina.anaos.io)
    // For MVP, we'll just grab the first account if we can't match.
    const account = await prisma.account.findFirst();
    if (!account) return NextResponse.json({ error: "No account found" }, { status: 400 });

    // 1. AI Parsing: Extract metadata from the raw missed call email
    const systemPrompt = `You are an expert data extractor parsing Missed Call VoIP emails.
Extract the following information as a strict JSON object:
{
  "callerPhone": "The phone number of the person who called, formatted with country code (e.g., +1234567890). Leave empty if not found",
  "agentName": "The name of the agent or department they were trying to reach",
  "source": "Any context about where the call came from (e.g., Website Ad, Facebook Ad)",
  "duration": "Duration of the call/ring"
}
Output ONLY JSON, no markdown formatting.`;

    const extractionResult = await executeLLMCompletion({
      provider: "openai",
      model: "gpt-4o-mini",
      systemPrompt,
      userMessage: `Parse this email:\n\n${textBody}`,
      accountId: account.id
    });

    let extractedData;
    try {
      extractedData = JSON.parse(extractionResult.replace(/```json/g, "").replace(/```/g, "").trim());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.error("Failed to parse LLM extraction", extractionResult);
      return NextResponse.json({ error: "Failed to parse email" }, { status: 500 });
    }

    if (!extractedData.callerPhone) {
      console.log("No caller phone found in email, ignoring.");
      return NextResponse.json({ success: true, ignored: true, reason: "no_phone_number" });
    }

    // 2. Find workflows triggered by Email
    const activeWorkflows = await prisma.workflow.findMany({
      where: { isActive: true, accountId: account.id }
    });

    let matched = false;
    for (const wf of activeWorkflows) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let nodes: any[] = [];
      try {
        nodes = JSON.parse(wf.nodes);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) { continue; }

      const hasEmailTrigger = nodes.some(n => n.type === NodeType.TRIGGER_EMAIL);
      if (hasEmailTrigger) {
        matched = true;
        // 3. Enqueue the workflow
        await enqueueWorkflow(wf.id, {
          contactId: extractedData.callerPhone,
          phone: extractedData.callerPhone,
          agentName: extractedData.agentName,
          source: extractedData.source,
          rawEmailText: textBody
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      matched,
      extracted: extractedData 
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Email Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
