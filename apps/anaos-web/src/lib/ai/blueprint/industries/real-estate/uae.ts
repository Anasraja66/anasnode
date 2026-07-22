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
1. Bulk Broadcasting Messages to Property Owners (via WhatsApp).
2. AI-handled replies: When owners reply to the broadcast, the AI answers questions, qualifies them, and books a meeting/appointment.
3. Voice Calling Agents (Vapi) for outbound calling to owners.
4. Email sequences.
5. Calendar booking for viewing appointments or listing meetings.
6. Omnichannel Lead Handling: WhatsApp, Facebook, Instagram integration.
7. CRM Integration: Moving leads across stages (Contacted -> Met -> Listed -> Sold).
8. (Optional/Future) Pulling properties automatically from their website or portals like Property Finder.

Design the variables and workflow names around these exact use-cases. E.g. "Property Owner Outreach", "AI Owner Qualification", "Outbound Voice Agent".
`
};
