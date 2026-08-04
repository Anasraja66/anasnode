import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import { WorkflowService } from "@/lib/services/workflow.service";
import { handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

// GET /api/v1/workflows - List workflows for accounts
export async function GET(request: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId") ?? undefined;

    const workflows = await WorkflowService.list(accountId, workspaceId);
    return NextResponse.json({ success: true, workflows });
  } catch (error) {
    console.error("GET workflows error:", error);
    return handleApiError(error);
  }
}

// POST /api/v1/workflows - Create new workflow
export async function POST(request: Request) {
  try {
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, workspaceId, definition, nodes, edges, variables } = body;

    if (!name || !workspaceId) {
      return NextResponse.json({ error: "Missing required fields: name or workspaceId" }, { status: 400 });
    }

    const workflowDefinition = definition ?? { nodes: nodes || [], edges: edges || [] };

    const workflow = await WorkflowService.create(accountId, {
      name,
      description,
      workspaceId,
      definition: workflowDefinition,
      variables: variables ?? [],
    });

    return NextResponse.json({ success: true, workflow });
  } catch (error) {
    console.error("POST workflow error:", error);
    return handleApiError(error);
  }
}
