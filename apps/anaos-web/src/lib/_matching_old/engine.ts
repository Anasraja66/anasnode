import { prisma } from "@/lib/db";
import { Property } from "@prisma/client";
import { ExtractedLeadPreferences } from "../ai/pipeline/LeadExtractor";

export async function matchPropertiesForLead(
  accountId: string,
  preferences: ExtractedLeadPreferences,
  limit: number = 3
): Promise<Property[]> {
  const { budgetMax, budgetMin, preferredArea, preferredType, bedrooms, intent } = preferences;

  // Build Prisma where clause dynamically based on available preferences
  const where: any = {
    accountId,
    status: "available", // Only match available properties
  };

  // If intent is rent, match rent properties. Otherwise match sale properties (default)
  if (intent === "rent") {
    where.priceType = { in: ["rent_monthly", "rent_yearly"] };
  } else if (intent === "buy") {
    where.priceType = "sale";
  }

  // Budget Filter
  if (budgetMax || budgetMin) {
    where.price = {};
    if (budgetMax) where.price.lte = budgetMax * 1.15; // 15% upper flexibility
    if (budgetMin) where.price.gte = budgetMin * 0.85; // 15% lower flexibility
  }

  // Property Type Filter
  if (preferredType) {
    where.type = preferredType.toLowerCase();
  }

  // Bedrooms Filter
  if (bedrooms) {
    where.bedrooms = { gte: bedrooms }; // Match at least the requested bedrooms
  }

  // Location/Area filter
  if (preferredArea) {
    // We use a basic OR filter for city, area, or address containing the keyword
    where.OR = [
      { area: { contains: preferredArea, mode: "insensitive" } },
      { city: { contains: preferredArea, mode: "insensitive" } },
      { title: { contains: preferredArea, mode: "insensitive" } }
    ];
  }

  try {
    const matches = await prisma.property.findMany({
      where,
      take: limit,
      orderBy: [
        { featured: "desc" }, // Prioritize featured properties
        { createdAt: "desc" }
      ]
    });

    return matches;
  } catch (err) {
    console.error("[MatchingEngine] Failed to match properties:", err);
    return [];
  }
}

export function formatPropertiesForWhatsApp(properties: Property[]): string {
  if (properties.length === 0) {
    return "I couldn't find exact matches for your criteria right now. Let me connect you with an agent who can help source it for you!";
  }

  let text = "Here are some top properties matching your criteria:\n\n";
  
  properties.forEach((p, index) => {
    // Format price beautifully (e.g. 2,000,000 AED)
    const formattedPrice = new Intl.NumberFormat('en-US').format(p.price);
    
    text += `${index + 1}. *${p.title}*\n`;
    text += `📍 ${p.area ? p.area + ", " : ""}${p.city}\n`;
    text += `💰 ${formattedPrice} ${p.currency}\n`;
    text += `🛏️ ${p.bedrooms} Beds | 🛁 ${p.bathrooms} Baths\n`;
    if (p.slug) {
      text += `🔗 View Details: https://anaos.io/property/${p.slug}\n`; // Placeholder URL
    }
    text += `\n`;
  });

  text += "Would you like to schedule a viewing for any of these?";
  return text;
}
