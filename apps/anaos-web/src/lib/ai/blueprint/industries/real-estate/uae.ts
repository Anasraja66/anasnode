import { IndustryPlaybook } from "../types";

export const uaeRealEstate: IndustryPlaybook = {
  id: "real-estate-uae",
  name: "UAE Real Estate",
  description: "Playbook for UAE real estate agents and brokerages.",
  matchKeywords: ["uae", "dubai", "abu dhabi", "emaar", "damac", "off-plan", "off plan", "property finder", "bayut"],
  systemPromptAddition: `
## UAE REAL ESTATE MVP FOCUS
You are configuring a workspace specifically for a UAE Real Estate Agent/Brokerage.
The absolute primary problem to solve is APPROACHING PROPERTY OWNERS (Sellers/Landlords) and capturing leads (Buyers).

You MUST include automations for:
1. Missed Call Text-Back (Bayut/Dubizzle): Read missed call email notifications (e.g., from Titan/Gmail), extract the lead's number, and instantly trigger a WhatsApp AI message ("Sorry I missed your call, how can I assist you?").
2. Bulk Broadcasting Messages to Property Owners (via WhatsApp).
3. AI-handled replies: When owners reply to the broadcast or missed call, the AI answers questions, qualifies them, and books a meeting/appointment.
4. Voice Calling Agents (Vapi) for outbound calling to owners.
5. Email sequences for follow-ups.
6. Calendar booking for viewing appointments or listing meetings.
7. Omnichannel Lead Handling: WhatsApp, Facebook, Instagram integration (GoHighLevel style inbox).
8. CRM Integration: Moving leads across stages (Missed Call -> Contacted -> Met -> Listed -> Sold).
8. (Optional/Future) Pulling properties automatically from their website or portals like Property Finder.

Design the variables and workflow names around these exact use-cases. E.g. "Property Owner Outreach", "AI Owner Qualification", "Outbound Voice Agent".
`
};
