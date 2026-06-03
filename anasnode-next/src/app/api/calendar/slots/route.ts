import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import { getAvailableSlots, parseBookingDate } from "@/lib/google/calendar";

export const dynamic = "force-dynamic";

// GET /api/calendar/slots?date=today|tomorrow|2025-06-10
export async function GET(request: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date") || "today";

    const date = parseBookingDate(dateStr);
    const slots = await getAvailableSlots(accountId, date);

    return NextResponse.json({
      success: true,
      date: date.toISOString().split("T")[0],
      slots: slots.map((s) => ({
        id: s.id,
        label: s.label,
        dateLabel: s.dateLabel,
        startAt: s.startAt.toISOString(),
        endAt: s.endAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("GET /api/calendar/slots:", err);
    return NextResponse.json({ error: "Failed to get slots" }, { status: 500 });
  }
}
