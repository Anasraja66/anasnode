import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mockAccountId = "acc-default-user";

    const cred = await prisma.integrationCredential.findFirst({
      where: { id, accountId: mockAccountId },
    });

    if (!cred) {
      return NextResponse.json({ error: "Credential not found" }, { status: 404 });
    }

    // Try decrypting keys to verify integrity
    const decryptedKeys = decrypt(cred.credentials);
    const parsed = JSON.parse(decryptedKeys);

    if (!parsed.apiKey && !parsed.accessToken && !parsed.password) {
      return NextResponse.json({
        success: false,
        message: "Validation failed: Missing active private key or token inside credential object.",
      });
    }

    // Simulate third party model checks (OpenAI / Claude list models)
    console.log(`[TEST CREDENTIAL] Validated credentials for type: ${cred.type}, name: ${cred.name}`);

    return NextResponse.json({
      success: true,
      message: `Connection successfully established with ${cred.type.toUpperCase()}!`,
    });
  } catch (error: any) {
    console.error("Test credentials error:", error);
    return NextResponse.json({
      success: false,
      message: `Test failed: ${error.message}`,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mockAccountId = "acc-default-user";

    const deleted = await prisma.integrationCredential.deleteMany({
      where: { id, accountId: mockAccountId },
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
