import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "US";
    const areaCode = searchParams.get("areaCode") || "";

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      // Return mocked data for local testing if no keys are provided
      return NextResponse.json({
        success: true,
        numbers: [
          { phoneNumber: "+12345678901", friendlyName: "(234) 567-8901", capabilities: { SMS: true, Voice: true } },
          { phoneNumber: "+19876543210", friendlyName: "(987) 654-3210", capabilities: { SMS: true, Voice: true } },
        ],
        mocked: true,
      });
    }

    let url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/${country}/Local.json`;
    if (areaCode) {
      url += `?AreaCode=${areaCode}`;
    }

    const authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;

    const response = await fetch(url, {
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.message }, { status: response.status });
    }

    const numbers = data.available_phone_numbers.map((n: any) => ({
      phoneNumber: n.phone_number,
      friendlyName: n.friendly_name,
      capabilities: n.capabilities,
    }));

    return NextResponse.json({ success: true, numbers });
  } catch (error: any) {
    console.error("Twilio Number Search Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
