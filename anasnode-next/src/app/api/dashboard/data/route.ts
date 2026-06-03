import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { normalizeIndustryLabel } from "@/lib/industry/presets";
import { FastApiClient } from "@/lib/api/fastapi";

function formatRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;
    if (!user?.accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = user.accountId;

    // Check FastAPI health in parallel
    const fastApiStatus = FastApiClient.checkHealth()
      .then(res => res.status === "online")
      .catch(() => false);

    // Fetch workspaces with their workflows (automations) from database
    const [dbWorkspaces, fastApiOnline] = await Promise.all([
      prisma.workspace.findMany({
        where: { accountId },
        orderBy: { createdAt: "desc" },
      }),
      fastApiStatus,
    ]);

    const parsedWorkspaces = [];

    for (const w of dbWorkspaces) {
      const industryLabel = normalizeIndustryLabel(w.industry);
      if (industryLabel !== w.industry) {
        await prisma.workspace.update({
          where: { id: w.id },
          data: { industry: industryLabel },
        });
      }

      // Fetch workflows for this workspace
      const dbWorkflows = await prisma.workflow.findMany({
        where: { workspaceId: w.id },
        orderBy: { createdAt: "desc" },
      });

      const automations = dbWorkflows.map(wf => {
        let stats = { runs: 0, success: 0, failed: 0 };
        try {
          stats = JSON.parse(wf.stats);
        } catch {}

        let nodes = [];
        let edges = [];
        try {
          nodes = JSON.parse(wf.nodes || "[]");
          edges = JSON.parse(wf.edges || "[]");
        } catch {}

        const lastRunAt = wf.lastRunAt
          ? formatRelativeTime(wf.lastRunAt)
          : "Never";

        return {
          id: wf.id,
          name: wf.name,
          description: wf.description || "",
          type: "whatsapp_flow" as const,
          enabled: wf.isActive,
          status: wf.isActive ? ("active" as const) : ("draft" as const),
          runs: stats.runs || 0,
          lastRun: lastRunAt,
          ctr: "n/a",
          lastModified: new Date(wf.updatedAt).toLocaleDateString(),
          nodes,
          edges,
        };
      });

      parsedWorkspaces.push({
        id: w.id,
        name: w.name,
        industry: industryLabel,
        slug: w.slug,
        plan: "pro" as const,
        automations,
        variables: []
      });
    }

    const inboxRows = await prisma.inboxConversation.findMany({
      where: { accountId },
      orderBy: { lastMessageAt: "desc" },
      take: 100,
    });

    const contacts = inboxRows.map((c) => ({
      id: c.id,
      name: c.contactName,
      phone: c.contactPhone,
      channel: c.channel,
      stage: c.optedOut ? "opted_out" : c.unreadCount > 0 ? "new" : "active",
      lastMessage: c.lastMessage || "—",
      time: formatRelativeTime(c.lastMessageAt),
      tags: (() => {
        try {
          return JSON.parse(c.tags || "[]");
        } catch {
          return [];
        }
      })(),
      unreadCount: c.unreadCount,
      aiEnabled: c.aiEnabled,
      optedOut: c.optedOut,
    }));

    const whatsappCred = await prisma.integrationCredential.findFirst({
      where: { accountId, type: "whatsapp", isActive: true },
    });

    const shopifyCred = await prisma.integrationCredential.findFirst({
      where: { accountId, type: "shopify", isActive: true },
    });

    return NextResponse.json({
      success: true,
      workspaces: parsedWorkspaces,
      contacts,
      integrations: {
        whatsapp: !!(whatsappCred || process.env.WHATSAPP_ACCESS_TOKEN),
        shopify: !!shopifyCred,
        fastapi: fastApiOnline,
      },
    });
  } catch (error) {
    console.error("[DASHBOARD_API_ERROR]:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
    }
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
