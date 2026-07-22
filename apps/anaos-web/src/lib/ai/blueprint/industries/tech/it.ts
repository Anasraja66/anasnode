import { IndustryPlaybook } from "../types";

export const itPlaybook: IndustryPlaybook = {
  id: "tech-it",
  name: "IT & Tech Services",
  description: "Playbook for IT support, software agencies, and MSPs.",
  matchKeywords: ["it", "tech", "software", "agency", "msp", "support", "development", "web design"],
  systemPromptAddition: `
## IT & TECH SERVICES MVP FOCUS
You are configuring a workspace for an IT Support or Tech Agency.
You MUST include automations for:
1. Missed Call Text-Back: Instantly send an AI WhatsApp/SMS message when a call is missed.
2. Support Ticket Generation: AI reads inbound emails/messages and creates a support ticket.
3. Client Onboarding Sequence: Automated email/WhatsApp sequence when a new client signs up.
4. AI Voice Agents for tier-1 support queries.
5. Omnichannel Lead Handling (Unified inbox for FB/WA).
`
};
