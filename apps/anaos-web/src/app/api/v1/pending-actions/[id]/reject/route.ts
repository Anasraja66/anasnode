import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAccountId } from "@/lib/auth/session";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accountId = await requireAccountId();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const action = await prisma.pendingAction.findUnique({
      where: { id },
    });

    if (!action || action.accountId !== accountId) {
      return NextResponse.json({ success: false, error: "Action not found" }, { status: 404 });
    }

    await prisma.pendingAction.update({
      where: { id },
      data: { status: "rejected" },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/v1/pending-actions/[id]/reject error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
