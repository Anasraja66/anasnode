import { prisma } from "@/lib/db";
import { sendMetaTextMessage } from "@/lib/whatsapp/meta";
import {
  listAudienceRecipients,
  parseAudienceFilter,
} from "@/lib/broadcast/audience";
import { buildTemplateBody, validateCampaignForSend } from "@/lib/broadcast/meta-policy";
import {
  applyTemplateVars,
  contactTemplateVars,
  parseCustomFieldsJson,
} from "@/lib/contacts/profile";

export async function sendBroadcastCampaign(params: {
  campaignId: string;
  accountId: string;
}): Promise<{ sent: number; failed: number; errors: string[] }> {
  const campaign = await prisma.broadcastCampaign.findFirst({
    where: { id: params.campaignId, accountId: params.accountId },
  });
  if (!campaign) throw new Error("Campaign not found");

  const filter = parseAudienceFilter(campaign.audienceFilter);
  const recipients = await listAudienceRecipients(
    params.accountId,
    filter,
    campaign.dailyCap
  );

  const check = validateCampaignForSend({
    bodyText: campaign.bodyText,
    outside24h: campaign.outside24h,
    optedOutExcluded: filter.excludeOptedOut !== false,
  });
  if (!check.ok) {
    throw new Error(check.warnings.join(" "));
  }

  const baseBody = buildTemplateBody({
    body: campaign.bodyText,
    footer: campaign.footerText,
    optOut: campaign.optOutLine,
  });

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const r of recipients) {
    const vars = contactTemplateVars({
      phone: r.phone,
      firstName: r.firstName,
      lastName: r.lastName,
      contactName: r.name,
      email: r.email,
      gender: r.gender,
      customFields: parseCustomFieldsJson(r.customFields),
    });
    const text = applyTemplateVars(baseBody, vars);
    const ok = await sendMetaTextMessage(r.phone, text, params.accountId);
    if (ok) {
      sent++;
      await prisma.inboxConversation
        .upsert({
          where: {
            accountId_channel_contactPhone: {
              accountId: params.accountId,
              channel: "whatsapp",
              contactPhone: r.phone,
            },
          },
          create: {
            accountId: params.accountId,
            workspaceId: campaign.workspaceId ?? undefined,
            channel: "whatsapp",
            contactPhone: r.phone,
            contactName: r.name,
            lastMessage: text.slice(0, 200),
            lastMessageAt: new Date(),
          },
          update: {
            lastMessage: text.slice(0, 200),
            lastMessageAt: new Date(),
          },
        })
        .catch(() => null);
    } else {
      failed++;
      if (errors.length < 5) errors.push(`Failed: ${r.phone}`);
    }
    await new Promise((r) => setTimeout(r, 80));
  }

  await prisma.broadcastCampaign.update({
    where: { id: campaign.id },
    data: {
      status: "sent",
      sentCount: campaign.sentCount + sent,
      failedCount: campaign.failedCount + failed,
    },
  });

  return { sent, failed, errors };
}
