/**
 * WhatsApp Meta Cloud API Helper
 * Exposes methods to send messages to users using the official Meta Graph API.
 */

export interface MetaMessagePayload {
  messaging_product: "whatsapp";
  to: string;
  type: "text" | "interactive";
  text?: {
    body: string;
  };
  interactive?: any;
}

/**
 * Send a text message to a user via the WhatsApp Cloud API.
 */
export async function sendMetaTextMessage(to: string, text: string): Promise<boolean> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    console.error("WhatsApp Meta credentials are not configured in environment variables.");
    return false;
  }

  const url = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
  
  const payload: MetaMessagePayload = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: text,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error response from Meta WhatsApp API:", JSON.stringify(data, null, 2));
      return false;
    }

    console.log(`Successfully sent Meta WhatsApp message to ${to}. Message ID:`, data.messages?.[0]?.id);
    return true;
  } catch (error) {
    console.error("Failed to send WhatsApp message via Meta:", error);
    return false;
  }
}
