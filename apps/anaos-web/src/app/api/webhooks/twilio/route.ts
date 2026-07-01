import { NextResponse } from "next/server";
import { WorkflowEngine } from "@/lib/workflow/engine/executor";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const params = new URLSearchParams(text);

    const from = params.get("From") || "";
    const to = params.get("To") || "";
    const body = params.get("Body") || "";
    const profileName = params.get("ProfileName") || "Customer";

    if (!from) {
      return NextResponse.json({ success: false, error: "Missing From number" }, { status: 400 });
    }

    // Clean up WhatsApp prefix if present for clean storage
    const cleanPhone = from.replace("whatsapp:", "").replace("+", "");

    console.log(`[Twilio Webhook] Received message from ${cleanPhone}: ${body}`);

    // Here we should route to the Universal Engine.
    // For now, let's find ANY active workflow that has a "trigger_whatsapp" node
    // In a real multi-tenant system, you'd match the 'To' number to an AccountID first.
    
    const activeWorkflows = await prisma.workflow.findMany({
      where: { isActive: true },
    });

    let workflowTriggered = false;

    for (const wf of activeWorkflows) {
      const graph = wf.graph as any;
      if (!graph || !graph.nodes) continue;

      // Find trigger node
      const triggerNode = graph.nodes.find((n: any) => n.type === "trigger_whatsapp");
      
      if (triggerNode) {
        console.log(`[Twilio Webhook] Triggering workflow ${wf.id}`);
        const engine = new WorkflowEngine(wf.id, wf.accountId);
        
        // Pass the incoming message as trigger context
        const triggerData = {
          phone: cleanPhone,
          message: body,
          name: profileName,
          platform: "whatsapp_twilio"
        };
        
        // We don't await the full execution to avoid holding the Twilio webhook open
        engine.run(triggerData).catch(err => {
          console.error(`Workflow ${wf.id} execution failed:`, err);
        });
        
        workflowTriggered = true;
      }
    }

    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Twilio Webhook Error:", error);
    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
      status: 500,
      headers: { "Content-Type": "text/xml" },
    });
  }
}
