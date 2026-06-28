import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { saveCompiledAutomation } from "@/lib/workflow/compiler";
import { getIndustryPreset } from "@/lib/industry/presets";
import {
  serializeLanguageSettings,
  type WorkspaceLanguageSettings,
} from "@/lib/i18n/settings";
import { defaultPlatformLanguageSettings } from "@/lib/i18n/platform";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, industry, industryId, ownerRole, workspaceName, languageSettings } =
      await request.json();

    const preset = getIndustryPreset(industryId || industry);
    const role = ownerRole || "owner";

    if (!name || !workspaceName || (!industry && !industryId)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const email = session.user.email;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        role: String(role).toLowerCase(),
      },
    });

    const slug = workspaceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const langJson = languageSettings
      ? serializeLanguageSettings(
          languageSettings as WorkspaceLanguageSettings
        )
      : serializeLanguageSettings(defaultPlatformLanguageSettings());

    let workspace = await prisma.workspace.findFirst({
      where: { accountId: user.accountId },
      orderBy: { createdAt: "asc" },
    });

    if (workspace) {
      workspace = await prisma.workspace.update({
        where: { id: workspace.id },
        data: {
          name: workspaceName,
          slug,
          industry: preset.label,
          status: "live",
          languageSettings: langJson,
        },
      });
    } else {
      workspace = await prisma.workspace.create({
        data: {
          accountId: user.accountId,
          name: workspaceName,
          slug,
          industry: preset.label,
          status: "live",
          languageSettings: langJson,
        },
      });
    }

    const existingWorkflow = await prisma.workflow.findFirst({
      where: { workspaceId: workspace.id },
    });

    let workflowId = existingWorkflow?.id;

    if (!existingWorkflow) {
      const prompt = `I run ${workspaceName} (${preset.label}). Automate WhatsApp: ${preset.automationHint}. Keep replies natural for customers.`;
      const result = await saveCompiledAutomation(user.accountId, prompt, {
        activate: true,
        workspaceId: workspace.id,
      });
      workflowId = result.workflow.id;
    } else if (!existingWorkflow.isActive) {
      await prisma.workflow.update({
        where: { id: existingWorkflow.id },
        data: { isActive: true },
      });
      workflowId = existingWorkflow.id;
    }

    return NextResponse.json({
      success: true,
      workspaceId: workspace.id,
      workflowId,
    });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
