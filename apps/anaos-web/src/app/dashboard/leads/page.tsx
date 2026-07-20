"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Plus, Search, Phone, Mail, MapPin, Tag, Clock,
  X, Loader2, MessageSquare, Building2, ChevronRight,
  ArrowRight, Star, TrendingUp, AlertCircle, Check,
  Filter, RefreshCw, Edit3, Trash2, Calendar, DollarSign,
  Zap, MoreHorizontal, User
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  stage: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  preferredArea: string;
  preferredType: string;
  preferredAction: string;
  notes: string;
  tags: string;
  priority: string;
  nextFollowUpAt?: string;
  dealValue?: number;
  createdAt: string;
  property?: { id: string; title: string; referenceNumber: string };
  _count?: { activities: number };
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const STAGES = [
  { id: "new", label: "New", color: "from-violet-600/20 to-violet-600/5", border: "border-violet-500/30", dot: "bg-violet-500", count_bg: "bg-violet-500/20 text-violet-300" },
  { id: "contacted", label: "Contacted", color: "from-blue-600/20 to-blue-600/5", border: "border-blue-500/30", dot: "bg-blue-500", count_bg: "bg-blue-500/20 text-blue-300" },
  { id: "viewing_scheduled", label: "Viewing Scheduled", color: "from-amber-600/20 to-amber-600/5", border: "border-amber-500/30", dot: "bg-amber-500", count_bg: "bg-amber-500/20 text-amber-300" },
  { id: "offer_made", label: "Offer Made", color: "from-orange-600/20 to-orange-600/5", border: "border-orange-500/30", dot: "bg-orange-500", count_bg: "bg-orange-500/20 text-orange-300" },
  { id: "negotiating", label: "Negotiating", color: "from-pink-600/20 to-pink-600/5", border: "border-pink-500/30", dot: "bg-pink-500", count_bg: "bg-pink-500/20 text-pink-300" },
  { id: "closed_won", label: "Won ✓", color: "from-emerald-600/20 to-emerald-600/5", border: "border-emerald-500/30", dot: "bg-emerald-500", count_bg: "bg-emerald-500/20 text-emerald-300" },
  { id: "closed_lost", label: "Lost ✗", color: "from-red-600/20 to-red-600/5", border: "border-red-500/30", dot: "bg-red-500", count_bg: "bg-red-500/20 text-red-300" },
];

const SOURCES = ["whatsapp", "instagram", "facebook", "manual", "website", "referral"];
const PRIORITIES = ["low", "medium", "high"];
const CURRENCIES = ["AED", "GBP", "USD", "PKR"];
const PROPERTY_TYPES = ["apartment", "villa", "plot", "commercial", "office", "townhouse"];

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
};

const SOURCE_ICONS: Record<string, string> = {
  whatsapp: "💬", instagram: "📸", facebook: "👤", manual: "✏️", website: "🌐", referral: "🤝",
};

function formatBudget(min: number, max: number, currency: string) {
  if (!min && !max) return "Budget not set";
  const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n;
  if (min && max) return `${currency} ${fmt(min)} – ${fmt(max)}`;
  if (max) return `Up to ${currency} ${fmt(max)}`;
  return `From ${currency} ${fmt(min)}`;
}

// ─── Lead Card ─────────────────────────────────────────────────────────────────
function LeadCard({ lead, onEdit, onDelete, onStageChange }: {
  lead: Lead;
  onEdit: (l: Lead) => void;
  onDelete: (id: string) => void;
  onStageChange: (id: string, stage: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const tags = JSON.parse(lead.tags || "[]");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-xl p-4 space-y-3 cursor-pointer transition-all duration-200 relative"
      onClick={() => onEdit(lead)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white text-sm truncate">{lead.name}</div>
            <div className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
              <span>{SOURCE_ICONS[lead.source]}</span>
              <span className="capitalize">{lead.source}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[lead.priority]}`}>
            {lead.priority}
          </span>
          <button
            onClick={e => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Budget */}
      <div className="text-sm font-semibold text-violet-300">
        {formatBudget(lead.budgetMin, lead.budgetMax, lead.currency)}
      </div>

      {/* Preferences */}
      {(lead.preferredArea || lead.preferredType) && (
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {[lead.preferredType && lead.preferredType, lead.preferredArea].filter(Boolean).join(" in ")}
          </span>
        </div>
      )}

      {/* Linked property */}
      {lead.property && (
        <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg px-2.5 py-1.5">
          <Building2 className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{lead.property.title}</span>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-white/50">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
        {lead.phone && (
          <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
            <MessageSquare className="w-3 h-3" /> WhatsApp
          </a>
        )}
        {lead.nextFollowUpAt && (
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <Clock className="w-3 h-3" />
            {new Date(lead.nextFollowUpAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-white/30 ml-auto">
          <Zap className="w-3 h-3" />{lead._count?.activities || 0}
        </div>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-10 right-3 z-30 bg-[#1a1d27] border border-white/15 rounded-xl shadow-2xl p-1.5 min-w-[140px]"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => { onEdit(lead); setShowMenu(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button onClick={() => { onDelete(lead.id); setShowMenu(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Lead Modal ────────────────────────────────────────────────────────────────
function LeadModal({ lead, onClose, onSave }: { lead?: Lead | null; onClose: () => void; onSave: () => void }) {
  const isEdit = !!lead;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: lead?.name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    source: lead?.source || "whatsapp",
    stage: lead?.stage || "new",
    budgetMin: lead?.budgetMin || 0,
    budgetMax: lead?.budgetMax || 0,
    currency: lead?.currency || "AED",
    preferredArea: lead?.preferredArea || "",
    preferredType: lead?.preferredType || "",
    preferredAction: lead?.preferredAction || "buy",
    notes: lead?.notes || "",
    priority: lead?.priority || "medium",
  });

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const url = isEdit ? `/api/leads/${lead!.id}` : "/api/leads";
      const method = isEdit ? "PATCH" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      onSave();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{isEdit ? "Edit Lead" : "Add New Lead"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-white/60 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Full Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Ahmed Al Rashid"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">WhatsApp / Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+971 50 123 4567"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
          </div>

          {/* Source + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Source</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm">
                {SOURCES.map(s => <option key={s} value={s} className="bg-slate-900 capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm">
                {PRIORITIES.map(p => <option key={p} value={p} className="bg-slate-900 capitalize">{p}</option>)}
              </select>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Budget Range</label>
            <div className="grid grid-cols-3 gap-3">
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm">
                {CURRENCIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
              <input type="number" value={form.budgetMin} onChange={e => setForm(f => ({ ...f, budgetMin: Number(e.target.value) }))}
                placeholder="Min"
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
              <input type="number" value={form.budgetMax} onChange={e => setForm(f => ({ ...f, budgetMax: Number(e.target.value) }))}
                placeholder="Max"
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
          </div>

          {/* Property Preferences */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Looking to</label>
              <select value={form.preferredAction} onChange={e => setForm(f => ({ ...f, preferredAction: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm">
                <option value="buy" className="bg-slate-900">Buy</option>
                <option value="rent" className="bg-slate-900">Rent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Property Type</label>
              <select value={form.preferredType} onChange={e => setForm(f => ({ ...f, preferredType: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm">
                <option value="" className="bg-slate-900">Any</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t} className="bg-slate-900 capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Preferred Area</label>
              <input value={form.preferredArea} onChange={e => setForm(f => ({ ...f, preferredArea: e.target.value }))}
                placeholder="e.g. Downtown"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
          </div>

          {/* Stage */}
          <div>
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Pipeline Stage</label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map(s => (
                <button key={s.id} type="button"
                  onClick={() => setForm(f => ({ ...f, stage: s.id }))}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${form.stage === s.id ? "bg-violet-600/40 border-violet-500/60 text-violet-200" : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3} placeholder="Any additional notes about this lead..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm resize-none" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || !form.name.trim()}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl text-white text-sm font-medium transition-all flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Lead"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Kanban Page ──────────────────────────────────────────────────────────
export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterSource) params.set("source", filterSource);
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [search, filterSource]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    fetchLeads();
  };

  const handleStageChange = async (id: string, stage: string) => {
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage }) });
    fetchLeads();
  };

  const handleEdit = (l: Lead) => { setEditingLead(l); setShowModal(true); };

  // Stats
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.priority === "high").length;
  const wonLeads = leads.filter(l => l.stage === "closed_won").length;
  const totalDealValue = leads.filter(l => l.stage === "closed_won").reduce((acc, l) => acc + (l.dealValue || 0), 0);

  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      <div className="px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              Lead Pipeline
            </h1>
            <p className="text-white/50 mt-1.5">Track and manage your real estate leads</p>
          </div>
          <button
            onClick={() => { setEditingLead(null); setShowModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium text-sm transition-all shadow-lg shadow-violet-600/25"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: totalLeads, color: "text-violet-400" },
            { label: "Hot Leads 🔥", value: hotLeads, color: "text-red-400" },
            { label: "Deals Won", value: wonLeads, color: "text-emerald-400" },
            { label: "Pipeline Value", value: totalDealValue > 0 ? `${totalDealValue.toLocaleString()}` : "—", color: "text-amber-400" },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
          </div>
          <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50">
            <option value="" className="bg-slate-900">All Sources</option>
            {SOURCES.map(s => <option key={s} value={s} className="bg-slate-900 capitalize">{s}</option>)}
          </select>
          <button onClick={fetchLeads} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-6" style={{ minHeight: "60vh" }}>
            {STAGES.map(stage => {
              const stageLeads = leads.filter(l => l.stage === stage.id);
              return (
                <div key={stage.id} className="flex-shrink-0 w-72">
                  {/* Column header */}
                  <div className={`flex items-center justify-between mb-3 px-3 py-2.5 rounded-xl bg-gradient-to-b ${stage.color} border ${stage.border}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                      <span className="text-sm font-semibold text-white">{stage.label}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stage.count_bg}`}>
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {stageLeads.map(lead => (
                        <LeadCard key={lead.id} lead={lead} onEdit={handleEdit} onDelete={handleDelete} onStageChange={handleStageChange} />
                      ))}
                    </AnimatePresence>
                    {stageLeads.length === 0 && (
                      <div className="text-center py-8 text-white/20 text-xs border border-dashed border-white/10 rounded-xl">
                        No leads here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <LeadModal
            lead={editingLead}
            onClose={() => { setShowModal(false); setEditingLead(null); }}
            onSave={fetchLeads}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
