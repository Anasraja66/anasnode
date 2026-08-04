import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import { TemplateService } from "@/lib/services/template.service";
import { handleApiError } from "@/lib/errors";
import { TEMPLATES, createWorkflowFromTemplate } from "@/lib/workflow/templates";

export const dynamic = "force-dynamic";

// GET /api/v1/workflows/templates - Get all available templates
export async function GET() {
  try {
    const templates = await TemplateService.list();
    const briefTemplates = templates.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      industry: t.category,
      nodeCount: JSON.parse(t.definition || "{}").nodes?.length ?? 0,
    }));

    return NextResponse.json({ success: true, templates: briefTemplates });
  } catch (error) {
    console.error("GET templates error:", error);
    return handleApiError(error);
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
    return handleApiError(error);
  }
}
