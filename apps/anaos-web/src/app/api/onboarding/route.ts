import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { generateBlueprint } from "@/lib/ai/blueprint/generator";
import { saveCompiledAutomation } from "@/lib/workflow/compiler";

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, industry, workspaceName: fallbackName, name } = await request.json();

    const finalPrompt = prompt || (industry ? `Create a workspace for a ${industry} business.` : null);

    if (!finalPrompt) {
      return NextResponse.json(
        { error: "Missing required prompt or industry" },
        { status: 400 }
      );
    }

    const email = sessionUser.email;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name },
      });
    }

    // 1. Generate the AI Workspace Blueprint
    const blueprint = await generateBlueprint(finalPrompt);

    const workspaceName = fallbackName || `${blueprint.industryName} Workspace`;
    const slug = workspaceName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // 2. Create or Update Workspace
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
          industry: blueprint.industryName,
          status: "live",
        },
      });
    } else {
      workspace = await prisma.workspace.create({
        data: {
          accountId: user.accountId,
          name: workspaceName,
          slug,
          industry: blueprint.industryName,
          status: "live",
        },
      });
    }

    // 3. Provision AI Agent Persona
    const existingAgent = await prisma.aIAgent.findFirst({
      where: { workspaceId: workspace.id },
    });

    if (!existingAgent) {
      await prisma.aIAgent.create({
        data: {
          accountId: user.accountId,
          workspaceId: workspace.id,
          name: "Main Consultant",
          persona: blueprint.agentPersona,
          model: "gpt-4o",
        },
      });
    }

    // 4. Provision Knowledge Base Categories
    for (const category of blueprint.knowledgeBaseCategories) {
      const existingKb = await prisma.knowledgeBase.findFirst({
        where: { workspaceId: workspace.id, name: category },
      });
      if (!existingKb) {
        await prisma.knowledgeBase.create({
          data: {
            accountId: user.accountId,
            workspaceId: workspace.id,
            name: category,
            description: `Auto-generated folder for ${category}`,
          },
        });
      }
    }

    // 5. Generate Default Workflow (fallback to existing compiler for React Flow structure)
    // We pass the prompt to saveCompiledAutomation so it picks the closest template based on their words
    const existingWorkflow = await prisma.workflow.findFirst({
      where: { workspaceId: workspace.id },
    });

    let workflowId = existingWorkflow?.id;

    if (!existingWorkflow) {
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
      blueprint,
    });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return NextResponse.json(
      { error: "Failed to generate workspace" },
      { status: 500 }
    );
  }
}
