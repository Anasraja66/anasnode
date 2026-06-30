"use client";
/**
 * Anaos Workflow Canvas — Premium Visual Automation Builder
 * Better than N8N: Channel-specific nodes, categorized palette,
 * mini-map, animated edges, business-owner friendly UI
 */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, GitBranch, Bot, MessageSquare, Clock, Globe, Tag, Square,
  Play, ZoomIn, ZoomOut, Trash2, ChevronRight, X,
  ArrowLeft, Loader2, Sliders, ChevronDown,
  Phone, Mail, Database, Star, UserPlus, Send, Bell, Filter,
  Search, Map, LayoutGrid, Sparkles, CheckCircle2, Repeat,
} from "lucide-react";

// ─── WhatsApp SVG Icon ─────────────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── Instagram SVG Icon ───────────────────────────────────────────────────────
const InstagramIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// ─── Facebook SVG Icon ────────────────────────────────────────────────────────
const FacebookIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

export type NodeType =
  | "trigger_whatsapp" | "trigger_instagram" | "trigger_facebook"
  | "trigger_schedule" | "trigger_webhook"
  | "send_whatsapp" | "send_instagram" | "send_facebook" | "send_email"
  | "ai_reply" | "condition" | "wait" | "http_request"
  | "add_tag" | "remove_tag" | "save_lead" | "notify_team"
  | "end";

export interface WorkflowNodeData {
  id: string;
  type: NodeType | string;
  label: string;
  x: number;
  y: number;
  config: Record<string, string>;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface WorkflowData {
  nodes: WorkflowNodeData[];
  edges: WorkflowEdge[];
}

// ─── Node Definitions ─────────────────────────────────────────────────────────

type NodeConfig = {
  label: string;
  desc: string;
  icon: React.ElementType | ((props: { size?: number; color?: string }) => React.ReactNode);
  color: string;
  glow: string;
  bg: string;
  border: string;
  category: string;
  isCustomIcon?: boolean;
  fields: Array<{
    key: string;
    label: string;
    type: "text" | "select" | "textarea";
    options?: string[];
    placeholder?: string;
  }>;
};

const NODE_TYPES: Record<string, NodeConfig> = {
  // ── Triggers ──────────────────────────────────────────────────────────────
  trigger_whatsapp: {
    label: "WhatsApp Trigger",
    desc: "When WA message received",
    icon: WhatsAppIcon,
    isCustomIcon: true,
    color: "#25D366",
    glow: "rgba(37,211,102,0.35)",
    bg: "rgba(37,211,102,0.12)",
    border: "#25D366",
    category: "Triggers",
    fields: [
      { key: "keyword", label: "Keyword Filter (optional)", type: "text", placeholder: "e.g. order, book, info" },
      { key: "phone", label: "WhatsApp Number", type: "text", placeholder: "+92-XXX-XXXXXXX" },
    ],
  },
  trigger_instagram: {
    label: "Instagram Trigger",
    desc: "When IG DM received",
    icon: InstagramIcon,
    isCustomIcon: true,
    color: "#E1306C",
    glow: "rgba(225,48,108,0.35)",
    bg: "rgba(225,48,108,0.12)",
    border: "#E1306C",
    category: "Triggers",
    fields: [
      { key: "keyword", label: "Keyword Filter (optional)", type: "text", placeholder: "e.g. price, info" },
      { key: "account", label: "Instagram Account", type: "text", placeholder: "@yourbusiness" },
    ],
  },
  trigger_facebook: {
    label: "Facebook Trigger",
    desc: "When FB message received",
    icon: FacebookIcon,
    isCustomIcon: true,
    color: "#1877F2",
    glow: "rgba(24,119,242,0.35)",
    bg: "rgba(24,119,242,0.12)",
    border: "#1877F2",
    category: "Triggers",
    fields: [
      { key: "keyword", label: "Keyword Filter (optional)", type: "text", placeholder: "e.g. buy, reserve" },
      { key: "page", label: "Facebook Page", type: "text", placeholder: "Your Page Name" },
    ],
  },
  trigger_schedule: {
    label: "Schedule Trigger",
    desc: "Run at a specific time",
    icon: Clock,
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.35)",
    bg: "rgba(139,92,246,0.12)",
    border: "#8B5CF6",
    category: "Triggers",
    fields: [
      { key: "frequency", label: "Frequency", type: "select", options: ["Daily", "Weekly", "Monthly", "Every hour"] },
      { key: "time", label: "Time", type: "text", placeholder: "09:00 AM" },
    ],
  },
  trigger_webhook: {
    label: "Webhook Trigger",
    desc: "On HTTP webhook call",
    icon: Zap,
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.35)",
    bg: "rgba(245,158,11,0.12)",
    border: "#F59E0B",
    category: "Triggers",
    fields: [
      { key: "method", label: "HTTP Method", type: "select", options: ["POST", "GET"] },
      { key: "path", label: "Webhook Path", type: "text", placeholder: "/webhook/order-placed" },
    ],
  },

  // ── Send Messages ─────────────────────────────────────────────────────────
  send_whatsapp: {
    label: "Send WhatsApp",
    desc: "Send WA message to customer",
    icon: WhatsAppIcon,
    isCustomIcon: true,
    color: "#25D366",
    glow: "rgba(37,211,102,0.35)",
    bg: "rgba(37,211,102,0.12)",
    border: "#25D366",
    category: "Messages",
    fields: [
      { key: "message", label: "Message", type: "textarea", placeholder: "Hello {{name}}! Your order is confirmed 🎉" },
      { key: "media_url", label: "Image/File URL (optional)", type: "text", placeholder: "https://..." },
    ],
  },
  send_instagram: {
    label: "Send Instagram DM",
    desc: "Reply via Instagram DM",
    icon: InstagramIcon,
    isCustomIcon: true,
    color: "#E1306C",
    glow: "rgba(225,48,108,0.35)",
    bg: "rgba(225,48,108,0.12)",
    border: "#E1306C",
    category: "Messages",
    fields: [
      { key: "message", label: "Message", type: "textarea", placeholder: "Thanks for reaching out! ✨" },
    ],
  },
  send_facebook: {
    label: "Send Facebook Msg",
    desc: "Reply via Messenger",
    icon: FacebookIcon,
    isCustomIcon: true,
    color: "#1877F2",
    glow: "rgba(24,119,242,0.35)",
    bg: "rgba(24,119,242,0.12)",
    border: "#1877F2",
    category: "Messages",
    fields: [
      { key: "message", label: "Message", type: "textarea", placeholder: "Hi! How can we help you today?" },
    ],
  },
  send_email: {
    label: "Send Email",
    desc: "Send email to contact",
    icon: Mail,
    color: "#06B6D4",
    glow: "rgba(6,182,212,0.35)",
    bg: "rgba(6,182,212,0.12)",
    border: "#06B6D4",
    category: "Messages",
    fields: [
      { key: "to", label: "To Email", type: "text", placeholder: "{{email}}" },
      { key: "subject", label: "Subject", type: "text", placeholder: "Your booking confirmation" },
      { key: "body", label: "Email Body", type: "textarea", placeholder: "Dear {{name}}, ..." },
    ],
  },

  // ── AI & Logic ────────────────────────────────────────────────────────────
  ai_reply: {
    label: "AI Response",
    desc: "Smart AI auto-reply",
    icon: Bot,
    color: "#10B981",
    glow: "rgba(16,185,129,0.35)",
    bg: "rgba(16,185,129,0.12)",
    border: "#10B981",
    category: "AI & Logic",
    fields: [
      { key: "system_prompt", label: "AI Role / Instructions", type: "textarea", placeholder: "You are a helpful restaurant assistant. Answer questions about menu, hours, and bookings." },
      { key: "tone", label: "Tone", type: "select", options: ["Friendly", "Professional", "Formal", "Casual", "Urdu/Roman Urdu"] },
      { key: "language", label: "Language", type: "select", options: ["English", "Urdu", "Roman Urdu", "Arabic", "Auto-detect"] },
    ],
  },
  condition: {
    label: "Condition / Filter",
    desc: "Branch based on data",
    icon: Filter,
    color: "#D97706",
    glow: "rgba(217,119,6,0.35)",
    bg: "rgba(217,119,6,0.12)",
    border: "#D97706",
    category: "AI & Logic",
    fields: [
      { key: "field", label: "Check Field", type: "select", options: ["message_text", "budget", "tag", "contact_name", "phone", "email", "custom_field"] },
      { key: "operator", label: "Condition", type: "select", options: ["contains", "equals", "not_contains", "greater_than", "less_than", "is_empty"] },
      { key: "value", label: "Value", type: "text", placeholder: "e.g. order, 5000, customer" },
    ],
  },
  wait: {
    label: "Wait / Delay",
    desc: "Pause before next step",
    icon: Clock,
    color: "#71717A",
    glow: "rgba(113,113,122,0.35)",
    bg: "rgba(113,113,122,0.12)",
    border: "#71717A",
    category: "AI & Logic",
    fields: [
      { key: "duration", label: "Duration", type: "text", placeholder: "5" },
      { key: "unit", label: "Unit", type: "select", options: ["minutes", "hours", "days"] },
    ],
  },

  // ── Actions ───────────────────────────────────────────────────────────────
  http_request: {
    label: "API / HTTP Call",
    desc: "Call external service",
    icon: Globe,
    color: "#F97316",
    glow: "rgba(249,115,22,0.35)",
    bg: "rgba(249,115,22,0.12)",
    border: "#F97316",
    category: "Actions",
    fields: [
      { key: "url", label: "API URL", type: "text", placeholder: "https://api.example.com/orders" },
      { key: "method", label: "Method", type: "select", options: ["POST", "GET", "PUT", "DELETE"] },
      { key: "body", label: "Body (JSON)", type: "textarea", placeholder: '{"customer": "{{name}}", "phone": "{{phone}}"}' },
    ],
  },
  add_tag: {
    label: "Add Tag / Label",
    desc: "Tag this contact",
    icon: Tag,
    color: "#EC4899",
    glow: "rgba(236,72,153,0.35)",
    bg: "rgba(236,72,153,0.12)",
    border: "#EC4899",
    category: "Actions",
    fields: [
      { key: "tag", label: "Tag Name", type: "text", placeholder: "hot-lead, vip-customer, interested" },
    ],
  },
  save_lead: {
    label: "Save Lead / Contact",
    desc: "Store contact info",
    icon: UserPlus,
    color: "#6366F1",
    glow: "rgba(99,102,241,0.35)",
    bg: "rgba(99,102,241,0.12)",
    border: "#6366F1",
    category: "Actions",
    fields: [
      { key: "name_field", label: "Name Variable", type: "text", placeholder: "{{name}}" },
      { key: "phone_field", label: "Phone Variable", type: "text", placeholder: "{{phone}}" },
      { key: "list", label: "Save to List", type: "text", placeholder: "restaurant-leads" },
    ],
  },
  notify_team: {
    label: "Notify Team",
    desc: "Alert your staff",
    icon: Bell,
    color: "#14B8A6",
    glow: "rgba(20,184,166,0.35)",
    bg: "rgba(20,184,166,0.12)",
    border: "#14B8A6",
    category: "Actions",
    fields: [
      { key: "channel", label: "Notify Via", type: "select", options: ["WhatsApp", "Email", "Slack", "Telegram"] },
      { key: "message", label: "Alert Message", type: "textarea", placeholder: "New hot lead: {{name}} - {{phone}}" },
    ],
  },
  end: {
    label: "End Flow",
    desc: "Workflow complete",
    icon: CheckCircle2,
    color: "#EF4444",
    glow: "rgba(239,68,68,0.35)",
    bg: "rgba(239,68,68,0.12)",
    border: "#EF4444",
    category: "Actions",
    fields: [
      { key: "note", label: "End Note (optional)", type: "text", placeholder: "Flow completed successfully" },
    ],
  },
  trigger_shopify: {
    label: "Shopify Trigger",
    desc: "When Shopify event occurs",
    icon: Database,
    color: "#96BF48",
    glow: "rgba(150,191,72,0.35)",
    bg: "rgba(150,191,72,0.12)",
    border: "#96BF48",
    category: "Triggers",
    fields: [
      { key: "event", label: "Event Type", type: "select", options: ["cart_abandoned", "order_placed", "customer_created"] }
    ]
  },
  trigger_form: {
    label: "Form Trigger",
    desc: "When a form is submitted",
    icon: Tag,
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.35)",
    bg: "rgba(245,158,11,0.12)",
    border: "#F59E0B",
    category: "Triggers",
    fields: [
      { key: "formId", label: "Form ID", type: "text", placeholder: "e.g. contact-form" }
    ]
  },
  anamind_set: {
    label: "Set Variable",
    desc: "Store variable in profile",
    icon: Database,
    color: "#EC4899",
    glow: "rgba(236,72,153,0.35)",
    bg: "rgba(236,72,153,0.12)",
    border: "#EC4899",
    category: "Actions",
    fields: [
      { key: "variableKey", label: "Variable Name", type: "text", placeholder: "BUDGET" },
      { key: "variableValue", label: "Value", type: "text", placeholder: "{{BUDGET}}" }
    ]
  },
  anamind_get: {
    label: "Get Variable",
    desc: "Retrieve variable from profile",
    icon: Database,
    color: "#EC4899",
    glow: "rgba(236,72,153,0.35)",
    bg: "rgba(236,72,153,0.12)",
    border: "#EC4899",
    category: "Actions",
    fields: [
      { key: "variableKey", label: "Variable Name", type: "text", placeholder: "BUDGET" }
    ]
  },
  google_calendar: {
    label: "Google Calendar",
    desc: "Schedule calendar event",
    icon: Clock,
    color: "#4285F4",
    glow: "rgba(66,133,244,0.35)",
    bg: "rgba(66,133,244,0.12)",
    border: "#4285F4",
    category: "Actions",
    fields: [
      { key: "summary", label: "Event Title", type: "text", placeholder: "Meeting with {{name}}" },
      { key: "startTime", label: "Start Time", type: "text", placeholder: "Tomorrow at 2:00 PM" }
    ]
  },
};

// ─── Type normaliser ──────────────────────────────────────────────────────────
const TYPE_ALIASES: Record<string, string> = {
  trigger: "trigger_whatsapp",
  trigger_whatsapp: "trigger_whatsapp",
  trigger_instagram: "trigger_instagram",
  trigger_facebook: "trigger_facebook",
  trigger_schedule: "trigger_schedule",
  trigger_webhook: "trigger_webhook",
  trigger_shopify: "trigger_shopify",
  trigger_form: "trigger_form",
  ai: "ai_reply",
  ai_response: "ai_reply",
  ai_reply: "ai_reply",
  ai_respond: "ai_reply",
  ai_classify: "ai_reply",
  ai_extract: "ai_reply",
  ai_generate_content: "ai_reply",
  ai_sentiment: "ai_reply",
  ai_translate: "ai_reply",
  message: "send_whatsapp",
  send_message: "send_whatsapp",
  send_whatsapp: "send_whatsapp",
  send_whatsapp_buttons: "send_whatsapp",
  send_whatsapp_list: "send_whatsapp",
  send_instagram: "send_instagram",
  send_instagram_dm: "send_instagram",
  send_facebook: "send_facebook",
  send_email: "send_email",
  http: "http_request",
  http_call: "http_request",
  http_request: "http_request",
  condition: "condition",
  condition_branch: "condition",
  wait: "wait",
  delay: "wait",
  add_tag: "add_tag",
  tag: "add_tag",
  save_lead: "save_lead",
  notify_team: "notify_team",
  end: "end",
  stop: "end",
  anamind_set: "anamind_set",
  anamind_get: "anamind_get",
  google_calendar: "google_calendar",
  shopify_order: "http_request",
  hubspot_contact: "save_lead",
  webhook_send: "http_request",
};

function normaliseType(raw: string): string {
  return TYPE_ALIASES[raw] ?? "trigger_whatsapp";
}

// ─── Category grouping ────────────────────────────────────────────────────────
const CATEGORIES = ["Triggers", "Messages", "AI & Logic", "Actions"];
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Triggers: Zap,
  Messages: Send,
  "AI & Logic": Bot,
  Actions: Star,
};
const CATEGORY_COLORS: Record<string, string> = {
  Triggers: "#25D366",
  Messages: "#1877F2",
  "AI & Logic": "#10B981",
  Actions: "#EC4899",
};

// ─── Node Palette ─────────────────────────────────────────────────────────────
function NodePalette({ onDragStart, search, setSearch }: {
  onDragStart: (type: string) => void;
  search: string;
  setSearch: (v: string) => void;
}) {
  const [openCats, setOpenCats] = useState<string[]>(["Triggers", "Messages", "AI & Logic", "Actions"]);

  const toggleCat = (cat: string) =>
    setOpenCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const filtered = Object.entries(NODE_TYPES).filter(([, cfg]) =>
    !search || cfg.label.toLowerCase().includes(search.toLowerCase()) ||
    cfg.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1 w-full h-full">
      {/* Header */}
      <div className="mb-3 px-1">
        <div className="flex items-center gap-2 mb-1">
          <LayoutGrid size={14} className="text-white/50" />
          <h3 className="text-[13px] font-bold text-white tracking-tight">Node Library</h3>
        </div>
        <p className="text-[10px] text-white/30 font-medium leading-normal">
          Drag to canvas • All channels included
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search nodes..."
          className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-3 py-2 text-[11.5px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/20"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-1 overflow-y-auto flex-1 pr-0.5" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map(cat => {
          const CatIcon = CATEGORY_ICONS[cat];
          const catColor = CATEGORY_COLORS[cat];
          const catNodes = filtered.filter(([, cfg]) => cfg.category === cat);
          if (catNodes.length === 0) return null;
          const isOpen = openCats.includes(cat);

          return (
            <div key={cat} className="mb-1">
              {/* Category header */}
              <button
                onClick={() => toggleCat(cat)}
                className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors mb-1 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: catColor + "20" }}>
                    <CatIcon size={10} style={{ color: catColor }} />
                  </div>
                  <span className="text-[11px] font-bold text-white/60 uppercase tracking-wider">{cat}</span>
                </div>
                <ChevronDown size={10} className={`text-white/30 transition-transform ${isOpen ? "" : "-rotate-90"}`} />
              </button>

              {/* Nodes */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-1.5 overflow-hidden"
                  >
                    {catNodes.map(([type, cfg]) => {
                      const Icon = cfg.icon;
                      return (
                        <div
                          key={type}
                          draggable
                          onDragStart={() => onDragStart(type)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-grab active:cursor-grabbing select-none transition-all hover:scale-[1.02] border border-transparent hover:border-white/8 group"
                          style={{ background: "rgba(255,255,255,0.03)" }}
                          title={cfg.desc}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                            style={{ background: cfg.color + "18", border: `1px solid ${cfg.color}30` }}
                          >
                            {cfg.isCustomIcon ? (
                              <Icon size={13} color={cfg.color} />
                            ) : (
                              <Icon size={13} style={{ color: cfg.color }} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11.5px] font-bold text-white/85 leading-tight truncate">{cfg.label}</p>
                            <p className="text-[9.5px] text-white/30 font-medium mt-0.5 truncate">{cfg.desc}</p>
                          </div>
                          <ChevronRight size={9} className="text-white/20 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Canvas Node ──────────────────────────────────────────────────────────────
function CanvasNode({
  node, selected, onClick, onDragStart, onDragEnd, isDragging,
  isConnectingSource, isConnectingCandidate,
}: {
  node: WorkflowNodeData;
  selected: boolean;
  onClick: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDragEnd: () => void;
  isDragging?: boolean;
  isConnectingSource?: boolean;
  isConnectingCandidate?: boolean;
}) {
  const typeKey = normaliseType(node.type);
  const cfg = NODE_TYPES[typeKey] ?? NODE_TYPES["trigger_whatsapp"];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="canvas-node"
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        zIndex: isDragging ? 30 : selected ? 20 : 10,
      }}
      onClick={e => { e.stopPropagation(); onClick(); }}
      onMouseDown={onDragStart}
      onMouseUp={onDragEnd}
    >
      <div
        className="rounded-lg transition-all duration-100 flex flex-col overflow-hidden"
        style={{
          background: "#1E222B", // n8n dark mode style body
          border: `1px solid ${selected ? "#FF6E4A" : "#303440"}`, // n8n uses orange for selection
          boxShadow: selected ? "0 0 0 1px #FF6E4A" : "0 2px 5px rgba(0,0,0,0.2)",
          width: 200,
          minHeight: 70,
          transform: isDragging ? "scale(1.02) translateY(-2px)" : "scale(1)",
        }}
      >
        {/* n8n Style Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[#303440] bg-[#252A33]">
          <div
            className="w-5 h-5 rounded flex items-center justify-center shrink-0"
            style={{ background: cfg.color }}
          >
            {cfg.isCustomIcon ? (
              <Icon size={12} color="#ffffff" />
            ) : (
              <Icon size={12} style={{ color: "#ffffff" }} />
            )}
          </div>
          <p className="text-[12px] font-semibold text-white/90 leading-tight truncate">{node.label || cfg.label}</p>
        </div>

        {/* n8n Style Body / Config preview */}
        <div className="px-3 py-2.5 bg-[#1E222B] flex-1 flex flex-col justify-center">
          {node.config && Object.keys(node.config).length > 0 ? (
            Object.entries(node.config).slice(0, 1).map(([k, v]) => v && (
              <p key={k} className="text-[10px] text-white/60 truncate w-full font-medium">
                <span className="opacity-50">{k}:</span> {String(v)}
              </p>
            ))
          ) : (
            <p className="text-[10px] text-white/40 italic">Double-click to set up</p>
          )}
        </div>

        {/* Output port (Right) */}
        <div
          className={`absolute right-[-5px] top-[60%] -translate-y-1/2 w-[10px] h-[10px] rounded-full border-[1.5px] bg-[#1E222B] z-10 transition-all ${isConnectingSource ? "scale-125" : ""}`}
          style={{ borderColor: "#6b7280" }}
        />
        {/* Input port (Left) */}
        <div
          className={`absolute left-[-5px] top-[60%] -translate-y-1/2 w-[10px] h-[10px] rounded-full border-[1.5px] bg-[#1E222B] z-10 transition-all ${isConnectingCandidate ? "scale-125 bg-green-500" : ""}`}
          style={{ borderColor: isConnectingCandidate ? "#22c55e" : "#6b7280" }}
        />
      </div>
    </motion.div>
  );
}

// ─── Animated Edges ───────────────────────────────────────────────────────────
function EdgeLayer({ nodes, edges }: { nodes: WorkflowNodeData[]; edges: WorkflowEdge[] }) {
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }} width="100%" height="100%">
      <defs>
        <marker id="arrow-n8n" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,1 L0,5 L5,3 z" fill="#6b7280" />
        </marker>
      </defs>
      {edges.map(edge => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        if (!from || !to) return null;

        // n8n node width is 200, output port is at right edge, top 60%
        const x1 = from.x + 200;
        const y1 = from.y + 51; // ~60% of 70px height + header
        const x2 = to.x;
        const y2 = to.y + 51;
        const cx = (x1 + x2) / 2;

        return (
          <g key={edge.id}>
            {/* Main solid n8n style edge */}
            <path d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`}
              fill="none" stroke="#6b7280" strokeWidth={2}
              opacity={0.8} markerEnd="url(#arrow-n8n)" />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Properties Panel ─────────────────────────────────────────────────────────
function PropertiesPanel({ node, onChange, onDelete, onClose }: {
  node: WorkflowNodeData;
  onChange: (id: string, config: Record<string, string>, label: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const typeKey = normaliseType(node.type);
  const cfg = NODE_TYPES[typeKey] ?? NODE_TYPES["trigger_whatsapp"];
  const [label, setLabel] = useState(node.label);
  const [config, setConfig] = useState<Record<string, string>>(node.config);

  const update = (key: string, value: string) => {
    const next = { ...config, [key]: value };
    setConfig(next);
    onChange(node.id, next, label);
  };

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="w-80 shrink-0 border-l flex flex-col properties-panel h-full"
      style={{
        background: "#1E222B",
        borderColor: "#303440",
        boxShadow: "-5px 0 30px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#303440] bg-[#252A33]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: cfg.color + "20" }}>
            {cfg.isCustomIcon
              ? <cfg.icon size={12} color={cfg.color} />
              : <cfg.icon size={12} style={{ color: cfg.color }} />}
          </div>
          <div>
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider leading-none">{cfg.category}</p>
            <p className="text-[13px] font-bold text-white leading-tight">{cfg.label}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer">
          <X size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "none" }}>
        {/* Label */}
        <div>
          <label className="text-[10px] font-bold text-white/35 uppercase tracking-wider block mb-1.5">Node Label</label>
          <input
            value={label}
            onChange={e => { setLabel(e.target.value); onChange(node.id, config, e.target.value); }}
            className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-[12.5px] text-white focus:outline-none focus:border-white/25 transition-colors"
          />
        </div>

        {/* Dynamic fields */}
        {cfg.fields.map(field => (
          <div key={field.key}>
            <label className="text-[10px] font-bold text-white/35 uppercase tracking-wider block mb-1.5">{field.label}</label>
            {field.type === "select" ? (
              <select
                value={config[field.key] || ""}
                onChange={e => update(field.key, e.target.value)}
                className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-[12.5px] text-white focus:outline-none focus:border-white/25 appearance-none transition-colors"
              >
                <option value="">Select…</option>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                value={config[field.key] || ""}
                onChange={e => update(field.key, e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-[12.5px] text-white focus:outline-none focus:border-white/25 resize-none transition-colors"
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}…`}
              />
            ) : (
              <input
                value={config[field.key] || ""}
                onChange={e => update(field.key, e.target.value)}
                className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-[12.5px] text-white focus:outline-none focus:border-white/25 transition-colors"
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}…`}
              />
            )}
          </div>
        ))}

        {/* Variables hint */}
        <div className="mt-6 border border-[#FF6E4A]/30 bg-[#FF6E4A]/5 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-[#FF6E4A] mb-1.5 flex items-center gap-1.5">
            <Zap size={10} /> Expression Support
          </p>
          <p className="text-[11px] text-white/50 leading-relaxed font-mono">
            {`{{ $json.name }}`} <br />
            {`{{ $node["Webhook"].output.phone }}`}
          </p>
        </div>
      </div>

      {/* Delete */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => onDelete(node.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400/80 text-[12px] font-bold hover:bg-red-900/40 transition-colors cursor-pointer"
        >
          <Trash2 size={11} /> Delete Node
        </button>
      </div>
    </motion.div>
  );
}

// ─── Mini Map ─────────────────────────────────────────────────────────────────
function MiniMap({ nodes, pan, zoom, canvasW, canvasH }: {
  nodes: WorkflowNodeData[];
  pan: { x: number; y: number };
  zoom: number;
  canvasW: number;
  canvasH: number;
}) {
  const W = 160, H = 90;
  if (nodes.length === 0) return null;

  const minX = Math.min(...nodes.map(n => n.x));
  const maxX = Math.max(...nodes.map(n => n.x + 160));
  const minY = Math.min(...nodes.map(n => n.y));
  const maxY = Math.max(...nodes.map(n => n.y + 80));
  const rangeX = Math.max(maxX - minX, 400);
  const rangeY = Math.max(maxY - minY, 200);
  const scaleX = W / rangeX;
  const scaleY = H / rangeY;

  return (
    <div
      className="absolute bottom-6 right-6 rounded-xl overflow-hidden border border-[#303440]"
      style={{ background: "#1E222B", width: W + 16, height: H + 16 }}
    >
      <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest px-2 pt-1.5">Mini Map</p>
      <svg width={W} height={H} style={{ display: "block", margin: "0 auto" }}>
        {nodes.map(n => {
          const typeKey = normaliseType(n.type);
          const cfg = NODE_TYPES[typeKey] ?? NODE_TYPES["trigger_whatsapp"];
          return (
            <rect
              key={n.id}
              x={(n.x - minX) * scaleX}
              y={(n.y - minY) * scaleY}
              width={20}
              height={10}
              rx={2}
              fill={cfg.color}
              opacity={0.8}
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── Main WorkflowCanvas ──────────────────────────────────────────────────────

interface WorkflowCanvasProps {
  workflowId: string;
  initialData?: WorkflowData;
  workflowName?: string;
  onBack?: () => void;
}

function canvasTypeToDb(type: string): string {
  switch (type) {
    case "trigger_whatsapp": return "trigger_whatsapp";
    case "trigger_instagram": return "trigger_instagram";
    case "trigger_facebook": return "trigger_facebook";
    case "trigger_schedule": return "trigger_schedule";
    case "trigger_webhook": return "trigger_webhook";
    case "ai_reply": return "ai_respond";
    case "send_whatsapp": return "send_whatsapp";
    case "send_instagram": return "send_instagram_dm";
    case "send_facebook": return "send_facebook";
    case "send_email": return "send_email";
    case "condition": return "condition";
    case "wait": return "wait";
    case "http_request": return "http_request";
    case "anamind_set": return "anamind_set";
    case "anamind_get": return "anamind_get";
    case "google_calendar": return "google_calendar";
    default: return type;
  }
}

function dbNodeToCanvas(node: any): WorkflowNodeData {
  const typeKey = normaliseType(node.type);
  const config = { ...node.config };

  if (config.systemPrompt !== undefined && config.system_prompt === undefined) {
    config.system_prompt = config.systemPrompt;
  }
  if (config.template !== undefined && config.message === undefined) {
    config.message = config.template;
  }
  if (config.minutes !== undefined && config.duration === undefined) {
    config.duration = String(config.minutes);
    config.unit = "minutes";
  }

  return {
    id: node.id,
    type: typeKey,
    label: node.label ?? node.name ?? "Untitled Node",
    x: typeof node.x === "number" ? node.x : (node.position?.x ?? 100),
    y: typeof node.y === "number" ? node.y : (node.position?.y ?? 100),
    config,
  };
}

function canvasNodeToDb(node: WorkflowNodeData, allEdges: WorkflowEdge[]): any {
  const dbType = canvasTypeToDb(node.type);
  const config: Record<string, any> = { ...node.config };

  if (config.system_prompt !== undefined) {
    config.systemPrompt = config.system_prompt;
  }
  if (config.message !== undefined) {
    config.template = config.message;
  }
  if (config.duration !== undefined) {
    config.minutes = Number(config.duration) || 1;
  }

  const inputs = allEdges.filter(e => e.to === node.id).map(e => e.from);
  const outputs = allEdges.filter(e => e.from === node.id).map(e => e.to);

  return {
    id: node.id,
    type: dbType,
    name: node.label,
    position: { x: node.x, y: node.y },
    config,
    inputs,
    outputs,
  };
}

function canvasEdgeToDb(edge: WorkflowEdge): any {
  return {
    id: edge.id,
    source: edge.from,
    target: edge.to,
  };
}

export default function WorkflowCanvas({ workflowId, initialData, workflowName = "Untitled Workflow", onBack }: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<WorkflowNodeData[]>(() => {
    if (!initialData?.nodes) return [];
    return initialData.nodes.map(dbNodeToCanvas);
  });
  const [edges, setEdges] = useState<WorkflowEdge[]>(() => {
    if (!initialData?.edges) return [];
    return initialData.edges.map((e: any) => ({
      id: e.id || `edge-${e.from ?? e.source}-${e.to ?? e.target}`,
      from: e.from ?? e.source,
      to: e.to ?? e.target,
      label: e.label,
    }));
  });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggingNodeType, setDraggingNodeType] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ nodeId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [name, setName] = useState(workflowName);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [search, setSearch] = useState("");
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const selectedNodeData = nodes.find(n => n.id === selectedNode) || null;

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCanvasSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setCanvasSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Canvas panning
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest(".canvas-node") || target.closest("button") || target.closest("input") || target.closest("select") || target.closest("textarea") || target.closest(".properties-panel")) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  useEffect(() => {
    if (!isPanning) return;
    const onMove = (e: MouseEvent) => setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    const onUp = () => setIsPanning(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isPanning, panStart]);

  // Drop from palette
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingNodeType) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - pan.x) / zoom - 90;
    const y = (e.clientY - rect.top - pan.y) / zoom - 30;
    const typeKey = normaliseType(draggingNodeType);
    const cfg = NODE_TYPES[typeKey] ?? NODE_TYPES["trigger_whatsapp"];
    const newNode: WorkflowNodeData = {
      id: `node-${Date.now()}`,
      type: draggingNodeType,
      label: cfg.label,
      x: Math.max(20, x),
      y: Math.max(20, y),
      config: {},
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode.id);
    setDraggingNodeType(null);
  }, [draggingNodeType, pan, zoom]);

  // Drag existing node
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    setDragState({ nodeId, startX: e.clientX, startY: e.clientY, origX: node.x, origY: node.y });
  }, [nodes]);

  useEffect(() => {
    if (!dragState) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragState.startX) / zoom;
      const dy = (e.clientY - dragState.startY) / zoom;
      setNodes(prev => prev.map(n => n.id === dragState.nodeId ? { ...n, x: Math.max(0, dragState.origX + dx), y: Math.max(0, dragState.origY + dy) } : n));
    };
    const onUp = () => setDragState(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragState, zoom]);

  // Connect nodes
  const handleNodeClick = useCallback((nodeId: string) => {
    if (connecting && connecting !== nodeId) {
      const edgeId = `edge-${connecting}-${nodeId}`;
      if (!edges.some(e => e.from === connecting && e.to === nodeId)) {
        setEdges(prev => [...prev, { id: edgeId, from: connecting, to: nodeId }]);
      }
      setConnecting(null);
      return;
    }
    setSelectedNode(nodeId);
    setConnecting(null);
  }, [connecting, edges]);

  const handleNodeChange = useCallback((id: string, config: Record<string, string>, label: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, config, label } : n));
  }, []);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.from !== id && e.to !== id));
    setSelectedNode(null);
  }, []);

  // Save
  const handleSave = async () => {
    setSaving(true);
    try {
      const dbNodes = nodes.map(n => canvasNodeToDb(n, edges));
      const dbEdges = edges.map(canvasEdgeToDb);

      await fetch(`/api/v1/workflows/${workflowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nodes: dbNodes, edges: dbEdges }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // Zoom with scroll
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(2.5, z - e.deltaY * 0.001)));
  }, []);

  const nodeCount = nodes.length;
  const edgeCount = edges.length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080A12", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(ellipse at 15% 25%, rgba(37,211,102,0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 75%, rgba(24,119,242,0.03) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(225,48,108,0.02) 0%, transparent 60%),
          linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 28px 28px, 28px 28px",
      }} />

      {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
      <div
        className="w-[220px] shrink-0 border-r flex flex-col p-3 z-20 relative"
        style={{ background: "#1E222B", borderColor: "#303440" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Sparkles size={11} className="text-blue-400" />
          </div>
          <span className="text-[12px] font-bold text-white/80 tracking-tight">Anaos Builder</span>
        </div>

        <NodePalette
          onDragStart={setDraggingNodeType}
          search={search}
          setSearch={setSearch}
        />

        {/* Stats */}
        <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
          <div className="bg-white/3 rounded-xl p-2 text-center">
            <p className="text-[16px] font-bold text-white">{nodeCount}</p>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Nodes</p>
          </div>
          <div className="bg-white/3 rounded-xl p-2 text-center">
            <p className="text-[16px] font-bold text-white">{edgeCount}</p>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Edges</p>
          </div>
        </div>
      </div>

      {/* ── Main Area ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Top Toolbar */}
        <div
          className="h-14 shrink-0 flex items-center justify-between px-5 border-b z-20 relative"
          style={{ background: "#1E222B", borderColor: "#303440" }}
        >
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all cursor-pointer">
                <ArrowLeft size={15} />
              </button>
            )}
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-transparent text-[14px] font-bold text-white focus:outline-none w-48 placeholder:text-white/30"
              placeholder="Workflow name..."
            />
            {/* Status badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] font-bold tracking-widest text-[#25D366] bg-[#25D366]/8 border border-[#25D366]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              <span>ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Zoom */}
            <div className="flex items-center gap-1 bg-white/4 border border-white/8 rounded-xl px-2 py-1.5">
              <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                <ZoomOut size={12} />
              </button>
              <span className="text-[10px] font-bold text-white/40 w-9 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(2.5, z + 0.1))} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                <ZoomIn size={12} />
              </button>
            </div>

            {/* Connect mode */}
            <button
              onClick={() => setConnecting(connecting ? null : (selectedNode || null))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${connecting ? "bg-purple-600 text-white" : "bg-white/4 border border-white/8 text-white/50 hover:text-white"}`}
            >
              <ChevronRight size={11} />
              {connecting ? "Click target…" : "Connect"}
            </button>

            {/* Reset view */}
            <button
              onClick={() => { setPan({ x: 0, y: 0 }); setZoom(1); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/4 border border-white/8 text-[11px] font-bold text-white/50 hover:text-white transition-all cursor-pointer"
            >
              <Map size={11} />
              Reset
            </button>

            {/* Save/Deploy */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              style={{ background: saved ? "#10B981" : "#0A6BFF", color: "#fff", boxShadow: saved ? "0 0 20px rgba(16,185,129,0.4)" : "0 0 20px rgba(10,107,255,0.3)" }}
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? <CheckCircle2 size={12} /> : <Play size={12} className="fill-white" />}
              <span>{saving ? "Saving…" : saved ? "Saved!" : "Deploy"}</span>
            </button>
          </div>
        </div>

        {/* Canvas + Properties Panel */}
        <div className="flex flex-1 min-h-0 relative">
          {/* Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 relative overflow-hidden"
            onDragOver={e => e.preventDefault()}
            onDrop={handleCanvasDrop}
            onMouseDown={handleCanvasMouseDown}
            onWheel={handleWheel}
            onClick={() => { if (!connecting) setSelectedNode(null); }}
            style={{ cursor: isPanning ? "grabbing" : connecting ? "crosshair" : "default" }}
          >
            {/* Empty state */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} className="text-white/20" />
                  </div>
                  <p className="text-[15px] font-bold text-white/20">Drag nodes from the left panel</p>
                  <p className="text-[12px] text-white/10 font-medium mt-1">or use AI to generate your workflow</p>
                </div>
              </div>
            )}

            {/* Transformed layer */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "0 0",
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              <EdgeLayer nodes={nodes} edges={edges} />
              {nodes.map(node => (
                <CanvasNode
                  key={node.id}
                  node={node}
                  selected={selectedNode === node.id}
                  onClick={() => handleNodeClick(node.id)}
                  onDragStart={e => handleNodeMouseDown(e, node.id)}
                  onDragEnd={() => setDragState(null)}
                  isDragging={dragState?.nodeId === node.id}
                  isConnectingSource={connecting === node.id}
                  isConnectingCandidate={!!connecting && connecting !== node.id}
                />
              ))}
            </div>

            {/* Mini Map */}
            <MiniMap nodes={nodes} pan={pan} zoom={zoom} canvasW={canvasSize.w} canvasH={canvasSize.h} />

            {/* Channel legend */}
            <div className="absolute bottom-6 left-4 flex flex-col gap-1.5 pointer-events-none">
              {[
                { color: "#25D366", label: "WhatsApp" },
                { color: "#E1306C", label: "Instagram" },
                { color: "#1877F2", label: "Facebook" },
              ].map(ch => (
                <div key={ch.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: ch.color, boxShadow: `0 0 6px ${ch.color}` }} />
                  <span className="text-[9px] font-bold text-white/25 uppercase tracking-wider">{ch.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Properties Panel */}
          <AnimatePresence>
            {selectedNodeData && (
              <div className="p-3 border-l shrink-0" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(8,10,18,0.97)" }}>
                <PropertiesPanel
                  node={selectedNodeData}
                  onChange={handleNodeChange}
                  onDelete={handleDeleteNode}
                  onClose={() => setSelectedNode(null)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
