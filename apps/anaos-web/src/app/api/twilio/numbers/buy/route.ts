/**
 * POST /api/twilio/numbers/buy
 *
 * Purchases a phone number from Twilio and:
 *   1. Registers the SmsUrl + VoiceUrl so Twilio routes messages to Anaos
 *   2. Saves the number to the account's integration credentials in DB
 *
 * Body: { phoneNumber: string, accountId: string }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BuyNumberBody {
  phoneNumber: string;
  accountId: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build the full webhook URL using the app's base URL from env */
function buildWebhookUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.com";
  return `${base}${path}`;
}

/** Encode Twilio Basic Auth header from account SID + auth token */
function twilioAuthHeader(accountSid: string, authToken: string): string {
  const encoded = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  return `Basic ${encoded}`;
}

// ── Mock purchase (for local dev without Twilio keys) ─────────────────────────

async function mockPurchase(
  phoneNumber: string,
  accountId: string
): Promise<NextResponse> {
  console.log(`[Twilio] Mock number purchase: ${phoneNumber} for account ${accountId}`);

  await prisma.integrationCredential.create({
    data: {
      accountId,
      type: "twilio",
      name: `Virtual Number ${phoneNumber}`,
      credentials: JSON.stringify({
        phoneNumber,
        provider: "twilio_mock",
        purchasedAt: new Date().toISOString(),
      }),
    },
  });

  return NextResponse.json({
    success: true,
    mock: true,
    message: "Mock number purchased (no Twilio keys set)",
    phoneNumber,
  });
}

// ── Real purchase via Twilio API ──────────────────────────────────────────────

async function realPurchase(
  phoneNumber: string,
  accountId: string,
  accountSid: string,
  authToken: string
): Promise<NextResponse> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`;

  // Build form body with webhook URLs so Twilio routes to our handlers
  const params = new URLSearchParams();
  params.append("PhoneNumber", phoneNumber);
  params.append("SmsUrl", buildWebhookUrl("/api/webhooks/twilio"));
  params.append("SmsMethod", "POST");
  params.append("VoiceUrl", buildWebhookUrl("/api/webhooks/voice"));
  params.append("VoiceMethod", "POST");
  params.append("StatusCallback", buildWebhookUrl("/api/webhooks/voice"));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: twilioAuthHeader(accountSid, authToken),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[Twilio] Purchase failed:", data);
    return NextResponse.json(
      { success: false, error: data.message || "Twilio purchase failed" },
      { status: response.status }
    );
  }

  // Save to DB so this account can be resolved later from incoming messages
  await prisma.integrationCredential.create({
    data: {
      accountId,
      type: "twilio",
      name: `Twilio ${data.phone_number}`,
      credentials: JSON.stringify({
        phoneNumber: data.phone_number,
        sid: data.sid,
        provider: "twilio",
        purchasedAt: new Date().toISOString(),
      }),
    },
  });

  console.log(`[Twilio] Purchased ${data.phone_number} for account ${accountId}`);

  return NextResponse.json({
    success: true,
    phoneNumber: data.phone_number,
    sid: data.sid,
  });
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: BuyNumberBody = await request.json();
    const { phoneNumber, accountId } = body;

    if (!phoneNumber || !accountId) {
      return NextResponse.json(
        { success: false, error: "phoneNumber and accountId are required" },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    // Use mock if Twilio keys are not set (local dev)
    if (!accountSid || !authToken) {
      return mockPurchase(phoneNumber, accountId);
    }

    return realPurchase(phoneNumber, accountId, accountSid, authToken);
  } catch (error) {
    console.error("[Twilio] Buy number error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
