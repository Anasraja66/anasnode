import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { getAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cred = await prisma.integrationCredential.findFirst({
      where: { id, accountId },
    });

    if (!cred) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 });
    }

    const decryptedKeys = decrypt(cred.credentials);
    const parsed = JSON.parse(decryptedKeys);

    if (!parsed.apiKey && !parsed.accessToken && !parsed.password) {
      return NextResponse.json({
        success: false,
        message: "Validation failed: Missing active private key or token.",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Credential validated for ${cred.type}.`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Test failed";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await prisma.integrationCredential.deleteMany({
      where: { id, accountId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Credential deleted successfully",
    });
  } catch (error) {
    console.error("DELETE credentials error:", error);
    return NextResponse.json({ error: "Failed to delete credential" }, { status: 500 });
  }
}
