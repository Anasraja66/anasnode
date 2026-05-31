"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Zap,
  Radio,
  BarChart2,
  Settings,
  MessageSquare,
  Plus,
  ChevronDown,
  ArrowUpRight,
  MoreHorizontal,
  Search,
  Bell,
  Check,
  X,
  Circle,
  Dot,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  Activity,
  GitBranch,
  Clock,
  Hash,
  Send
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "overview" | "contacts" | "automations" | "broadcasts" | "analytics";

type Workspace = {
  id: string;
  name: string;
  industry: string;
  slug: string;
  status: "live" | "draft" | "paused";
  version: number;
  automations: Automation[];
  variables: Variable[];
};

type Automation = {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  runs: number;
  lastRun: string;
};

type Variable = {
  key: string;
  value: string;
  confidence: number;
  ttl: string;
};

type Contact = {
  id: string;
  name: string;
  phone: string;
  industry: string;
  stage: string;
  lastMessage: string;
  time: string;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const WORKSPACES: Workspace[] = [
  {
    id: "ws-1",
    name: "Marina Realty",
    industry: "Real Estate",
    slug: "marina-realty",
    status: "live",
    version: 3,
    automations: [
      { id: "a-1", name: "Lead Qualification Bot", type: "whatsapp_flow", enabled: true, runs: 284, lastRun: "2 min ago" },
      { id: "a-2", name: "Viewing Scheduler", type: "calendar", enabled: true, runs: 97, lastRun: "14 min ago" },
      { id: "a-3", name: "Cold Lead Drip", type: "campaign", enabled: false, runs: 41, lastRun: "3 days ago" },
    ],
    variables: [
      { key: "BUDGET", value: "AED 2.2M", confidence: 98, ttl: "30 days" },
      { key: "LOCATION", value: "Dubai Marina", confidence: 95, ttl: "30 days" },
      { key: "BEDROOMS", value: "3 BHK", confidence: 99, ttl: "30 days" },
    ],
  },
  {
    id: "ws-2",
    name: "Olive & Oak",
    industry: "Restaurant",
    slug: "olive-oak",
    status: "live",
    version: 1,
    automations: [
      { id: "a-4", name: "WhatsApp Ordering", type: "whatsapp_flow", enabled: true, runs: 512, lastRun: "Just now" },
      { id: "a-5", name: "Table Reservations", type: "calendar", enabled: true, runs: 203, lastRun: "8 min ago" },
      { id: "a-6", name: "Review Requests", type: "campaign", enabled: true, runs: 88, lastRun: "1 hr ago" },
    ],
    variables: [
      { key: "GUESTS", value: "4 people", confidence: 97, ttl: "7 days" },
      { key: "TIMING", value: "Tonight 8pm", confidence: 91, ttl: "1 day" },
    ],
  },
];

const CONTACTS: Contact[] = [
  { id: "c-1", name: "Ahmed Hassan", phone: "+971 50 123 4567", industry: "Real Estate", stage: "Qualified", lastMessage: "Yes, AED 2.2M is my budget.", time: "2m ago" },
  { id: "c-2", name: "Sara Khan", phone: "+92 300 987 6543", industry: "Restaurant", stage: "Booked", lastMessage: "Can I pre-order drinks?", time: "4h ago" },
  { id: "c-3", name: "Dr. Imran Qureshi", phone: "+92 321 456 7890", industry: "Clinic", stage: "Reminded", lastMessage: "Confirmed for tomorrow 11am.", time: "1d ago" },
  { id: "c-4", name: "Layla Al-Rashid", phone: "+971 55 234 5678", industry: "Real Estate", stage: "Viewing Set", lastMessage: "Saturday works for the viewing.", time: "2d ago" },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { dot: string; text: string }> = {
    live:    { dot: "bg-emerald-500", text: "text-emerald-700" },
    draft:   { dot: "bg-zinc-400",    text: "text-zinc-500" },
    paused:  { dot: "bg-amber-500",   text: "text-amber-700" },
    Qualified:   { dot: "bg-blue-500",    text: "text-blue-700" },
    Booked:      { dot: "bg-emerald-500", text: "text-emerald-700" },
    Reminded:    { dot: "bg-amber-500",   text: "text-amber-700" },
    "Viewing Set": { dot: "bg-violet-500", text: "text-violet-700" },
  };
  const s = map[status] ?? { dot: "bg-zinc-400", text: "text-zinc-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview",    label: "Overview",       icon: LayoutDashboard },
  { id: "contacts",    label: "Contacts",       icon: Users },
  { id: "automations", label: "Automations",    icon: Zap },
  { id: "broadcasts",  label: "Broadcasts",     icon: Radio },
  { id: "analytics",   label: "Analytics",      icon: BarChart2 },
];

function Sidebar({ active, onChange, ws, onWsChange, workspaces }: {
  active: Tab;
  onChange: (t: Tab) => void;
  ws: Workspace;
  onWsChange: (w: Workspace) => void;
  workspaces: Workspace[];
}) {
  const [wsOpen, setWsOpen] = useState(false);

  return (
    <aside className="w-[220px] shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 px-5 flex items-center gap-2.5 border-b border-zinc-200">
        <div className="w-6 h-6 rounded-[6px] bg-zinc-900 flex items-center justify-center">
          <div className="w-2 h-2 rounded-[3px] bg-white" />
        </div>
        <span className="text-[14px] font-semibold text-zinc-900 tracking-tight">AnasNode</span>
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 pt-3">
        <button
          onClick={() => setWsOpen(!wsOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-5 h-5 rounded bg-zinc-900 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-white">{ws.name[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-zinc-900 truncate">{ws.name}</p>
            </div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform shrink-0 ${wsOpen ? "rotate-180" : ""}`} />
        </button>

        {wsOpen && (
          <div className="mt-1 rounded-lg border border-zinc-200 bg-white shadow-lg overflow-hidden">
            {workspaces.map((w) => (
              <button
                key={w.id}
                onClick={() => { onWsChange(w); setWsOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-zinc-50 transition-colors cursor-pointer ${ws.id === w.id ? "bg-zinc-50" : ""}`}
              >
                <div className="w-5 h-5 rounded bg-zinc-200 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-zinc-700">{w.name[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-zinc-800 truncate">{w.name}</p>
                  <p className="text-[11px] text-zinc-500">{w.industry}</p>
                </div>
                {ws.id === w.id && <Check className="w-3.5 h-3.5 text-zinc-700 shrink-0" />}
              </button>
            ))}
            <div className="border-t border-zinc-100 px-3 py-2.5">
              <button className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> New workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 space-y-0.5">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
              active === id
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-zinc-200 space-y-0.5">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 transition-colors cursor-pointer">
          <Settings className="w-4 h-4" /> Settings
        </button>
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-5 h-5 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
            <span className="text-[8px] font-bold text-zinc-600">A</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-zinc-800 truncate">Anas</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ title, ws }: { title: string; ws: Workspace }) {
  return (
    <header className="h-14 border-b border-zinc-200 bg-white px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-zinc-400">{ws.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
        <span className="font-medium text-zinc-900">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 h-8 px-3 rounded-lg border border-zinc-200 text-[12.5px] text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer">
          <Search className="w-3.5 h-3.5" /> Search
        </button>
        <button className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

// ─── Page: Overview ───────────────────────────────────────────────────────────

function OverviewPage({ ws, onToggle }: { ws: Workspace; onToggle: (id: string) => void }) {
  const stats = [
    { label: "Active Automations", value: ws.automations.filter(a => a.enabled).length.toString(), change: null },
    { label: "Total Runs", value: ws.automations.reduce((s, a) => s + a.runs, 0).toLocaleString(), change: "+18%" },
    { label: "Contacts", value: "432", change: "+12%" },
    { label: "Messages Sent", value: "8,412", change: "+24%" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-5xl">

      {/* Workspace Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[18px] font-semibold text-zinc-900">{ws.name}</h1>
            <StatusBadge status={ws.status} />
            <span className="text-[11px] font-mono text-zinc-400">v{ws.version}.0</span>
          </div>
          <p className="mt-1 text-[13px] text-zinc-500">/{ws.slug} · {ws.industry}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 text-[12.5px] font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Sync
          </button>
          <button className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-zinc-900 text-white text-[12.5px] font-medium hover:bg-zinc-700 transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add automation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-[11.5px] text-zinc-500 font-medium">{s.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[22px] font-semibold text-zinc-900 tabular-nums">{s.value}</span>
              {s.change && (
                <span className="text-[11px] font-medium text-emerald-600">{s.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Automations Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-[13.5px] font-semibold text-zinc-900">Automations</h2>
          <span className="text-[12px] text-zinc-400 font-mono">{ws.automations.length} total</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100">
              {["Name", "Type", "Runs", "Last run", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-[11px] font-medium text-zinc-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {ws.automations.map((a) => (
              <tr key={a.id} className="hover:bg-zinc-50/60 transition-colors">
                <td className="px-5 py-3.5 text-[13px] font-medium text-zinc-800">{a.name}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-500">
                    {a.type}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-zinc-600 tabular-nums">{a.runs.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-[12.5px] text-zinc-400">{a.lastRun}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => onToggle(a.id)}
                    className={`relative w-8 h-4.5 rounded-full transition-colors cursor-pointer ${a.enabled ? "bg-zinc-900" : "bg-zinc-200"}`}
                  >
                    <span className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${a.enabled ? "left-[17px]" : "left-0.5"}`} />
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <button className="text-zinc-300 hover:text-zinc-600 transition-colors cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AnasMind Variables */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-[13.5px] font-semibold text-zinc-900">AnasMind Variables</h2>
            <p className="text-[12px] text-zinc-400 mt-0.5">Extracted from conversations via Claude Haiku</p>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">{ws.variables.length} pinned</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100">
              {["Key", "Value", "Confidence", "TTL"].map((h) => (
                <th key={h} className="px-5 py-3 text-[11px] font-medium text-zinc-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {ws.variables.map((v) => (
              <tr key={v.key} className="hover:bg-zinc-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <span className="text-[12px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                    {v.key}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[13px] font-medium text-zinc-800">{v.value}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${v.confidence}%` }} />
                    </div>
                    <span className="text-[12px] tabular-nums text-zinc-500">{v.confidence}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[12px] text-zinc-400 font-mono">{v.ttl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page: Contacts ───────────────────────────────────────────────────────────

function ContactsPage({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-zinc-900">Contacts</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Auto-synced from WhatsApp conversations</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-zinc-200 text-[12.5px] text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer">
            <Search className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-zinc-900 text-white text-[12.5px] font-medium hover:bg-zinc-700 transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add contact
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              {["Name", "Phone", "Industry", "Stage", "Last message", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-[11px] font-medium text-zinc-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {contacts.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50/60 transition-colors">
                <td className="px-5 py-3.5 text-[13px] font-medium text-zinc-800">{c.name}</td>
                <td className="px-5 py-3.5 text-[12.5px] font-mono text-zinc-400">{c.phone}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-500 font-mono">{c.industry}</span>
                </td>
                <td className="px-5 py-3.5"><StatusBadge status={c.stage} /></td>
                <td className="px-5 py-3.5 text-[12.5px] text-zinc-500 max-w-[200px] truncate">
                  "{c.lastMessage}"
                </td>
                <td className="px-5 py-3.5 text-[12px] text-zinc-400 font-mono">{c.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page: Broadcasts ─────────────────────────────────────────────────────────

function BroadcastsPage() {
  return (
    <div className="p-6 space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-semibold text-zinc-900">Broadcasts</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Send bulk WhatsApp messages via Meta Cloud API</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-zinc-900 text-white text-[12.5px] font-medium hover:bg-zinc-700 transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5" /> New broadcast
        </button>
      </div>

      {/* Recent Campaign */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h2 className="text-[13.5px] font-semibold text-zinc-900">Recent campaigns</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              {["Campaign", "Audience", "Sent", "Read", "Replied", "Status", ""].map(h => (
                <th key={h} className="px-5 py-3 text-[11px] font-medium text-zinc-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {[
              { name: "Marina Premium 3BHK", audience: "142 leads", sent: 142, read: 124, replied: 58, status: "Sent" },
              { name: "Weekly Specials — Olive & Oak", audience: "89 regulars", sent: 89, read: 76, replied: 12, status: "Sent" },
              { name: "Post-Visit Review Request", audience: "34 diners", sent: 34, read: 29, replied: 21, status: "Sent" },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-zinc-50/60 transition-colors">
                <td className="px-5 py-3.5 text-[13px] font-medium text-zinc-800">{row.name}</td>
                <td className="px-5 py-3.5 text-[12.5px] text-zinc-500">{row.audience}</td>
                <td className="px-5 py-3.5 text-[13px] tabular-nums text-zinc-700">{row.sent}</td>
                <td className="px-5 py-3.5 text-[13px] tabular-nums text-zinc-700">
                  {row.read} <span className="text-zinc-400 text-[11px]">({Math.round(row.read/row.sent*100)}%)</span>
                </td>
                <td className="px-5 py-3.5 text-[13px] tabular-nums text-zinc-700">
                  {row.replied} <span className="text-zinc-400 text-[11px]">({Math.round(row.replied/row.sent*100)}%)</span>
                </td>
                <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
                <td className="px-5 py-3.5">
                  <button className="text-zinc-300 hover:text-zinc-600 transition-colors cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page: Analytics ──────────────────────────────────────────────────────────

function AnalyticsPage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const inbound =  [62, 45, 78, 38, 55, 88, 100];
  const outbound = [88, 68, 92, 55, 76, 100, 100];
  const max = 100;

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-[18px] font-semibold text-zinc-900">Analytics</h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">Last 7 days across all workspaces</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Leads captured",       value: "432", delta: "+12.5%" },
          { label: "AnasMind enriched",    value: "386", delta: "+8.1%" },
          { label: "Messages sent",        value: "8,412", delta: "+24.0%" },
          { label: "Viewings / bookings",  value: "124", delta: "+15.2%" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-[11.5px] text-zinc-500 font-medium">{s.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[22px] font-semibold text-zinc-900 tabular-nums">{s.value}</span>
              <span className="text-[11px] font-medium text-emerald-600">{s.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-[13.5px] font-semibold text-zinc-900">Conversation volume</h2>
            <p className="text-[12px] text-zinc-400 mt-0.5">Inbound vs auto-replies — last 7 days</p>
          </div>
          <div className="flex items-center gap-4 text-[11.5px] text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-200" />Inbound</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-800" />Auto-reply</span>
          </div>
        </div>
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-end gap-4 h-36">
            {days.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                <div className="w-full flex gap-1 items-end justify-center h-full">
                  <div className="w-full rounded-t-[3px] bg-zinc-100" style={{ height: `${(inbound[i]/max)*100}%` }} />
                  <div className="w-full rounded-t-[3px] bg-zinc-800" style={{ height: `${(outbound[i]/max)*100}%` }} />
                </div>
                <span className="text-[10.5px] font-mono text-zinc-400">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Automations (Prompt Builder) ───────────────────────────────────────

function AutomationsPage({ ws }: { ws: Workspace }) {
  const [prompt, setPrompt] = useState("");
  const [building, setBuilding] = useState(false);
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);

  const stages = ["Parsing business context", "Mapping WhatsApp flows", "Connecting CRM schema", "Generating workspace"];

  const handleBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || building) return;
    setBuilding(true);
    setDone(false);
    setStage(0);
    const iv = setInterval(() => {
      setStage(p => {
        if (p >= stages.length - 1) {
          clearInterval(iv);
          setTimeout(() => { setBuilding(false); setDone(true); }, 600);
          return p;
        }
        return p + 1;
      });
    }, 900);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-[18px] font-semibold text-zinc-900">New automation</h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">Describe what you need — AnasNode generates the flow via Claude</p>
      </div>

      <form onSubmit={handleBuild} className="space-y-3">
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden focus-within:border-zinc-400 transition-colors">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. Qualify restaurant table booking requests on WhatsApp, check availability, confirm and send reminders an hour before."
            rows={4}
            className="w-full bg-transparent px-4 py-3.5 text-[13.5px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none resize-none leading-relaxed"
          />
          <div className="px-4 py-2.5 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <span className="text-[11.5px] text-zinc-400">Workspace: {ws.name}</span>
            <button
              type="submit"
              disabled={building || !prompt.trim()}
              className="flex items-center gap-1.5 h-7.5 px-3.5 rounded-lg bg-zinc-900 text-white text-[12px] font-medium hover:bg-zinc-700 transition-colors disabled:opacity-40 cursor-pointer"
            >
              {building ? (
                <>
                  <span className="flex gap-0.5">
                    {[0,1,2].map(i => <span key={i} className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: `${i*120}ms` }} />)}
                  </span>
                  Building...
                </>
              ) : (
                <><Zap className="w-3.5 h-3.5" /> Generate</>
              )}
            </button>
          </div>
        </div>

        {building && (
          <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>claude-haiku-4-5</span>
              <span>step {stage + 1}/{stages.length}</span>
            </div>
            <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-800 rounded-full transition-all duration-700"
                style={{ width: `${((stage + 1) / stages.length) * 100}%` }}
              />
            </div>
            <p className="text-[12.5px] text-zinc-600">{stages[stage]}…</p>
          </div>
        )}

        {done && (
          <div className="rounded-xl border border-zinc-200 bg-white p-4 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-emerald-600" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-zinc-800">Automation ready</p>
              <p className="text-[12.5px] text-zinc-500 mt-0.5">3 nodes generated · flow attached to {ws.name} workspace</p>
            </div>
          </div>
        )}
      </form>

      {/* Existing automations list */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h2 className="text-[13.5px] font-semibold text-zinc-900">Current automations</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {ws.automations.map(a => (
            <div key={a.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-zinc-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <Zap className={`w-4 h-4 ${a.enabled ? "text-zinc-700" : "text-zinc-300"}`} />
                <div>
                  <p className="text-[13px] font-medium text-zinc-800">{a.name}</p>
                  <p className="text-[11.5px] text-zinc-400">{a.runs} runs · {a.lastRun}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-500">{a.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [workspaces, setWorkspaces] = useState(WORKSPACES);
  const [ws, setWs] = useState(WORKSPACES[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleAutomation = (automationId: string) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id !== ws.id) return w;
      const updated = { ...w, automations: w.automations.map(a => a.id === automationId ? { ...a, enabled: !a.enabled } : a) };
      setWs(updated);
      return updated;
    }));
  };

  const tabLabel: Record<Tab, string> = {
    overview:    "Overview",
    contacts:    "Contacts",
    automations: "Automations",
    broadcasts:  "Broadcasts",
    analytics:   "Analytics",
  };

  if (!mounted) {
    return (
      <div className="flex h-screen bg-zinc-50 items-center justify-center">
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: `${i*150}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <Sidebar
        active={tab}
        onChange={setTab}
        ws={ws}
        onWsChange={(w) => { setWs(w); setTab("overview"); }}
        workspaces={workspaces}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-zinc-50">
        <Topbar title={tabLabel[tab]} ws={ws} />
        <main className="flex-1 overflow-y-auto">
          {tab === "overview"    && <OverviewPage    ws={ws} onToggle={toggleAutomation} />}
          {tab === "contacts"    && <ContactsPage    contacts={CONTACTS} />}
          {tab === "automations" && <AutomationsPage ws={ws} />}
          {tab === "broadcasts"  && <BroadcastsPage />}
          {tab === "analytics"   && <AnalyticsPage />}
        </main>
      </div>
    </div>
  );
}
