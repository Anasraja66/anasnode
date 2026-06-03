import { NextResponse } from "next/server";
import { TEMPLATES, createWorkflowFromTemplate } from "@/lib/workflow/templates";
import { getAccountId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

// GET /api/v1/workflows/templates - Get all available templates
export async function GET() {
  try {
    const briefTemplates = TEMPLATES.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      industry: t.industry,
      nodeCount: t.nodes.length,
    }));

    return NextResponse.json({
      success: true,
      templates: briefTemplates,
    });
  } catch (error) {
    console.error("GET templates error:", error);
    return NextResponse.json({ error: "Failed to list templates" }, { status: 500 });
  }
}

// POST /api/v1/workflows/templates - Create workflow from template
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, workspaceId, name, description } = body;

    if (!templateId || !workspaceId) {
      return NextResponse.json({ error: "Missing required parameters: templateId or workspaceId" }, { status: 400 });
    }

    const accountId = await getAccountId();
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await createWorkflowFromTemplate(templateId, workspaceId, accountId, {
      name,
      description,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("POST instantiate template error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
