import { NextRequest, NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

// GET /api/leads
export async function GET(req: NextRequest) {
  try {
    const accountId = await requireAccountId();
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage");
    const source = searchParams.get("source");
    const search = searchParams.get("search");
    const assignedTo = searchParams.get("assignedTo");

    const where: Record<string, unknown> = { accountId };
    if (stage) where.stage = stage;
    if (source) where.source = source;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { id: true, title: true, referenceNumber: true } },
        _count: { select: { activities: true } },
      },
    });

    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/leads
export async function POST(req: NextRequest) {
  try {
    const accountId = await requireAccountId();
    const body = await req.json();
    const {
      name, phone, email, source, stage, budgetMin, budgetMax,
      currency, preferredArea, preferredType, preferredAction,
      notes, tags, assignedTo, conversationId, interestedIn,
      priority, nextFollowUpAt, workspaceId,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        accountId,
        workspaceId: workspaceId || null,
        name,
        phone: phone || "",
        email: email || "",
        source: source || "manual",
        stage: stage || "new",
        budgetMin: budgetMin || 0,
        budgetMax: budgetMax || 0,
        currency: currency || "AED",
        preferredArea: preferredArea || "",
        preferredType: preferredType || "",
        preferredAction: preferredAction || "buy",
        notes: notes || "",
        tags: JSON.stringify(tags || []),
        assignedTo: assignedTo || null,
        conversationId: conversationId || null,
        interestedIn: interestedIn || null,
        priority: priority || "medium",
        nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt) : null,
      },
    });

    // Auto log creation activity
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "stage_change",
        content: `Lead created from ${source || "manual"}`,
        createdBy: "system",
      },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
