import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { requireAccountId } from "@/lib/auth/session";
import {
  exchangeEmbeddedSignupCode,
  fetchPhoneNumberDetails,
  resolveMetaRedirectUri,
  subscribeWabaWebhooks,
} from "@/lib/meta/graph";
import { activateDefaultWhatsAppWorkflow } from "@/lib/meta/activate-whatsapp-workflow";
import { validatePhoneNumberId } from "@/lib/whatsapp/credentials";

export const dynamic = "force-dynamic";

type CompleteBody = {
  code: string;
  wabaId?: string;
  phoneNumberId?: string;
  businessId?: string;
  event?: string;
  pageIds?: string[];
  instagramAccountIds?: string[];
  activateDefaultWorkflow?: boolean;
  aiAutoReply?: boolean;
};

/**
 * POST /api/integrations/meta/whatsapp/complete
 * Exchange Embedded Signup code → save tenant WhatsApp credentials.
 */
export async function POST(request: Request) {
  try {
    const accountId = await requireAccountId();
    const body = (await request.json()) as CompleteBody;

    if (!body.code?.trim()) {
      return NextResponse.json({ error: "Authorization code is required" }, { status: 400 });
    }

    if (!body.wabaId || !body.phoneNumberId) {
      return NextResponse.json(
        { error: "WhatsApp setup incomplete — finish Meta popup (number + business)" },
        { status: 400 }
      );
    }

    const idCheck = validatePhoneNumberId(String(body.phoneNumberId));
    if (!idCheck.ok) {
      return NextResponse.json({ error: idCheck.error }, { status: 400 });
    }

    const redirectUri = resolveMetaRedirectUri();
    let accessToken: string;

    try {
      const exchanged = await exchangeEmbeddedSignupCode(body.code.trim(), redirectUri);
      accessToken = exchanged.accessToken;
    } catch (firstErr) {
      try {
        const exchanged = await exchangeEmbeddedSignupCode(body.code.trim());
        accessToken = exchanged.accessToken;
      } catch {
        throw firstErr;
      }
    }

    const phoneMeta = await fetchPhoneNumberDetails(idCheck.normalized, accessToken);
    const displayPhone = phoneMeta.displayPhone;
    const businessName = phoneMeta.verifiedName;

    await subscribeWabaWebhooks(body.wabaId, accessToken);

    const credentials = {
      accessToken,
      phoneNumberId: idCheck.normalized,
      wabaId: body.wabaId,
      businessId: body.businessId,
      displayPhone,
      businessName,
      pageIds: body.pageIds || [],
      instagramAccountIds: body.instagramAccountIds || [],
      connectedVia: "embedded_signup",
      aiAutoReply: body.aiAutoReply !== false,
      embeddedEvent: body.event,
    };

    const encryptedData = encrypt(JSON.stringify(credentials));
    const label = businessName || displayPhone || "WhatsApp Business";

    const existing = await prisma.integrationCredential.findFirst({
      where: { accountId, type: "whatsapp" },
    });

    await (existing
      ? prisma.integrationCredential.update({
          where: { id: existing.id },
          data: { name: label, credentials: encryptedData, isActive: true },
        })
      : prisma.integrationCredential.create({
          data: {
            accountId,
            type: "whatsapp",
            name: label,
            credentials: encryptedData,
            isActive: true,
          },
        }));

    let activatedWorkflowId: string | null = null;
    if (body.activateDefaultWorkflow !== false) {
      activatedWorkflowId = await activateDefaultWhatsAppWorkflow(accountId);
    }

    return NextResponse.json({
      success: true,
      message: displayPhone
        ? `WhatsApp connected: ${displayPhone}. You can keep using your phone — Anaos handles automations.`
        : "WhatsApp connected via Meta. Turn on automations from your dashboard.",
      displayPhone,
      businessName,
      wabaId: body.wabaId,
      activatedWorkflowId,
      webhooksSubscribed: true,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("meta whatsapp complete error:", error);
    const msg =
      error instanceof Error ? error.message : "Failed to complete WhatsApp connection";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
