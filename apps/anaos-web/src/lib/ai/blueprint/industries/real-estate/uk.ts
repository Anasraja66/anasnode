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
1. Rightmove & Zoopla inquiry handling via email/WhatsApp.
2. Viewing schedules (Lettings vs Sales).
3. Landlord updates and tenant screening workflows.
4. Voice Agents for handling high volumes of inbound calls for viewings.
`
};
