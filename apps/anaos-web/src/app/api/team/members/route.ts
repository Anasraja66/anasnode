import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// GET /api/team/members — list all users in account
export async function GET() {
  try {
    const accountId = await getAccountId();
    if (!accountId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [users, invites] = await Promise.all([
      prisma.user.findMany({
        where: { accountId },
        select: { id: true, email: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.teamInvite.findMany({
        where: { accountId, acceptedAt: null, expiresAt: { gt: new Date() } },
        select: { id: true, email: true, role: true, createdAt: true, expiresAt: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ success: true, users, pendingInvites: invites });
  } catch (err) {
    console.error("GET /api/team/members error:", err);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
