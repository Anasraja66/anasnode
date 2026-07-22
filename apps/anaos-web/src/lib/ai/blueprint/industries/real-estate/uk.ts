import { IndustryPlaybook } from "../types";

export const ukRealEstate: IndustryPlaybook = {
  id: "real-estate-uk",
  name: "UK Real Estate",
  description: "Playbook for UK Estate Agents.",
  matchKeywords: ["uk", "london", "rightmove", "zoopla", "estate agent", "lettings", "manchester", "birmingham"],
  systemPromptAddition: `
## UK REAL ESTATE FOCUS
You are configuring a workspace for a UK Estate Agent (Lettings and Sales).
You MUST include automations for:
1. Missed Call Text-Back: Instantly send an AI WhatsApp/SMS message when a call is missed.
2. Rightmove & Zoopla inquiry handling via email/WhatsApp.
3. Viewing schedules (Lettings vs Sales) with Calendar integration.
4. Voice Agents for handling high volumes of inbound calls for viewings.
5. Omnichannel Lead Handling (Unified inbox for FB/WA).
`
};
