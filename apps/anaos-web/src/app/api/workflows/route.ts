import { NextRequest, NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

// GET /api/workflows
export async function GET(req: NextRequest) {
  try {
    const accountId = await requireAccountId();
    const workflows = await prisma.workflow.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ workflows });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/workflows
export async function POST(req: NextRequest) {
  try {
    const accountId = await requireAccountId();
    const body = await req.json();
    
    // Fallback default node (Trigger)
    const defaultNodes = [{
      id: "trigger-1",
      type: "trigger_webhook",
      name: "Webhook Trigger",
      position: { x: 250, y: 100 },
      data: { label: "Trigger" },
      outputs: []
    }];

    const workflow = await prisma.workflow.create({
      data: {
        accountId,
        workspaceId: body.workspaceId || accountId, // Fallback if no workspace
        name: body.name || "Untitled Automation",
        description: body.description || "",
        mode: "draft",
        isActive: false,
        nodes: JSON.stringify(body.nodes || defaultNodes),
        edges: JSON.stringify(body.edges || []),
      }
    });

    return NextResponse.json({ workflow }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
