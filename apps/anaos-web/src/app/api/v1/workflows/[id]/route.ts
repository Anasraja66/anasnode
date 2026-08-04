import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import { WorkflowService } from "@/lib/services/workflow.service";
import { handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workflow = await WorkflowService.getById(accountId, id);
    return NextResponse.json({ success: true, workflow });
  } catch (error) {
    console.error("GET workflow error:", error);
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, definition, variables } = body;

    const updated = await WorkflowService.update(accountId, id, {
      name,
      description,
      definition,
      variables,
    });

    return NextResponse.json({ success: true, workflow: updated });
  } catch (error) {
    console.error("PUT workflow error:", error);
    return handleApiError(error);
  }
}
