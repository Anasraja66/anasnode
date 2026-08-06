import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { workflowId: id };
    if (status) {
      query.status = status;
    }

    const executions = await prisma.workflowExecution.findMany({
      where: query,
      orderBy: { startedAt: "desc" },
      take: 20, // limit to last 20 runs
    });

    const formatted = executions.map(e => ({
      ...e,
      input: JSON.parse(e.input || "{}"),
      output: JSON.parse(e.output || "{}"),
      logs: JSON.parse(e.logs || "[]"),
    }));

    return NextResponse.json({
      success: true,
      executions: formatted,
    });
  } catch (error) {
    console.error("GET executions error:", error);
    return NextResponse.json({ error: "Failed to fetch execution list" }, { status: 500 });
  }
}
