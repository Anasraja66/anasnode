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
1. SMS & Email Follow-up sequences (extremely common in the US).
2. MLS / Zillow lead integration handlers.
3. Voice AI (Vapi) for handling missed calls (Missed Call Text-Back is huge).
4. Calendar booking for open houses or viewings.
`
};
