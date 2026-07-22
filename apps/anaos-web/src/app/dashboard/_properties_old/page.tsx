"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Plus, Search, Filter, MapPin, Bed, Bath,
  Square, Tag, Eye, Edit3, Trash2, X, Check, ChevronDown,
  Star, Share2, TrendingUp, Home, Building, Layers,
  DollarSign, Users, ArrowUpRight, Loader2, Upload,
  Globe, FileText, RefreshCw
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  currency: string;
  priceType: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  sizeUnit: string;
  city: string;
  area: string;
  country: string;
  address: string;
  images: string;
  amenities: string;
  permitNumber: string;
  referenceNumber: string;
  featured: boolean;
  viewCount: number;
  createdAt: string;
  _count?: { leads: number };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PROPERTY_TYPES = ["apartment", "villa", "plot", "commercial", "office", "townhouse"];
const STATUSES = ["available", "under_offer", "sold", "rented"];
const CURRENCIES = ["AED", "GBP", "USD", "PKR", "EUR"];
const COUNTRIES = ["UAE", "UK", "USA", "Pakistan", "Saudi Arabia", "Qatar"];
const PRICE_TYPES = ["sale", "rent_monthly", "rent_yearly"];
const AMENITIES_LIST = ["Parking", "Pool", "Gym", "Security", "Balcony", "Garden", "Maid Room", "Study", "Storage", "Central AC", "Built-in Wardrobes", "Kitchen Appliances", "Broadband", "Near Metro", "Sea View", "City View"];

const STATUS_COLORS: Record<string, string> = {
  available: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  under_offer: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  sold: "bg-red-500/20 text-red-400 border-red-500/30",
  rented: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const TYPE_ICONS: Record<string, typeof Home> = {
  apartment: Building2, villa: Home, plot: Layers, commercial: Building,
  office: Building2, townhouse: Home,
};

function formatPrice(price: number, currency: string, priceType: string) {
  const formatted = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price);
  const suffix = priceType === "rent_monthly" ? "/mo" : priceType === "rent_yearly" ? "/yr" : "";
  return `${currency} ${formatted}${suffix}`;
}

// ─── Property Card ─────────────────────────────────────────────────────────────
function PropertyCard({ property, onEdit, onDelete }: { property: Property; onEdit: (p: Property) => void; onDelete: (id: string) => void }) {
  const images = JSON.parse(property.images || "[]");
  const TypeIcon = TYPE_ICONS[property.type] || Building2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/20"
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        {images.length > 0 ? (
          <img src={images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TypeIcon className="w-16 h-16 text-white/20" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${STATUS_COLORS[property.status]}`}>
            {property.status.replace("_", " ").toUpperCase()}
          </span>
        </div>
        {property.featured && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/90 text-white flex items-center gap-1 backdrop-blur-sm">
              <Star className="w-3 h-3 fill-current" /> Featured
            </span>
          </div>
        )}
        {/* Actions on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button onClick={() => onEdit(property)} className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white transition-all">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(property.id)} className="p-2 bg-red-500/60 hover:bg-red-500/80 backdrop-blur-sm rounded-xl text-white transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">{property.title}</h3>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-white/50 text-xs">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>{[property.area, property.city, property.country].filter(Boolean).join(", ")}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-xl font-bold text-white">
          {formatPrice(property.price, property.currency, property.priceType)}
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-white/60 text-xs">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /><span>{property.bedrooms} Bed</span></div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /><span>{property.bathrooms} Bath</span></div>
          )}
          {property.size > 0 && (
            <div className="flex items-center gap-1"><Square className="w-3.5 h-3.5" /><span>{property.size} {property.sizeUnit}</span></div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{property.viewCount}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{property._count?.leads || 0} leads</span>
          </div>
          <span className="text-xs text-white/30 font-mono">{property.referenceNumber}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Add/Edit Modal ────────────────────────────────────────────────────────────
function PropertyModal({ property, onClose, onSave }: { property?: Property | null; onClose: () => void; onSave: () => void }) {
  const isEdit = !!property;
  const [loading, setLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property ? JSON.parse(property.amenities || "[]") : []
  );
  const [form, setForm] = useState({
    title: property?.title || "",
    description: property?.description || "",
    type: property?.type || "apartment",
    status: property?.status || "available",
    price: property?.price || 0,
    currency: property?.currency || "AED",
    priceType: property?.priceType || "sale",
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    size: property?.size || 0,
    sizeUnit: property?.sizeUnit || "sqft",
    city: property?.city || "",
    area: property?.area || "",
    country: property?.country || "UAE",
    address: property?.address || "",
    permitNumber: property?.permitNumber || "",
    referenceNumber: property?.referenceNumber || "",
    featured: property?.featured || false,
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const body = { ...form, amenities: selectedAmenities, images: JSON.parse(property?.images || "[]") };
      const url = isEdit ? `/api/properties/${property!.id}` : "/api/properties";
      const method = isEdit ? "PATCH" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      onSave();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-white">{isEdit ? "Edit Property" : "Add New Property"}</h2>
            <p className="text-sm text-white/50 mt-0.5">Fill in the property details below</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Property Title *</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Luxurious 3BR Apartment in Downtown Dubai"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm"
            />
          </div>

          {/* Type + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm capitalize">
                {PROPERTY_TYPES.map(t => <option key={t} value={t} className="bg-slate-900 capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm">
                {STATUSES.map(s => <option key={s} value={s} className="bg-slate-900">{s.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Currency</label>
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm">
                {CURRENCIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>
            <div className="col-span-1">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Price</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
            <div className="col-span-1">
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Price Type</label>
              <select value={form.priceType} onChange={e => setForm(f => ({ ...f, priceType: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm">
                {PRICE_TYPES.map(p => <option key={p} value={p} className="bg-slate-900">{p.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Bedrooms</label>
              <input type="number" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Bathrooms</label>
              <input type="number" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Size (sqft)</label>
              <input type="number" value={form.size} onChange={e => setForm(f => ({ ...f, size: Number(e.target.value) }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Country</label>
              <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 text-sm">
                {COUNTRIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">City</label>
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="e.g. Dubai, London"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Area / Community</label>
              <input value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                placeholder="e.g. Downtown, Marina"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
          </div>

          {/* Permit Number (Dubai RERA) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">
                Permit No. <span className="text-violet-400">(RERA - Dubai)</span>
              </label>
              <input value={form.permitNumber} onChange={e => setForm(f => ({ ...f, permitNumber: e.target.value }))}
                placeholder="e.g. 7124759872"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Reference No.</label>
              <input value={form.referenceNumber} onChange={e => setForm(f => ({ ...f, referenceNumber: e.target.value }))}
                placeholder="Auto-generated if empty"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Describe the property in detail..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm resize-none" />
          </div>

          {/* Amenities */}
          <div>
            <label className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3 block">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map(a => (
                <button key={a} type="button"
                  onClick={() => setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${selectedAmenities.includes(a) ? "bg-violet-600/30 border-violet-500/50 text-violet-300" : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <button onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
              className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${form.featured ? "bg-amber-500" : "bg-white/20"}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${form.featured ? "left-6" : "left-1"}`} />
            </button>
            <div>
              <div className="text-sm font-medium text-white">Featured Property</div>
              <div className="text-xs text-white/50">Featured properties are highlighted and shown first</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || !form.title.trim()}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl text-white text-sm font-medium transition-all flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Property"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterStatus) params.set("status", filterStatus);
      if (filterType) params.set("type", filterType);
      const res = await fetch(`/api/properties?${params}`);
      const data = await res.json();
      setProperties(data.properties || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, [search, filterStatus, filterType]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    setDeleting(id);
    await fetch(`/api/properties/${id}`, { method: "DELETE" });
    setDeleting(null);
    fetchProperties();
  };

  const handleEdit = (p: Property) => { setEditingProperty(p); setShowModal(true); };

  // Stats
  const available = properties.filter(p => p.status === "available").length;
  const sold = properties.filter(p => p.status === "sold").length;
  const rented = properties.filter(p => p.status === "rented").length;
  const totalLeads = properties.reduce((acc, p) => acc + (p._count?.leads || 0), 0);

  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-violet-400" />
              </div>
              Properties
            </h1>
            <p className="text-white/50 mt-1.5">Manage your real estate portfolio</p>
          </div>
          <button
            onClick={() => { setEditingProperty(null); setShowModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium text-sm transition-all shadow-lg shadow-violet-600/25"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: properties.length, icon: Building2, color: "violet" },
            { label: "Available", value: available, icon: Check, color: "emerald" },
            { label: "Sold / Rented", value: sold + rented, icon: TrendingUp, color: "amber" },
            { label: "Total Leads", value: totalLeads, icon: Users, color: "blue" },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, area, city, reference..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm"
            />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50">
            <option value="" className="bg-slate-900">All Status</option>
            {STATUSES.map(s => <option key={s} value={s} className="bg-slate-900">{s.replace("_", " ")}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50">
            <option value="" className="bg-slate-900">All Types</option>
            {PROPERTY_TYPES.map(t => <option key={t} value={t} className="bg-slate-900 capitalize">{t}</option>)}
          </select>
          <button onClick={fetchProperties} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto">
              <Building2 className="w-10 h-10 text-white/20" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white/60">No Properties Yet</h3>
              <p className="text-white/30 text-sm mt-1">Start by adding your first property listing</p>
            </div>
            <button
              onClick={() => { setEditingProperty(null); setShowModal(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-white font-medium text-sm transition-all mt-2"
            >
              <Plus className="w-4 h-4" /> Add First Property
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {properties.map(p => (
                <PropertyCard key={p.id} property={p} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <PropertyModal
            property={editingProperty}
            onClose={() => { setShowModal(false); setEditingProperty(null); }}
            onSave={fetchProperties}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
