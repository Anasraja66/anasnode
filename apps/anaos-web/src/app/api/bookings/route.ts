import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accountId = await requireAccountId();
    
    const bookings = await prisma.bookingEvent.findMany({
      where: { accountId },
      orderBy: { startAt: 'asc' },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
