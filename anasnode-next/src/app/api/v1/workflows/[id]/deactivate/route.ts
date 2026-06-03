import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workflow = await prisma.workflow.findFirst({
      where: { id, accountId },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const updated = await prisma.workflow.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      isActive: false,
      message: `Workflow "${updated.name}" has been deactivated.`,
    });
  } catch (error: any) {
    console.error("Workflow deactivation error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
