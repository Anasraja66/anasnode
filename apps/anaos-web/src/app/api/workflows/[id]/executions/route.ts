import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workflowId } = await params;
    const session = await getServerSession(authOptions);

    const executions = await prisma.workflowExecution.findMany({
      where: { workflowId },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, executions });
  } catch (error) {
    console.error("Fetch executions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
