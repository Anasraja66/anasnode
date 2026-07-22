/**
 * POST /api/twilio/connect
 *
 * Connects an existing Twilio Number (Bring Your Own Number / BYON).
 * 1. Validates the provided SID and AuthToken by fetching the specific IncomingPhoneNumber.
 * 2. Updates the Webhook URLs on that number to point to AnaOS.
 * 3. Saves the credentials in the DB.
 *
 * Body: { phoneNumber: string, accountSid: string, authToken: string, accountId: string }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";

export const dynamic = "force-dynamic";

interface ConnectNumberBody {
  phoneNumber: string; // e.g. +1415...
  accountSid: string;
  authToken: string;
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

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: ConnectNumberBody = await request.json();
    const { phoneNumber, accountSid, authToken, accountId } = body;

    if (!phoneNumber || !accountSid || !authToken || !accountId) {
      return NextResponse.json({ success: false, error: "phoneNumber, accountSid, authToken, and accountId are required" }, { status: 400 });
    }

    // Step 1: Find the number SID by fetching all numbers on this account
    // (We must do this because to update webhooks, Twilio requires the specific IncomingPhoneNumber SID)
    const listUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json?PhoneNumber=${encodeURIComponent(phoneNumber)}`;
    
    const listRes = await fetch(listUrl, {
      method: "GET",
      headers: {
        Authorization: twilioAuthHeader(accountSid, authToken),
      },
    });

    const listData = await listRes.json();
    if (!listRes.ok || !listData.incoming_phone_numbers || listData.incoming_phone_numbers.length === 0) {
      console.error("[Twilio Connect] Failed to find number:", listData);
      return NextResponse.json({ success: false, error: "Could not find this phone number in your Twilio account. Please check the credentials." }, { status: 400 });
    }

    const numberObj = listData.incoming_phone_numbers[0];
    const numberSid = numberObj.sid;

    // Step 2: Update Webhooks on the existing number
    const updateUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers/${numberSid}.json`;
    const updateParams = new URLSearchParams();
    updateParams.append("SmsUrl", buildWebhookUrl("/api/webhooks/twilio"));
    updateParams.append("SmsMethod", "POST");
    updateParams.append("VoiceUrl", buildWebhookUrl("/api/webhooks/voice"));
    updateParams.append("VoiceMethod", "POST");
    updateParams.append("StatusCallback", buildWebhookUrl("/api/webhooks/voice"));

    const updateRes = await fetch(updateUrl, {
      method: "POST",
      headers: {
        Authorization: twilioAuthHeader(accountSid, authToken),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: updateParams.toString(),
    });

    const updateData = await updateRes.json();
    if (!updateRes.ok) {
      console.error("[Twilio Connect] Failed to update webhooks:", updateData);
      return NextResponse.json({ success: false, error: "Connected, but failed to update webhook URLs on Twilio." }, { status: 500 });
    }

    // Step 3: Save to DB (Encrypting sensitive tokens)
    await prisma.integrationCredential.create({
      data: {
        accountId,
        type: "twilio",
        name: `Connected ${numberObj.phone_number}`,
        credentials: encrypt(JSON.stringify({
          phoneNumber: numberObj.phone_number,
          accountSid: accountSid,
          authToken: authToken,
          numberSid: numberSid,
          provider: "twilio_byon",
          connectedAt: new Date().toISOString(),
        })),
        isActive: true,
      },
    });

    console.log(`[Twilio] Successfully connected existing number ${numberObj.phone_number} for AnaOS account ${accountId}`);

    return NextResponse.json({
      success: true,
      phoneNumber: numberObj.phone_number,
      message: "Number connected successfully and webhooks configured.",
    });
  } catch (error) {
    console.error("[Twilio] Connect number route error:", error);
    return NextResponse.json({ success: false, error: "Internal server error during connection" }, { status: 500 });
  }
}
