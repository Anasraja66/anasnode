import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/calendar/book — create a booking
export async function POST(request: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { contactPhone, contactName, title, startAt, endAt, notes, channel } = await request.json();

    if (!contactPhone || !startAt || !endAt) {
      return NextResponse.json({ error: "contactPhone, startAt, endAt required" }, { status: 400 });
    }

    const booking = await prisma.bookingEvent.create({
      data: {
        accountId,
        contactPhone,
        contactName: contactName || "Customer",
        title: title || "Appointment",
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        notes: notes || "",
        channel: channel || "whatsapp",
        status: "confirmed",
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("POST /api/calendar/book:", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
