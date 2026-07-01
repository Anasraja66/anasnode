import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId"); // In real app, from session

    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.inboxConversation.findMany({
      where: { accountId },
      orderBy: { lastMessageAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error("Inbox list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
