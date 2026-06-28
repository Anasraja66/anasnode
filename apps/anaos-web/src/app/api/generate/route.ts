import { NextResponse } from "next/server";
import { resolveWorkspaceFromPrompt } from "@/lib/generate/workspace";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const workspace = await resolveWorkspaceFromPrompt(prompt);

    return NextResponse.json({
      success: true,
      workspace,
    });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
