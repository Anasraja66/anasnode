import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const accountId = session?.user?.accountId || "acc-default-user";

    const workflow = await prisma.workflow.findFirst({
      where: { id, accountId },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const formatted = {
      ...workflow,
      nodes: JSON.parse(workflow.nodes || "[]"),
      edges: JSON.parse(workflow.edges || "[]"),
      variables: JSON.parse(workflow.variables || "[]"),
      stats: JSON.parse(workflow.stats || "{}"),
    };

    return NextResponse.json({
      success: true,
      workflow: formatted,
    });
  } catch (error) {
    console.error("GET workflow error:", error);
    return NextResponse.json({ error: "Failed to fetch workflow" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const accountId = session?.user?.accountId || "acc-default-user";
    const body = await request.json();
    const { name, description, nodes, edges, variables } = body;

    const workflow = await prisma.workflow.findFirst({
      where: { id, accountId },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const updated = await prisma.workflow.update({
      where: { id },
      data: {
        name: name !== undefined ? name : workflow.name,
        description: description !== undefined ? description : workflow.description,
        nodes: nodes !== undefined ? JSON.stringify(nodes) : workflow.nodes,
        edges: edges !== undefined ? JSON.stringify(edges) : workflow.edges,
        variables: variables !== undefined ? JSON.stringify(variables) : workflow.variables,
        version: workflow.version + 1, // Increment layout version
      },
    });

    return NextResponse.json({
      success: true,
      workflow: {
        ...updated,
        nodes: JSON.parse(updated.nodes || "[]"),
        edges: JSON.parse(updated.edges || "[]"),
        variables: JSON.parse(updated.variables || "[]"),
        stats: JSON.parse(updated.stats || "{}"),
      },
    });
  } catch (error) {
    console.error("PUT workflow error:", error);
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 });
  }
}
