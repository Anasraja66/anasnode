import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";

export const dynamic = "force-dynamic";

// GET /api/v1/credentials - List masked credentials
export async function GET() {
  try {
    // Standard mock account ID in development
    const mockAccountId = "acc-default-user";
    
    // Auto-create standard mock account if it doesn't exist
    await prisma.account.upsert({
      where: { email: "anas@anaos.io" },
      update: {},
      create: {
        id: mockAccountId,
        email: "anas@anaos.io",
        name: "Anas User",
      }
    });

    const credentialsList = await prisma.integrationCredential.findMany({
      where: { accountId: mockAccountId },
      select: {
        id: true,
        type: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      credentials: credentialsList,
    });
  } catch (error) {
    console.error("GET credentials error:", error);
    return NextResponse.json({ error: "Failed to list credentials" }, { status: 500 });
  }
}

// POST /api/v1/credentials - Save and encrypt credentials
export async function POST(request: Request) {
  try {
    const mockAccountId = "acc-default-user";
    const body = await request.json();
    const { type, name, credentials } = body;

    if (!type || !name || !credentials) {
      return NextResponse.json({ error: "Missing required fields: type, name, or credentials" }, { status: 400 });
    }

    // Encrypt raw credential object (API keys/secrets)
    const encryptedData = encrypt(JSON.stringify(credentials));

    // Save to SQLite
    const savedCredential = await prisma.integrationCredential.create({
      data: {
        accountId: mockAccountId,
        type,
        name,
        credentials: encryptedData,
        isActive: true,
      },
      select: {
        id: true,
        type: true,
        name: true,
        isActive: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      credential: savedCredential,
    });
  } catch (error) {
    console.error("POST credentials error:", error);
    return NextResponse.json({ error: "Failed to save credentials" }, { status: 500 });
  }
}
