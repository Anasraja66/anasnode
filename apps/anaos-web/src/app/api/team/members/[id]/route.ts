import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// PUT /api/team/members/[id] — change role
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accountId = await getAccountId();
    if (!accountId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { role } = await request.json();
    if (!["owner", "admin", "agent"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { id, accountId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("PUT /api/team/members/[id] error:", err);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

// DELETE /api/team/members/[id] — remove member
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const accountId = await getAccountId();
    if (!accountId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({ where: { id, accountId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Don't allow removing the last owner
    if (user.role === "owner") {
      const ownerCount = await prisma.user.count({ where: { accountId, role: "owner" } });
      if (ownerCount <= 1) {
        return NextResponse.json({ error: "Cannot remove the only owner" }, { status: 400 });
      }
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/team/members/[id] error:", err);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
