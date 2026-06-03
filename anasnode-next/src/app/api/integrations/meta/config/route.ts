import { NextResponse } from "next/server";
import { getPlatformMetaConfig } from "@/lib/meta/platform-config";

export const dynamic = "force-dynamic";

/**
 * Public Meta SDK config for Embedded Signup (no secrets).
 */
export async function GET() {
  const platform = await getPlatformMetaConfig();
  const appId = platform.appId;
  const configId = platform.configId;
  const graphVersion = process.env.META_GRAPH_API_VERSION || "v21.0";

  const configured = Boolean(appId && configId && platform.appSecret);

  return NextResponse.json({
    success: true,
    configured,
    appId: configured ? appId : "",
    configId: configured ? configId : "",
    graphVersion,
    setupHint: configured
      ? null
      : "Dashboard → Setup Help — wahan 3 values paste karo (App ID, Secret, Config ID)",
  });
}
