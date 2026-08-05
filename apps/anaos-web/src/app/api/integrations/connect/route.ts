import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { requireAccountId } from "@/lib/auth/session";
import { activateDefaultWhatsAppWorkflow } from "@/lib/meta/activate-whatsapp-workflow";
import { validatePhoneNumberId } from "@/lib/whatsapp/credentials";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = [
  // Messaging & Social
  "whatsapp", "instagram", "facebook", "telegram", "slack", "discord",
  "twitter", "youtube", "pinterest", "vimeo", "manychat",
  // E-commerce
  "shopify", "woocommerce", "magento", "bigcommerce", "gumroad",
  "squarepos", "lemonsqueezy",
  // AI & Voice
  "openai", "openaiassistants", "claude", "gemini", "dalle",
  "midjourney", "pinecone", "vapi", "elevenlabs", "retell", "bland",
  // CRM & Sales
  "hubspot", "salesforce", "zohocrm", "pipedrive", "activecampaign",
  "apolloio", "seamlessai", "clearbit",
  // Email Marketing
  "smtp", "mailchimp", "sendgrid", "postmark", "mailgun", "brevo",
  "klaviyo", "convertkit", "constantcontact", "aweber", "getresponse",
  // Payments & Finance
  "stripe", "paypal", "razorpay", "quickbooks", "xero", "braintree",
  "paddle",
  // Google Suite
  "google_calendar", "google_sheets", "google_drive", "googledocs",
  "googleforms", "googleads",
  // Cloud & Dev Tools
  "aws", "firebase", "supabase", "ftp", "webhooks",
  "github", "gitlab", "bitbucket", "githubactions",
  // Project Management
  "asana", "trello", "notion", "airtable", "monday", "clickup",
  "jira", "linear", "coda", "smartsheet",
  // Meetings & Scheduling
  "zoom", "calendly", "google_calendar", "webex", "gotowebinar",
  "microsoftteams",
  // Storage
  "dropbox", "onedrive",
  // HR & Payroll
  "bamboohr", "workable", "deel",
  // Monitoring & Analytics
  "datadog", "sentry", "pagerduty", "mixpanel", "amplitude", "segment",
  // Support & Chat
  "zendesk", "intercom", "freshdesk", "crisp", "drift", "tidio",
  "front", "gorgias", "kustomer",
  // Design
  "canva", "figma",
  // Content & CMS
  "wordpress", "webflow", "ghost", "strapi", "contentful", "sanity",
  "medium",
  // Advertising
  "facebookleads", "tiktokleads", "linkedinads",
  // Social Scheduling
  "buffer", "hootsuite",
  // Forms & Surveys
  "typeform", "googleforms", "jotform", "surveymonkey",
  // Communication APIs
  "twilio", "messagebird", "plivo",
  // Docs & Signing
  "docusign",
  // Events
  "eventbrite",
  // Databases
  "mysql", "postgres",
] as const;

/**
 * POST /api/integrations/connect
 * Save encrypted integration credentials for the logged-in account.
 */
export async function POST(request: Request) {
  try {
    const accountId = await requireAccountId();
    const body = await request.json();
    const { type, name, credentials, activateDefaultWorkflow } = body;

    if (!type || !name || !credentials) {
      return NextResponse.json(
        { error: "type, name, and credentials are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return NextResponse.json({ error: "Unsupported integration type" }, { status: 400 });
    }

    if (type === "whatsapp") {
      if (!credentials.accessToken || !credentials.phoneNumberId) {
        return NextResponse.json(
          { error: "WhatsApp requires accessToken and phoneNumberId" },
          { status: 400 }
        );
      }
      const idCheck = validatePhoneNumberId(String(credentials.phoneNumberId));
      if (!idCheck.ok) {
        return NextResponse.json({ error: idCheck.error }, { status: 400 });
      }
      credentials.phoneNumberId = idCheck.normalized;
    }

    if (type === "shopify") {
      if (!credentials.shop || !credentials.accessToken) {
        return NextResponse.json(
          { error: "Shopify requires shop (my-store.myshopify.com) and accessToken" },
          { status: 400 }
        );
      }
    }

    if (type === "smtp") {
      if (!credentials.user || !credentials.password) {
        return NextResponse.json(
          { error: "Email requires address and app password" },
          { status: 400 }
        );
      }
    }

    if (type === "google_sheets" || type === "google_drive") {
      if (!credentials.clientId || !credentials.clientSecret || !credentials.refreshToken) {
        return NextResponse.json(
          {
            error:
              "Google Sheets and Drive require clientId, clientSecret, and refreshToken",
          },
          { status: 400 }
        );
      }
    }

    if (type === "hubspot") {
      if (!credentials.apiKey && !credentials.accessToken) {
        return NextResponse.json(
          {
            error: "HubSpot requires apiKey or accessToken",
          },
          { status: 400 }
        );
      }
    }

    if (type === "twilio") {
      if (!credentials.accountSid || !credentials.authToken || !credentials.fromNumber) {
        return NextResponse.json(
          {
            error: "Twilio requires accountSid, authToken, and fromNumber",
          },
          { status: 400 }
        );
      }
    }

    if (type === "stripe") {
      if (!credentials.secretKey) {
        return NextResponse.json(
          { error: "Stripe requires secretKey" },
          { status: 400 }
        );
      }
    }

    const encryptedData = encrypt(JSON.stringify(credentials));

    const existing = await prisma.integrationCredential.findFirst({
      where: { accountId, type },
    });

    const saved = existing
      ? await prisma.integrationCredential.update({
        where: { id: existing.id },
        data: { name, credentials: encryptedData, isActive: true },
        select: { id: true, type: true, name: true, isActive: true, createdAt: true },
      })
      : await prisma.integrationCredential.create({
        data: {
          accountId,
          type,
          name,
          credentials: encryptedData,
          isActive: true,
        },
        select: { id: true, type: true, name: true, isActive: true, createdAt: true },
      });

    let activatedWorkflowId: string | null = null;

    if (activateDefaultWorkflow && type === "whatsapp") {
      activatedWorkflowId = await activateDefaultWhatsAppWorkflow(accountId);
    }

    const displayPhone = credentials.displayPhone as string | undefined;
    const friendlyMessage =
      type === "whatsapp"
        ? displayPhone
          ? `WhatsApp ready on ${displayPhone}. Automations can reply while you use your phone.`
          : activatedWorkflowId
            ? "WhatsApp connected — your automation is now ON."
            : "WhatsApp connected. Turn on an automation from the dashboard."
        : type === "smtp"
          ? "Business email connected — automations can send mail."
          : `${type} connected successfully.`;

    return NextResponse.json({
      success: true,
      credential: saved,
      activatedWorkflowId,
      message: friendlyMessage,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("integrations connect error:", error);
    return NextResponse.json({ error: "Failed to connect integration" }, { status: 500 });
  }
}
