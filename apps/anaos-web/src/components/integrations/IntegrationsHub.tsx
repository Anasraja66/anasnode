"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plug, ArrowLeft, CheckCircle2, Clock, Zap,
  MessageSquare, Mail, Phone, ShoppingCart, Calendar,
  Bot, Globe, Database, Users, CreditCard, Hash,
  BookOpen, Folder, Code, Send, Cloud, LayoutGrid,
} from "lucide-react";

import BrandIcon from "@/components/ui/BrandIcon";

// ── Connector Data ──────────────────────────────────────────────────────────

type ConnectorStatus = "connected" | "available" | "coming_soon";

type Connector = {
  id: string;
  name: string;
  desc: string;
  category: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
  status: ConnectorStatus;
  href?: string;
};

const CONNECTORS: Connector[] = [
  // Messaging
  { id: "whatsapp", name: "WhatsApp Business", desc: "AI replies, broadcasts, and 24/7 automation on your business number.", category: "Messaging", color: "#25D366", bg: "#25D36618", icon: <BrandIcon id="whatsapp" className="w-8 h-8" />, status: "available", href: "/dashboard/integrations/whatsapp" },
  { id: "instagram", name: "Instagram DMs", desc: "Auto-reply to Instagram direct messages from the same inbox.", category: "Messaging", color: "#E1306C", bg: "#E1306C18", icon: <BrandIcon id="instagram" className="w-8 h-8" />, status: "available", href: "/dashboard/integrations/instagram" },
  { id: "facebook", name: "Facebook Messenger", desc: "Automate responses on your Facebook page inbox.", category: "Messaging", color: "#1877F2", bg: "#1877F218", icon: <BrandIcon id="facebook" className="w-8 h-8" />, status: "available", href: "/dashboard/integrations/facebook" },
  { id: "telegram", name: "Telegram", desc: "Send messages and run bots on Telegram channels.", category: "Messaging", color: "#2AABEE", bg: "#2AABEE18", icon: <BrandIcon id="telegram" className="w-8 h-8" />, status: "coming_soon" },
  { id: "email", name: "Email / SMTP", desc: "Send emails from Gmail or any SMTP server via automations.", category: "Messaging", color: "#06B6D4", bg: "#06B6D418", icon: <BrandIcon id="email" className="w-8 h-8" />, status: "available", href: "/dashboard/integrations/email" },
  { id: "sms", name: "SMS via Twilio", desc: "Send SMS messages to any phone number worldwide.", category: "Messaging", color: "#F22F46", bg: "#F22F4618", icon: <BrandIcon id="twilio" className="w-8 h-8" />, status: "available" },

  // CRM
  { id: "anaos_crm", name: "AnaOS CRM", desc: "Built-in contacts, deals, and pipeline — no setup needed.", category: "CRM", color: "#0A6BFF", bg: "#0A6BFF18", icon: <Users className="w-7 h-7 text-[#0A6BFF]" />, status: "connected" },
  { id: "hubspot", name: "HubSpot", desc: "Sync contacts and deals to HubSpot when workflows run.", category: "CRM", color: "#FF7A59", bg: "#FF7A5918", icon: <BrandIcon id="hubspot" className="w-8 h-8" />, status: "coming_soon" },
  { id: "salesforce", name: "Salesforce", desc: "Create and update Salesforce leads from any trigger.", category: "CRM", color: "#00A1E0", bg: "#00A1E018", icon: <BrandIcon id="salesforce" className="w-8 h-8" />, status: "coming_soon" },
  { id: "google_sheets", name: "Google Sheets", desc: "Log leads, orders, and data to a Google Sheet in real time.", category: "CRM", color: "#34A853", bg: "#34A85318", icon: <BrandIcon id="googlesheets" className="w-8 h-8" />, status: "coming_soon" },
  { id: "airtable", name: "Airtable", desc: "Use Airtable as a flexible CRM or database for your automations.", category: "CRM", color: "#FCB400", bg: "#FCB40018", icon: <BrandIcon id="airtable" className="w-8 h-8" />, status: "coming_soon" },

  // E-commerce
  { id: "shopify", name: "Shopify", desc: "Abandoned cart recovery, order tracking, and customer alerts.", category: "E-commerce", color: "#96BF48", bg: "#96BF4818", icon: <BrandIcon id="shopify" className="w-8 h-8" />, status: "available", href: "/dashboard/integrations/shopify" },
  { id: "woocommerce", name: "WooCommerce", desc: "Connect your WordPress WooCommerce store to automations.", category: "E-commerce", color: "#7F54B3", bg: "#7F54B318", icon: <BrandIcon id="woocommerce" className="w-8 h-8" />, status: "coming_soon" },
  { id: "stripe", name: "Stripe", desc: "Trigger flows on payments — send invoice, thank-you, or upsell.", category: "E-commerce", color: "#635BFF", bg: "#635BFF18", icon: <BrandIcon id="stripe" className="w-8 h-8" />, status: "coming_soon" },
  { id: "paypal", name: "PayPal", desc: "Automate receipts and follow-ups on PayPal transactions.", category: "E-commerce", color: "#003087", bg: "#00308718", icon: <BrandIcon id="paypal" className="w-8 h-8" />, status: "coming_soon" },

  // AI Providers
  { id: "openai", name: "OpenAI / GPT-4", desc: "Use your own OpenAI key for AI nodes in workflows.", category: "AI", color: "#10A37F", bg: "#10A37F18", icon: <BrandIcon id="openai" className="w-8 h-8" />, status: "available" },
  { id: "claude", name: "Anthropic Claude", desc: "Power AI reply nodes with Claude Sonnet or Haiku.", category: "AI", color: "#D97706", bg: "#D9770618", icon: <Bot className="w-7 h-7 text-[#D97706]" />, status: "available" },
  { id: "gemini", name: "Google Gemini", desc: "Integrate Gemini Pro for AI generation tasks.", category: "AI", color: "#4285F4", bg: "#4285F418", icon: <Bot className="w-7 h-7 text-[#4285F4]" />, status: "available" },
  { id: "groq", name: "Groq", desc: "Ultra-fast AI inference — best for real-time WhatsApp replies.", category: "AI", color: "#F55036", bg: "#F5503618", icon: <Zap className="w-7 h-7 text-[#F55036]" />, status: "available" },

  // Productivity
  { id: "google_calendar", name: "Google Calendar", desc: "Book appointments directly from WhatsApp or form chats.", category: "Productivity", color: "#4285F4", bg: "#4285F418", icon: <BrandIcon id="googlecalendar" className="w-8 h-8" />, status: "available", href: "/dashboard/integrations/google-calendar" },
  { id: "slack", name: "Slack", desc: "Send team alerts and notifications to any Slack channel.", category: "Productivity", color: "#4A154B", bg: "#4A154B18", icon: <BrandIcon id="slack" className="w-8 h-8" />, status: "available" },
  { id: "notion", name: "Notion", desc: "Create and update Notion pages from automation workflows.", category: "Productivity", color: "#000000", bg: "#00000018", icon: <BrandIcon id="notion" className="w-8 h-8" />, status: "available" },
  { id: "google_drive", name: "Google Drive", desc: "Store brochures, invoices and files — share via WhatsApp.", category: "Productivity", color: "#FBBC04", bg: "#FBBC0418", icon: <BrandIcon id="googledrive" className="w-8 h-8" />, status: "available" },

  // Developer
  { id: "webhook", name: "Webhooks", desc: "Trigger any workflow from any external app via HTTP webhook.", category: "Developer", color: "#F59E0B", bg: "#F59E0B18", icon: <Zap className="w-7 h-7 text-[#F59E0B]" />, status: "available" },
  { id: "http_api", name: "HTTP / REST API", desc: "Call any external API or service from inside a workflow node.", category: "Developer", color: "#F97316", bg: "#F9731618", icon: <Globe className="w-7 h-7 text-[#F97316]" />, status: "available" },
  { id: "custom_code", name: "Custom Code", desc: "Run custom JavaScript logic inside a workflow step.", category: "Developer", color: "#374151", bg: "#37415118", icon: <Code className="w-7 h-7 text-[#374151]" />, status: "available" },
];

const CATEGORIES = ["All", "Messaging", "CRM", "E-commerce", "AI", "Productivity", "Developer"];

const STATUS_LABELS: Record<ConnectorStatus, { label: string; color: string; icon: React.ReactNode }> = {
  connected: { label: "Connected", color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  available: { label: "Available", color: "text-blue-700 bg-blue-50 border-blue-200", icon: <Zap className="w-3 h-3" /> },
  coming_soon: { label: "Coming Soon", color: "text-zinc-500 bg-zinc-100 border-zinc-200", icon: <Clock className="w-3 h-3" /> },
};

export function IntegrationsHub() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set(["anaos_crm"]));

  useEffect(() => {
    fetch("/api/integrations/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.integrations) {
          const ids = data.integrations
            .filter((i: { status: string }) => i.status === "connected")
            .map((i: { id: string }) => i.id);
          setConnectedIds(new Set(["anaos_crm", ...ids]));
        }
      })
      .catch(() => {});
  }, []);

  const filtered = CONNECTORS.filter((c) => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const connectedCount = CONNECTORS.filter((c) => connectedIds.has(c.id)).length;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-800 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0A6BFF] flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <Plug className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900">Integrations</h1>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Connect your tools once — AnaOS runs all automations automatically.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold text-[#0A6BFF]">{connectedCount} connected</span>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="text-xs text-zinc-500">{CONNECTORS.length} total integrations</span>
                </div>
              </div>
            </div>
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 mt-6 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                  activeCategory === cat
                    ? "bg-[#0A6BFF] text-white border-[#0A6BFF] shadow-sm"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-semibold">No integrations found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((connector, i) => {
                const isConnected = connectedIds.has(connector.id);
                const effectiveStatus: ConnectorStatus = isConnected ? "connected" : connector.status;
                const statusInfo = STATUS_LABELS[effectiveStatus];
                const canConnect = effectiveStatus === "available" && !isConnected;
                const href = connector.href || (canConnect ? "#" : undefined);

                return (
                  <motion.div
                    key={connector.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className={`bg-white rounded-2xl border p-5 flex flex-col gap-4 transition-shadow hover:shadow-md ${
                      effectiveStatus === "coming_soon" ? "opacity-70" : ""
                    } ${isConnected ? "border-emerald-200 bg-emerald-50/20" : "border-zinc-100"}`}
                  >
                    {/* Icon + Status */}
                    <div className="flex items-start justify-between">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: connector.bg, color: connector.color }}
                      >
                        {connector.icon}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-zinc-900 text-sm">{connector.name}</h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{connector.desc}</p>
                    </div>

                    {/* CTA */}
                    {isConnected ? (
                      <Link
                        href={connector.href || "#"}
                        className="w-full text-center py-2 rounded-xl border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-colors"
                      >
                        Manage
                      </Link>
                    ) : (
                      <Link
                        href={connector.href || "#"}
                        className="w-full text-center py-2 rounded-xl bg-[#0A6BFF] hover:bg-blue-600 text-white text-xs font-semibold transition-colors shadow-sm inline-block"
                      >
                        Connect
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom promo */}
        <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <Plug className="w-8 h-8 mx-auto text-zinc-400 mb-3" />
          <p className="font-semibold text-zinc-800">Need a custom integration?</p>
          <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto">
            Use the <span className="font-semibold text-zinc-700">HTTP Request</span> or <span className="font-semibold text-zinc-700">Webhook</span> node in the workflow builder to connect any API — no native integration needed.
          </p>
          <Link
            href="/dashboard/automations/builder/new"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition-colors"
          >
            Open Workflow Builder
            <Zap className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
