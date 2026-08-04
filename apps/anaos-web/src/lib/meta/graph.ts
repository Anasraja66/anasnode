/**
 * Meta Graph API helpers for WhatsApp Embedded Signup onboarding.
 */

import { getPlatformMetaConfig } from "@/lib/meta/platform-config";

const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

export async function validateMetaAccessToken(
  accessToken: string
): Promise<{ valid: boolean; error?: string }> {
  if (!accessToken?.trim()) return { valid: false, error: "No access token" };
  const res = await fetch(
    `${GRAPH_BASE}/me?access_token=${encodeURIComponent(accessToken.trim())}`
  );
  const data = await res.json();
  if (data.error) {
    return { valid: false, error: data.error.message as string };
  }
  return { valid: true };
}

export type ExchangeTokenResult = {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
};

export async function exchangeEmbeddedSignupCode(
  code: string,
  redirectUri?: string
): Promise<ExchangeTokenResult> {
  const platform = await getPlatformMetaConfig();
  const appId = platform.appId;
  const appSecret = platform.appSecret;
  if (!appId || !appSecret) {
    throw new Error("Meta app not configured — Please save the 3 required Meta parameters on the Setup Help page first.");
  }

  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    code,
  });

  if (redirectUri) {
    params.set("redirect_uri", redirectUri);
  }

  const res = await fetch(`${GRAPH_BASE}/oauth/access_token?${params.toString()}`);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Failed to exchange Meta authorization code");
  }

  return {
    accessToken: data.access_token,
    tokenType: data.token_type,
    expiresIn: data.expires_in,
  };
}

export async function subscribeWabaWebhooks(
  wabaId: string,
  accessToken: string
): Promise<boolean> {
  const res = await fetch(`${GRAPH_BASE}/${wabaId}/subscribed_apps`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    console.warn("WABA subscribed_apps:", data);
    return false;
  }
  return data.success === true;
}

export async function fetchPhoneNumberDetails(
  phoneNumberId: string,
  accessToken: string
): Promise<{ displayPhone?: string; verifiedName?: string }> {
  const fields = "display_phone_number,verified_name";
  const res = await fetch(
    `${GRAPH_BASE}/${phoneNumberId}?fields=${fields}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await res.json();
  if (!res.ok) return {};
  return {
    displayPhone: data.display_phone_number,
    verifiedName: data.verified_name,
  };
}

/** Find Phone number ID using access token + app debug (Embedded / temporary tokens). */
export async function discoverPhoneNumberIdFromToken(
  accessToken: string
): Promise<{ phoneNumberId: string; displayPhone?: string } | null> {
  const platform = await getPlatformMetaConfig();
  if (!platform.appId || !platform.appSecret) return null;

  const debugRes = await fetch(
    `${GRAPH_BASE}/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${platform.appId}|${platform.appSecret}`
  );
  const debug = await debugRes.json();
  const wabaIds = new Set<string>();

  for (const scope of debug.data?.granular_scopes || []) {
    const ids = scope.target_ids as string[] | undefined;
    if (!ids?.length) continue;
    if (
      String(scope.scope || "").includes("whatsapp") ||
      scope.scope === "whatsapp_business_management"
    ) {
      ids.forEach((id) => wabaIds.add(id));
    }
  }

  for (const wabaId of wabaIds) {
    const res = await fetch(`${GRAPH_BASE}/${wabaId}/phone_numbers`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    const first = data.data?.[0];
    if (first?.id) {
      return {
        phoneNumberId: String(first.id),
        displayPhone: first.display_phone_number as string | undefined,
      };
    }
  }

  return null;
}

export function resolveMetaRedirectUri(): string {
  if (process.env.META_OAUTH_REDIRECT_URI) {
    return process.env.META_OAUTH_REDIRECT_URI;
  }
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/dashboard/integrations/connect/whatsapp`;
}
