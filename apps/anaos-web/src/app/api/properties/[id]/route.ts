import { NextRequest, NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

// GET /api/properties/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accountId = await requireAccountId();
    const { id } = await params;
    const property = await prisma.property.findFirst({
      where: { id, accountId },
      include: { _count: { select: { leads: true } } },
    });
    if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ property });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// PATCH /api/properties/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accountId = await requireAccountId();
    const { id } = await params;
    const body = await req.json();

    if (body.images && Array.isArray(body.images)) body.images = JSON.stringify(body.images);
    if (body.amenities && Array.isArray(body.amenities)) body.amenities = JSON.stringify(body.amenities);

    const result = await prisma.property.updateMany({
      where: { id, accountId },
      data: { ...body, updatedAt: new Date() },
    });

    if (result.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// DELETE /api/properties/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const accountId = await requireAccountId();
    const { id } = await params;
    await prisma.property.deleteMany({ where: { id, accountId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
