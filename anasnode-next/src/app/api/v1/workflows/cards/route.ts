import { NextResponse } from "next/server";
import { getWorkflowCards } from "@/lib/workflow/card-view";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Missing required parameter: workspaceId" }, { status: 400 });
    }

    const cards = await getWorkflowCards(workspaceId);

    return NextResponse.json({
      success: true,
      cards,
    });
  } catch (error) {
    console.error("GET workflow cards error:", error);
    return NextResponse.json({ error: "Failed to load dashboard cards" }, { status: 500 });
  }
}
