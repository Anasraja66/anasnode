import { INodeHandler } from "../engine/registry";
import { WorkflowNode, ExecutionContext, NodeResult } from "../types";
import { evaluateExpression } from "../engine/evaluator";

export class EmailNodeHandler implements INodeHandler {
  async execute(node: WorkflowNode, ctx: ExecutionContext): Promise<NodeResult> {
    const to = evaluateExpression(node.config.to || "", ctx);
    const subject = evaluateExpression(node.config.subject || "", ctx);
    const body = evaluateExpression(node.config.body || "", ctx);

    if (!to || !subject) {
      throw new Error("Email 'to' and 'subject' are required.");
    }

    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || "no-reply@anaos.com";

    if (!sendgridApiKey) {
      console.log(`[Mock Email] To: ${to} | Subject: ${subject} | Body: ${body}`);
      return { output: { status: "success", data: { message: "Mock email sent successfully (No SendGrid API Key)" } }, nextNodeIds: node.outputs || [] };
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail },
        subject: subject,
        content: [{ type: "text/plain", value: body }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`SendGrid API error: ${JSON.stringify(errorData)}`);
    }

    return { output: { status: "success", data: { message: "Email sent successfully" } }, nextNodeIds: node.outputs || [] };
  }
}
