import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || "meta";
  
  const clientId = process.env.NEXT_PUBLIC_META_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/meta/callback`;
  const scopes = [
    "pages_show_list",
    "pages_messaging",
    "instagram_basic",
    "instagram_manage_messages",
  ].join(",");

  if (!clientId || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.redirect(new URL(`/dashboard/integrations?error=missing_env`, request.url));
  }

  const fbLoginUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${encodeURIComponent(scopes)}&response_type=code`;

  return NextResponse.redirect(fbLoginUrl);
}
