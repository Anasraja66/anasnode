import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { code, accountId } = await request.json();

    if (!code || !accountId) {
      return NextResponse.json({ success: false, error: "Missing code or account ID" }, { status: 400 });
    }

    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    if (!appId || !appSecret) {
      // Mock success for local dev without credentials
      await prisma.integrationCredential.create({
        data: {
          accountId,
          type: "whatsapp",
          name: "Bring Your Own Number (Mock)",
          credentials: JSON.stringify({ 
            wabaId: "mock_waba_123", 
            phoneNumberId: "mock_phone_123", 
            provider: "meta" 
          }),
        }
      });
      return NextResponse.json({ success: true, message: "Mock OAuth successful" });
    }

    // 1. Exchange code for user access token
    const tokenUrl = `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error(`Failed to exchange token: ${tokenData.error?.message}`);
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch the WABA ID (WhatsApp Business Account ID) associated with this token
    // The embedded signup flow automatically links a WABA to the user.
    const debugUrl = `https://graph.facebook.com/v20.0/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`;
    const debugRes = await fetch(debugUrl);
    const debugData = await debugRes.json();
    
    // In a real app, you would now use the shared WABA ID from the granular permissions.
    // For this example, we save the access token in credentials so the backend can use it.
    
    await prisma.integrationCredential.create({
      data: {
        accountId,
        type: "whatsapp",
        name: "Connected via Facebook",
        credentials: JSON.stringify({ 
          accessToken, 
          wabaId: debugData.data?.metadata?.sso_waba_id || "pending",
          provider: "meta" 
        }),
      }
    });

    return NextResponse.json({ success: true, message: "OAuth successful" });
  } catch (error: any) {
    console.error("Meta OAuth Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
