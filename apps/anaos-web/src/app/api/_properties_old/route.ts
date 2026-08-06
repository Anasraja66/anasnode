import { NextRequest, NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

// GET /api/properties — List all properties for this account
export async function GET(req: NextRequest) {
  try {
    const accountId = await requireAccountId();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const country = searchParams.get("country");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { accountId };
    if (status) where.status = status;
    if (type) where.type = type;
    if (country) where.country = country;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { area: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { referenceNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { leads: true } } },
    });

    return NextResponse.json({ properties });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/properties — Create a new property
export async function POST(req: NextRequest) {
  try {
    const accountId = await requireAccountId();
    const body = await req.json();
    const {
      title, description, type, status, price, currency, priceType,
      bedrooms, bathrooms, size, sizeUnit, city, area, country, address,
      latitude, longitude, images, amenities, floorPlan, permitNumber,
      referenceNumber, featured, workspaceId,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const ref = referenceNumber || `RE-${Date.now().toString(36).toUpperCase()}`;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + ref.toLowerCase();

    const property = await prisma.property.create({
      data: {
        accountId,
        workspaceId: workspaceId || null,
        title,
        description: description || "",
        type: type || "apartment",
        status: status || "available",
        price: price || 0,
        currency: currency || "AED",
        priceType: priceType || "sale",
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        size: size || 0,
        sizeUnit: sizeUnit || "sqft",
        city: city || "",
        area: area || "",
        country: country || "UAE",
        address: address || "",
        latitude: latitude || null,
        longitude: longitude || null,
        images: JSON.stringify(images || []),
        amenities: JSON.stringify(amenities || []),
        floorPlan: floorPlan || null,
        permitNumber: permitNumber || "",
        referenceNumber: ref,
        featured: featured || false,
        slug,
      },
    });

    return NextResponse.json({ property }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
