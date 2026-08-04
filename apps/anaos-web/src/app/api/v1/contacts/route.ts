import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    
    const query: any = { accountId };
    if (source && source !== "all") {
      query.source = source;
    }

    const parties = await prisma.party.findMany({
      where: query,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: parties,
    });
  } catch (error) {
    console.error("GET contacts error:", error);
    return NextResponse.json({ error: "Failed to list contacts" }, { status: 500 });
  }
}
