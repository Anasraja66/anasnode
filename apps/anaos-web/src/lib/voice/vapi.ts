/**
 * Vapi.ai API Connector
 * Responsible for dispatching outbound AI Voice calls.
 */

export interface VapiCallConfig {
  phoneNumberId: string;     // The Twilio/Vapi phone number ID to call from
  customerNumber: string;    // The customer's phone number
  assistantPrompt: string;   // The dynamic LLM context for the call
  firstMessage: string;      // The first sentence the bot will say
  provider?: "eleven_labs" | "openai" | "playht";
  voiceId?: string;
}

export async function dispatchVapiCall(config: VapiCallConfig): Promise<{ callId: string; status: string }> {
  const vapiKey = process.env.VAPI_API_KEY;
  if (!vapiKey) {
    console.error("VAPI_API_KEY is not set.");
    // Return a mock success for development if key is missing
    return { callId: "mock_vapi_" + Date.now(), status: "mocked" };
  }

  // https://api.vapi.ai/call/phone
  const response = await fetch("https://api.vapi.ai/call/phone", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${vapiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumberId: config.phoneNumberId,
      customer: {
        number: config.customerNumber,
      },
      assistant: {
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: config.assistantPrompt
            }
          ]
        },
        voice: {
          provider: config.provider || "eleven_labs",
          voiceId: config.voiceId || "burt", // Default 11labs voice
        },
        firstMessage: config.firstMessage,
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vapi API failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return {
    callId: data.id,
    status: data.status
  };
}
