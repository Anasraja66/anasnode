import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaces } = await request.json();

    if (!workspaces || !Array.isArray(workspaces) || workspaces.length === 0) {
      return NextResponse.json({ error: "No workspaces provided" }, { status: 400 });
    }

    const accountId = (session.user as any).accountId;
    if (!accountId) {
      return NextResponse.json({ error: "Account ID missing" }, { status: 400 });
    }

    // Process each workspace
    const results = [];
    for (const ws of workspaces) {
      // 1. Create the Workspace
      const newWorkspace = await prisma.workspace.create({
        data: {
          accountId,
          name: ws.name || "AI Generated Workspace",
          industry: ws.industry || "General",
          slug: ws.slug || `ws-${Date.now()}`,
          status: "live",
          languageSettings: "en",
        },
      });

      // 2. Map the automations (Instagram, Facebook, WhatsApp) to Workflows
      const automations = ws.automations || [];
      for (const auto of automations) {
        if (!auto.enabled) continue;

        // Base node for the workflow
        const nodes = [
          {
            id: "trigger-1",
            type: "trigger",
            position: { x: 100, y: 100 },
            data: { 
              label: "Inbound Message",
              channel: auto.type === "whatsapp_flow" ? "whatsapp" : 
                       auto.type === "instagram_flow" ? "instagram" : 
                       auto.type === "facebook_flow" ? "facebook" : "whatsapp" 
            }
          },
          {
            id: "ai-1",
            type: "ai_action",
            position: { x: 100, y: 250 },
            data: { label: "Generate AI Reply" }
          }
        ];

        const edges = [
          { id: "e1-2", source: "trigger-1", target: "ai-1" }
        ];

        await prisma.workflow.create({
          data: {
            accountId,
            workspaceId: newWorkspace.id,
            name: auto.name || "AI Automation",
            description: auto.description || `Auto-generated ${auto.type} workflow`,
            isActive: true,
            nodes: JSON.stringify(nodes),
            edges: JSON.stringify(edges),
            variables: JSON.stringify(ws.variables?.map((v: any) => v.key) || []),
          }
        });
      }
      
      results.push(newWorkspace);
    }

    return NextResponse.json({ success: true, count: results.length, workspaces: results });
  } catch (error) {
    console.error("Workspace Import error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
