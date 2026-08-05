import { after, NextResponse } from "next/server";
import crypto from "crypto";
import { resolveAccountIdFromWhatsApp } from "@/lib/inbox/store";
import { parseWhatsAppInboundMessage } from "@/lib/whatsapp/parse-inbound";
import { processInboundWhatsAppMessage } from "@/lib/whatsapp/process-inbound";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "anaos_secret_verify_token";

  if (mode === "subscribe" && token === verifyToken) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    // Enforce Webhook Security Verification for Meta
    if (process.env.META_APP_SECRET && signature) {
      const hmac = crypto.createHmac("sha256", process.env.META_APP_SECRET);
      const digest = "sha256=" + hmac.update(rawBody).digest("hex");
      if (signature !== digest) {
        console.warn("[WhatsApp Webhook] Invalid signature detected!");
        return new Response("Invalid signature", { status: 401 });
      }
    } else if (process.env.NODE_ENV === "production" && !process.env.META_APP_SECRET) {
      console.warn("[WhatsApp Webhook] WARNING: META_APP_SECRET is not set in production. Webhooks are insecure.");
    }

    const body = JSON.parse(rawBody);
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const val = change?.value;

    if (!val?.messages?.length) {
      return NextResponse.json({ success: true, message: "Acknowledged" });
    }

    const message = val.messages[0];
    const senderName = val.contacts?.[0]?.profile?.name || "Customer";
    const phoneNumberId = val.metadata?.phone_number_id as string | undefined;

    const accountId = await resolveAccountIdFromWhatsApp(phoneNumberId);
    const parsed = await parseWhatsAppInboundMessage(message, senderName, accountId);

    if (!parsed) {
      return NextResponse.json({ success: true, message: "No parseable content" });
    }

    console.log(
      `[WhatsApp] ${senderName} (${parsed.phone}) [${parsed.contentType}]: ${parsed.messageText.slice(0, 120)}`
    );

    // Meta expects a fast 200; AI + send can take several seconds.
    after(async () => {
      try {
        const result = await processInboundWhatsAppMessage(parsed, { phoneNumberId });
        console.log("[WhatsApp] processed:", {
          sent: result.sent,
          mode: result.mode,
          phone: parsed.phone.slice(-4),
        });
      } catch (err) {
        console.error("[WhatsApp] background process failed:", err);
      }
    });

    return NextResponse.json({ success: true, queued: true });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
