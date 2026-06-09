import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { loadKnowledgeDocs, buildKnowledgeContext } from "@/lib/knowledge/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;
    const accountId = user?.accountId as string | undefined;
    if (!accountId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const workspaceId = (searchParams.get("workspaceId") || "").trim() || undefined;
    if (!q) return NextResponse.json({ error: "q is required" }, { status: 400 });

    const docs = await loadKnowledgeDocs({ accountId, workspaceId, limit: 12 });
    const { context, matchedDocIds } = buildKnowledgeContext({
      query: q,
      docs,
      maxChunks: 6,
      maxChars: 1600,
    });

    return NextResponse.json({
      success: true,
      matchedDocIds,
      context,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to search knowledge";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

