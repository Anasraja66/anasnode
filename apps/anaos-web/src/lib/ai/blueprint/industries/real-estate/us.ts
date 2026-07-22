import { IndustryPlaybook } from "../types";

export const usRealEstate: IndustryPlaybook = {
  id: "real-estate-us",
  name: "US Real Estate",
  description: "Playbook for United States realtors and brokerages.",
  matchKeywords: ["us", "usa", "america", "zillow", "mls", "realtor", "texas", "california", "florida", "new york"],
  systemPromptAddition: `
## US REAL ESTATE FOCUS
You are configuring a workspace for a US-based Realtor or Brokerage.
You MUST include automations for:
1. Missed Call Text-Back: Instantly send an AI WhatsApp/SMS message when a call is missed.
2. SMS & Email Follow-up sequences (extremely common in the US).
3. MLS / Zillow lead integration handlers.
4. Voice AI (Vapi) for handling inbound calls and booking appointments.
5. Calendar booking for open houses or viewings.
6. Omnichannel Lead Handling (GoHighLevel style unified inbox).
`
};
