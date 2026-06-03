import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import {
  compileAutomationFromPrompt,
  saveCompiledAutomation,
} from "@/lib/workflow/compiler";
import { GeneratedWorkspace } from "@/lib/generate/workspace";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/workflows/from-prompt
 * Prompt → compiled workflow graph (save when logged in)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      prompt,
      workspace,
      activate = false,
      save = true,
      workspaceId,
    } = body as {
      prompt?: string;
      workspace?: GeneratedWorkspace;
      activate?: boolean;
      save?: boolean;
      workspaceId?: string;
    };

    if (!prompt?.trim() && !workspace) {
      return NextResponse.json(
        { error: "prompt or workspace is required" },
        { status: 400 }
      );
    }

    const effectivePrompt = prompt?.trim() || `Automation for ${workspace?.name}`;
    const compiled = await compileAutomationFromPrompt(effectivePrompt, workspace);
    const accountId = await getAccountId();

    if (!save || !accountId) {
      return NextResponse.json({
        success: true,
        saved: false,
        requiresAuth: !accountId,
        templateId: compiled.templateId,
        workspace: compiled.workspace,
        workflow: {
          name: compiled.workflowName,
          description: compiled.workflowDescription,
          nodes: compiled.nodes,
          edges: compiled.edges,
          isActive: false,
        },
        message: accountId
          ? "Preview ready."
          : "Preview ready. Sign in to deploy live.",
      });
    }

    const result = await saveCompiledAutomation(accountId, effectivePrompt, {
      workspace: compiled.workspace,
      activate,
      workspaceId,
    });

    return NextResponse.json({
      success: true,
      saved: true,
      activated: activate && result.workflow.isActive,
      templateId: compiled.templateId,
      workspace: {
        id: result.workspace.id,
        name: result.workspace.name,
        industry: result.workspace.industry,
        slug: result.workspace.slug,
        status: result.workspace.status,
      },
      workflow: result.workflow,
      message: activate
        ? "Automation compiled, saved, and activated."
        : "Automation compiled and saved.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to compile automation";
    console.error("from-prompt error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
