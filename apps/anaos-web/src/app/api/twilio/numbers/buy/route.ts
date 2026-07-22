/**
 * POST /api/twilio/numbers/buy
 *
 * ManyChat-Style Provisioning:
 *   1. Creates a Twilio Subaccount for the user (to isolate billing/spam).
 *   2. Purchases a phone number on that Subaccount.
 *   3. Registers the SmsUrl + VoiceUrl so Twilio routes messages to AnaOS.
 *   4. Saves the subaccount SID, AuthToken, and Number to the DB.
 *
 * Body: { phoneNumber: string, accountId: string }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";

export const dynamic = "force-dynamic";

interface BuyNumberBody {
  phoneNumber: string;
  accountId: string;
}

function buildWebhookUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.com";
  return `${base}${path}`;
}

function twilioAuthHeader(accountSid: string, authToken: string): string {
  const encoded = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  return `Basic ${encoded}`;
}

async function mockPurchase(phoneNumber: string, accountId: string): Promise<NextResponse> {
  console.log(`[Twilio Mock] Subaccount created & number purchased: ${phoneNumber} for account ${accountId}`);

  await prisma.integrationCredential.create({
    data: {
      accountId,
      type: "twilio",
      name: `Virtual Number ${phoneNumber}`,
      credentials: encrypt(JSON.stringify({
        phoneNumber,
        accountSid: "AC_mock_subaccount_123",
        authToken: "mock_auth_token_456",
        provider: "twilio_mock",
        purchasedAt: new Date().toISOString(),
      })),
      isActive: true,
    },
  });

  return NextResponse.json({
    success: true,
    mock: true,
    message: "Mock subaccount created and number purchased (no Twilio keys set)",
    phoneNumber,
  });
}

async function realPurchase(
  phoneNumber: string,
  accountId: string,
  masterSid: string,
  masterToken: string
): Promise<NextResponse> {
  try {
    // Step 1: Create a Subaccount
    const subaccountUrl = `https://api.twilio.com/2010-04-01/Accounts.json`;
    const subParams = new URLSearchParams();
    subParams.append("FriendlyName", `AnaOS_Account_${accountId}`);

    const subRes = await fetch(subaccountUrl, {
      method: "POST",
      headers: {
        Authorization: twilioAuthHeader(masterSid, masterToken),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: subParams.toString(),
    });

    const subData = await subRes.json();
    if (!subRes.ok) {
      console.error("[Twilio Subaccount] Creation failed:", subData);
      return NextResponse.json({ success: false, error: subData.message || "Failed to create Subaccount" }, { status: subRes.status });
    }

    const subSid = subData.sid;
    const subToken = subData.auth_token;
    console.log(`[Twilio] Created subaccount ${subSid} for AnaOS account ${accountId}`);

    // Step 2: Buy Number on Subaccount
    const buyUrl = `https://api.twilio.com/2010-04-01/Accounts/${subSid}/IncomingPhoneNumbers.json`;
    const buyParams = new URLSearchParams();
    buyParams.append("PhoneNumber", phoneNumber);
    buyParams.append("SmsUrl", buildWebhookUrl("/api/webhooks/twilio"));
    buyParams.append("SmsMethod", "POST");
    buyParams.append("VoiceUrl", buildWebhookUrl("/api/webhooks/voice"));
    buyParams.append("VoiceMethod", "POST");
    buyParams.append("StatusCallback", buildWebhookUrl("/api/webhooks/voice"));

    const buyRes = await fetch(buyUrl, {
      method: "POST",
      headers: {
        Authorization: twilioAuthHeader(subSid, subToken),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: buyParams.toString(),
    });

    const buyData = await buyRes.json();
    if (!buyRes.ok) {
      console.error("[Twilio Buy] Purchase failed on subaccount:", buyData);
      return NextResponse.json({ success: false, error: buyData.message || "Twilio purchase failed" }, { status: buyRes.status });
    }

    // Step 3: Save to DB (Encrypting sensitive tokens)
    await prisma.integrationCredential.create({
      data: {
        accountId,
        type: "twilio",
        name: `Twilio ${buyData.phone_number}`,
        credentials: encrypt(JSON.stringify({
          phoneNumber: buyData.phone_number,
          accountSid: subSid,
          authToken: subToken,
          numberSid: buyData.sid,
          provider: "twilio",
          purchasedAt: new Date().toISOString(),
        })),
        isActive: true,
      },
    });

    console.log(`[Twilio] Successfully purchased ${buyData.phone_number} on subaccount ${subSid}`);

    return NextResponse.json({
      success: true,
      phoneNumber: buyData.phone_number,
      sid: buyData.sid,
      subaccountSid: subSid,
    });
  } catch (error) {
    console.error("[Twilio] Exception during purchase flow:", error);
    return NextResponse.json({ success: false, error: "Internal server error during Twilio provisioning" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: BuyNumberBody = await request.json();
    const { phoneNumber, accountId } = body;

    if (!phoneNumber || !accountId) {
      return NextResponse.json({ success: false, error: "phoneNumber and accountId are required" }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      return mockPurchase(phoneNumber, accountId);
    }

    return realPurchase(phoneNumber, accountId, accountSid, authToken);
  } catch (error) {
    console.error("[Twilio] Buy number route error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
