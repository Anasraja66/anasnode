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

export type PluginStatus = "available" | "beta" | "coming_soon";

export type AnaosPlugin = {
  id: string;
  name: string;
  category: PluginCategory;
  description: string;
  status: PluginStatus;
  connectLabel: string;
  href?: string;
  ownerHint: string;
};

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
    description:
      "Your number + Meta account. AI replies to customers; you can still use WhatsApp on your phone.",
    status: "available",
    connectLabel: "Connect with Meta",
    href: "/dashboard/integrations/whatsapp",
    ownerHint: "Order updates, support, lead qualify — on your business line",
  },
  {
    id: "instagram",
    name: "Instagram DM",
    category: "messaging",
    description: "Auto-reply to Instagram direct messages from the same Anaos brain.",
    status: "coming_soon",
    connectLabel: "Coming soon",
    ownerHint: "Sync with WhatsApp inbox",
  },
  {
    id: "facebook",
    name: "Facebook Messenger",
    category: "messaging",
    description: "Messenger automations for your Facebook page.",
    status: "coming_soon",
    connectLabel: "Coming soon",
    ownerHint: "Page inbox automation",
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "commerce",
    description: "Abandoned cart, order confirm, shipping alerts — tied to your store.",
    status: "beta",
    connectLabel: "Connect store",
    href: "/dashboard/integrations/shopify",
    ownerHint: "Built for e-commerce owners",
  },
  {
    id: "smtp",
    name: "Business Email",
    category: "email",
    description: "Gmail or SMTP — send order emails and follow-ups from automations.",
    status: "available",
    connectLabel: "Connect email",
    href: "/dashboard/integrations/email",
    ownerHint: "Receipts, reminders, support threads",
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    category: "google",
    description: "Book appointments from WhatsApp chat automatically.",
    status: "coming_soon",
    connectLabel: "Coming soon",
    ownerHint: "Clinics, salons, real estate viewings",
  },
  {
    id: "google_sheets",
    name: "Google Sheets",
    category: "google",
    description: "Log leads and orders to a spreadsheet in real time.",
    status: "coming_soon",
    connectLabel: "Coming soon",
    ownerHint: "Simple CRM for small teams",
  },
  {
    id: "google_drive",
    name: "Google Drive",
    category: "google",
    description: "Store brochures, invoices, and AI training files in Drive.",
    status: "coming_soon",
    connectLabel: "Coming soon",
    ownerHint: "Share PDFs in WhatsApp automatically",
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    category: "crm",
    description: "Create contacts and deals when customers chat.",
    status: "coming_soon",
    connectLabel: "Coming soon",
    ownerHint: "Sales pipeline sync",
  },
  {
    id: "twilio",
    name: "Voice & SMS",
    category: "voice",
    description: "Calling agent and SMS — same business rules as WhatsApp.",
    status: "coming_soon",
    connectLabel: "Coming soon",
    ownerHint: "Phone automation layer",
  },
  {
    id: "openai",
    name: "OpenAI",
    category: "ai",
    description: "Use your own OpenAI key for AI reply nodes.",
    status: "beta",
    connectLabel: "Add API key",
    ownerHint: "Optional — Anaos provides demo AI",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "commerce",
    description: "Payment received → WhatsApp invoice and thank-you flow.",
    status: "coming_soon",
    connectLabel: "Coming soon",
    ownerHint: "Works with Shopify stores",
  },
];

export function getPlugin(id: string): AnaosPlugin | undefined {
  return ANAOS_PLUGINS.find((p) => p.id === id);
}

export function pluginsByCategory(category: PluginCategory): AnaosPlugin[] {
  return ANAOS_PLUGINS.filter((p) => p.category === category);
}
