import { INodeHandler } from "../engine/registry";
import { WorkflowNode, ExecutionContext, NodeResult } from "../types";
import { evaluateExpression } from "../engine/evaluator";
import prisma from "@/lib/db";
import nodemailer from "nodemailer";

export class EmailNodeHandler implements INodeHandler {
  async execute(node: WorkflowNode, ctx: ExecutionContext): Promise<NodeResult> {
    const to = evaluateExpression(node.config.to || "", ctx);
    const subject = evaluateExpression(node.config.subject || "", ctx);
    const body = evaluateExpression(node.config.body || "", ctx);

    if (!to || !subject) {
      throw new Error("Email 'to' and 'subject' are required.");
    }

    // Attempt to fetch SMTP credentials from the database for this account
    const credential = await prisma.integrationCredential.findFirst({
      where: {
        accountId: ctx.accountId,
        type: "smtp",
        isActive: true,
      },
    });

    if (credential) {
      try {
        const smtpConfig = JSON.parse(credential.credentials);
        const transporter = nodemailer.createTransport({
          host: smtpConfig.host,
          port: Number(smtpConfig.port) || 587,
          secure: Number(smtpConfig.port) === 465,
          auth: {
            user: smtpConfig.user,
            pass: smtpConfig.password,
          },
        });

        await transporter.sendMail({
          from: `"${smtpConfig.fromName || "AnaOS"}" <${smtpConfig.user}>`,
          to,
          subject,
          text: body,
        });

        return { 
          output: { status: "success", data: { message: "Email sent successfully via SMTP" } }, 
          nextNodeIds: node.outputs || [] 
        };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        throw new Error(`SMTP Error: ${err.message}`);
      }
    }

    // Fallback to SendGrid if no SMTP is configured but SendGrid API key exists in env
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || "no-reply@anaos.com";

    if (!sendgridApiKey) {
      console.log(`[Mock Email] To: ${to} | Subject: ${subject} | Body: ${body}`);
      return { 
        output: { status: "success", data: { message: "Mock email sent successfully (No SMTP credentials or SendGrid key)" } }, 
        nextNodeIds: node.outputs || [] 
      };
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

    return { 
      output: { status: "success", data: { message: "Email sent successfully via SendGrid" } }, 
      nextNodeIds: node.outputs || [] 
    };
  }
}
