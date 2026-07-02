import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      // Mock for development if no session
      const broadcasts = await prisma.broadcastCampaign.findMany({
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ broadcasts });
    }

    const broadcasts = await prisma.broadcastCampaign.findMany({
      where: { accountId: (session.user as any).accountId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ broadcasts });
  } catch (error) {
    console.error("Broadcasts GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, channel, audience, bodyText } = body;

    const session = await auth();
    
    // For development fallback to the first account if no session
    let accountId = (session?.user as any)?.accountId;
    if (!accountId) {
      const firstAccount = await prisma.account.findFirst();
      if (!firstAccount) throw new Error("No account found");
      accountId = firstAccount.id;
    }

    const campaign = await prisma.broadcastCampaign.create({
      data: {
        accountId,
        name: name || "Untitled Campaign",
        bodyText,
        category: channel || "marketing",
        status: "sent",
        sentCount: Math.floor(Math.random() * 500) + 50, // Simulated count for now
        failedCount: 0,
      }
    });

    // In a real scenario, this is where we would map over all InboxConversations
    // and dispatch Twilio / SendGrid messages asynchronously using BullMQ or Vercel waitUntil.

    return NextResponse.json({ success: true, campaign });
  } catch (error) {
    console.error("Broadcasts POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
