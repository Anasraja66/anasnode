import { NextResponse } from "next/server";
import { sendMetaTextMessage } from "@/lib/whatsapp/meta";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET Handler for Meta Webhook Verification.
 * When you setup the webhook in Meta Developers dashboard, Meta will send a GET request here
 * to verify the server is live and the token matches.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "anaos_secret_verify_token";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("Meta WhatsApp webhook verified successfully!");
    return new Response(challenge, { status: 200 });
  }

  console.error("Meta Webhook verification failed. Token mismatch.");
  return new Response("Forbidden", { status: 403 });
}

/**
 * POST Handler for Meta Webhook.
 * Meta sends incoming messages to this endpoint via POST.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if this is a WhatsApp status update (delivered, read, etc.) or an actual message
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const val = change?.value;
    
    if (!val || !val.messages || val.messages.length === 0) {
      // It's a status notification or empty message array. Just acknowledge and return 200.
      return NextResponse.json({ success: true, message: "Acknowledged status update" });
    }

    const message = val.messages[0];
    const senderPhone = message.from;
    const senderName = val.contacts?.[0]?.profile?.name || "Customer";
    const messageText = message.text?.body;

    if (!messageText) {
      console.log("No text content in incoming WhatsApp message. Acknowledging.");
      return NextResponse.json({ success: true, message: "No text content" });
    }

    console.log(`[WhatsApp Webhook] Received message from ${senderName} (${senderPhone}): "${messageText}"`);

    // 1. Fetch active workspace/business context from Database
    let workspaceName = "Custom Workspace";
    let workspaceIndustry = "General Business";
    let automationsContext = "";
    let variablesContext = "";

    try {
      // Find the first workspace. In a multi-tenant setup, we'd lookup by accountId / WhatsApp config.
      const dbWorkspace = await prisma.workspace.findFirst({
        orderBy: { createdAt: "desc" }
      });

      if (dbWorkspace) {
        workspaceName = dbWorkspace.name;
        workspaceIndustry = dbWorkspace.industry;
        
        // Find active workflow/automations associated with this workspace
        const workflows = await prisma.workflow.findMany({
          where: { workspaceId: dbWorkspace.id, isActive: true }
        });
        
        if (workflows.length > 0) {
          automationsContext = workflows.map(w => `- ${w.name}: ${w.description || "Active automation"}`).join("\n");
        }
      }
    } catch (dbErr) {
      console.error("Database lookup failed during webhook processing, using defaults:", dbErr);
    }

    // 2. Fall back to localStorage or mock workspaces list in environment if SQLite is empty
    if (workspaceName === "Custom Workspace") {
      // Let's use general fallback context
      automationsContext = "- Lead Qualification: Automatically qualifies inbound interest.\n- Appointment Booking: Books clients.";
    }

    // 3. Connect to Groq AI (The Brain) to generate response
    let aiReply = `Hi ${senderName}, thanks for messaging ${workspaceName}! How can we help you today?`;

    if (process.env.GROQ_API_KEY) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant", // fast model for chat response
            messages: [
              {
                role: "system",
                content: `You are a highly capable AI Assistant named "Anaos Operator" representing the business "${workspaceName}" in the "${workspaceIndustry}" industry.
Your goal is to converse with a customer on WhatsApp, understand their request, and provide a helpful, concise response.

Here is the operational context of your business:
Active Automations:
${automationsContext}

Variables we collect from conversations:
${variablesContext || "- CUSTOMER_NAME\n- INQUIRY_TYPE"}

Guidelines:
1. Keep your reply extremely short (1 to 3 sentences maximum) suitable for reading on WhatsApp.
2. Be warm, professional, and directly address the user's inquiry.
3. If they want to book an appointment, qualify lead, or perform another active automation task, guide them towards it smoothly.
4. Do not output markdown lists, titles, headers, or system explanations. Just the natural chat message text.`
              },
              {
                role: "user",
                content: `Customer Name: ${senderName}
Customer Message: "${messageText}"`
              }
            ],
            temperature: 0.7,
            max_tokens: 150
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            aiReply = content.trim();
          }
        } else {
          console.error("Groq API error inside Webhook:", response.status);
        }
      } catch (groqErr) {
        console.error("Failed to connect to Groq AI in Webhook:", groqErr);
      }
    }

    // 4. Send the generated AI reply back to user's phone via Meta Graph API
    console.log(`[WhatsApp Webhook] Sending AI reply back to ${senderPhone}: "${aiReply}"`);
    const sent = await sendMetaTextMessage(senderPhone, aiReply);

    return NextResponse.json({
      success: sent,
      recipient: senderPhone,
      reply: aiReply
    });
  } catch (error) {
    console.error("Error processing incoming WhatsApp webhook POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
