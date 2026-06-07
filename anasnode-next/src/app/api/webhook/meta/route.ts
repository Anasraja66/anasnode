import { NextResponse } from "next/server";
import { AnaosNLP } from "@/lib/ai/pipeline/AnaosNLP";
import { esClient } from "@/lib/db/searchEngine";
import { IndustryType } from "@/lib/ai/resources/lexicons";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Mock extraction of a message from Meta Webhook
    // In a real scenario, we'd parse the complex WhatsApp/Messenger JSON structure.
    const incomingMessage = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || body.message;
    const businessIndustry: IndustryType = body.industry || "general";

    if (!incomingMessage) {
      return NextResponse.json({ success: false, error: "No message found" }, { status: 400 });
    }

    // 1. Process the text through our NLP Pipeline (GATE architecture)
    const nlpDocument = AnaosNLP.processText(incomingMessage, businessIndustry);

    // 2. Index the processed document into our Search Engine (Elasticsearch simulation)
    const docId = await esClient.indexDocument(nlpDocument);

    return NextResponse.json({
      success: true,
      message: "Message processed and indexed successfully",
      indexedId: docId,
      nlpResult: nlpDocument
    });
  } catch (error: any) {
    console.error("[Meta Webhook Error]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
