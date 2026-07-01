import { NextResponse } from "next/server";
import prisma from "@/lib/db";
// Assuming the user is authenticated, we would get accountId from session.
// For now, we mock it or pass it in body for demo purposes.

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { phoneNumber, accountId } = await request.json();

    if (!phoneNumber || !accountId) {
      return NextResponse.json({ success: false, error: "Phone number and Account ID required" }, { status: 400 });
    }

    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

    if (!twilioAccountSid || !twilioAuthToken) {
      // Mock successful purchase for local dev
      await prisma.integrationCredential.create({
        data: {
          accountId,
          type: "whatsapp",
          name: `Virtual Number ${phoneNumber}`,
          credentials: JSON.stringify({ phoneNumber, provider: "twilio_mock" }),
        }
      });
      return NextResponse.json({ success: true, message: "Mock number purchased successfully", phoneNumber });
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/IncomingPhoneNumbers.json`;
    const authHeader = `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString("base64")}`;
    
    const params = new URLSearchParams();
    params.append("PhoneNumber", phoneNumber);
    // Note: You would typically also append SmsUrl and VoiceUrl here to point to your Universal Webhook

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message }, { status: response.status });
    }

    // Save to database
    await prisma.integrationCredential.create({
      data: {
        accountId,
        type: "whatsapp",
        name: `Twilio Number ${phoneNumber}`,
        credentials: JSON.stringify({ 
          phoneNumber: data.phone_number, 
          sid: data.sid, 
          provider: "twilio" 
        }),
      }
    });

    return NextResponse.json({ success: true, message: "Number purchased successfully", phoneNumber: data.phone_number });
  } catch (error: any) {
    console.error("Twilio Number Purchase Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
