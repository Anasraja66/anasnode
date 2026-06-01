import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// GET /api/v1/workflows - List workflows for accounts
export async function GET(request: Request) {
  try {
    const session = await auth();
    const accountId = session?.user?.accountId || "acc-default-user";
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    const query: any = { accountId };
    if (workspaceId) {
      query.workspaceId = workspaceId;
    }

    const workflows = await prisma.workflow.findMany({
      where: query,
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        version: true,
        stats: true,
        lastRunAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Parse stats string
    const formatted = workflows.map(w => ({
      ...w,
      stats: JSON.parse(w.stats || "{}"),
    }));

    return NextResponse.json({
      success: true,
      workflows: formatted,
    });
  } catch (error) {
    console.error("GET workflows error:", error);
    return NextResponse.json({ error: "Failed to list workflows" }, { status: 500 });
  }
}

// POST /api/v1/workflows - Create new workflow
export async function POST(request: Request) {
  try {
    const session = await auth();
    const accountId = session?.user?.accountId || "acc-default-user";
    const body = await request.json();
    const { name, description, workspaceId, nodes = [], edges = [] } = body;

    if (!name || !workspaceId) {
      return NextResponse.json({ error: "Missing required fields: name or workspaceId" }, { status: 400 });
    }

    // Verify workspace exists or auto-create in development
    const workspace = await prisma.workspace.upsert({
      where: { id: workspaceId },
      update: {},
      create: {
        id: workspaceId,
        accountId,
        name: "My Business Workspace",
        industry: "General",
        slug: "my-business-workspace",
        status: "draft",
      }
    });

    const workflow = await prisma.workflow.create({
      data: {
        accountId,
        workspaceId: workspace.id,
        name,
        description,
        nodes: JSON.stringify(nodes),
        edges: JSON.stringify(edges),
        variables: "[]",
        stats: JSON.stringify({ runs: 0, success: 0, failed: 0 }),
      },
    });

    return NextResponse.json({
      success: true,
      workflow: {
        ...workflow,
        nodes,
        edges,
        stats: { runs: 0, success: 0, failed: 0 },
      },
    });
  } catch (error) {
    console.error("POST workflow error:", error);
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 });
  }
}
