import { IndustryPlaybook } from "../types";

export const maintenancePlaybook: IndustryPlaybook = {
  id: "heavy-maintenance",
  name: "Maintenance Services",
  description: "Playbook for plumbing, HVAC, electrical, and general maintenance.",
  matchKeywords: ["maintenance", "plumbing", "plumber", "hvac", "electrician", "repair", "handyman", "ac repair"],
  systemPromptAddition: `
## MAINTENANCE SERVICES MVP FOCUS
You are configuring a workspace for a Maintenance/Repair Company (e.g., Plumbing, HVAC).
You MUST include automations for:
1. Missed Call Text-Back: Instantly send an AI WhatsApp/SMS message when a call is missed.
2. Emergency Call Handling: AI Voice Agent to take emergency details 24/7.
3. Ticket Creation: Automatically capture the issue (Plumbing/HVAC) and create a CRM ticket.
4. Technician Dispatch Tracking & Updates.
5. Omnichannel Lead Handling (Unified inbox for FB/WA).
`
};
