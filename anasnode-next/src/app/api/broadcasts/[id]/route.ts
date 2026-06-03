import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { countAudience, parseAudienceFilter } from "@/lib/broadcast/audience";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const accountId = await requireAccountId();
    const { id } = await ctx.params;
    const campaign = await prisma.broadcastCampaign.findFirst({
      where: { id, accountId },
    });
    if (!campaign) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const filter = parseAudienceFilter(campaign.audienceFilter);
    const audienceCount = await countAudience(accountId, filter);
    return NextResponse.json({ success: true, campaign, audienceCount });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const accountId = await requireAccountId();
    const { id } = await ctx.params;
    const body = await request.json();

    const existing = await prisma.broadcastCampaign.findFirst({
      where: { id, accountId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const campaign = await prisma.broadcastCampaign.update({
      where: { id },
      data: {
        name: body.name !== undefined ? String(body.name).slice(0, 120) : undefined,
        bodyText: body.bodyText !== undefined ? String(body.bodyText) : undefined,
        footerText: body.footerText !== undefined ? String(body.footerText) : undefined,
        optOutLine: body.optOutLine !== undefined ? String(body.optOutLine) : undefined,
        category:
          body.category !== undefined
            ? body.category === "utility"
              ? "utility"
              : "marketing"
            : undefined,
        languageCode:
          body.languageCode !== undefined ? String(body.languageCode) : undefined,
        outside24h:
          body.outside24h !== undefined ? Boolean(body.outside24h) : undefined,
        dailyCap:
          body.dailyCap !== undefined
            ? Math.min(1000, Math.max(50, Number(body.dailyCap)))
            : undefined,
        audienceFilter:
          body.audienceFilter !== undefined
            ? JSON.stringify(body.audienceFilter)
            : undefined,
        status: body.status !== undefined ? String(body.status) : undefined,
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
