import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { generateBroadcastFromPrompt } from "@/lib/broadcast/generate-from-prompt";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const accountId = await requireAccountId();
    const { prompt, workspaceId, workspaceName } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Describe your broadcast" }, { status: 400 });
    }

    const wsName = workspaceName || "Your business";
    const generated = await generateBroadcastFromPrompt(prompt.trim(), wsName);

    const campaign = await prisma.broadcastCampaign.create({
      data: {
        accountId,
        workspaceId: workspaceId || null,
        name: generated.name,
        bodyText: generated.bodyText,
        footerText: generated.footerText,
        optOutLine: generated.optOutLine,
        category: generated.category,
        languageCode: generated.languageCode,
        outside24h: generated.outside24h,
        dailyCap: generated.dailyCap,
        promptSource: prompt.trim(),
        audienceFilter: JSON.stringify({
          match: "all",
          tags: generated.audienceTags,
          excludeOptedOut: true,
        }),
        status: "draft",
      },
    });

    return NextResponse.json({ success: true, campaign, generated });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("broadcast from-prompt:", e);
    return NextResponse.json({ error: "Failed to generate broadcast" }, { status: 500 });
  }
}
