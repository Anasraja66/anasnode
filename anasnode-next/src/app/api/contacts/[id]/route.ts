import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { tagsToJson } from "@/lib/inbox/tags";
import {
  customFieldsToJson,
  displayContactName,
  parseCustomFieldsJson,
} from "@/lib/contacts/profile";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const accountId = await requireAccountId();
    const { id } = await ctx.params;
    const body = await request.json();

    const existing = await prisma.inboxConversation.findFirst({
      where: { id, accountId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const firstName =
      body.firstName !== undefined ? String(body.firstName).slice(0, 80) : existing.firstName;
    const lastName =
      body.lastName !== undefined ? String(body.lastName).slice(0, 80) : existing.lastName;
    const email =
      body.email !== undefined ? String(body.email).slice(0, 200) : existing.email;
    const gender =
      body.gender !== undefined ? String(body.gender).slice(0, 40) : existing.gender;

    const contactName =
      body.name !== undefined
        ? String(body.name).slice(0, 120)
        : displayContactName({
            firstName,
            lastName,
            contactName: existing.contactName,
            email,
          });

    const tags =
      body.tags !== undefined
        ? Array.isArray(body.tags)
          ? tagsToJson(body.tags.map((t: unknown) => String(t)))
          : tagsToJson(
              String(body.tags)
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            )
        : undefined;

    const customFields =
      body.customFields !== undefined
        ? customFieldsToJson(body.customFields as Record<string, string>)
        : undefined;

    const contact = await prisma.inboxConversation.update({
      where: { id },
      data: {
        contactName,
        firstName,
        lastName,
        email,
        gender,
        tags,
        customFields,
        aiEnabled: body.aiEnabled !== undefined ? Boolean(body.aiEnabled) : undefined,
        optedOut: body.optedOut !== undefined ? Boolean(body.optedOut) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      contact: {
        ...contact,
        customFields: parseCustomFieldsJson(contact.customFields),
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const accountId = await requireAccountId();
    const { id } = await ctx.params;

    const existing = await prisma.inboxConversation.findFirst({
      where: { id, accountId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.inboxMessage.deleteMany({ where: { conversationId: id } });
    await prisma.inboxConversation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
