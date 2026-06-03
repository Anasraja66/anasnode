import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { parseTagsJson } from "@/lib/inbox/tags";
import { normalizePhone } from "@/lib/contacts/phone";
import {
  displayContactName,
  parseCustomFieldsJson,
} from "@/lib/contacts/profile";
import { upsertImportedContact } from "@/lib/contacts/upsert";
import { handleApiError, ValidationError } from "@/lib/errors";
import { contactSchema } from "@/lib/validation/contact";

export const dynamic = "force-dynamic";

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

function mapContact(c: any) {
  return {
    id: c.id,
    name: c.contactName,
    firstName: c.firstName,
    lastName: c.lastName,
    phone: c.contactPhone,
    email: c.email,
    gender: c.gender,
    customFields: parseCustomFieldsJson(c.customFields),
    channel: c.channel,
    lastMessage: c.lastMessage,
    time: formatRelative(c.lastMessageAt),
    lastMessageAt: c.lastMessageAt.toISOString(),
    unreadCount: c.unreadCount,
    tags: parseTagsJson(c.tags),
    optedOut: c.optedOut,
    aiEnabled: c.aiEnabled,
    lastInboundAt: c.lastInboundAt?.toISOString() ?? null,
    stage: c.optedOut ? "opted_out" : c.unreadCount > 0 ? "new" : "active",
  };
}

export async function GET(request: Request) {
  try {
    const accountId = await requireAccountId();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim().toLowerCase();

    const rows = await prisma.inboxConversation.findMany({
      where: {
        accountId,
        ...(q
          ? {
              OR: [
                { contactName: { contains: q } },
                { contactPhone: { contains: q } },
                { email: { contains: q } },
                { firstName: { contains: q } },
                { lastName: { contains: q } },
                { lastMessage: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: { lastMessageAt: "desc" },
      take: 500,
    });

    return NextResponse.json({
      success: true,
      contacts: rows.map(mapContact),
      total: rows.length,
    });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

export async function POST(request: Request) {
  try {
    const accountId = await requireAccountId();
    const json = await request.json();
    
    // Proper Zod Validation
    const result = contactSchema.safeParse(json);
    if (!result.success) {
      throw new ValidationError(result.error.errors[0].message);
    }

    const body = result.data;
    const phone = normalizePhone(body.phone);

    if (!phone) {
      throw new ValidationError("WhatsApp contacts need a valid phone number");
    }

    const workspace = await prisma.workspace.findFirst({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    });

    const contact = await upsertImportedContact({
      accountId,
      workspaceId: workspace?.id,
      row: {
        phone,
        firstName: body.firstName,
        lastName: body.lastName,
        contactName:
          body.name ||
          displayContactName({ 
            firstName: body.firstName, 
            lastName: body.lastName, 
            contactName: body.name, 
            email: body.email || "" 
          }),
        email: body.email || "",
        gender: body.gender,
        tags: body.tags,
        customFields: body.customFields,
      },
      mergeTags: false,
    });

    return NextResponse.json({ success: true, contact: mapContact(contact) });
  } catch (e: unknown) {
    return handleApiError(e);
  }
}

