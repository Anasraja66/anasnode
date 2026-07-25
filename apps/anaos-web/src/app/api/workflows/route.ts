import { NextRequest, NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma, isDbAvailable } from "@/lib/db";

// GET /api/workflows
export async function GET(req: NextRequest) {
  try {
    const accountId = await requireAccountId();
    if (!isDbAvailable || !prisma) {
      return NextResponse.json({ workflows: [] });
    }
    const workflows = await prisma.workflow.findMany({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ workflows });
  } catch (error) {
    return NextResponse.json({ workflows: [] });
  }
}

// POST /api/workflows
export async function POST(req: NextRequest) {
  try {
    const accountId = await requireAccountId();
    const body = await req.json();

    // No DB — return a fake workflow ID so builder opens
    if (!isDbAvailable || !prisma) {
      const fakeId = `demo-${Date.now()}`;
      return NextResponse.json({
        workflow: {
          id: fakeId,
          name: body.name || "Untitled Automation",
          description: body.description || "",
          isActive: false,
          mode: "draft",
          definition: body.definition || "{}",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }, { status: 201 });
    }

    const workflow = await prisma.workflow.create({
      data: {
        accountId,
        workspaceId: body.workspaceId || accountId,
        name: body.name || "Untitled Automation",
        description: body.description || "",
        mode: "draft",
        isActive: false,
        definition: body.definition || "{}",
      }
    });

    return NextResponse.json({ workflow }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 });
  }
}
