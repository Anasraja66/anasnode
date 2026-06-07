import { NextResponse } from "next/server";
import { QAEngine, calculateMeanMRR } from "@/lib/ai/pipeline/QAEngine";
import { IndustryType } from "@/lib/ai/resources/lexicons";

/**
 * POST /api/qa
 * Body: { question: string, industry?: string }
 * Returns: Full QA result with answer, candidates, passages, MRR score
 *
 * GET /api/qa?q=question&industry=real-estate
 * Same as POST but via query params
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, industry = "general" } = body;

    if (!question?.trim()) {
      return NextResponse.json(
        { success: false, error: "question is required" },
        { status: 400 }
      );
    }

    const result = await QAEngine.answer(question.trim(), industry as IndustryType);

    return NextResponse.json({
      success: true,
      question: result.question,
      answerType: result.answerType,
      answer: result.topAnswer?.text ?? "No answer found in indexed data.",
      confidence: result.topAnswer?.confidence ?? 0,
      mrrScore: result.mrrScore,
      keywords: result.keywords,
      allCandidates: result.allCandidates,
      passages: result.passages,
      nlpBreakdown: {
        intent: result.nlpAnalysis.intent,
        sentiment: result.nlpAnalysis.sentiment,
        posTagString: result.nlpAnalysis.posTagString,
        entities: result.nlpAnalysis.annotations,
        summary: result.nlpAnalysis.summary,
      },
    });
  } catch (error: any) {
    console.error("[QA Engine Error]", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const question = searchParams.get("q");
  const industry = (searchParams.get("industry") ?? "general") as IndustryType;

  if (!question?.trim()) {
    return NextResponse.json(
      { success: false, error: "q (question) param is required" },
      { status: 400 }
    );
  }

  try {
    const result = await QAEngine.answer(question.trim(), industry);

    return NextResponse.json({
      success: true,
      question: result.question,
      answerType: result.answerType,
      answer: result.topAnswer?.text ?? "No answer found in indexed data.",
      confidence: result.topAnswer?.confidence ?? 0,
      mrrScore: result.mrrScore,
      keywords: result.keywords,
      passages: result.passages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
