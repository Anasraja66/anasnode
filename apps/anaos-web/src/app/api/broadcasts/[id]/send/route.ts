import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { sendBroadcastCampaign } from "@/lib/broadcast/send-campaign";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, ctx: Ctx) {
  try {
    const accountId = await requireAccountId();
    const { id } = await ctx.params;
    const result = await sendBroadcastCampaign({ campaignId: id, accountId });
    return NextResponse.json({ success: true, ...result });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const message = e instanceof Error ? e.message : "Send failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
