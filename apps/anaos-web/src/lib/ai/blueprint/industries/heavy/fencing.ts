import { IndustryPlaybook } from "../types";

export const fencingPlaybook: IndustryPlaybook = {
  id: "heavy-fencing",
  name: "Fencing & Construction",
  description: "Playbook for fencing contractors and builders.",
  matchKeywords: ["fencing", "fence", "builder", "contractor", "construction", "remodeling"],
  systemPromptAddition: `
## FENCING & CONSTRUCTION MVP FOCUS
You are configuring a workspace for a Fencing/Construction Contractor.
You MUST include automations for:
1. Missed Call Text-Back: Instantly send an AI WhatsApp/SMS message when a call is missed.
2. Site Visit Booking: AI schedules physical estimates/measurements via Calendar.
3. Material Delivery Tracking & Contractor Follow-ups.
4. AI Voice Agents for field workers or inbound estimate requests.
5. Omnichannel Lead Handling (Unified inbox for FB/WA).
`
};
