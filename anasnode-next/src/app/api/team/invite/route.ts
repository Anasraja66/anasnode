import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// POST /api/team/invite — create invite link
export async function POST(request: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { email, role = "agent" } = await request.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    if (!["admin", "agent"].includes(role)) {
      return NextResponse.json({ error: "Invalid role — can only invite admin or agent" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.accountId === accountId) {
      return NextResponse.json({ error: "User already in your team" }, { status: 409 });
    }

    // Expire old invites for same email
    await prisma.teamInvite.deleteMany({ where: { accountId, email, acceptedAt: null } });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const invite = await prisma.teamInvite.create({
      data: { accountId, email, role, expiresAt },
    });

    const inviteUrl = `${process.env.NEXTAUTH_URL}/join/${invite.token}`;
    return NextResponse.json({ success: true, inviteUrl, invite });
  } catch (err) {
    console.error("POST /api/team/invite error:", err);
    return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });
  }
}
