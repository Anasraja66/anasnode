import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { defaultOptOutLine } from "@/lib/broadcast/meta-policy";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accountId = await requireAccountId();
    const rows = await prisma.broadcastCampaign.findMany({
      where: { accountId },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, campaigns: rows });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load broadcasts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const accountId = await requireAccountId();
    const body = await request.json();
    const name = String(body.name || "Untitled broadcast").slice(0, 120);

    const campaign = await prisma.broadcastCampaign.create({
      data: {
        accountId,
        workspaceId: body.workspaceId || null,
        name,
        bodyText: String(body.bodyText || "").slice(0, 4096),
        footerText: String(body.footerText || "").slice(0, 200),
        optOutLine: String(body.optOutLine || defaultOptOutLine(body.languageCode || "en")),
        category: body.category === "utility" ? "utility" : "marketing",
        languageCode: String(body.languageCode || "en"),
        outside24h: body.outside24h !== false,
        audienceFilter: JSON.stringify(body.audienceFilter || { tags: [], excludeOptedOut: true }),
        dailyCap: Math.min(1000, Math.max(50, Number(body.dailyCap) || 250)),
        status: "draft",
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to create broadcast" }, { status: 500 });
  }
}
