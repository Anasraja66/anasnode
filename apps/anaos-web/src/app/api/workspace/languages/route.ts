import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import {
  DEFAULT_LANGUAGE_SETTINGS,
  parseLanguageSettings,
  serializeLanguageSettings,
  type WorkspaceLanguageSettings,
} from "@/lib/i18n/settings";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { LanguageCode } from "@/lib/i18n/languages";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accountId = await requireAccountId();
    const workspace = await prisma.workspace.findFirst({
      where: { accountId },
      orderBy: { createdAt: "desc" },
      select: { id: true, languageSettings: true },
    });

    if (!workspace) {
      return NextResponse.json({
        success: true,
        settings: DEFAULT_LANGUAGE_SETTINGS,
      });
    }

    return NextResponse.json({
      success: true,
      workspaceId: workspace.id,
      settings: parseLanguageSettings(workspace.languageSettings),
    });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const accountId = await requireAccountId();
    const body = (await request.json()) as WorkspaceLanguageSettings;

    const settings: WorkspaceLanguageSettings = {
      mode: body.mode === "fixed" ? "fixed" : "auto",
      fixedLanguage: body.fixedLanguage,
      enabled: body.enabled || DEFAULT_LANGUAGE_SETTINGS.enabled,
    };

    const workspace = await prisma.workspace.findFirst({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    });

    if (!workspace) {
      return NextResponse.json({ error: "No workspace" }, { status: 404 });
    }

    await prisma.workspace.update({
      where: { id: workspace.id },
      data: { languageSettings: serializeLanguageSettings(settings) },
    });

    return NextResponse.json({ success: true, settings });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
