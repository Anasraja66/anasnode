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

// ── Custom Brand SVG Icons ──────────────────────────────────────────────────
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ShopifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M15.337.009l-.21.06C14.94.04 14.72.01 14.48 0c-.45 0-.87.18-1.17.51-.78.87-.9 2.22-.93 2.97-.03.45-.06.9-.09 1.35-1.89-.18-3.78-.18-5.7 0-.03-.45-.06-.9-.09-1.35-.03-.75-.15-2.1-.93-2.97C5.3.18 4.88 0 4.43 0c-.24.01-.46.04-.65.07l-.21-.06C3.36-.02 3 .47 3 1.02v.42L2.31 20.1c0 .48.3.9.75 1.05L11.73 24l8.67-2.85c.45-.15.75-.57.75-1.05L20.97 1.44V1.02C20.94.47 20.58-.02 20.34.01l-.21.06C19.68.04 19.46.01 19.22 0c-.45 0-.87.18-1.17.51-.78.87-.9 2.22-.93 2.97-.03.45-.06.9-.09 1.35-.6.06-1.2.12-1.8.21V4.8c0-.45-.33-.84-.78-.9z" />
  </svg>
);

const SlackIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

const StripeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const NotionIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
  </svg>
);

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
  { id: "whatsapp", name: "WhatsApp Business", desc: "AI replies, broadcasts, and 24/7 automation on your business number.", category: "Messaging", color: "#25D366", bg: "#25D36618", icon: <WhatsAppIcon />, status: "available", href: "/dashboard/integrations/whatsapp" },
  { id: "instagram", name: "Instagram DMs", desc: "Auto-reply to Instagram direct messages from the same inbox.", category: "Messaging", color: "#E1306C", bg: "#E1306C18", icon: <InstagramIcon />, status: "available", href: "/dashboard/integrations/instagram" },
  { id: "facebook", name: "Facebook Messenger", desc: "Automate responses on your Facebook page inbox.", category: "Messaging", color: "#1877F2", bg: "#1877F218", icon: <FacebookIcon />, status: "available", href: "/dashboard/integrations/facebook" },
  { id: "telegram", name: "Telegram", desc: "Send messages and run bots on Telegram channels.", category: "Messaging", color: "#2AABEE", bg: "#2AABEE18", icon: <TelegramIcon />, status: "coming_soon" },
  { id: "email", name: "Email / SMTP", desc: "Send emails from Gmail or any SMTP server via automations.", category: "Messaging", color: "#06B6D4", bg: "#06B6D418", icon: <Mail className="w-6 h-6" />, status: "available", href: "/dashboard/integrations/email" },
  { id: "sms", name: "SMS via Twilio", desc: "Send SMS messages to any phone number worldwide.", category: "Messaging", color: "#F22F46", bg: "#F22F4618", icon: <Phone className="w-6 h-6" />, status: "available" },

  // CRM
  { id: "anaos_crm", name: "AnaOS CRM", desc: "Built-in contacts, deals, and pipeline — no setup needed.", category: "CRM", color: "#0A6BFF", bg: "#0A6BFF18", icon: <Users className="w-6 h-6" />, status: "connected" },
  { id: "hubspot", name: "HubSpot", desc: "Sync contacts and deals to HubSpot when workflows run.", category: "CRM", color: "#FF7A59", bg: "#FF7A5918", icon: <Database className="w-6 h-6" />, status: "coming_soon" },
  { id: "salesforce", name: "Salesforce", desc: "Create and update Salesforce leads from any trigger.", category: "CRM", color: "#00A1E0", bg: "#00A1E018", icon: <Cloud className="w-6 h-6" />, status: "coming_soon" },
  { id: "google_sheets", name: "Google Sheets", desc: "Log leads, orders, and data to a Google Sheet in real time.", category: "CRM", color: "#34A853", bg: "#34A85318", icon: <LayoutGrid className="w-6 h-6" />, status: "coming_soon" },
  { id: "airtable", name: "Airtable", desc: "Use Airtable as a flexible CRM or database for your automations.", category: "CRM", color: "#FCB400", bg: "#FCB40018", icon: <LayoutGrid className="w-6 h-6" />, status: "coming_soon" },

  // E-commerce
  { id: "shopify", name: "Shopify", desc: "Abandoned cart recovery, order tracking, and customer alerts.", category: "E-commerce", color: "#96BF48", bg: "#96BF4818", icon: <ShopifyIcon />, status: "available", href: "/dashboard/integrations/shopify" },
  { id: "woocommerce", name: "WooCommerce", desc: "Connect your WordPress WooCommerce store to automations.", category: "E-commerce", color: "#7F54B3", bg: "#7F54B318", icon: <ShoppingCart className="w-6 h-6" />, status: "coming_soon" },
  { id: "stripe", name: "Stripe", desc: "Trigger flows on payments — send invoice, thank-you, or upsell.", category: "E-commerce", color: "#635BFF", bg: "#635BFF18", icon: <StripeIcon />, status: "coming_soon" },
  { id: "paypal", name: "PayPal", desc: "Automate receipts and follow-ups on PayPal transactions.", category: "E-commerce", color: "#003087", bg: "#00308718", icon: <CreditCard className="w-6 h-6" />, status: "coming_soon" },

  // AI Providers
  { id: "openai", name: "OpenAI / GPT-4", desc: "Use your own OpenAI key for AI nodes in workflows.", category: "AI", color: "#10A37F", bg: "#10A37F18", icon: <Bot className="w-6 h-6" />, status: "available" },
  { id: "claude", name: "Anthropic Claude", desc: "Power AI reply nodes with Claude Sonnet or Haiku.", category: "AI", color: "#D97706", bg: "#D9770618", icon: <Bot className="w-6 h-6" />, status: "available" },
  { id: "gemini", name: "Google Gemini", desc: "Integrate Gemini Pro for AI generation tasks.", category: "AI", color: "#4285F4", bg: "#4285F418", icon: <Zap className="w-6 h-6" />, status: "available" },
  { id: "groq", name: "Groq", desc: "Ultra-fast AI inference — best for real-time WhatsApp replies.", category: "AI", color: "#F55036", bg: "#F5503618", icon: <Zap className="w-6 h-6" />, status: "available" },

  // Productivity
  { id: "google_calendar", name: "Google Calendar", desc: "Book appointments directly from WhatsApp or form chats.", category: "Productivity", color: "#4285F4", bg: "#4285F418", icon: <Calendar className="w-6 h-6" />, status: "available", href: "/dashboard/integrations/google-calendar" },
  { id: "slack", name: "Slack", desc: "Send team alerts and notifications to any Slack channel.", category: "Productivity", color: "#4A154B", bg: "#4A154B18", icon: <SlackIcon />, status: "available" },
  { id: "notion", name: "Notion", desc: "Create and update Notion pages from automation workflows.", category: "Productivity", color: "#000000", bg: "#00000018", icon: <NotionIcon />, status: "available" },
  { id: "google_drive", name: "Google Drive", desc: "Store brochures, invoices and files — share via WhatsApp.", category: "Productivity", color: "#FBBC04", bg: "#FBBC0418", icon: <Folder className="w-6 h-6" />, status: "available" },

  // Developer
  { id: "webhook", name: "Webhooks", desc: "Trigger any workflow from any external app via HTTP webhook.", category: "Developer", color: "#F59E0B", bg: "#F59E0B18", icon: <Zap className="w-6 h-6" />, status: "available" },
  { id: "http_api", name: "HTTP / REST API", desc: "Call any external API or service from inside a workflow node.", category: "Developer", color: "#F97316", bg: "#F9731618", icon: <Globe className="w-6 h-6" />, status: "available" },
  { id: "custom_code", name: "Custom Code", desc: "Run custom JavaScript logic inside a workflow step.", category: "Developer", color: "#374151", bg: "#37415118", icon: <Code className="w-6 h-6" />, status: "available" },
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
