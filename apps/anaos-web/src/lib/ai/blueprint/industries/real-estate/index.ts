import { IndustryPlaybook } from "../types";
import { uaeRealEstate } from "./uae";
import { usRealEstate } from "./us";
import { ukRealEstate } from "./uk";

export const realEstatePlaybooks: IndustryPlaybook[] = [
  uaeRealEstate,
  usRealEstate,
  ukRealEstate,
];

export const baseRealEstate: IndustryPlaybook = {
  id: "real-estate-base",
  name: "Global Real Estate",
  description: "General playbook for real estate.",
  matchKeywords: ["real estate", "realty", "property", "brokerage", "broker"],
  systemPromptAddition: `
## REAL ESTATE AUTOMATION FOCUS
You are configuring a workspace for a Real Estate Brokerage.
You MUST include automations for:
1. Lead Qualification: Automatically ask for Budget and Location.
2. Property Viewings: Calendar bookings for showings.
3. Omnichannel outreach: SMS, Email, WhatsApp, Facebook, Instagram.
`
};
