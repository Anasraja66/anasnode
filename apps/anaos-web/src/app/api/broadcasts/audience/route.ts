import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { countAudience, type AudienceFilter } from "@/lib/broadcast/audience";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const accountId = await requireAccountId();
    const body = await request.json();
    const filter = (body.filter || {}) as AudienceFilter;
    const count = await countAudience(accountId, filter);
    return NextResponse.json({ success: true, count });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
