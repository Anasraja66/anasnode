import { prisma } from "@/lib/db";

export type AudienceFilter = {
  match?: "all" | "any";
  tags?: string[];
  excludeOptedOut?: boolean;
};

export function parseAudienceFilter(raw?: string | null): AudienceFilter {
  if (!raw) return { match: "all", tags: [], excludeOptedOut: true };
  try {
    const p = JSON.parse(raw) as AudienceFilter;
    return {
      match: p.match === "any" ? "any" : "all",
      tags: Array.isArray(p.tags) ? p.tags : [],
      excludeOptedOut: p.excludeOptedOut !== false,
    };
  } catch {
    return { match: "all", tags: [], excludeOptedOut: true };
  }
}

function parseTags(raw: string): string[] {
  try {
    const t = JSON.parse(raw);
    return Array.isArray(t) ? t.map(String) : [];
  } catch {
    return [];
  }
}

export async function countAudience(
  accountId: string,
  filter: AudienceFilter
): Promise<number> {
  const rows = await prisma.inboxConversation.findMany({
    where: { accountId, channel: "whatsapp" },
    select: { tags: true, optedOut: true },
  });

  return rows.filter((r) => {
    if (filter.excludeOptedOut && r.optedOut) return false;
    const tags = parseTags(r.tags);
    if (!filter.tags?.length) return true;
    if (filter.match === "any") {
      return filter.tags.some((t) => tags.includes(t));
    }
    return filter.tags.every((t) => tags.includes(t));
  }).length;
}

export type AudienceRecipient = {
  phone: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  customFields: string;
};

export async function listAudienceRecipients(
  accountId: string,
  filter: AudienceFilter,
  limit = 500
): Promise<AudienceRecipient[]> {
  const rows = await prisma.inboxConversation.findMany({
    where: { accountId, channel: "whatsapp" },
    select: {
      contactPhone: true,
      contactName: true,
      firstName: true,
      lastName: true,
      email: true,
      gender: true,
      customFields: true,
      tags: true,
      optedOut: true,
    },
    take: 5000,
  });

  const matched = rows.filter((r) => {
    if (filter.excludeOptedOut && r.optedOut) return false;
    const tags = parseTags(r.tags);
    if (!filter.tags?.length) return true;
    if (filter.match === "any") {
      return filter.tags.some((t) => tags.includes(t));
    }
    return filter.tags.every((t) => tags.includes(t));
  });

  return matched.slice(0, limit).map((r) => ({
    phone: r.contactPhone,
    name: r.contactName,
    firstName: r.firstName,
    lastName: r.lastName,
    email: r.email,
    gender: r.gender,
    customFields: r.customFields,
  }));
}

/** @deprecated use listAudienceRecipients */
export async function listAudiencePhones(
  accountId: string,
  filter: AudienceFilter,
  limit = 500
): Promise<{ phone: string; name: string }[]> {
  const rows = await listAudienceRecipients(accountId, filter, limit);
  return rows.map((r) => ({ phone: r.phone, name: r.name }));
}
