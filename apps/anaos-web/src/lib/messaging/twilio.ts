import twilio from "twilio";
import { prisma } from "../db";
import { decrypt } from "../crypto";

export async function sendTwilioMessage(to: string, body: string, accountId: string): Promise<boolean> {
  try {
    // Attempt to fetch Twilio credentials for this account
    const cred = await prisma.integrationCredential.findFirst({
      where: { accountId, type: "twilio", isActive: true },
    });

    let accountSid = process.env.TWILIO_ACCOUNT_SID;
    let authToken = process.env.TWILIO_AUTH_TOKEN;
    let fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (cred) {
      try {
        const decrypted = JSON.parse(decrypt(cred.credentials));
        if (decrypted.accountSid) accountSid = decrypted.accountSid;
        if (decrypted.authToken) authToken = decrypted.authToken;
        if (decrypted.fromNumber) fromNumber = decrypted.fromNumber;
      } catch (e) {
        console.error("Failed to decrypt Twilio credentials", e);
      }
    }

    if (!accountSid || !authToken || !fromNumber) {
      console.warn(`[Twilio] Missing credentials for account ${accountId}. Cannot send SMS.`);
      // Mock success for local dev MVP
      console.log(`[MOCK SMS] To: ${to} | Body: ${body}`);
      return true;
    }

    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body,
      from: fromNumber,
      to
    });
    
    return true;
  } catch (error) {
    console.error("[Twilio] Error sending SMS:", error);
    return false;
  }
}
