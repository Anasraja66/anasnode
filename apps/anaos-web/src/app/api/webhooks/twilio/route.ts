/**
 * Twilio Inbound SMS/WhatsApp Webhook
 *
 * Twilio calls this URL when a message arrives on any Twilio number.
 * Steps:
 *   1. Parse the Twilio form body
 *   2. Match the "To" number to an Anaos account (tenant isolation)
 *   3. Find that account's active workflow with a WhatsApp trigger
 *   4. Run the workflow using the main WorkflowExecutor
 *   5. Return empty TwiML so Twilio does not auto-reply
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { WorkflowExecutor } from "@/lib/workflow/executor";

export const dynamic = "force-dynamic";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Strip leading "whatsapp:" prefix and "+" so we get a clean digit string */
function cleanPhone(raw: string): string {
  return raw.replace("whatsapp:", "").replace("+", "").trim();
}

/** Empty TwiML — tells Twilio "we got it, don't auto-reply" */
function twimlOk(): NextResponse {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
    { status: 200, headers: { "Content-Type": "text/xml" } }
  );
}

/** Error TwiML — same format, still 500 so Twilio knows something failed */
function twimlError(): NextResponse {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
    { status: 500, headers: { "Content-Type": "text/xml" } }
  );
}

// ── Tenant resolver ───────────────────────────────────────────────────────────

/**
 * Find which Anaos account owns the "To" phone number.
 *
 * We store the phone number inside the JSON credentials blob.
 * We search all Twilio credentials and check if the phone matches.
 *
 * Returns accountId string, or null if no match found.
 */
async function resolveAccountByTwilioNumber(
  toNumber: string
): Promise<string | null> {
  const allTwilioCreds = await prisma.integrationCredential.findMany({
    where: { type: "twilio", isActive: true },
    select: { accountId: true, credentials: true },
  });

  for (const cred of allTwilioCreds) {
    try {
      const parsed = JSON.parse(cred.credentials);
      const storedNumber = cleanPhone(parsed.phoneNumber || parsed.fromNumber || "");
      if (storedNumber && toNumber.includes(storedNumber)) {
        return cred.accountId;
      }
    } catch {
      // skip malformed credential rows
    }
  }

  return null;
}

// ── Main Handler ──────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Parse Twilio's URL-encoded form body
    const text = await request.text();
    const params = new URLSearchParams(text);

    const from = params.get("From") || "";
    const to = params.get("To") || "";
    const body = params.get("Body") || "";
    const profileName = params.get("ProfileName") || "Customer";

    if (!from) {
      console.warn("[Twilio] Missing 'From' number — ignoring");
      return twimlOk();
    }

    const fromPhone = cleanPhone(from);
    const toPhone = cleanPhone(to);

    console.log(`[Twilio] Inbound from=${fromPhone} to=${toPhone} body="${body.slice(0, 80)}"`);

    // 2. Resolve which account owns the "To" number
    const accountId = await resolveAccountByTwilioNumber(toPhone);

    if (!accountId) {
      console.warn(`[Twilio] No account found for number: ${toPhone}`);
      return twimlOk(); // still return 200 to Twilio
    }

    // 3. Find active workflows for this account that have a WhatsApp trigger
    const activeWorkflows = await prisma.workflow.findMany({
      where: { isActive: true, accountId },
    });

    const triggerData = {
      phone: fromPhone,
      contactPhone: fromPhone,
      contactName: profileName,
      name: profileName,
      message: body,
      contactId: fromPhone,
      platform: "twilio",
    };

    // 4. Run the first matching workflow
    let triggered = false;
    for (const workflow of activeWorkflows) {
      let nodes: any[] = [];
      try {
        nodes = JSON.parse(workflow.nodes || "[]");
      } catch {
        continue;
      }

      const hasWhatsAppTrigger = nodes.some(
        (node: any) => node.type === "trigger_whatsapp"
      );

      if (!hasWhatsAppTrigger) continue;

      console.log(`[Twilio] Running workflow "${workflow.name}" (${workflow.id})`);

      // Run in background — do not await so Twilio gets fast response
      const executor = new WorkflowExecutor();
      executor.execute(workflow.id, triggerData).catch((err: Error) => {
        console.error(`[Twilio] Workflow ${workflow.id} failed:`, err.message);
      });

      triggered = true;
      break; // one workflow per message is enough
    }

    if (!triggered) {
      console.log(`[Twilio] No matching workflow for account ${accountId}`);
    }

    return twimlOk();
  } catch (error) {
    console.error("[Twilio] Webhook error:", error);
    return twimlError();
  }
}
