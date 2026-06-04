import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function GET() {
  try {
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workflows = await prisma.workflow.findMany({
      where: { accountId },
      select: { id: true, isActive: true, stats: true },
    });

    const workflowIds = workflows.map((w: { id: string }) => w.id);

    const since = new Date();
    since.setDate(since.getDate() - 6);
    since.setHours(0, 0, 0, 0);

    const executions = workflowIds.length
      ? await prisma.workflowExecution.findMany({
          where: {
            workflowId: { in: workflowIds },
            startedAt: { gte: since },
          },
          select: { status: true, startedAt: true, duration: true },
        })
      : [];

    let totalRuns = 0;
    let successRuns = 0;
    let failedRuns = 0;

    for (const w of workflows) {
      try {
        const s = JSON.parse(w.stats || "{}");
        totalRuns += Number(s.runs) || 0;
        successRuns += Number(s.success) || 0;
        failedRuns += Number(s.failed) || 0;
      } catch {
        /* ignore */
      }
    }

    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return {
        key: d.toISOString().slice(0, 10),
        label: DAY_LABELS[d.getDay()],
        inbound: 0,
        automated: 0,
      };
    });

    for (const ex of executions) {
      const key = ex.startedAt.toISOString().slice(0, 10);
      const bucket = last7.find((b) => b.key === key);
      if (!bucket) continue;
      bucket.inbound += 1;
      if (ex.status === "success") bucket.automated += 1;
    }

    const credentials = await prisma.integrationCredential.findMany({
      where: { accountId, isActive: true },
      select: { type: true },
    });

    return NextResponse.json({
      success: true,
      summary: {
        automationRuns: totalRuns,
        successfulRuns: successRuns,
        failedRuns: failedRuns,
        activeAutomations: workflows.filter((w: { isActive: boolean }) => w.isActive).length,
        connectedChannels: credentials.length,
        executionsLast7Days: executions.length,
      },
      chart: last7.map(({ label, inbound, automated }) => ({
        label,
        inbound,
        automated,
      })),
      integrations: credentials.map((c) => c.type),
    });
  } catch (error) {
    console.error("analytics summary error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
