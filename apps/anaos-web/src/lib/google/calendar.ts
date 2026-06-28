/**
 * Google Calendar — Mock + Real API client
 *
 * When GOOGLE_CALENDAR_MOCK=true (default) → returns realistic fake slots
 * When real credentials are set → calls Google Calendar API
 *
 * This lets you demo the full booking flow without OAuth setup.
 */

export type TimeSlot = {
  id: string;
  startAt: Date;
  endAt: Date;
  label: string;      // "10:00 AM - 11:00 AM"
  dateLabel: string;  // "Monday, June 3"
};

const SLOT_DURATION_MINUTES = 60;
const SLOTS_PER_DAY = 6;
const BUSINESS_HOURS = { start: 9, end: 18 }; // 9am - 6pm

/**
 * Get available time slots for a given date
 * In mock mode: generates realistic available slots (some occupied)
 */
export async function getAvailableSlots(
  accountId: string,
  date: Date
): Promise<TimeSlot[]> {
  // Always use mock for now
  return getMockSlots(date);
}

function getMockSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const d = new Date(date);
  d.setHours(BUSINESS_HOURS.start, 0, 0, 0);

  // Deterministic "busy" hours based on day of week (looks realistic)
  const busyHours = getBusyHours(d);

  for (let i = 0; i < SLOTS_PER_DAY; i++) {
    const startHour = BUSINESS_HOURS.start + i * (SLOT_DURATION_MINUTES / 60);
    if (startHour >= BUSINESS_HOURS.end) break;

    // Skip "busy" hours
    if (busyHours.includes(startHour)) continue;

    const startAt = new Date(d);
    startAt.setHours(startHour, 0, 0, 0);

    const endAt = new Date(startAt);
    endAt.setMinutes(endAt.getMinutes() + SLOT_DURATION_MINUTES);

    const slotId = `slot-${startAt.getTime()}`;

    slots.push({
      id: slotId,
      startAt,
      endAt,
      label: formatTimeRange(startAt, endAt),
      dateLabel: formatDateLabel(startAt),
    });
  }

  return slots;
}

function getBusyHours(date: Date): number[] {
  // Deterministic busy pattern based on day of week
  const dow = date.getDay();
  const patterns: Record<number, number[]> = {
    0: [9, 10, 14],   // Sunday
    1: [10, 13, 15],  // Monday
    2: [9, 11, 16],   // Tuesday
    3: [13, 14],      // Wednesday
    4: [10, 15, 17],  // Thursday
    5: [9, 12, 16],   // Friday
    6: [11, 14],      // Saturday
  };
  return patterns[dow] || [];
}

function formatTimeRange(start: Date, end: Date): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

/**
 * Parse a date from natural language: "today", "tomorrow", "monday", or ISO date
 */
export function parseBookingDate(input: string): Date {
  const lower = input.trim().toLowerCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (lower === "today") return today;
  if (lower === "tomorrow") {
    const t = new Date(today);
    t.setDate(t.getDate() + 1);
    return t;
  }

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayIdx = days.indexOf(lower);
  if (dayIdx !== -1) {
    const current = today.getDay();
    let diff = dayIdx - current;
    if (diff <= 0) diff += 7;
    const result = new Date(today);
    result.setDate(today.getDate() + diff);
    return result;
  }

  // Try parsing as ISO date
  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) return parsed;

  // Default: today
  return today;
}

/**
 * Format slots into a WhatsApp-friendly message
 */
export function formatSlotsMessage(slots: TimeSlot[], dateLabel?: string): string {
  if (slots.length === 0) {
    return "No available slots for that day. Would you like to check another day?";
  }

  const header = dateLabel
    ? `📅 Available slots for *${dateLabel}*:\n\n`
    : `📅 Available slots:\n\n`;

  const list = slots
    .map((s, i) => `${i + 1}️⃣ ${s.label}`)
    .join("\n");

  return header + list + "\n\nReply with a number to book, or say a different date.";
}
