import { prisma } from "@/lib/db";
import { tagsToJson, parseTagsJson } from "@/lib/inbox/tags";
import {
  customFieldsToJson,
  displayContactName,
  parseCustomFieldsJson,
  type ContactProfile,
} from "@/lib/contacts/profile";
import type { ImportedContactRow } from "@/lib/contacts/import-parse";

export async function upsertImportedContact(params: {
  accountId: string;
  workspaceId?: string | null;
  row: ImportedContactRow | (ContactProfile & { phone: string; tags?: string[] });
  mergeTags?: boolean;
}) {
  const row = params.row;
  const phone = row.phone;
  const profile: ContactProfile = {
    firstName: row.firstName,
    lastName: row.lastName,
    contactName: row.contactName,
    email: row.email,
    gender: row.gender,
    customFields: row.customFields,
  };
  const name = displayContactName(profile);
  const tags = "tags" in row && row.tags ? row.tags : [];

  const existing = await prisma.inboxConversation.findUnique({
    where: {
      accountId_channel_contactPhone: {
        accountId: params.accountId,
        channel: "whatsapp",
        contactPhone: phone,
      },
    },
  });

  const mergedTags =
    params.mergeTags !== false && existing
      ? [...new Set([...parseTagsJson(existing.tags), ...tags])]
      : tags;

  const mergedCustom = {
    ...parseCustomFieldsJson(existing?.customFields),
    ...(row.customFields || {}),
  };

  return prisma.inboxConversation.upsert({
    where: {
      accountId_channel_contactPhone: {
        accountId: params.accountId,
        channel: "whatsapp",
        contactPhone: phone,
      },
    },
    create: {
      accountId: params.accountId,
      workspaceId: params.workspaceId ?? undefined,
      channel: "whatsapp",
      contactPhone: phone,
      contactName: name,
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
      gender: profile.gender || "",
      customFields: customFieldsToJson(mergedCustom),
      tags: tagsToJson(mergedTags),
      lastMessage: "",
      unreadCount: 0,
    },
    update: {
      contactName: name,
      firstName: profile.firstName || undefined,
      lastName: profile.lastName || undefined,
      email: profile.email || undefined,
      gender: profile.gender || undefined,
      customFields: customFieldsToJson(mergedCustom),
      tags: mergedTags.length ? tagsToJson(mergedTags) : undefined,
    },
  });
}
