import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAccountId } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const accountId = await requireAccountId();

    const actions = await prisma.pendingAction.findMany({
      where: {
        accountId: accountId,
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, actions });
  } catch (error: any) {
    console.error("GET /api/v1/pending-actions error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
