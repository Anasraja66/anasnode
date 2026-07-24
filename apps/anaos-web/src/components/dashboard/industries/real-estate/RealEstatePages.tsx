"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Plus, Search, Users, MapPin, MessageSquare,
  Loader2, X, Bed, Bath, Square
} from "lucide-react";

// ─── Properties Embed ─────────────────────────────────────────────────────────

export function PropertiesEmbedPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "", type: "apartment", status: "available", price: 0,
    currency: "AED", priceType: "sale", bedrooms: 0, bathrooms: 0, size: 0,
    city: "", area: "", country: "UAE", description: "", permitNumber: "",
  });
  const [saving, setSaving] = useState(false);

  const STATUSES = ["available", "under_offer", "sold", "rented"];
  const STATUS_COLORS: Record<string, string> = {
    available: "bg-emerald-100 text-emerald-700 border-emerald-200",
    under_offer: "bg-amber-100 text-amber-700 border-amber-200",
    sold: "bg-red-100 text-red-700 border-red-200",
    rented: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterStatus) params.set("status", filterStatus);
      const res = await fetch(`/api/properties?${params}`);
      const data = await res.json();
      setProperties(data.properties || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, [search, filterStatus]);

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    await fetch("/api/properties", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setShowModal(false);
    setForm({ title: "", type: "apartment", status: "available", price: 0, currency: "AED", priceType: "sale", bedrooms: 0, bathrooms: 0, size: 0, city: "", area: "", country: "UAE", description: "", permitNumber: "" });
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="px-8 py-6 border-b border-zinc-200 bg-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-violet-600" /> Properties
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Manage your real estate listings — UAE, UK & USA</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Listings", value: properties.length },
            { label: "Available", value: properties.filter(p => p.status === "available").length },
            { label: "Under Offer", value: properties.filter(p => p.status === "under_offer").length },
            { label: "Total Leads", value: properties.reduce((acc: number, p: any) => acc + (p._count?.leads || 0), 0) },
          ].map(s => (
            <div key={s.label} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-zinc-900">{s.value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 flex gap-3 bg-white border-b border-zinc-100">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search properties..."
            className="w-full border border-zinc-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400 text-zinc-700">
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {/* Property Grid */}
      <div className="px-8 py-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-400 font-medium">No properties yet</p>
            <p className="text-zinc-400 text-sm mt-1">Add your first listing to get started</p>
            <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-all">
              Add Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {properties.map((p: any) => {
              const imgs = JSON.parse(p.images || "[]");
              return (
                <div key={p.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="h-44 bg-zinc-100 relative overflow-hidden">
                    {imgs[0] ? (
                      <img src={imgs[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50">
                        <Building2 className="w-12 h-12 text-violet-200" />
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${STATUS_COLORS[p.status] || "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
                      {p.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-zinc-900 text-sm line-clamp-2 leading-snug">{p.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{[p.area, p.city, p.country].filter(Boolean).join(", ")}
                    </p>
                    <div className="text-xl font-bold text-zinc-900 mt-3">
                      {p.currency} {Number(p.price).toLocaleString()}
                      {p.priceType === "rent_monthly" && <span className="text-sm font-normal text-zinc-400">/mo</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                      {p.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms}</span>}
                      {p.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms}</span>}
                      {p.size > 0 && <span className="flex items-center gap-1"><Square className="w-3 h-3" />{p.size} {p.sizeUnit}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                      <span className="text-xs text-zinc-400">{p._count?.leads || 0} leads • <span className="font-mono">{p.referenceNumber}</span></span>
                      <button onClick={async (e) => { e.stopPropagation(); if (!confirm("Delete this property?")) return; await fetch(`/api/properties/${p.id}`, { method: "DELETE" }); fetchProperties(); }}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900">Add New Property</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-all"><X className="w-4 h-4 text-zinc-500" /></button>
              </div>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Property Title *"
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400 text-zinc-700">
                  {["apartment", "villa", "plot", "commercial", "office", "townhouse"].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400 text-zinc-700">
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400 text-zinc-700">
                  {["AED", "GBP", "USD", "PKR", "EUR"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="Price"
                  className="col-span-2 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input type="number" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: Number(e.target.value) }))} placeholder="Beds"
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400" />
                <input type="number" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: Number(e.target.value) }))} placeholder="Baths"
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400" />
                <input type="number" value={form.size} onChange={e => setForm(f => ({ ...f, size: Number(e.target.value) }))} placeholder="Sqft"
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400 text-zinc-700">
                  {["UAE", "UK", "USA", "Pakistan", "Saudi Arabia", "Qatar"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City"
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400" />
                <input value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="Area/Community"
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400" />
              </div>
              <input value={form.permitNumber} onChange={e => setForm(f => ({ ...f, permitNumber: e.target.value }))} placeholder="RERA Permit No. (Dubai)"
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400" />
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-zinc-200 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 transition-all">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Add Property
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Leads Embed ──────────────────────────────────────────────────────────────

export function LeadsEmbedPage() {
  const STAGES = [
    { id: "new", label: "New Inquiry", color: "bg-violet-100 text-violet-700 border-violet-200" },
    { id: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { id: "viewing_scheduled", label: "Viewing", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { id: "offer_made", label: "Offer Made", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { id: "negotiating", label: "Negotiating", color: "bg-pink-100 text-pink-700 border-pink-200" },
    { id: "closed_won", label: "Won ✓", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { id: "closed_lost", label: "Lost ✗", color: "bg-red-100 text-red-700 border-red-200" },
  ];

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", source: "whatsapp", stage: "new",
    budgetMax: 0, currency: "AED", preferredArea: "", priority: "medium",
  });
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, [search]);

  const handleSaveLead = async () => {
    if (!form.name) return;
    setSaving(true);
    await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setShowAdd(false);
    setForm({ name: "", phone: "", source: "whatsapp", stage: "new", budgetMax: 0, currency: "AED", preferredArea: "", priority: "medium" });
    fetchLeads();
  };

  const updateStage = async (id: string, stage: string) => {
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage }) });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="px-8 py-6 border-b border-zinc-200 bg-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" /> Lead Pipeline
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Track every lead from first contact to closing</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: leads.length },
            { label: "Hot 🔥", value: leads.filter((l: any) => l.priority === "high").length },
            { label: "Viewings Scheduled", value: leads.filter((l: any) => l.stage === "viewing_scheduled").length },
            { label: "Deals Won", value: leads.filter((l: any) => l.stage === "closed_won").length },
          ].map(s => (
            <div key={s.label} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-zinc-900">{s.value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-8 py-4 bg-white border-b border-zinc-100">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads by name or phone..."
            className="w-full border border-zinc-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="px-8 py-6 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>
        ) : (
          <div className="flex gap-5" style={{ minWidth: "max-content", minHeight: "60vh" }}>
            {STAGES.map(stage => {
              const stageLeads = leads.filter((l: any) => l.stage === stage.id);
              return (
                <div key={stage.id} className="w-64 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${stage.color}`}>{stage.label}</span>
                    <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                  </div>
                  <div className="space-y-3">
                    {stageLeads.map((lead: any) => (
                      <div key={lead.id} className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-zinc-900 truncate">{lead.name}</div>
                            <div className="text-xs text-zinc-400 capitalize">{lead.source}</div>
                          </div>
                        </div>
                        {lead.budgetMax > 0 && (
                          <div className="text-sm font-bold text-violet-600 mb-2">
                            {lead.currency} {Number(lead.budgetMax).toLocaleString()} max
                          </div>
                        )}
                        {lead.preferredArea && (
                          <p className="text-xs text-zinc-400 mb-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{lead.preferredArea}
                          </p>
                        )}
                        {lead.phone && (
                          <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 mb-3 transition-colors font-medium">
                            <MessageSquare className="w-3 h-3" /> {lead.phone}
                          </a>
                        )}
                        <select value={lead.stage} onChange={e => updateStage(lead.id, e.target.value)}
                          className="w-full text-xs border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-600 focus:outline-none focus:border-violet-400 bg-zinc-50">
                          {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </div>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="border-2 border-dashed border-zinc-200 rounded-xl py-8 text-center text-xs text-zinc-300">
                        No leads
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-900">Add New Lead</h3>
                <button onClick={() => setShowAdd(false)} className="p-1.5 hover:bg-zinc-100 rounded-lg"><X className="w-4 h-4 text-zinc-500" /></button>
              </div>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full Name *"
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400" />
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="WhatsApp / Phone"
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400 text-zinc-700">
                  {["whatsapp", "instagram", "facebook", "manual", "website", "referral"].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400 text-zinc-700">
                  {["low", "medium", "high"].map(p => <option key={p} value={p} className="capitalize">{p} priority</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                  className="border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400 text-zinc-700">
                  {["AED", "GBP", "USD", "PKR"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" value={form.budgetMax} onChange={e => setForm(f => ({ ...f, budgetMax: Number(e.target.value) }))} placeholder="Max Budget"
                  className="col-span-2 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400" />
              </div>
              <input value={form.preferredArea} onChange={e => setForm(f => ({ ...f, preferredArea: e.target.value }))} placeholder="Preferred Area (e.g. Downtown Dubai)"
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400" />
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-zinc-200 rounded-xl text-sm text-zinc-600 hover:bg-zinc-50 transition-all">Cancel</button>
                <button onClick={handleSaveLead} disabled={saving || !form.name}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Add Lead
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
