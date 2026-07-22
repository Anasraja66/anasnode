import { IndustryPlaybook } from "../types";

export const cleaningPlaybook: IndustryPlaybook = {
  id: "heavy-cleaning",
  name: "Cleaning Services",
  description: "Playbook for commercial and residential cleaning companies.",
  matchKeywords: ["cleaning", "maid", "janitorial", "housekeeping", "carpet cleaning", "cleaner"],
  systemPromptAddition: `
## CLEANING SERVICES MVP FOCUS
You are configuring a workspace for a Cleaning Company.
You MUST include automations for:
1. Missed Call Text-Back: Instantly send an AI WhatsApp/SMS message when a call is missed.
2. Quote Generation: AI asks for square footage/rooms and provides an instant quote.
3. Scheduling & Booking: Calendar integration for cleaning appointments.
4. Recurring Service Reminders (weekly/monthly).
5. Customer Review Collector after service completion.
6. Omnichannel Lead Handling (Unified inbox for FB/WA).
`
};
