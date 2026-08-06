export async function sendTwilioMessage(
  to: string,
  body: string,
  isWhatsApp: boolean = true
): Promise<string> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.warn("Twilio credentials missing in environment variables.");
    // In dev, just return a fake ID if keys are missing
    return `mock_tw_${Date.now()}`;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const formattedTo = isWhatsApp && !to.startsWith("whatsapp:") ? `whatsapp:${to}` : to;
  const formattedFrom = isWhatsApp && !fromNumber.startsWith("whatsapp:") ? `whatsapp:${fromNumber}` : fromNumber;

  const params = new URLSearchParams();
  params.append("To", formattedTo);
  params.append("From", formattedFrom);
  params.append("Body", body);

  const authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Twilio Error: ${data.message || response.statusText}`);
    }

    return data.sid;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("sendTwilioMessage failed:", error);
    throw error;
  }
}
