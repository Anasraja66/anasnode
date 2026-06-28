import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { getAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const credentialsList = await prisma.integrationCredential.findMany({
      where: { accountId },
      select: {
        id: true,
        type: true,
        name: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
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

export async function POST(request: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, name, credentials } = body;

    if (!type || !name || !credentials) {
      return NextResponse.json(
        { error: "Missing required fields: type, name, or credentials" },
        { status: 400 }
      );
    }

    const encryptedData = encrypt(JSON.stringify(credentials));

    const savedCredential = await prisma.integrationCredential.create({
      data: {
        accountId,
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
      },
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
