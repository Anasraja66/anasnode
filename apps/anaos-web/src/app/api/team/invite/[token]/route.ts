import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

// GET /api/team/invite/[token] — get invite info for the join page
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const invite = await prisma.teamInvite.findUnique({
      where: { token },
      include: { account: { select: { name: true, email: true } } },
    });

    if (!invite) return NextResponse.json({ error: "Invalid invite link" }, { status: 404 });
    if (invite.acceptedAt) return NextResponse.json({ error: "Invite already used" }, { status: 410 });
    if (new Date() > invite.expiresAt) return NextResponse.json({ error: "Invite expired" }, { status: 410 });

    return NextResponse.json({
      success: true,
      invite: { email: invite.email, role: invite.role, accountName: invite.account.name },
    });
  } catch (err) {
    console.error("GET /api/team/invite/[token]:", err);
    return NextResponse.json({ error: "Failed to fetch invite" }, { status: 500 });
  }
}

// POST /api/team/invite/[token] — accept invite + create user account
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const invite = await prisma.teamInvite.findUnique({ where: { token } });
    if (!invite) return NextResponse.json({ error: "Invalid invite" }, { status: 404 });
    if (invite.acceptedAt) return NextResponse.json({ error: "Already accepted" }, { status: 410 });
    if (new Date() > invite.expiresAt) return NextResponse.json({ error: "Invite expired" }, { status: 410 });

    const { name, password } = await request.json();
    if (!name || !password) return NextResponse.json({ error: "Name and password required" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if user with this email already exists
    const existing = await prisma.user.findUnique({ where: { email: invite.email } });
    if (existing) {
      // Just link to the account if they already exist
      await prisma.user.update({ where: { id: existing.id }, data: { accountId: invite.accountId, role: invite.role } });
    } else {
      await prisma.user.create({
        data: {
          email: invite.email,
          name,
          password: hashedPassword,
          role: invite.role,
          accountId: invite.accountId,
        },
      });
    }

    await prisma.teamInvite.update({
      where: { token },
      data: { acceptedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Account created — please log in" });
  } catch (err) {
    console.error("POST /api/team/invite/[token]:", err);
    return NextResponse.json({ error: "Failed to accept invite" }, { status: 500 });
  }
}
