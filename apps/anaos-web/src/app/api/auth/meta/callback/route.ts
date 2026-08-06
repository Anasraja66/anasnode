import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { requireAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/meta/callback
 * Handles the OAuth redirect from Meta (Facebook).
 * Exchanges the 'code' for a short-lived token, then upgrades to a long-lived token.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // Optional: passing the channel type or redirect path
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      console.error("[Meta OAuth Error]", error, errorDescription);
      return NextResponse.redirect(new URL(`/dashboard/integrations?error=${error}`, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL(`/dashboard/integrations?error=no_code`, request.url));
    }

    // Attempt to identify the user session to store credentials
    // Note: Since this is a redirect, we need the session cookie to be valid.
    let accountId: string;
    try {
      accountId = await requireAccountId();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (authErr) {
      console.error("[Meta OAuth Auth Error] Session not found");
      return NextResponse.redirect(new URL("/login?redirect=/dashboard/integrations", request.url));
    }

    const clientId = process.env.NEXT_PUBLIC_META_CLIENT_ID;
    const clientSecret = process.env.META_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/meta/callback`;

    if (!clientId || !clientSecret || !process.env.NEXT_PUBLIC_APP_URL) {
      console.error("Meta Client ID/Secret or App URL is missing in Env");
      return NextResponse.redirect(new URL(`/dashboard/integrations?error=missing_env`, request.url));
    }

    // Step 1: Exchange code for short-lived access token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error("[Meta Token Error]", tokenData.error);
      return NextResponse.redirect(new URL(`/dashboard/integrations?error=token_exchange_failed`, request.url));
    }

    const shortLivedToken = tokenData.access_token;

    // Step 2: Upgrade to a Long-Lived System User Token
    const upgradeUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${shortLivedToken}`;
    const upgradeRes = await fetch(upgradeUrl);
    const upgradeData = await upgradeRes.json();
    
    const longLivedToken = upgradeData.access_token || shortLivedToken;

    // We can also fetch the user's ID or Pages here using the token
    // For now, we will store the longLivedToken as a generic Meta token 
    // that the user can use for WhatsApp, Facebook, or Instagram.

    const encryptedData = encrypt(
      JSON.stringify({
        accessToken: longLivedToken,
        // phoneNumberId and other specifics can be updated later when they select a page/number in the UI
      })
    );

    // Save or update the credential in DB. 
    // We store it generically under "meta_oauth" or directly under "whatsapp"/"facebook" if passed in state.
    const integrationType = state || "meta_oauth";

    const existing = await prisma.integrationCredential.findFirst({
      where: { accountId, type: integrationType },
    });

    if (existing) {
      await prisma.integrationCredential.update({
        where: { id: existing.id },
        data: { credentials: encryptedData, isActive: true },
      });
    } else {
      await prisma.integrationCredential.create({
        data: {
          accountId,
          type: integrationType,
          name: `Meta Connection (${integrationType})`,
          credentials: encryptedData,
          isActive: true,
        },
      });
    }

    // Redirect back to integrations page with success flag
    return NextResponse.redirect(new URL(`/dashboard/integrations?success=meta_connected`, request.url));
  } catch (error) {
    console.error("[Meta OAuth Exception]", error);
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=server_error`, request.url));
  }
}
