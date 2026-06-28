import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/calendar/bookings — list bookings
export async function GET(request: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const limit = parseInt(searchParams.get("limit") || "20");

    const bookings = await prisma.bookingEvent.findMany({
      where: { accountId, ...(status ? { status } : {}) },
      orderBy: { startAt: "asc" },
      take: limit,
    });

    const now = new Date();
    const todayBookings = bookings.filter(
      (b: { startAt: Date }) => b.startAt >= new Date(now.setHours(0, 0, 0, 0))
        && b.startAt < new Date(now.setHours(23, 59, 59, 999))
    );

    return NextResponse.json({ success: true, bookings, todayCount: todayBookings.length });
  } catch (err) {
    console.error("GET /api/calendar/bookings:", err);
    return NextResponse.json({ error: "Failed to get bookings" }, { status: 500 });
  }
}
