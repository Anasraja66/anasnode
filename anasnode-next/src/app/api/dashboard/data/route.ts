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

function getRequiredIntegrations(nodes: any[]): string[] {
  const reqs = new Set<string>();
  for (const n of nodes) {
    const type = n.type;
    if (
      type === "trigger_whatsapp" ||
      type === "send_whatsapp" ||
      type === "send_whatsapp_buttons" ||
      type === "send_whatsapp_list"
    ) {
      reqs.add("whatsapp");
    }
    if (type === "trigger_instagram" || type === "send_instagram_dm") {
      reqs.add("instagram");
    }
    if (type === "trigger_shopify" || type === "shopify_order") {
      reqs.add("shopify");
    }
    if (type === "google_calendar") {
      reqs.add("google_calendar");
    }
    if (type === "send_email") {
      reqs.add("smtp");
    }
  }
  // Default fallback if no nodes match
  if (reqs.size === 0) {
    reqs.add("whatsapp");
  }
  return Array.from(reqs);
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

    // Fetch all active integration credentials for this account
    const credentials = await prisma.integrationCredential.findMany({
      where: { accountId, isActive: true },
      select: { type: true },
    });
    const connectedTypes = new Set(credentials.map(c => c.type));
    if (process.env.WHATSAPP_ACCESS_TOKEN) {
      connectedTypes.add("whatsapp");
    }

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

        // Determine required integrations & check status
        const reqs = getRequiredIntegrations(nodes);
        const missing = reqs.filter(r => {
          if (r === "whatsapp" || r === "instagram" || r === "facebook") {
            return !connectedTypes.has("whatsapp");
          }
          if (r === "shopify") {
            return !connectedTypes.has("shopify");
          }
          if (r === "smtp" || r === "google_calendar" || r === "google_drive" || r === "google_sheets") {
            return !connectedTypes.has("smtp");
          }
          return !connectedTypes.has(r);
        });

        const isConnected = missing.length === 0;

        return {
          id: wf.id,
          name: wf.name,
          description: wf.description || "",
          type: "whatsapp_flow" as const,
          enabled: isConnected ? wf.isActive : false,
          status: !isConnected 
            ? ("needs_connection" as const) 
            : wf.isActive 
              ? ("active" as const) 
              : ("draft" as const),
          runs: stats.runs || 0,
          lastRun: lastRunAt,
          ctr: "n/a",
          lastModified: new Date(wf.updatedAt).toLocaleDateString(),
          nodes,
          edges,
          requiredIntegrations: reqs,
          missingIntegrations: missing,
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

    return NextResponse.json({
      success: true,
      workspaces: parsedWorkspaces,
      contacts,
      integrations: {
        whatsapp: connectedTypes.has("whatsapp"),
        shopify: connectedTypes.has("shopify"),
        smtp: connectedTypes.has("smtp"),
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
