import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { validatePhoneNumberId } from "@/lib/whatsapp/credentials";
import { validateMetaAccessToken } from "@/lib/meta/graph";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accountId = await requireAccountId();

    const cred = await prisma.integrationCredential.findFirst({
      where: { accountId, type: "whatsapp", isActive: true },
      orderBy: { createdAt: "desc" },
    });

    let phoneNumberId: string | undefined;
    let phoneNumberIdError: string | undefined;
    let tokenExpired = false;
    let tokenError: string | null = null;
    let accessToken: string | undefined;

    if (cred) {
      try {
        const parsed = JSON.parse(decrypt(cred.credentials)) as {
          phoneNumberId?: string;
          accessToken?: string;
        };
        accessToken = parsed.accessToken;
        const check = validatePhoneNumberId(String(parsed.phoneNumberId || ""));
        if (check.ok) {
          phoneNumberId = check.normalized;
        } else {
          phoneNumberIdError = check.error;
        }
        if (accessToken) {
          const tv = await validateMetaAccessToken(accessToken);
          if (!tv.valid) {
            tokenExpired = true;
            tokenError = tv.error || "Access token invalid";
          }
        }
      } catch {
        /* ignore */
      }
    }

    const hasGroq = Boolean(process.env.GROQ_API_KEY);
    const aiFirst = process.env.ANAOS_AI_FIRST !== "false";
    const appUrl = process.env.NEXTAUTH_URL || process.env.AUTH_URL || "";
    const publicWebhookBase = process.env.PUBLIC_WEBHOOK_URL?.replace(/\/$/, "");
    const publicWebhookUrl = publicWebhookBase
      ? `${publicWebhookBase}/api/webhooks/whatsapp`
      : null;
    const isLocalOnly =
      !publicWebhookUrl &&
      (!appUrl || appUrl.includes("localhost") || appUrl.includes("127.0.0.1"));

    return NextResponse.json({
      success: true,
      connected: Boolean(cred || process.env.WHATSAPP_ACCESS_TOKEN),
      canSend:
        Boolean(phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID) &&
        !tokenExpired,
      phoneNumberIdInvalid: Boolean(phoneNumberIdError),
      phoneNumberIdError: phoneNumberIdError || null,
      phoneNumberId: phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || null,
      tokenExpired,
      tokenError,
      aiReady: hasGroq,
      aiFirst,
      needsPublicWebhook: isLocalOnly,
      publicWebhookUrl,
      webhookPath: "/api/webhooks/whatsapp",
      hints: [
        tokenExpired
          ? "Meta access token expired — open Integrations → WhatsApp and connect again (or paste a new token from Meta API Setup)."
          : null,
        isLocalOnly
          ? "Tunnel not running. In project folder run: npm run tunnel — then paste the webhook URL in Meta."
          : publicWebhookUrl
            ? `Tunnel active. Set Meta webhook callback to: ${publicWebhookUrl}`
            : null,
        !hasGroq
          ? "Add GROQ_API_KEY in .env for smart AI replies on WhatsApp"
          : null,
        phoneNumberIdError || null,
        "In Meta API Setup, add your phone number under “To” (test mode) or messages will not deliver",
      ].filter(Boolean),
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load status" }, { status: 500 });
  }
}
