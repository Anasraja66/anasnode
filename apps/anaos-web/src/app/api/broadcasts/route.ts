/**
 * GET/POST /api/broadcasts
 *
 * GET  — List all broadcast campaigns for the authenticated account
 * POST — Create a new campaign and immediately trigger message delivery
 *
 * Both routes require authentication.
 * Unauthenticated requests always get 401 — no dev fallbacks.
 */

import { after, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, AuthError } from "@/lib/api/auth-helper";
import { sendBroadcastCampaign } from "@/lib/broadcast/send-campaign";

export const dynamic = "force-dynamic";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CreateBroadcastBody {
  name?: string;
  bodyText: string;
  footerText?: string;
  optOutLine?: string;
  category?: string;
  audienceFilter?: Record<string, any>;
  dailyCap?: number;
  workspaceId?: string;
}

// ── GET — List campaigns ──────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  try {
    const { accountId } = await requireAuth();

    const campaigns = await prisma.broadcastCampaign.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ broadcasts: campaigns });
  } catch (err) {
    if (err instanceof AuthError) return err.response;
    console.error("[Broadcasts GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST — Create + send campaign ────────────────────────────────────────────

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { accountId } = await requireAuth();

    const body: CreateBroadcastBody = await request.json();

    if (!body.bodyText?.trim()) {
      return NextResponse.json(
        { error: "bodyText is required" },
        { status: 400 }
      );
    }

    // 1. Create the campaign record
    const campaign = await prisma.broadcastCampaign.create({
      data: {
        accountId,
        workspaceId: body.workspaceId || null,
        name: body.name || "Untitled Campaign",
        bodyText: body.bodyText,
        footerText: body.footerText || "",
        optOutLine: body.optOutLine || "Reply STOP to opt out.",
        category: body.category || "marketing",
        audienceFilter: body.audienceFilter
          ? JSON.stringify(body.audienceFilter)
          : "{}",
        dailyCap: body.dailyCap || 250,
        status: "sending",
      },
    });

    console.log(`[Broadcasts] Campaign "${campaign.name}" (${campaign.id}) created`);

    // 2. Send messages in background — do not block the HTTP response
    after(async () => {
      try {
        const result = await sendBroadcastCampaign({
          campaignId: campaign.id,
          accountId,
        });

        console.log(
          `[Broadcasts] Campaign ${campaign.id} complete: sent=${result.sent} failed=${result.failed}`
        );
      } catch (err: any) {
        console.error(`[Broadcasts] Campaign ${campaign.id} send failed:`, err.message);

        // Mark campaign as failed
        await prisma.broadcastCampaign.update({
          where: { id: campaign.id },
          data: { status: "failed" },
        }).catch(() => null);
      }
    });

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
      },
      message: "Campaign created and sending started",
    });
  } catch (err) {
    if (err instanceof AuthError) return err.response;
    console.error("[Broadcasts POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
