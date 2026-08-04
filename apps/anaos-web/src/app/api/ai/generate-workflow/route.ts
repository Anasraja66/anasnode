import { NextResponse } from "next/server";

// Very basic keyword-based matching for now. In a real scenario, this would call OpenAI/Gemini.
export async function POST(req: Request) {
  try {
    const { prompt, integrations } = await req.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
    }

    const p = prompt.toLowerCase();
    
    // Baseline workflow structure
    const newWorkflow = {
      id: "node_" + crypto.randomUUID(),
      name: "AI Generated Workflow",
      nodes: [
        {
          id: "trigger_1",
          type: "trigger",
          position: { x: 250, y: 100 },
          data: {
            title: "Incoming Message",
            type: p.includes("whatsapp") ? "whatsapp" 
                : p.includes("instagram") ? "instagram" 
                : p.includes("messenger") || p.includes("facebook") ? "messenger" 
                : "all",
            channel: p.includes("whatsapp") ? "WhatsApp" : "All Channels",
            config: {}
          }
        }
      ],
      edges: []
    };

    let lastNodeId = "trigger_1";
    let yPos = 250;

    // Condition Node
    if (p.includes("if") || p.includes("condition") || p.includes("score")) {
      const condId = "condition_" + crypto.randomUUID().slice(0,4);
      newWorkflow.nodes.push({
        id: condId,
        type: "condition",
        position: { x: 250, y: yPos },
        data: {
          title: "Condition",
          rules: [{ field: "message.body", operator: "contains", value: "buy" }],
          config: {}
        }
      });
      newWorkflow.edges.push({
        id: `e-${lastNodeId}-${condId}`,
        source: lastNodeId,
        target: condId,
        type: "smoothstep",
      });
      lastNodeId = condId;
      yPos += 150;
    }

    // AI Reply Node
    if (p.includes("ai") || p.includes("reply") || p.includes("respond")) {
      const aiId = "ai_" + crypto.randomUUID().slice(0,4);
      newWorkflow.nodes.push({
        id: aiId,
        type: "ai_reply",
        position: { x: 250, y: yPos },
        data: {
          title: "AI Reply",
          prompt: "You are a helpful assistant. Reply to the customer's message.",
          model: "gpt-4o-mini",
          config: {}
        }
      });
      newWorkflow.edges.push({
        id: `e-${lastNodeId}-${aiId}`,
        source: lastNodeId,
        target: aiId,
        type: "smoothstep",
        sourceHandle: "true", // if it came from condition
      });
      lastNodeId = aiId;
      yPos += 150;
    }

    // CRM/Sync Node
    if (p.includes("crm") || p.includes("lead") || p.includes("sync")) {
      const syncId = "sync_" + crypto.randomUUID().slice(0,4);
      newWorkflow.nodes.push({
        id: syncId,
        type: "action",
        position: { x: 250, y: yPos },
        data: {
          title: "Update CRM",
          actionType: "anaos_crm_upsert",
          config: {}
        }
      });
      newWorkflow.edges.push({
        id: `e-${lastNodeId}-${syncId}`,
        source: lastNodeId,
        target: syncId,
        type: "smoothstep",
      });
    }

    // Give it a relevant name based on prompt length
    if (prompt.length < 50) {
      newWorkflow.name = prompt.charAt(0).toUpperCase() + prompt.slice(1);
    } else {
      newWorkflow.name = "Automated Follow-up";
    }

    return NextResponse.json({
      success: true,
      workflow: newWorkflow
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
