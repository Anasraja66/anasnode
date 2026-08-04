/**
 * Anaos integration catalog — owner-facing labels only.
 */

export type PluginCategory =
  | "messaging"
  | "commerce"
  | "email"
  | "google"
  | "crm"
  | "voice"
  | "ai"
  | "analytics";

export type ProviderId = "meta" | "google" | "commerce" | "others";

export type PluginStatus = "available" | "beta" | "coming_soon";

export type IntegrationFormField = {
  key: string;
  label: string;
  type: "text" | "password" | "textarea" | "email";
  placeholder?: string;
  required?: boolean;
  description?: string;
};

export type AnaosPlugin = {
  id: string;
  name: string;
  category: PluginCategory;
  providerId: ProviderId;
  description: string;
  status: PluginStatus;
  connectLabel: string;
  href?: string;
  ownerHint: string;
  buttonLabel?: string;
  notes?: string;
  formFields?: IntegrationFormField[];
};

export const PROVIDERS: { id: ProviderId; label: string; description: string }[] = [
  { id: "meta", label: "Meta Ecosystem", description: "WhatsApp, Instagram, and Facebook Messenger connections" },
  { id: "google", label: "Google Workspace", description: "Gmail, Google Calendar, Sheets, and Drive automations" },
  { id: "commerce", label: "Commerce & Payments", description: "Shopify, WooCommerce, and Stripe checkout automation" },
  { id: "others", label: "Other Networks & APIs", description: "TikTok, LinkedIn, Twilio, and LLM providers" },
];

export const PLUGIN_CATEGORIES: { id: PluginCategory; label: string }[] = [
  { id: "messaging", label: "Messaging" },
  { id: "commerce", label: "Commerce" },
  { id: "email", label: "Email" },
  { id: "google", label: "Google Workspace" },
  { id: "crm", label: "CRM" },
  { id: "voice", label: "Voice & SMS" },
  { id: "ai", label: "AI Models" },
];

export const ANAOS_PLUGINS: AnaosPlugin[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "messaging",
    providerId: "meta",
    description:
      "Your number + Meta account. AI replies to customers; you can still use WhatsApp on your phone.",
    status: "available",
    connectLabel: "Connect with Meta",
    href: "/dashboard/integrations/connect/whatsapp",
    ownerHint: "Order updates, support, lead qualify — on your business line",
    buttonLabel: "Connect WhatsApp",
    notes: "Use the Meta embedded signup flow to connect your WhatsApp Business number.",
  },
  {
    id: "instagram",
    name: "Instagram DM",
    category: "messaging",
    providerId: "meta",
    description: "Auto-reply to Instagram direct messages from the same Anaos brain.",
    status: "available",
    connectLabel: "Connect DM",
    href: "/dashboard/integrations/connect/instagram",
    ownerHint: "Sync with WhatsApp inbox",
    buttonLabel: "Connect with Meta",
    notes: "Authorize Instagram via Meta to handle DMs and comments in Anaos.",
  },
  {
    id: "facebook",
    name: "Facebook Messenger",
    category: "messaging",
    providerId: "meta",
    description: "Messenger automations for your Facebook page.",
    status: "available",
    connectLabel: "Connect Page",
    href: "/dashboard/integrations/connect/facebook",
    ownerHint: "Page inbox automation",
    buttonLabel: "Connect with Meta",
    notes: "Authorize Facebook Messenger via Meta so Anaos can reply to page conversations.",
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "commerce",
    providerId: "commerce",
    description: "Abandoned cart, order confirm, shipping alerts — tied to your store.",
    status: "beta",
    connectLabel: "Connect store",
    href: "/dashboard/integrations/connect/shopify",
    ownerHint: "Built for e-commerce owners",
    buttonLabel: "Connect Shopify",
    notes: "Enter your Shopify store domain and access token to sync orders and cart events.",
    formFields: [
      { key: "shop", label: "Shopify store domain", type: "text", placeholder: "my-store.myshopify.com", required: true },
      { key: "accessToken", label: "Shopify access token", type: "password", placeholder: "Admin API access token", required: true },
    ],
  },
  {
    id: "smtp",
    name: "Business Email",
    category: "email",
    providerId: "google",
    description: "Gmail or SMTP — send order emails and follow-ups from automations.",
    status: "available",
    connectLabel: "Connect email",
    href: "/dashboard/integrations/connect/smtp",
    ownerHint: "Receipts, reminders, support threads",
    buttonLabel: "Connect Email",
    notes: "Use an app password or SMTP credentials to send transactional emails from Anaos.",
    formFields: [
      { key: "host", label: "SMTP host", type: "text", placeholder: "smtp.gmail.com", required: false },
      { key: "port", label: "SMTP port", type: "text", placeholder: "587", required: false },
      { key: "user", label: "Email address", type: "email", placeholder: "you@example.com", required: true },
      { key: "password", label: "App password", type: "password", placeholder: "Your app password", required: true },
      { key: "fromName", label: "From name", type: "text", placeholder: "Your business name", required: false },
    ],
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    category: "google",
    providerId: "google",
    description: "Book appointments from WhatsApp chat automatically.",
    status: "available",
    connectLabel: "Connect Calendar",
    href: "/dashboard/integrations/connect/google_calendar",
    ownerHint: "Clinics, salons, real estate viewings",
    buttonLabel: "Connect Google Calendar",
    notes: "Add a Google email address and calendar name to start booking appointments.",
    formFields: [
      { key: "email", label: "Google account email", type: "email", placeholder: "name@gmail.com", required: true },
      { key: "calendarName", label: "Calendar name", type: "text", placeholder: "Primary Calendar", required: false },
    ],
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    category: "google",
    providerId: "google",
    description: "Log leads and orders to a spreadsheet in real time.",
    status: "available",
    connectLabel: "Connect Google Sheets",
    href: "/dashboard/integrations/connect/google_sheets",
    ownerHint: "Simple CRM for small teams",
    buttonLabel: "Connect Google Sheets",
    notes: "Use your OAuth client credentials and refresh token from Google Cloud.",
    formFields: [
      { key: "clientId", label: "Google Client ID", type: "text", placeholder: "1234.apps.googleusercontent.com", required: true },
      { key: "clientSecret", label: "Google Client Secret", type: "password", placeholder: "Your client secret", required: true },
      { key: "refreshToken", label: "Google Refresh Token", type: "textarea", placeholder: "Refresh token from Google OAuth", required: true },
    ],
  },
  {
    id: "google_drive",
    name: "Google Drive",
    category: "google",
    providerId: "google",
    description: "Store brochures, invoices, and AI training files in Drive.",
    status: "available",
    connectLabel: "Connect Google Drive",
    href: "/dashboard/integrations/connect/google_drive",
    ownerHint: "Share PDFs in WhatsApp automatically",
    buttonLabel: "Connect Google Drive",
    notes: "Save files automatically and use Drive links in workflows.",
    formFields: [
      { key: "clientId", label: "Google Client ID", type: "text", placeholder: "1234.apps.googleusercontent.com", required: true },
      { key: "clientSecret", label: "Google Client Secret", type: "password", placeholder: "Your client secret", required: true },
      { key: "refreshToken", label: "Google Refresh Token", type: "textarea", placeholder: "Refresh token from Google OAuth", required: true },
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    category: "crm",
    providerId: "others",
    description: "Create contacts and deals when customers chat.",
    status: "available",
    connectLabel: "Connect HubSpot",
    href: "/dashboard/integrations/connect/hubspot",
    ownerHint: "Sales pipeline sync",
    buttonLabel: "Connect HubSpot",
    notes: "Enter either a HubSpot API key or an access token.",
    formFields: [
      { key: "apiKey", label: "HubSpot API Key", type: "password", placeholder: "Your HubSpot API key", required: false },
      { key: "accessToken", label: "HubSpot Access Token", type: "password", placeholder: "Your HubSpot access token", required: false },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    category: "analytics",
    providerId: "others",
    description: "Connect TikTok to automate lead capture and campaign reporting.",
    status: "coming_soon",
    connectLabel: "Coming soon",
    ownerHint: "Ad lead sync",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "crm",
    providerId: "others",
    description: "Capture leads and automate follow-ups from LinkedIn.",
    status: "coming_soon",
    connectLabel: "Coming soon",
    ownerHint: "B2B outreach",
  },
  {
    id: "twilio",
    name: "Voice & SMS",
    category: "voice",
    providerId: "others",
    description: "Calling agent and SMS — same business rules as WhatsApp.",
    status: "available",
    connectLabel: "Connect Twilio",
    href: "/dashboard/integrations/connect/twilio",
    ownerHint: "Phone automation layer",
    buttonLabel: "Connect Twilio",
    notes: "Enter Twilio account credentials and the number you will send from.",
    formFields: [
      { key: "accountSid", label: "Twilio Account SID", type: "text", placeholder: "ACxxxx", required: true },
      { key: "authToken", label: "Twilio Auth Token", type: "password", placeholder: "Your auth token", required: true },
      { key: "fromNumber", label: "From phone number", type: "text", placeholder: "+1234567890", required: true },
    ],
  },
  {
    id: "anaos_voice_fast",
    name: "AnaOS Voice (Fast Engine)",
    category: "voice",
    providerId: "others",
    description: "Lightning-fast voice agent built for quick bookings and lead qualification.",
    status: "available",
    connectLabel: "Activate Engine",
    ownerHint: "Powered by Vapi. 2 credits/min",
  },
  {
    id: "anaos_voice_conversational",
    name: "AnaOS Voice (Conversational)",
    category: "voice",
    providerId: "others",
    description: "Deeply conversational agent that handles complex interruptions gracefully.",
    status: "available",
    connectLabel: "Activate Engine",
    ownerHint: "Powered by Retell. 3 credits/min",
  },
  {
    id: "openai",
    name: "OpenAI",
    category: "ai",
    providerId: "others",
    description: "Use your own OpenAI key for AI reply nodes.",
    status: "beta",
    connectLabel: "Add API key",
    ownerHint: "Optional — Anaos provides demo AI",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "commerce",
    providerId: "commerce",
    description: "Payment received → WhatsApp invoice and thank-you flow.",
    status: "available",
    connectLabel: "Connect Stripe",
    href: "/dashboard/integrations/connect/stripe",
    ownerHint: "Works with Shopify stores",
    buttonLabel: "Connect Stripe",
    notes: "Use your Stripe secret key to enable payment-triggered automations.",
    formFields: [
      { key: "secretKey", label: "Stripe Secret Key", type: "password", placeholder: "sk_live_...", required: true },
    ],
  },
  // ── New Activepieces-powered integrations ─────────────────────────────────
  {
    id: "slack",
    name: "Slack",
    category: "messaging",
    providerId: "others",
    description: "Send team alerts and workflow notifications to any Slack channel.",
    status: "available",
    connectLabel: "Connect Slack",
    href: "/dashboard/integrations/connect/slack",
    ownerHint: "Team notifications & alerts",
    buttonLabel: "Connect Slack",
    notes: "Create a Slack Bot Token from api.slack.com and paste it here.",
    formFields: [
      { key: "token", label: "Bot Token", type: "password", placeholder: "xoxb-...", required: true },
    ],
  },
  {
    id: "notion",
    name: "Notion",
    category: "crm",
    providerId: "others",
    description: "Create and update Notion pages from workflow triggers.",
    status: "available",
    connectLabel: "Connect Notion",
    href: "/dashboard/integrations/connect/notion",
    ownerHint: "Docs & database automation",
    buttonLabel: "Connect Notion",
    notes: "Create an internal integration at notion.so/my-integrations and get your token.",
    formFields: [
      { key: "token", label: "Notion Integration Token", type: "password", placeholder: "secret_...", required: true },
    ],
  },
  {
    id: "airtable",
    name: "Airtable",
    category: "crm",
    providerId: "others",
    description: "Use Airtable as a flexible CRM or database for your automations.",
    status: "available",
    connectLabel: "Connect Airtable",
    href: "/dashboard/integrations/connect/airtable",
    ownerHint: "Flexible database & CRM",
    buttonLabel: "Connect Airtable",
    notes: "Get your API key from airtable.com/account.",
    formFields: [
      { key: "apiKey", label: "Airtable API Key", type: "password", placeholder: "key...", required: true },
      { key: "baseId", label: "Base ID", type: "text", placeholder: "app...", required: true },
    ],
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "email",
    providerId: "others",
    description: "Add contacts to lists and trigger email campaigns automatically.",
    status: "available",
    connectLabel: "Connect Mailchimp",
    href: "/dashboard/integrations/connect/mailchimp",
    ownerHint: "Email marketing automation",
    buttonLabel: "Connect Mailchimp",
    notes: "Get your API key from Mailchimp Account → Extras → API Keys.",
    formFields: [
      { key: "apiKey", label: "Mailchimp API Key", type: "password", placeholder: "xxxxxxxx-us1", required: true },
      { key: "listId", label: "Audience/List ID", type: "text", placeholder: "Your audience ID", required: false },
    ],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    category: "email",
    providerId: "others",
    description: "Send transactional emails at scale via SendGrid.",
    status: "available",
    connectLabel: "Connect SendGrid",
    href: "/dashboard/integrations/connect/sendgrid",
    ownerHint: "Transactional email sending",
    buttonLabel: "Connect SendGrid",
    notes: "Get your API key from SendGrid Settings → API Keys.",
    formFields: [
      { key: "apiKey", label: "SendGrid API Key", type: "password", placeholder: "SG...", required: true },
      { key: "fromEmail", label: "From Email", type: "email", placeholder: "you@yourdomain.com", required: true },
      { key: "fromName", label: "From Name", type: "text", placeholder: "Your Business", required: false },
    ],
  },
  {
    id: "discord",
    name: "Discord",
    category: "messaging",
    providerId: "others",
    description: "Send alerts and notifications to Discord channels via webhooks.",
    status: "available",
    connectLabel: "Connect Discord",
    href: "/dashboard/integrations/connect/discord",
    ownerHint: "Community & team notifications",
    buttonLabel: "Connect Discord",
    notes: "Go to Discord Server Settings → Integrations → Webhooks and copy the URL.",
    formFields: [
      { key: "webhookUrl", label: "Discord Webhook URL", type: "text", placeholder: "https://discord.com/api/webhooks/...", required: true },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    category: "messaging",
    providerId: "others",
    description: "Send messages and run bots on Telegram channels.",
    status: "available",
    connectLabel: "Connect Telegram",
    href: "/dashboard/integrations/connect/telegram",
    ownerHint: "Messaging & bot automation",
    buttonLabel: "Connect Telegram Bot",
    notes: "Create a bot via @BotFather on Telegram and paste the token here.",
    formFields: [
      { key: "botToken", label: "Bot Token", type: "password", placeholder: "1234567890:ABCDEF...", required: true },
      { key: "chatId", label: "Chat / Channel ID", type: "text", placeholder: "-100123456789", required: false },
    ],
  },
  {
    id: "pipedrive",
    name: "Pipedrive",
    category: "crm",
    providerId: "others",
    description: "Push leads and deals to Pipedrive from any workflow trigger.",
    status: "available",
    connectLabel: "Connect Pipedrive",
    href: "/dashboard/integrations/connect/pipedrive",
    ownerHint: "Sales pipeline automation",
    buttonLabel: "Connect Pipedrive",
    notes: "Get your API token from Pipedrive Settings → Personal Preferences → API.",
    formFields: [
      { key: "apiToken", label: "Pipedrive API Token", type: "password", placeholder: "Your API token", required: true },
    ],
  },
  {
    id: "trello",
    name: "Trello",
    category: "crm",
    providerId: "others",
    description: "Create Trello cards from workflow triggers automatically.",
    status: "available",
    connectLabel: "Connect Trello",
    href: "/dashboard/integrations/connect/trello",
    ownerHint: "Task & project management",
    buttonLabel: "Connect Trello",
    notes: "Get your API key and token from trello.com/app-key.",
    formFields: [
      { key: "apiKey", label: "Trello API Key", type: "text", placeholder: "Your API key", required: true },
      { key: "apiToken", label: "Trello Token", type: "password", placeholder: "Your token", required: true },
      { key: "boardId", label: "Default Board ID", type: "text", placeholder: "Board ID", required: false },
    ],
  },
  {
    id: "asana",
    name: "Asana",
    category: "crm",
    providerId: "others",
    description: "Create and assign Asana tasks from automation flows.",
    status: "available",
    connectLabel: "Connect Asana",
    href: "/dashboard/integrations/connect/asana",
    ownerHint: "Task & project automation",
    buttonLabel: "Connect Asana",
    notes: "Get a personal access token from Asana Settings → Apps → Developer Apps.",
    formFields: [
      { key: "accessToken", label: "Asana Personal Access Token", type: "password", placeholder: "1/...", required: true },
      { key: "workspaceId", label: "Workspace ID", type: "text", placeholder: "Your workspace ID", required: false },
    ],
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "voice",
    providerId: "others",
    description: "Schedule and manage Zoom meetings from workflow triggers.",
    status: "available",
    connectLabel: "Connect Zoom",
    href: "/dashboard/integrations/connect/zoom",
    ownerHint: "Meeting scheduling automation",
    buttonLabel: "Connect Zoom",
    notes: "Create a Server-to-Server OAuth app at marketplace.zoom.us to get credentials.",
    formFields: [
      { key: "accountId", label: "Zoom Account ID", type: "text", placeholder: "Your account ID", required: true },
      { key: "clientId", label: "Client ID", type: "text", placeholder: "Your client ID", required: true },
      { key: "clientSecret", label: "Client Secret", type: "password", placeholder: "Your client secret", required: true },
    ],
  },
  {
    id: "calendly",
    name: "Calendly",
    category: "voice",
    providerId: "others",
    description: "Trigger automation flows when meetings are booked on Calendly.",
    status: "available",
    connectLabel: "Connect Calendly",
    href: "/dashboard/integrations/connect/calendly",
    ownerHint: "Meeting booking automation",
    buttonLabel: "Connect Calendly",
    notes: "Get your Personal Access Token from Calendly Integrations → API & Webhooks.",
    formFields: [
      { key: "apiToken", label: "Calendly API Token", type: "password", placeholder: "Your personal access token", required: true },
    ],
  },
  {
    id: "dropbox",
    name: "Dropbox",
    category: "google",
    providerId: "others",
    description: "Save and share files via Dropbox from your automation workflows.",
    status: "available",
    connectLabel: "Connect Dropbox",
    href: "/dashboard/integrations/connect/dropbox",
    ownerHint: "File storage & sharing",
    buttonLabel: "Connect Dropbox",
    notes: "Create an app at dropbox.com/developers and generate an access token.",
    formFields: [
      { key: "accessToken", label: "Dropbox Access Token", type: "password", placeholder: "sl...", required: true },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    category: "analytics",
    providerId: "others",
    description: "Trigger workflows on GitHub events like push, PR, or issue.",
    status: "available",
    connectLabel: "Connect GitHub",
    href: "/dashboard/integrations/connect/github",
    ownerHint: "Dev team automation",
    buttonLabel: "Connect GitHub",
    notes: "Generate a Personal Access Token from GitHub Settings → Developer Settings.",
    formFields: [
      { key: "token", label: "GitHub Personal Access Token", type: "password", placeholder: "ghp_...", required: true },
      { key: "repoOwner", label: "Repository Owner", type: "text", placeholder: "your-username", required: false },
      { key: "repoName", label: "Repository Name", type: "text", placeholder: "your-repo", required: false },
    ],
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    category: "commerce",
    providerId: "commerce",
    description: "Connect your WordPress WooCommerce store to automation workflows.",
    status: "available",
    connectLabel: "Connect WooCommerce",
    href: "/dashboard/integrations/connect/woocommerce",
    ownerHint: "WordPress e-commerce automation",
    buttonLabel: "Connect WooCommerce",
    notes: "Generate REST API keys from WooCommerce → Settings → Advanced → REST API.",
    formFields: [
      { key: "siteUrl", label: "Store URL", type: "text", placeholder: "https://yourstore.com", required: true },
      { key: "consumerKey", label: "Consumer Key", type: "text", placeholder: "ck_...", required: true },
      { key: "consumerSecret", label: "Consumer Secret", type: "password", placeholder: "cs_...", required: true },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    category: "ai",
    providerId: "others",
    description: "Use your own OpenAI API key for AI reply and generation nodes.",
    status: "available",
    connectLabel: "Add API Key",
    href: "/dashboard/integrations/connect/openai",
    ownerHint: "BYOK – your billing, your control",
    buttonLabel: "Connect OpenAI",
    notes: "Get your API key from platform.openai.com/api-keys.",
    formFields: [
      { key: "apiKey", label: "OpenAI API Key", type: "password", placeholder: "sk-...", required: true },
    ],
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    category: "ai",
    providerId: "others",
    description: "Use Claude Sonnet or Haiku for AI nodes in your workflows.",
    status: "available",
    connectLabel: "Add API Key",
    href: "/dashboard/integrations/connect/claude",
    ownerHint: "BYOK – your billing, your control",
    buttonLabel: "Connect Claude",
    notes: "Get your API key from console.anthropic.com.",
    formFields: [
      { key: "apiKey", label: "Anthropic API Key", type: "password", placeholder: "sk-ant-...", required: true },
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    category: "ai",
    providerId: "google",
    description: "Use Google Gemini Pro for AI generation and reasoning tasks.",
    status: "available",
    connectLabel: "Add API Key",
    href: "/dashboard/integrations/connect/gemini",
    ownerHint: "BYOK – your billing, your control",
    buttonLabel: "Connect Gemini",
    notes: "Get your API key from aistudio.google.com.",
    formFields: [
      { key: "apiKey", label: "Google AI API Key", type: "password", placeholder: "AIza...", required: true },
    ],
  },
  {
    id: "groq",
    name: "Groq",
    category: "ai",
    providerId: "others",
    description: "Ultra-fast AI inference — best for real-time WhatsApp replies.",
    status: "available",
    connectLabel: "Add API Key",
    href: "/dashboard/integrations/connect/groq",
    ownerHint: "BYOK – fastest LLM inference",
    buttonLabel: "Connect Groq",
    notes: "Get your API key from console.groq.com.",
    formFields: [
      { key: "apiKey", label: "Groq API Key", type: "password", placeholder: "gsk_...", required: true },
    ],
  },
];

export function getPlugin(id: string): AnaosPlugin | undefined {
  return ANAOS_PLUGINS.find((p) => p.id === id);
}

export function pluginsByCategory(category: PluginCategory): AnaosPlugin[] {
  return ANAOS_PLUGINS.filter((p) => p.category === category);
}

export function pluginsByProvider(providerId: ProviderId): AnaosPlugin[] {
  return ANAOS_PLUGINS.filter((p) => p.providerId === providerId);
}

