import { NextRequest, NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

// GET /api/leads/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accountId = await requireAccountId();
    const { id } = await params;
    const lead = await prisma.lead.findFirst({
      where: { id, accountId },
      include: {
        property: true,
        activities: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// PATCH /api/leads/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accountId = await requireAccountId();
    const { id } = await params;
    const body = await req.json();

    // Get current lead for stage change tracking
    const currentLead = await prisma.lead.findFirst({ where: { id, accountId } });
    if (!currentLead) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.tags && Array.isArray(body.tags)) body.tags = JSON.stringify(body.tags);
    if (body.nextFollowUpAt) body.nextFollowUpAt = new Date(body.nextFollowUpAt);

    await prisma.lead.updateMany({
      where: { id, accountId },
      data: { ...body, updatedAt: new Date() },
    });

    // Auto log stage change
    if (body.stage && body.stage !== currentLead.stage) {
      await prisma.leadActivity.create({
        data: {
          leadId: id,
          type: "stage_change",
          content: `Stage changed: ${currentLead.stage} → ${body.stage}`,
          createdBy: "system",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// DELETE /api/leads/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accountId = await requireAccountId();
    const { id } = await params;
    await prisma.lead.deleteMany({ where: { id, accountId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
