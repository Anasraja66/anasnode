import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const user = session?.user as any;
    if (!user?.accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = user.accountId;

    // Fetch workspaces with their workflows (automations) from database
    const dbWorkspaces = await prisma.workspace.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    });

    const parsedWorkspaces = [];

    for (const w of dbWorkspaces) {
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

        return {
          id: wf.id,
          name: wf.name,
          description: wf.description || "",
          type: "whatsapp_flow" as const,
          status: wf.isActive ? ("active" as const) : ("draft" as const),
          runs: stats.runs || 0,
          ctr: "n/a",
          lastModified: new Date(wf.updatedAt).toLocaleDateString(),
          nodes,
          edges
        };
      });

      parsedWorkspaces.push({
        id: w.id,
        name: w.name,
        industry: w.industry,
        slug: w.slug,
        plan: "pro" as const,
        automations,
        variables: []
      });
    }

    // Fetch recent workflow executions to display as real contacts/activities!
    const recentExecutions = await prisma.workflowExecution.findMany({
      where: {
        workflow: {
          accountId
        }
      },
      include: {
        workflow: true
      },
      orderBy: {
        startedAt: "desc"
      },
      take: 10
    });

    // Extract contacts from recent executions or return empty list
    const contacts = recentExecutions.map((e, idx) => {
      let input: any = {};
      try {
        input = JSON.parse(e.input);
      } catch {}

      const name = input.name || `WhatsApp User ${idx + 1}`;
      const phone = input.phone || e.contactId || "WhatsApp Bot";

      return {
        id: e.id,
        name,
        phone,
        channel: "WhatsApp",
        stage: e.status === "success" ? "Qualified" : "Reminded",
        lastMessage: input.message || "Flow completed",
        time: new Date(e.startedAt).toLocaleDateString(),
        tags: e.status === "success" ? ["hot-lead"] : []
      };
    });

    return NextResponse.json({
      success: true,
      workspaces: parsedWorkspaces,
      contacts
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
