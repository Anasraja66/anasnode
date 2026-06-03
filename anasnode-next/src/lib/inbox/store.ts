import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

/** Match Meta webhook phone_number_id to the right Anaos account. */
export async function resolveAccountIdFromWhatsApp(
  phoneNumberId?: string
): Promise<string | undefined> {
  const creds = await prisma.integrationCredential.findMany({
    where: { type: "whatsapp", isActive: true },
    orderBy: { createdAt: "desc" },
  });

  if (phoneNumberId) {
    for (const cred of creds) {
      try {
        const parsed = JSON.parse(decrypt(cred.credentials)) as {
          phoneNumberId?: string;
        };
        if (parsed.phoneNumberId === phoneNumberId) {
          return cred.accountId;
        }
      } catch {
        /* skip bad credential */
      }
    }
  }

  return creds[0]?.accountId;
}

export async function upsertInboxConversation(params: {
  accountId: string;
  workspaceId?: string;
  channel?: string;
  contactPhone: string;
  contactName: string;
}) {
  const channel = params.channel || "whatsapp";

  return prisma.inboxConversation.upsert({
    where: {
      accountId_channel_contactPhone: {
        accountId: params.accountId,
        channel,
        contactPhone: params.contactPhone,
      },
    },
    create: {
      accountId: params.accountId,
      workspaceId: params.workspaceId,
      channel,
      contactPhone: params.contactPhone,
      contactName: params.contactName,
      lastMessage: "",
      unreadCount: 0,
    },
    update: {
      contactName: params.contactName,
      workspaceId: params.workspaceId ?? undefined,
    },
  });
}

export async function addInboxMessage(params: {
  conversationId: string;
  direction: "inbound" | "outbound";
  body: string;
  source?: string;
  preview?: string;
  incrementUnread?: boolean;
}) {
  const preview = params.preview ?? params.body.slice(0, 500);

  await prisma.inboxMessage.create({
    data: {
      conversationId: params.conversationId,
      direction: params.direction,
      body: params.body,
      source: params.source || (params.direction === "inbound" ? "customer" : "ai"),
    },
  });

  await prisma.inboxConversation.update({
    where: { id: params.conversationId },
    data: {
      lastMessage: preview,
      lastMessageAt: new Date(),
      ...(params.direction === "inbound" ? { lastInboundAt: new Date() } : {}),
      unreadCount: params.incrementUnread ? { increment: 1 } : undefined,
    },
  });
}

export async function markConversationOptedOut(conversationId: string) {
  await prisma.inboxConversation.update({
    where: { id: conversationId },
    data: { optedOut: true },
  });
}

export async function getConversationHistory(
  conversationId: string,
  limit = 12
): Promise<{ role: "user" | "assistant"; content: string }[]> {
  const rows = await prisma.inboxMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows
    .reverse()
    .map((m) => ({
      role: (m.direction === "inbound" ? "user" : "assistant") as "user" | "assistant",
      content: m.body,
    }));
}
