import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { fetchGoogleDocText } from "@/lib/knowledge/google-doc";
import { saveKnowledgeDoc } from "@/lib/knowledge/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    const accountId = user?.accountId;
    if (!accountId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      workspaceId,
      url,
      text,
      title,
    } = body as { workspaceId?: string; url?: string; text?: string; title?: string };

    let content = (text || "").trim();
    const sourceUrl = url?.trim() || undefined;

    if (!content && sourceUrl) {
      content = await fetchGoogleDocText(sourceUrl);
    }

    if (!content) {
      return NextResponse.json({ error: "Provide text or a Google Doc URL." }, { status: 400 });
    }

    const finalTitle =
      (title || "").trim() ||
      (sourceUrl ? "Uploaded Doc" : "Uploaded Text");

    const saved = await saveKnowledgeDoc({
      accountId,
      workspaceId,
      sourceUrl,
      title: finalTitle,
      content,
    });

    return NextResponse.json({
      success: true,
      doc: saved,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to ingest knowledge";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

