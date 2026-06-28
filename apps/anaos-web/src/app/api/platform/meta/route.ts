import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import {
  getPlatformMetaConfig,
  savePlatformMetaConfig,
} from "@/lib/meta/platform-config";

export const dynamic = "force-dynamic";

async function allowPlatformMetaAccess(): Promise<boolean> {
  try {
    await requireAccountId();
    return true;
  } catch {
    return process.env.NODE_ENV === "development";
  }
}

export async function GET() {
  try {
    if (!(await allowPlatformMetaAccess())) {
      return NextResponse.json({ error: "Login first" }, { status: 401 });
    }
    const config = await getPlatformMetaConfig();
    const configured = Boolean(config.appId && config.appSecret && config.configId);

    return NextResponse.json({
      success: true,
      configured,
      source: config.source,
      appId: configured ? config.appId : "",
      configId: configured ? config.configId : "",
      hasSecret: configured,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Login first" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await allowPlatformMetaAccess())) {
      return NextResponse.json({ error: "Login first" }, { status: 401 });
    }
    const body = await request.json();
    const { appId, appSecret, configId } = body;

    if (!appId?.trim() || !appSecret?.trim() || !configId?.trim()) {
      return NextResponse.json(
        { error: "Three parameters are required: App ID, App Secret, and Config ID" },
        { status: 400 }
      );
    }

    await savePlatformMetaConfig({
      appId,
      appSecret,
      configId,
    });

    return NextResponse.json({
      success: true,
      message: "Meta configurations saved successfully! Now go to WhatsApp integration and click Connect with Meta.",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Login first" }, { status: 401 });
    }
    console.error("platform meta save:", error);
    const detail =
      error instanceof Error ? error.message : "Save failed";
    const hint = detail.includes("platform_meta")
      ? "Database update required. Please restart your dev server (npm run dev)."
      : detail;
    return NextResponse.json({ error: hint }, { status: 500 });
  }
}
