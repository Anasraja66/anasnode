"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Zap,
  Radio,
  BarChart2,
  Settings,
  MessageSquare,
  Inbox,
  Plus,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  PenTool,
  Layers,
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
  Loader2,
  GitBranch,
  Clock,
  Hash,
  Send,
  UploadCloud,
  Trash2,
  FileText,
  CheckCircle2,
  LogOut,
  Home,
  AlertCircle,
  CheckSquare,
  Building2,
  Utensils,
  Stethoscope,
  Sliders,
  Globe,
  Megaphone,
  Plug,
  TrendingUp,
  Pin,
  ChevronLeft,
  PhoneCall,
  Calendar,
  LayoutTemplate,
} from "lucide-react";
import { InboxPage } from "@/components/dashboard/InboxPage";
import { ContactsHub } from "@/components/dashboard/ContactsHub";
import { IndustryShell } from "@/components/dashboard/IndustryShell";
import { IndustryWelcome } from "@/components/dashboard/IndustryWelcome";
import { CallsPage } from "@/components/dashboard/CallsPage";
import { getIndustryPreset, type IndustryPreset } from "@/lib/industry/presets";
import { AnaosAIHub } from "@/components/dashboard/AnaosAIHub";
import { VoiceAgentHub } from "@/components/dashboard/VoiceAgentHub";
import { BroadcastsHub } from "@/components/dashboard/BroadcastsHub";
import { AnaosLogo } from "@/components/ui/AnaosLogo";
import TeamSettingsPage from "@/components/dashboard/TeamSettingsPage";
import TodayBookingsWidget from "@/components/dashboard/TodayBookingsWidget";
import ChannelStatusWidget from "@/components/dashboard/ChannelStatusWidget";
import BrandIcon from "@/components/ui/BrandIcon";
import { ApprovalsPage } from "@/components/dashboard/ApprovalsPage";
import { PropertiesEmbedPage, LeadsEmbedPage } from "@/components/dashboard/industries/real-estate/RealEstatePages";
import { CleaningBookingsPage } from "@/components/dashboard/industries/cleaning/CleaningBookingsPage";
import { ConstructionProjectsPage } from "@/components/dashboard/industries/construction/ConstructionProjectsPage";
import { MaintenanceOrdersPage } from "@/components/dashboard/industries/maintenance/MaintenanceOrdersPage";
import { ITTicketsPage } from "@/components/dashboard/industries/it/ITTicketsPage";
import { FencingEstimatesPage } from "@/components/dashboard/industries/fencing/FencingEstimatesPage";
import { BookingsHub } from "@/components/dashboard/BookingsHub";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Tab = "voice_agent" | "ai_agent" | "calls" | "overview" | "inbox" | "approvals" | "contacts" | "bookings" | "automations" | "broadcasts" | "analytics" | "team" | "properties" | "leads" | "cleaning_bookings" | "construction_projects" | "maintenance_orders" | "it_tickets" | "fencing_estimates";

type Workspace = {
  id: string;
  name: string;
  industry: string;
  slug: string;
  status: "live" | "draft" | "paused";
  version: number;
  automations: Automation[];
};

type Automation = {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  status?: "active" | "draft" | "needs_connection";
  requiredProvider?: "meta" | "google" | "commerce" | "others" | null;
  requiredIntegrations?: string[];
  missingIntegrations?: string[];
  runs: number;
  lastRun: string;
};

type Contact = {
  id: string;
  name: string;
  phone: string;
  industry: string;
  stage: string;
  lastMessage: string;
  time: string;
  checked?: boolean;
};

type FAQ = {
  q: string;
  a: string;
};

type TrainedFile = {
  name: string;
  size: string;
  status: "Trained" | "Training";
  progress: number;
};


import { FastApiClient } from "@/lib/api/fastapi";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// â”€â”€â”€ OS Home Component (Manychat-inspired but Industry-Aware) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { PromptBox } from "@/components/landing/PromptBox";
import { Typewriter } from "@/components/landing/Typewriter";
import { WordRotator } from "@/components/landing/WordRotator";

// â”€â”€â”€ OS Home Component (Premium SaaS - Business Owner Focus) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";

function DashboardHome({ ws, preset, roiMetrics }: { ws: Workspace; preset: IndustryPreset; roiMetrics?: any }) {
  const Icon = preset.icon;
  const [showConnectors, setShowConnectors] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [dateStr, setDateStr] = useState("");

  const [promptMode, setPromptMode] = useState<"new" | "edit">("new");
  const [recentWorkflow, setRecentWorkflow] = useState<any>(null);
  const [activeChannel, setActiveChannel] = useState<string>("All channels");

  useEffect(() => {
    fetch("/api/v1/workflows")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.workflows && data.workflows.length > 0) {
          const sorted = [...data.workflows].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setRecentWorkflow(sorted[0]);
          setPromptMode("edit");
        }
      })
      .catch(() => {});
  }, []);

  // Client-only: avoids SSR/client hydration mismatch
  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good morning");
    else if (hr < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    setDateStr(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  // Note: businessConnectors SVGs removed to use BrandIcon natively
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };



  let availableChannels = ["WhatsApp"];
  if (recentWorkflow?.requiredIntegrations?.length > 0) {
    availableChannels = recentWorkflow.requiredIntegrations.map((c: string) => {
      if (c.toLowerCase() === "whatsapp") return "WhatsApp";
      if (c.toLowerCase() === "facebook") return "Facebook";
      if (c.toLowerCase() === "instagram") return "Instagram";
      if (c.toLowerCase() === "voice") return "Voice";
      return c.charAt(0).toUpperCase() + c.slice(1);
    });
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-[28px] relative z-10"
    >
      <OnboardingWizard />
      {/* Background foundation removed for cleaner look */}
      <div className="relative z-10 space-y-[28px] w-full font-sans">
        {/* Welcome Row (ManyChat Exact Style) */}
        <div className="flex flex-col justify-center min-h-[59px] w-full mb-8">
          <h1 className="text-[32px] font-bold text-zinc-900 mb-2 leading-none" suppressHydrationWarning>
            {greeting ? `${greeting}, Operator!` : `Welcome, Operator!`}
          </h1>
          <div className="flex items-center gap-3 text-[13px] text-zinc-600 font-medium" suppressHydrationWarning>
            <span>1 connected channel</span>
            <span className="text-zinc-300">Â·</span>
            <span>Workspace: <span className="font-bold text-zinc-800">{ws.name}</span></span>
          </div>
          <div className="mt-3">
            <button className="text-[13px] font-semibold text-sky-500 hover:underline cursor-pointer">
              See Insights
            </button>
          </div>
          
          <div className="flex items-center gap-6 mt-8 border-b border-zinc-200 w-full">
            <button 
              onClick={() => setActiveChannel("All channels")}
              className={`text-[14px] transition-colors pb-3 -mb-[1px] ${activeChannel === "All channels" ? "font-bold text-zinc-900 border-b-2 border-zinc-900" : "font-medium text-zinc-500 hover:text-zinc-700"}`}
            >
              All channels
            </button>
            {availableChannels.map((channel: string) => (
              <button 
                key={channel}
                onClick={() => setActiveChannel(channel)}
                className={`text-[14px] flex items-center gap-1.5 transition-colors pb-3 -mb-[1px] ${activeChannel === channel ? "font-bold text-zinc-900 border-b-2 border-zinc-900" : "font-medium text-zinc-500 hover:text-zinc-700"}`}
              >
                {channel}
                {channel === "WhatsApp" && <span className="bg-sky-500 text-white text-[9px] font-bold px-1.5 py-[1px] rounded-[3px] uppercase tracking-wide">Upgrade</span>}
              </button>
            ))}
          </div>
          
          <div className="mt-8 flex justify-between items-center w-full">
             <h2 className="text-[20px] font-bold text-zinc-900">
               {activeChannel === "All channels" 
                 ? "Set up your connected channels to drive conversations"
                 : `Set up ${activeChannel} basics to drive conversations`}
             </h2>
             <div className="flex items-center gap-3">
               <span className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-500">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 Production
               </span>
               <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 text-[12px] font-bold hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer">
                 <RefreshCw className="w-3.5 h-3.5" /> Refresh
               </button>
             </div>
          </div>
        </div>

        {/* V2 ROI Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: "Leads Captured", value: roiMetrics?.leadsThisWeek || "0", sub: "Last 7 days" },
            { title: "Missed Calls Recovered", value: roiMetrics?.leadsRecovered || "0", sub: "AI assisted" },
            { title: "Appointments Booked", value: roiMetrics?.appointmentsBooked || "0", sub: "Via WhatsApp" },
            { title: "AI Replies", value: roiMetrics?.aiReplies || "0", sub: "Auto-pilot tasks" },
            { title: "Avg Response Time", value: roiMetrics?.avgResponseSec ? `${roiMetrics.avgResponseSec}s` : "0s", sub: "Instant AI" }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm hover:border-zinc-300 transition-all duration-300">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.05em] mb-1 truncate">{stat.title}</p>
              <div className="text-[24px] font-bold text-zinc-900 leading-none">{stat.value}</div>
              <p className="text-[11px] text-zinc-500 mt-2 font-medium">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Compact Prompt Input Card */}
        <motion.div variants={itemVariants} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm relative z-20">
          <h2 className="text-[16px] font-bold text-zinc-900 mb-3">Ask Anaos AI to build or edit automations</h2>
          <PromptBox 
            staticPlaceholder="e.g. Build a lead qualification agent for WhatsApp and Facebook"
            mode={promptMode}
            onModeChange={setPromptMode}
            automationName={recentWorkflow?.name}
            initialValue={promptMode === "edit" ? (recentWorkflow?.description || "") : ""}
            onSubmitPrompt={(prompt) => {
              const event = new CustomEvent("anaos-open-onboarding", { detail: { prompt } });
              window.dispatchEvent(event);
            }}
          />
          
          {/* Connectors Banner */}
          <AnimatePresence>
            {showConnectors && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-4 w-full"
              >
                <div className="bg-[#FAFAFA] border border-zinc-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-4 hover:border-zinc-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm text-sky-500">
                    <Plug className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-[13px] font-bold text-zinc-900 leading-tight">Connectors are now available.</h4>
                    <p className="text-[12px] text-zinc-500 mt-0.5 font-medium font-sans">Connectors allow Anaos to interact with apps directly in conversations.</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => setShowConnectors(false)}
                      className="text-[12px] font-medium text-zinc-500 hover:text-zinc-800 transition-colors font-sans"
                    >
                      Dismiss
                    </button>
                    <button 
                      onClick={() => window.dispatchEvent(new Event("anaos-open-onboarding"))}
                      className="bg-[#0A6BFF] hover:bg-blue-600 text-white shadow-sm text-[12px] font-semibold px-4 py-1.5 rounded-lg transition-all shadow-sm font-sans"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* THE CORE VISUALIZER (4-Way Architecture) - Keep below */}
        {/* THE CORE VISUALIZER (4-Way Architecture) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* LEFT: Messaging Channels */}
          <motion.div 
            variants={itemVariants}
            className="bg-[#DDEBFF] border-none rounded-xl p-6 space-y-6 shadow-sm transition-all duration-300 flex flex-col group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white text-[#0A6BFF] flex items-center justify-center shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-zinc-900">Messaging</h3>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { name: "WhatsApp Business", id: "whatsapp", href: "/dashboard/integrations/whatsapp" },
                { name: "Instagram DM", id: "instagram", href: "/dashboard/integrations/instagram" },
                { name: "FB Messenger", id: "facebook", href: "/dashboard/integrations/facebook" },
                { name: "Email & SMS", id: "smtp", href: "/dashboard/integrations/email" }
              ].map((c) => (
                <Link href={c.href} key={c.name} className="bg-white border-none px-4 py-3.5 rounded-xl text-[13px] font-bold text-zinc-800 shadow-sm flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group/item block">
                  <div className="flex items-center gap-3">
                    <BrandIcon id={c.id} className="w-5 h-5 shrink-0" />
                    <span>{c.name}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* CENTER: Voice Integration */}
          <div className="flex flex-col gap-6">
            <Link 
              href="/dashboard/integrations"
              className="bg-[#DDEBFF] border-none rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group transition-colors block"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0A6BFF] mb-4 relative shadow-sm group-hover:scale-110 transition-transform">
                 <PhoneCall className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[15px] font-bold text-zinc-900">Voice Agent</h3>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    ACTIVE
                  </p>
                </div>
              </div>
            </Link>

            {/* BOTTOM: Content & Growth */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#DDEBFF] border-none rounded-xl p-6 space-y-6 shadow-sm transition-all duration-300 flex-1 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white text-[#0A6BFF] flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-zinc-900">Growth AI</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "TikTok", id: "tiktok", href: "/dashboard/integrations" },
                  { name: "YouTube", id: "youtube", href: "/dashboard/integrations" },
                  { name: "LinkedIn", id: "linkedin", href: "/dashboard/integrations" },
                  { name: "Blog", id: "blog", href: "/dashboard/integrations" }
                ].map((c) => (
                  <Link href={c.href} key={c.name} className="bg-white border-none px-3 py-3 rounded-xl text-[12px] font-bold text-zinc-800 shadow-sm flex items-center gap-2.5 hover:bg-zinc-50 transition-colors cursor-pointer block">
                    <div className="flex items-center gap-2.5">
                      <BrandIcon id={c.id} className="w-5 h-5 shrink-0" />
                      <span className="truncate">{c.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Business Integrations */}
          <motion.div 
            variants={itemVariants}
            className="bg-[#DDEBFF] border-none rounded-xl p-6 space-y-6 shadow-sm transition-all duration-300 flex flex-col group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white text-[#0A6BFF] flex items-center justify-center shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-zinc-900">Integrations</h3>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { name: "Shopify Store", id: "shopify", href: "/dashboard/integrations/shopify" },
                { name: "Google Calendar", id: "googlecalendar", href: "/dashboard/integrations/google-calendar" },
                { name: "HubSpot CRM", id: "hubspot", href: "/dashboard/integrations" },
                { name: "Stripe Payments", id: "stripe", href: "/dashboard/integrations" }
              ].map((c) => (
                <Link href={c.href} key={c.name} className="bg-white border-none px-4 py-3.5 rounded-xl text-[13px] font-bold text-zinc-800 shadow-sm flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group/item block">
                  <div className="flex items-center gap-3">
                    <BrandIcon id={c.id} className="w-5 h-5 shrink-0" />
                    <span>{c.name}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover/item:text-zinc-600 transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Bookings & Operational Activity */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-[28px] pt-6">
          <TodayBookingsWidget />
          <ChannelStatusWidget />
        </motion.div>

        {/* Minimal Channel Switcher - Refined */}
        <motion.div variants={itemVariants} className="pt-10 flex w-full overflow-x-auto scrollbar-none justify-start md:justify-center">
          <div className="inline-flex items-center gap-8 md:gap-14 border-b border-zinc-150 pb-px px-4 md:px-10 min-w-max mx-auto">
            {["OVERVIEW", "WHATSAPP", "INSTAGRAM", "VOICE"].map((tab) => (
              <button
                key={tab}
                className={`pb-4 text-[12px] font-semibold transition-all relative tracking-[0.2em] ${
                  tab === "OVERVIEW" 
                    ? "text-[#0A6BFF] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0A6BFF]" 
                    : "text-zinc-400 hover:text-zinc-650"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€ Left Sidebar Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Sidebar({ active, onChange, ws, onWsChange, workspaces, preset, user, open, setOpen }: {
  active: Tab;
  onChange: (t: Tab) => void;
  ws: Workspace;
  onWsChange: (w: Workspace) => void;
  workspaces: Workspace[];
  preset: IndustryPreset;
  user: { name: string | null; email: string; role: string } | null;
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const [wsOpen, setWsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isAgent = user?.role === "agent";

  const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview",    label: "Home",           icon: Home },
    { id: "inbox",       label: "Inbox",          icon: Inbox },
    { id: "approvals",   label: "Approvals",      icon: CheckSquare },
    { id: "contacts",    label: "Contacts",       icon: Users },
    { id: "bookings",    label: "Calendar",       icon: Calendar },
    { id: "templates",   label: "Templates",      icon: LayoutTemplate },
  ];

  if (preset.id === "real-estate") {
    NAV_ITEMS.push({ id: "properties",  label: "Properties",     icon: Building2 });
    NAV_ITEMS.push({ id: "leads",       label: "Lead Pipeline",  icon: LayoutDashboard });
  } else if (preset.id === "cleaning") {
    NAV_ITEMS.push({ id: "cleaning_bookings", label: "Bookings", icon: Calendar });
  } else if (preset.id === "construction") {
    NAV_ITEMS.push({ id: "construction_projects", label: "Projects & Bids", icon: Building2 });
  } else if (preset.id === "maintenance") {
    NAV_ITEMS.push({ id: "maintenance_orders", label: "Work Orders", icon: Scissors });
  } else if (preset.id === "it") {
    NAV_ITEMS.push({ id: "it_tickets", label: "Support Tickets", icon: Briefcase });
  } else if (preset.id === "fencing") {
    NAV_ITEMS.push({ id: "fencing_estimates", label: "Estimates", icon: Building2 });
  }

  if (!isAgent) {
    NAV_ITEMS.push({ id: "automations", label: "Workflows", icon: GitBranch });
    NAV_ITEMS.push({ id: "broadcasts",  label: "Broadcasts", icon: Megaphone });
  }

  NAV_ITEMS.push({ id: "calls",       label: "Call Logs",         icon: PhoneCall });
  NAV_ITEMS.push({ id: "voice_agent", label: "Voice AI",        icon: PhoneCall });
  NAV_ITEMS.push({ id: "ai_agent",    label: "Knowledge Base",    icon: FileText });

  return (
    <aside 
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => { setIsCollapsed(true); setWsOpen(false); }}
      className={`dashboard-sidebar shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full z-40 transition-all duration-300 md:translate-x-0 md:static fixed inset-y-0 left-0 ${open ? "translate-x-0" : "-translate-x-full"} ${isCollapsed ? "w-[68px]" : "w-[260px]"}`}
    >
      {/* Professional Branding Logo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-100 relative bg-white overflow-hidden shrink-0">
        <div className={`flex items-center gap-3 transition-all ${isCollapsed ? "mx-auto" : ""}`}>
          <div className="cursor-pointer shrink-0" onClick={() => setIsCollapsed(!isCollapsed)}>
            <AnaosLogo className="w-11 h-11 sm:w-12 sm:h-12 text-[#0A6BFF]" />
          </div>
          {!isCollapsed && <span className="text-[20px] font-bold text-zinc-900 tracking-tight leading-none whitespace-nowrap">AnaOS</span>}
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={() => {
               setIsCollapsed(true);
               setOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors cursor-pointer shrink-0 md:hidden"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Workspace switcher */}
      <div className={`py-4 border-b border-zinc-100 relative shrink-0 ${isCollapsed ? "px-2" : "px-3"}`}>
        <button
          type="button"
          onClick={() => {
            if (isCollapsed) setIsCollapsed(false);
            else setWsOpen(!wsOpen);
          }}
          className={`w-full flex items-center rounded-lg hover:bg-zinc-100 transition-all cursor-pointer text-left group ${isCollapsed ? "justify-center p-1.5" : "gap-3 px-2 py-2"}`}
        >
          <div className="relative shrink-0 flex items-center justify-center">
            <div className={`rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden border border-zinc-300 ${isCollapsed ? "w-8 h-8" : "w-9 h-9"}`}>
               <Users className={`text-zinc-500 ${isCollapsed ? "w-4 h-4" : "w-5 h-5"}`} />
            </div>
            {!isCollapsed && (
              <div className="absolute -bottom-1.5 -right-1 bg-zinc-600 text-white text-[8px] font-bold px-1 rounded-[3px] border border-white shadow-sm whitespace-nowrap">
                FREE
              </div>
            )}
          </div>
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1 flex items-center">
                <p className="text-[14px] font-medium text-zinc-900 truncate">
                  {ws.name}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${wsOpen ? "rotate-180" : ""}`}
              />
            </>
          )}
        </button>

        {wsOpen && !isCollapsed && (
          <div className="absolute left-3 right-3 top-full mt-1 rounded-lg border border-zinc-200 bg-white shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 py-1">
            {workspaces.map((w) => (
              <button
                key={w.id}
                onClick={() => { onWsChange(w); setWsOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#f4f6fb] transition-colors cursor-pointer ${ws.id === w.id ? "bg-[#f4f6fb]" : ""}`}
              >
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#dbe1ea] flex items-center justify-center overflow-hidden">
                     <Users className="w-4 h-4 text-white mt-1.5" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 flex items-center justify-between">
                  <p className="text-[13px] text-zinc-700 truncate mr-2">{w.name}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="bg-zinc-500 text-white text-[10px] font-bold px-1.5 py-[1px] rounded-sm">
                      FREE
                    </span>
                    <Pin className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                </div>
              </button>
            ))}
            <div className="px-3 pt-2 pb-1 mt-1 border-t border-zinc-100">
              <button className="w-full py-1.5 rounded-md border border-zinc-200 text-[13px] text-zinc-600 flex items-center justify-center gap-1.5 hover:bg-zinc-50 transition-colors font-medium cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
                New Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 pt-4 space-y-1 overflow-y-auto custom-scrollbar ${isCollapsed ? "px-2" : "px-3"}`}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                onChange(id);
                if (window.innerWidth < 768) setOpen(false);
              }}
              title={isCollapsed ? label : undefined}
              className={`w-full flex items-center h-10 rounded-[8px] transition-all cursor-pointer group ${
                isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"
              } ${
                isActive
                  ? "bg-[#0A6BFF]/10 text-[#0A6BFF] font-semibold"
                  : "text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                  isActive ? "text-[#0A6BFF] stroke-[2]" : "text-zinc-400 group-hover:text-zinc-600 stroke-[2]"
                }`}
              />
              {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
            </button>
          );
        })}

        {!isAgent && (
          <>
            {!isCollapsed && (
              <div className="pt-6 pb-2 px-3">
                <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">Insights</span>
              </div>
            )}
            {isCollapsed && <div className="h-4" />}
            
            <button
              type="button"
              onClick={() => {
                 onChange("analytics");
                 if (window.innerWidth < 768) setOpen(false);
              }}
              title={isCollapsed ? "Analytics" : undefined}
              className={`w-full flex items-center h-10 rounded-[8px] transition-all cursor-pointer group ${
                isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"
              } ${
                active === "analytics"
                  ? "bg-[#0A6BFF]/10 text-[#0A6BFF] font-semibold"
                  : "text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <BarChart2
                className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                  active === "analytics" ? "text-[#0A6BFF] stroke-[2]" : "text-zinc-400 group-hover:text-zinc-600 stroke-[2]"
                }`}
              />
              {!isCollapsed && <span className="whitespace-nowrap">Analytics</span>}
            </button>
          </>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className={`py-4 border-t border-zinc-100 space-y-1 bg-transparent shrink-0 ${isCollapsed ? "px-2" : "px-3"}`}>
        {!isAgent && (
          <button
            type="button"
            onClick={() => {
              onChange("team");
              if (window.innerWidth < 768) setOpen(false);
            }}
            title={isCollapsed ? "Team Settings" : undefined}
            className={`w-full flex items-center h-10 rounded-[8px] transition-all cursor-pointer group ${
              isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"
            } ${
              active === "team"
                ? "bg-[#0A6BFF]/10 text-[#0A6BFF] font-semibold"
                : "text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <Users className={`w-[18px] h-[18px] shrink-0 transition-colors ${active === "team" ? "text-[#0A6BFF]" : "text-zinc-400 group-hover:text-zinc-600"} stroke-[2]`} />
            {!isCollapsed && <span className="whitespace-nowrap">Team Settings</span>}
          </button>
        )}
        <a
          href="/dashboard/integrations"
          title={isCollapsed ? "Integrations" : undefined}
          className={`w-full flex items-center h-10 rounded-[8px] text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer group ${
            isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"
          }`}
        >
          <Plug className="w-[18px] h-[18px] shrink-0 transition-colors text-zinc-400 group-hover:text-zinc-600 stroke-[2]" />
          {!isCollapsed && <span className="whitespace-nowrap">Integrations</span>}
        </a>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          title={isCollapsed ? "Log out" : undefined}
          className={`w-full flex items-center h-10 rounded-[8px] text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer group ${
            isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"
          }`}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0 transition-colors text-zinc-400 group-hover:text-zinc-600 stroke-[2]" />
          {!isCollapsed && <span className="whitespace-nowrap">Log out</span>}
        </button>
        
        {/* User Profile Footer */}
        <div className={`mt-3 border-t border-zinc-100 ${isCollapsed ? "pt-3 flex justify-center" : "pt-4 px-3 flex items-center gap-3"}`}>
          <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-white/10">
            <span className="text-[13px] font-bold text-white uppercase text-center w-full">
              {user?.name ? user.name.slice(0, 2) : (user?.email ? user.email.slice(0, 2) : "UN")}
            </span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-zinc-800 truncate tracking-tight">{user?.name || "User"}</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {user?.role ? `${user.role} OS` : "Agent OS"}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
// â”€â”€â”€ Topbar Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type WAStatus = {
  needsPublicWebhook?: boolean;
  aiReady?: boolean;
  phoneNumberIdInvalid?: boolean;
  phoneNumberIdError?: string | null;
  tokenExpired?: boolean;
  publicWebhookUrl?: string | null;
  hints?: string[];
};

function Topbar({ title, ws, preset, waStatus, integrations, onMenuClick }: { 
  title: string; 
  ws: Workspace; 
  preset: IndustryPreset;
  waStatus: WAStatus;
  integrations: { whatsapp: boolean; shopify: boolean; fastapi: boolean };
  onMenuClick: () => void;
}) {
  const [isAutoReply, setIsAutoReply] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Determine if we show the alert banner
  const hasIssue = waStatus.tokenExpired || waStatus.phoneNumberIdInvalid || waStatus.needsPublicWebhook || !integrations.fastapi;
  
  let alertMessage = "";
  if (waStatus.tokenExpired) alertMessage = "Meta token expired — reconnect WhatsApp in Integrations.";
  else if (waStatus.phoneNumberIdInvalid) alertMessage = `Phone ID Error: ${waStatus.phoneNumberIdError || "Check settings"}`;
  else if (waStatus.needsPublicWebhook) alertMessage = "Public webhook missing — use tunnel for local testing.";
  else if (!integrations.fastapi) alertMessage = "AI Engine (FastAPI) is offline — run 'fastapi dev main.py' in backend.";

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setSearchResults(data.results);
        })
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="flex flex-col shrink-0">
      <header className="h-16 border-b border-zinc-200 bg-white px-4 md:px-6 flex items-center justify-between shrink-0 relative z-[60]">
        <div className="flex items-center gap-3 text-[13.5px]">
          <button 
            type="button" 
            onClick={onMenuClick}
            className="md:hidden p-1 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
              <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
              <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
              <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-zinc-400 font-medium hidden sm:inline">{ws.name}</span>
          <ChevronRight className="w-4 h-4 text-zinc-200 hidden sm:inline" />
          <span className="font-bold text-zinc-700 tracking-tight">{title}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block z-50">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 transition-colors group-focus-within:text-sky-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NLP indexed data..."
              className="h-9 pl-9 pr-4 rounded-lg border border-zinc-200 text-[13px] bg-zinc-50/50 focus:outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all w-64 md:w-80"
            />
            
            {/* Search Results Dropdown â€” TF-IDF Powered */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden max-h-[420px] overflow-y-auto">
                {/* Header */}
                <div className="px-3 py-2 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-zinc-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center">
                      <Search className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TF-IDF Search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {searchResults.length > 0 && (
                      <span className="text-[9px] font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">
                        {searchResults.length} results
                      </span>
                    )}
                    {isSearching && <Loader2 className="w-3 h-3 animate-spin text-sky-500" />}
                  </div>
                </div>

                {searchResults.length === 0 && !isSearching ? (
                  <div className="p-6 text-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-2">
                      <Search className="w-4 h-4 text-zinc-400" />
                    </div>
                    <p className="text-zinc-500 text-[12px] font-medium">No indexed chats match this query.</p>
                    <p className="text-zinc-400 text-[10px] mt-1">Try sending a message via the webhook first.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-50">
                    {searchResults.map((res: any, idx: number) => {
                      // Handle both old format (IndexedDocument) and new TF-IDF (SearchResult)
                      const doc    = res.document ?? res;
                      const score  = res.score ?? null;
                      const terms  = res.matchedTerms ?? [];
                      const data   = doc.data;

                      const sentimentColor = {
                        positive: "bg-emerald-100 text-emerald-700",
                        neutral:  "bg-zinc-100 text-zinc-600",
                        negative: "bg-rose-100 text-rose-700",
                      }[data.sentiment as string] ?? "bg-zinc-100 text-zinc-600";

                      const nerCategoryColor: Record<string, string> = {
                        ENAMEX: "bg-violet-100 text-violet-700",
                        NUMEX:  "bg-amber-100 text-amber-700",
                        TIMEX:  "bg-sky-100 text-sky-700",
                        MISC:   "bg-zinc-100 text-zinc-600",
                      };

                      return (
                        <div
                          key={doc._id}
                          className="p-3 hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                        >
                          {/* Top Row: text + score */}
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[12px] text-zinc-800 font-semibold leading-snug flex-1 truncate">
                              {data.originalText}
                            </p>
                            {score !== null && (
                              <div className="shrink-0 flex flex-col items-end gap-0.5">
                                <span className="text-[9px] font-bold text-sky-600 uppercase tracking-widest">Score</span>
                                <span className="text-[11px] font-bold text-sky-700 tabular-nums">
                                  {score.toFixed(3)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Tags Row */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {/* Intent */}
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wider">
                              âš¡ {data.intent}
                            </span>

                            {/* Sentiment */}
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${sentimentColor}`}>
                              {data.sentiment === "positive" ? "ðŸ˜Š" : data.sentiment === "negative" ? "ðŸ˜ " : "ðŸ˜"} {data.sentiment}
                              {data.sentimentScore !== undefined && ` (${data.sentimentScore > 0 ? "+" : ""}${data.sentimentScore})`}
                            </span>

                            {/* NER Entities */}
                            {data.annotations?.slice(0, 4).map((anno: any) => (
                              <span
                                key={anno.id}
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${nerCategoryColor[anno.nerCategory] ?? "bg-zinc-100 text-zinc-600"}`}
                              >
                                {anno.type}: {anno.value}
                              </span>
                            ))}
                          </div>

                          {/* Matched TF-IDF Terms */}
                          {terms.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="text-[9px] text-zinc-400 font-bold">MATCHED:</span>
                              {terms.map((t: string) => (
                                <span key={t} className="text-[9px] font-bold text-sky-600 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-md">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* POS Tag String (if available) */}
                          {data.posTagString && (
                            <p className="text-[9px] text-zinc-400 font-mono mt-1.5 truncate">
                              {data.posTagString}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="h-6 w-px bg-zinc-200" />
          <div className="relative group z-50">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 transition-all cursor-pointer bg-white shadow-sm"
            >
              <Bell className="w-4.5 h-4.5 transition-transform group-hover:rotate-12" />
              {hasIssue && <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />}
            </button>
            
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <h3 className="text-[13px] font-bold text-zinc-900">Notifications</h3>
                  {hasIssue && <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm">1 New</span>}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {hasIssue ? (
                    <div className="p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-zinc-900 leading-tight mb-1">CRM System Alert</p>
                          <p className="text-[12px] text-zinc-500 leading-snug">{alertMessage}</p>
                          <button onClick={() => window.location.href='/dashboard/integrations/whatsapp'} className="mt-2 text-[11px] font-bold text-sky-600 hover:underline">Fix Issue &rarr;</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-3 border border-zinc-100">
                        <CheckCircle2 className="w-5 h-5 text-zinc-300" />
                      </div>
                      <p className="text-[13px] font-bold text-zinc-900">All caught up!</p>
                      <p className="text-[12px] text-zinc-500 mt-1">No new issues in your CRM.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global OS Alert Banner (Only shows when there's an issue) */}
      {hasIssue && (
        <div className="bg-[#0A6BFF] text-white shadow-sm px-5 py-2 flex items-center justify-between z-50 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <p className="text-[12.5px] font-medium tracking-tight">
              {alertMessage} <button onClick={() => window.location.href='/dashboard/integrations/whatsapp'} className="underline font-bold hover:text-zinc-300 ml-1">Fix now</button>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-[12px] font-bold px-4 py-1.5 rounded-md flex items-center gap-2 transition-colors">
              Support <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {!hasIssue && (
        <div className="bg-emerald-600 text-white px-5 py-1.5 flex items-center justify-between z-50 shadow-sm border-b border-emerald-700">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
            <p className="text-[11px] font-bold tracking-tight uppercase">System Status: All systems operational</p>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">WhatsApp Connected</span>
          </div>
        </div>
      )}
    </div>
  );
}


// â”€â”€â”€ Status Badge Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StatusBadge({ status }: { status: Workspace["status"] }) {
  const config = {
    live: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-100", label: "Live" },
    draft: { bg: "bg-zinc-100", text: "text-zinc-600", border: "border-zinc-200", label: "Draft" },
    paused: { bg: "bg-zinc-100", text: "text-zinc-500", border: "border-zinc-200", label: "Paused" },
  };
  const { bg, text, border, label } = config[status] || config.draft;
  return (
    <span className={`px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[10px] font-bold uppercase tracking-widest`}>
      {label}
    </span>
  );
}

function AIAgentPage({ ws }: { ws: Workspace }) {
  return <AnaosAIHub ws={ws} />;
}

function BroadcastsPage({ ws }: { ws: Workspace }) {
  return <BroadcastsHub workspaceName={ws.name} />;
}

// â”€â”€â”€ Page: Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    automationRuns: 0,
    successfulRuns: 0,
    failedRuns: 0,
    activeAutomations: 0,
    connectedChannels: 0,
    executionsLast7Days: 0,
  });
  const [chart, setChart] = useState<{ label: string; inbound: number; automated: number }[]>([]);

  useEffect(() => {
    fetch("/api/analytics/summary")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStats(data.summary);
          setChart(data.chart || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const max = Math.max(1, ...chart.flatMap((c) => [c.inbound, c.automated]));

  const cards = [
    { label: "Automation runs", value: String(stats.automationRuns) },
    { label: "Successful runs", value: String(stats.successfulRuns) },
    { label: "Active automations", value: String(stats.activeAutomations) },
    { label: "Connected channels", value: String(stats.connectedChannels) },
  ];

  return (
    <div className="space-y-10 max-w-5xl relative z-10 pb-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-zinc-800 tracking-tight">Analytics</h1>
        <p className="text-[15px] text-zinc-500 font-medium leading-relaxed">
          Real-time performance from your workflows â€” last 7 days
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-white border border-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {cards.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-zinc-300 transition-all duration-300"
              >
                <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-[0.1em]">
                  {s.label}
                </p>
                <span className="text-[22px] font-bold text-zinc-900 tabular-nums mt-3 block tracking-tight leading-none">
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
              <div>
                <h2 className="text-[17px] font-bold text-zinc-800 tracking-tight">Workflow activity</h2>
                <p className="text-[13px] text-zinc-500 font-bold mt-1">
                  Triggers vs successful runs ({stats.executionsLast7Days} this week)
                </p>
              </div>
              <div className="flex items-center gap-6 text-[12px] text-zinc-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-zinc-200" />
                  Triggered
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-zinc-800 shadow-lg shadow-zinc-200" />
                  Success
                </span>
              </div>
            </div>
            <div className="px-8 pt-10 pb-6">
              {chart.length === 0 ? (
                <p className="text-[14px] text-zinc-400 font-bold py-10 text-center uppercase tracking-widest">
                  Connect WhatsApp and turn on an automation to see activity here.
                </p>
              ) : (
                <div className="flex items-end gap-6 h-48">
                  {chart.map((d) => (
                    <div
                      key={d.label}
                      className="flex-1 flex flex-col items-center gap-4 h-full justify-end group"
                    >
                      <div className="w-full flex gap-2 items-end justify-center h-full">
                        <div
                          className="w-4 rounded-t-lg bg-zinc-100 group-hover:bg-zinc-200 transition-colors"
                          style={{ height: `${(d.inbound / max) * 100}%` }}
                        />
                        <div
                          className="w-4 rounded-t-lg bg-zinc-800 group-hover:bg-zinc-700 transition-colors shadow-lg shadow-zinc-100"
                          style={{ height: `${(d.automated / max) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold font-mono text-zinc-400 uppercase tracking-tighter">
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// â”€â”€â”€ Page: Automations (Channel-Aware State Machine) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type AutomationChannelState = "live" | "draft" | "needs_connection";

const CHANNEL_KEYWORDS: { channel: string; keywords: string[] }[] = [
  { channel: "whatsapp", keywords: ["whatsapp", "whats app", "wa ", "wp ", "message", "chat", "lead", "reply", "inbox"] },
  { channel: "instagram", keywords: ["instagram", "ig ", "dm", "reel", "story", "follower"] },
  { channel: "facebook", keywords: ["facebook", "fb ", "messenger", "page", "fanpage"] },
  { channel: "shopify", keywords: ["shopify", "order", "cart", "abandoned", "store", "product", "checkout"] },
  { channel: "smtp", keywords: ["email", "gmail", "smtp", "mail", "newsletter"] },
  { channel: "google_calendar", keywords: ["calendar", "appointment", "booking", "schedule", "slot", "viewing"] },
];

function detectChannels(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const { channel, keywords } of CHANNEL_KEYWORDS) {
    if (keywords.some((k) => lower.includes(k))) found.push(channel);
  }
  return found.length > 0 ? [...new Set(found)] : ["whatsapp"];
}

const CHANNEL_META: Record<string, { label: string; color: string; connectHref: string }> = {
  whatsapp:        { label: "WhatsApp",        color: "#25D366", connectHref: "/dashboard/integrations/whatsapp" },
  instagram:       { label: "Instagram",       color: "#E4405F", connectHref: "/dashboard/integrations/instagram" },
  facebook:        { label: "Facebook",        color: "#1877F2", connectHref: "/dashboard/integrations/facebook" },
  shopify:         { label: "Shopify",         color: "#96bf48", connectHref: "/dashboard/integrations/shopify" },
  smtp:            { label: "Email",           color: "#6366F1", connectHref: "/dashboard/integrations/email" },
  google_calendar: { label: "Google Calendar", color: "#EA4335", connectHref: "/dashboard/integrations/google-calendar" },
};

function ChannelBadge({ channelId, connected }: { channelId: string; connected: boolean }) {
  const meta = CHANNEL_META[channelId] ?? { label: channelId, color: "#6B7280", connectHref: "/dashboard/integrations" };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold border shadow-sm transition-all"
      style={{
        backgroundColor: connected ? `${meta.color}08` : "#F9FAFB",
        color: connected ? meta.color : "#9CA3AF",
        borderColor: connected ? `${meta.color}25` : "#E5E7EB",
      }}
    >
      {connected ? (
        <BrandIcon id={channelId} className="w-3.5 h-3.5" />
      ) : (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#D1D5DB" }}
        />
      )}
      {meta.label}
    </span>
  );
}

function AutomationStateBadge({ state }: { state: AutomationChannelState }) {
  const cfg = {
    live:             { label: "Live",             bg: "bg-sky-50",      text: "text-sky-700",      border: "border-sky-100",     dot: "bg-sky-500" },
    draft:            { label: "Draft",            bg: "bg-zinc-100",    text: "text-zinc-500",     border: "border-zinc-200",    dot: "bg-zinc-400" },
    needs_connection: { label: "Needs Connection", bg: "bg-orange-50",   text: "text-orange-700",   border: "border-orange-200",  dot: "bg-orange-500" },
  };
  const { label, bg, text, border, dot } = cfg[state];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-wider border ${bg} ${text} ${border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${state === "live" ? "animate-pulse" : ""}`} />
      {label}
    </span>
  );
}

interface GeneratedAutomation {
  id: string;
  name: string;
  description: string;
  channels: string[];
  state: AutomationChannelState;
  requiredProvider?: "meta" | "google" | "commerce" | "others" | null;
  missingIntegrations?: string[];
  prompt: string;
  runs: number;
  lastRun: string;
  enabled: boolean;
}

function AutomationsPage({ ws, integrations, toggleAutomation, toggleLoading }: { ws: Workspace; integrations: { whatsapp: boolean; instagram: boolean; facebook: boolean; shopify: boolean; smtp: boolean; fastapi: boolean }; toggleAutomation: (id: string) => Promise<void>; toggleLoading: string | null }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedAutomation[]>([]);
  const [detectedChannels, setDetectedChannels] = useState<string[]>([]);
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);
  const [apiAutomations, setApiAutomations] = useState<GeneratedAutomation[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const isConnected = (channelId: string): boolean => {
    if (channelId === "whatsapp") return integrations.whatsapp;
    if (channelId === "instagram") return integrations.instagram;
    if (channelId === "facebook") return integrations.facebook;
    if (channelId === "shopify") return integrations.shopify;
    if (channelId === "smtp") return integrations.smtp;
    if (channelId === "google_calendar") return integrations.smtp;
    return false;
  };

  const resolveProviderFromMissing = (missing: string[]): GeneratedAutomation["requiredProvider"] => {
    if (missing.some((m) => m === "whatsapp" || m === "instagram" || m === "facebook")) return "meta";
    if (missing.some((m) => m === "shopify" || m === "stripe" || m === "woocommerce")) return "commerce";
    if (missing.some((m) => m === "smtp" || m.startsWith("google_"))) return "google";
    if (missing.length > 0) return "others";
    return null;
  };

  const resolveConnectHref = (missing: string[], provider: GeneratedAutomation["requiredProvider"]): string => {
    if (provider === "meta") {
      if (missing.includes("instagram")) return "/dashboard/integrations/instagram";
      if (missing.includes("facebook")) return "/dashboard/integrations/facebook";
      return "/dashboard/integrations/whatsapp";
    }
    if (provider === "commerce") return "/dashboard/integrations/shopify";
    if (provider === "google") {
      if (missing.includes("google_calendar")) return "/dashboard/integrations/google-calendar";
      return "/dashboard/integrations/email";
    }
    return "/dashboard/integrations";
  };

  const resolveConnectLabel = (provider: GeneratedAutomation["requiredProvider"]): string => {
    if (provider === "meta") return "Connect Meta";
    if (provider === "commerce") return "Connect Shopify";
    if (provider === "google") return "Connect Google";
    return "Connect";
  };

  useEffect(() => {
    fetch("/api/v1/workflows")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.workflows)) {
          const mapped: GeneratedAutomation[] = data.workflows.map((w: {
            id: string; name: string; description?: string;
            isActive?: boolean; stats?: { runs?: number };
            lastRunAt?: string | null;
          }) => {
            const channels = detectChannels(w.name + " " + (w.description || ""));
            const missing = channels.filter((c) => !isConnected(c));
            const allConn = missing.length === 0;
            const isEnabled = w.isActive ?? false;
            const state: AutomationChannelState = !allConn ? "needs_connection" : isEnabled ? "live" : "draft";
            const runs = w.stats?.runs ?? 0;
            const lastRun = w.lastRunAt ? new Date(w.lastRunAt).toLocaleDateString() : "Never";
            const requiredProvider = state === "needs_connection" ? resolveProviderFromMissing(missing) : null;
            return { id: w.id, name: w.name, description: w.description || `Automation for ${ws.name}`, channels, state, requiredProvider, missingIntegrations: missing, prompt: "", runs, lastRun, enabled: isEnabled };
          });
          setApiAutomations(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingList(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.id, integrations.whatsapp, integrations.instagram, integrations.facebook, integrations.shopify, integrations.smtp]);

  useEffect(() => {
    if (!prompt.trim()) { setDetectedChannels([]); setShowConnectPrompt(false); return; }
    const channels = detectChannels(prompt);
    setDetectedChannels(channels);
    setShowConnectPrompt(channels.some((c) => !isConnected(c)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, integrations.whatsapp, integrations.instagram, integrations.facebook, integrations.shopify, integrations.smtp]);

  const handleBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || building) return;
    setBuilding(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/workflows/from-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, activate: true, save: true }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Build failed"); return; }
      
      if (data.workflow?.id) {
        router.push(`/dashboard/workflows/${data.workflow.id}`);
        return;
      }
      
      const channels = detectChannels(prompt);
      const missing = channels.filter((c) => !isConnected(c));
      const allConn = missing.length === 0;
      const requiredProvider = !allConn ? resolveProviderFromMissing(missing) : null;
      setGenerated((prev) => [{
        id: data.workflow?.id || `local-${Date.now()}`,
        name: data.workflow?.name || "New Automation",
        description: prompt.slice(0, 90) + (prompt.length > 90 ? "â€¦" : ""),
        channels,
        state: allConn ? "live" : "needs_connection",
        requiredProvider,
        missingIntegrations: missing,
        prompt,
        runs: 0,
        lastRun: "Just now",
        enabled: allConn,
      }, ...prev]);
      setPrompt("");
    } catch {
      setError("Network error â€” check your connection and try again.");
    } finally {
      setBuilding(false);
    }
  };

  const wsAutomations: GeneratedAutomation[] = ws.automations.map((a) => {
    const channels =
      Array.isArray(a.requiredIntegrations) && a.requiredIntegrations.length > 0
        ? a.requiredIntegrations
        : detectChannels(a.name + " " + a.type);
    const missing = Array.isArray(a.missingIntegrations)
      ? a.missingIntegrations
      : channels.filter((c) => !isConnected(c));
    const allConn = missing.length === 0;
    const state: AutomationChannelState =
      a.status === "needs_connection"
        ? "needs_connection"
        : !allConn
          ? "needs_connection"
          : a.enabled
            ? "live"
            : "draft";
    return {
      id: a.id, name: a.name,
      description: (a as any).description || `Compiled from prompt for ${ws.name} (${ws.industry})`,
      channels,
      state,
      requiredProvider: a.requiredProvider ?? (state === "needs_connection" ? resolveProviderFromMissing(missing) : null),
      missingIntegrations: missing,
      prompt: "", runs: a.runs, lastRun: a.lastRun, enabled: a.enabled,
    };
  });

  const finalList = [...generated, ...apiAutomations, ...wsAutomations].filter(
    (a, idx, arr) => arr.findIndex((b) => b.id === a.id) === idx
  );

  const liveCount  = finalList.filter((a) => a.state === "live").length;
  const needsCount = finalList.filter((a) => a.state === "needs_connection").length;

  return (
    <div className="space-y-6 max-w-3xl pb-10">

      {/* â”€â”€ Header â”€â”€ */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-zinc-900 tracking-tight leading-none">Automations</h1>
          <p className="text-[13.5px] text-zinc-400 font-medium mt-1.5 leading-snug">
            Describe a flow in plain language â€” Anaos builds it. Connect the channel to go live.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end pt-1">
          {liveCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {liveCount} Live
            </span>
          )}
          {needsCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-bold text-orange-700 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              {needsCount} Needs Connection
            </span>
          )}
        </div>
      </div>

      {/* â”€â”€ Build with Prompt Card â”€â”€ */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-zinc-100">
          <p className="text-[15px] font-semibold text-zinc-900 leading-snug">Build with prompt</p>
          <p className="text-[13px] text-zinc-500 font-medium mt-0.5">
            Describe your flow â€” Anaos detects the channel automatically
          </p>
        </div>

        <form onSubmit={handleBuild}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`e.g. "When a lead messages on WhatsApp asking about prices, qualify their budget and if over AED 2M send a viewing link, otherwise add to newsletter."`}
            rows={4}
            className="w-full bg-transparent px-5 py-4 text-[14px] text-zinc-700 placeholder:text-zinc-300 focus:outline-none resize-none leading-relaxed font-medium"
          />

          {detectedChannels.length > 0 && (
            <div className="px-5 py-2.5 bg-zinc-50 border-y border-zinc-100 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mr-1">Detected:</span>
              {detectedChannels.map((c) => (
                <ChannelBadge key={c} channelId={c} connected={isConnected(c)} />
              ))}
            </div>
          )}

          {showConnectPrompt && (
            <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-[12.5px] font-medium text-amber-800">
                  Some channels aren&apos;t connected â€” automation will be saved as <span className="italic font-bold">Needs Connection</span>.
                </p>
              </div>
              <a href="/dashboard/integrations" className="shrink-0 text-[11.5px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors whitespace-nowrap">
                Connect now â†’
              </a>
            </div>
          )}

          <div className="px-5 py-3.5 flex items-center justify-between border-t border-zinc-100">
            <span className="text-[13px] text-zinc-400 font-medium">
              Workspace: <strong className="text-zinc-600 font-semibold">{ws.name}</strong>
            </span>
            <button
              type="submit"
              disabled={building || !prompt.trim()}
              className="inline-flex items-center gap-1.5 h-9 px-5 rounded-xl bg-[#0A6BFF] hover:bg-blue-600 text-white text-[13px] font-semibold transition-all disabled:opacity-40 shadow-sm disabled:cursor-not-allowed cursor-pointer"
            >
              {building
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Buildingâ€¦</>
                : <><Plus className="w-3.5 h-3.5" /> Generate automation</>
              }
            </button>
          </div>
        </form>

        {error && (
          <div className="px-5 pb-4">
            <p className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          </div>
        )}
      </div>

      {/* â”€â”€ All Automations List â”€â”€ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.18em]">All Automations</h2>
          <span className="text-[12px] text-zinc-400 font-semibold">{finalList.length} total</span>
        </div>

        {loadingList && finalList.length === 0 ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[88px] rounded-xl bg-white border border-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : finalList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-[14px] font-bold text-zinc-700">No automations yet</p>
            <p className="text-[13px] text-zinc-400 mt-1">
              Use the prompt above to create your first flow â€” takes 30 seconds.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {finalList.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex items-stretch">
                  {/* Left accent bar */}
                  <div
                    className="w-[3px] shrink-0"
                    style={{
                      backgroundColor:
                        a.state === "live" ? "#10B981"
                        : a.state === "needs_connection" ? "#F97316"
                        : "#E5E7EB",
                    }}
                  />

                  {/* Content */}
                  <div className="flex-1 px-5 py-4 flex items-center justify-between gap-4 min-w-0">
                    <div className="min-w-0 flex-1">
                      {/* Name + badge */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <p className="text-[15px] font-semibold text-zinc-900 tracking-tight">{a.name}</p>
                        {a.state === "needs_connection" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[10.5px] font-bold text-orange-700 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            Needs Connection
                          </span>
                        )}
                        {a.state === "live" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10.5px] font-bold text-emerald-700 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                          </span>
                        )}
                        {a.state === "draft" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10.5px] font-bold text-zinc-500 uppercase tracking-wider">
                            Draft
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-[13px] text-zinc-500 font-medium mt-1 line-clamp-1">{a.description}</p>

                      {/* Meta */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {a.channels.map((c) => (
                          <ChannelBadge key={c} channelId={c} connected={isConnected(c)} />
                        ))}
                        <span className="text-[11.5px] text-zinc-300">Â·</span>
                        <span className="text-[12px] text-zinc-400">{a.runs} runs Â· {a.lastRun}</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => router.push(`/dashboard/workflows/${a.id}`)}
                        className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-zinc-700 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                      >
                        Edit Visually
                        <PenTool className="w-3.5 h-3.5 text-zinc-400" />
                      </button>

                      {a.state === "needs_connection" ? (
                        <a
                          href={resolveConnectHref(a.missingIntegrations || a.channels.filter((c) => !isConnected(c)), a.requiredProvider ?? resolveProviderFromMissing(a.missingIntegrations || a.channels.filter((c) => !isConnected(c))))}
                          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-3.5 py-2 rounded-xl hover:bg-orange-100 transition-colors shadow-sm whitespace-nowrap"
                        >
                          {resolveConnectLabel(a.requiredProvider ?? resolveProviderFromMissing(a.missingIntegrations || a.channels.filter((c) => !isConnected(c))))}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleAutomation(a.id)}
                          disabled={toggleLoading === a.id}
                          className={`w-11 h-6 rounded-full transition-all cursor-pointer relative shrink-0 ${
                            a.enabled ? "bg-emerald-500 shadow-sm shadow-emerald-200" : "bg-zinc-200"
                          } disabled:opacity-50`}
                          title={a.enabled ? "Pause automation" : "Activate automation"}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                              a.enabled ? "left-6" : "left-1"
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* â”€â”€ Bottom CTA â”€â”€ */}
      {needsCount > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4.5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
            <div>
              <p className="text-[13.5px] font-semibold text-zinc-950">
                {needsCount} automation{needsCount > 1 ? "s" : ""} waiting for connection
              </p>
              <p className="text-[12.5px] text-zinc-500 font-medium mt-0.5">
                Connect your channels once â€” automations go live instantly.
              </p>
            </div>
          </div>
          <a
            href="/dashboard/integrations"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A6BFF] hover:bg-blue-600 text-white shadow-sm text-[12.5px] font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            Connect now <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Main Root Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string | null; email: string; role: string } | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [ws, setWs] = useState<Workspace | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [inboxChatId, setInboxChatId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [roiMetrics, setRoiMetrics] = useState<any>(null);
  const [integrations, setIntegrations] = useState({
    whatsapp: false,
    instagram: false,
    facebook: false,
    shopify: false,
    smtp: false,
    fastapi: false,
  });
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [isDeployingAgent, setIsDeployingAgent] = useState(false);

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setSidebarOpen(false);
  };

  const [webhookActive, setWebhookActive] = useState(false);
  const [fastApiOnline, setFastApiOnline] = useState(false);
  const [waStatus, setWaStatus] = useState<{
    needsPublicWebhook?: boolean;
    aiReady?: boolean;
    phoneNumberIdInvalid?: boolean;
    phoneNumberIdError?: string | null;
    tokenExpired?: boolean;
    publicWebhookUrl?: string | null;
    hints?: string[];
    fastApiOffline?: boolean;
  }>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("tab");
    const chat = params.get("chat");
    if (
      q === "analytics" ||
      q === "overview" ||
      q === "inbox" ||
      q === "approvals" ||
      q === "contacts" ||
      q === "automations" ||
      q === "broadcasts" ||
      q === "voice_agent" ||
      q === "ai_agent" ||
      q === "team"
    ) {
      setTab(q as Tab);
    }
    if (chat) setInboxChatId(chat);
  }, []);

  useEffect(() => {
    setMounted(true);

    async function loadDashboardData() {
      try {
        setLoadError(null);
        
        // --- INTERCEPTOR LOGIC FOR LANDING PAGE DEPLOYMENTS ---
        const savedWorkspaces = localStorage.getItem("anaos_custom_workspaces");
        if (savedWorkspaces) {
          try {
            setIsDeployingAgent(true);
            const workspacesToImport = JSON.parse(savedWorkspaces);
            const importRes = await fetch("/api/workspace/import", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ workspaces: workspacesToImport }),
            });
            if (importRes.ok) {
              localStorage.removeItem("anaos_custom_workspaces");
            }
          } catch (e) {
            console.error("Failed to import workspaces", e);
          } finally {
            setIsDeployingAgent(false);
          }
        }
        // --------------------------------------------------------

        const res = await fetch("/api/dashboard/data");
        if (!res.ok) {
          setLoadError("Could not load dashboard. Try refreshing the page.");
          return;
        }
        const data = await res.json();
        
        if (data.user) {
          setUser(data.user);
        }
        if (data.roiMetrics) {
          setRoiMetrics(data.roiMetrics);
        }
        
        if (data.integrations) {
          setIntegrations(data.integrations);
          setWebhookActive(!!data.integrations.whatsapp);
          setFastApiOnline(!!data.integrations.fastapi);
        }

        fetch("/api/integrations/whatsapp/status")
          .then((r) => r.json())
          .then((st) => {
            if (st.success) {
              setWaStatus({
                needsPublicWebhook: st.needsPublicWebhook,
                aiReady: st.aiReady,
                phoneNumberIdInvalid: st.phoneNumberIdInvalid,
                phoneNumberIdError: st.phoneNumberIdError,
                tokenExpired: st.tokenExpired,
                publicWebhookUrl: st.publicWebhookUrl,
                hints: st.hints,
              });
            }
          })
          .catch(() => {});

        if (data.success && data.workspaces?.length > 0) {
          const mapped: Workspace[] = data.workspaces.map((w: {
            id: string;
            name: string;
            industry: string;
            slug: string;
            status?: string;
            automations?: Array<{
              id: string;
              name: string;
              type?: string;
              enabled?: boolean;
              status?: string;
              requiredProvider?: "meta" | "google" | "commerce" | "others" | null;
              requiredIntegrations?: string[];
              missingIntegrations?: string[];
              runs?: number;
              lastRun?: string;
            }>;
          }) => ({
            id: w.id,
            name: w.name,
            industry: getIndustryPreset(w.industry).label,
            slug: w.slug,
            status: (w.status as Workspace["status"]) || "live",
            version: 1,
            automations: (w.automations || []).map((a) => ({
              id: a.id,
              name: a.name,
              type: a.type || "whatsapp_flow",
              enabled: a.enabled ?? a.status === "active",
              status: (a.status as Automation["status"]) || undefined,
              requiredProvider: a.requiredProvider ?? null,
              requiredIntegrations: Array.isArray(a.requiredIntegrations) ? a.requiredIntegrations : undefined,
              missingIntegrations: Array.isArray(a.missingIntegrations) ? a.missingIntegrations : undefined,
              runs: a.runs ?? 0,
              lastRun: a.lastRun || "Never",
            })),
          }));

          setWorkspaces(mapped);

          const wsParam = new URLSearchParams(window.location.search).get("ws");
          const pick = wsParam ? mapped.find((w) => w.id === wsParam) : null;
          setWs(pick || mapped[0]);
          setContacts(data.contacts || []);
        } else {
          setWorkspaces([]);
          setWs(null);
          setContacts([]);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setLoadError(
          err instanceof Error && err.message === "Failed to fetch"
            ? "Server not responding. In terminal run: cd anasnode-next && npx prisma generate && npx prisma db push && npm run dev"
            : "Could not load dashboard. Refresh the page."
        );
      } finally {
        setLoadingData(false);
      }
    }

    loadDashboardData();
  }, [router]);

  const toggleAutomation = async (automationId: string) => {
    if (!ws) return;
    const automation = ws.automations.find((a) => a.id === automationId);
    if (!automation) return;

    setToggleLoading(automationId);
    const endpoint = automation.enabled
      ? `/api/v1/workflows/${automationId}/deactivate`
      : `/api/v1/workflows/${automationId}/activate`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        console.error("Toggle failed:", data.message || data.error);
        return;
      }

      setWorkspaces((prev) =>
        prev.map((w) => {
          if (w.id !== ws.id) return w;
          const updated = {
            ...w,
            automations: w.automations.map((a) =>
              a.id === automationId ? { ...a, enabled: !a.enabled } : a
            ),
          };
          setWs(updated);
          return updated;
        })
      );
      setWebhookActive(
        ws.automations.some(
          (a) => a.id === automationId ? !automation.enabled : a.enabled
        )
      );
    } catch (e) {
      console.error("Toggle automation error:", e);
    } finally {
      setToggleLoading(null);
    }
  };

  const tabLabel: Record<Tab, string> = {
    voice_agent: "Voice AI",
    ai_agent:    "Automate",
    calls: "Call Logs",
    overview:    "Home",
    inbox:       "Inbox",
    approvals:   "Approvals",
    contacts:    "Contacts",
    automations: "Workflows",
    broadcasts:  "Broadcasts",
    analytics:   "Analytics",
    team:        "Team Settings",
    properties:  "Properties",
    leads:       "Lead Pipeline",
  };

  if (!mounted || loadingData || isDeployingAgent) {
    return (
      <div className="flex h-screen w-full bg-[#F5F5F5] items-center justify-center flex-col gap-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[100px] animate-pulse" />
        </div>
        
        <div className="z-10 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-zinc-100 flex flex-col items-center max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0A6BFF] rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-100/50">
            {isDeployingAgent ? <Activity className="w-8 h-8 animate-bounce" /> : <Loader2 className="w-8 h-8 animate-spin" />}
          </div>
          {isDeployingAgent && (
            <>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">
                Deploying Your AI Agent...
              </h2>
              
              <p className="text-[13px] text-zinc-500 font-medium mb-8">
                We are building your workspace and wiring up your automations to the AI engine.
              </p>
            </>
          )}

          {/* Loading bar */}
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#0A6BFF] w-2/3 rounded-full animate-pulse transition-all duration-1000 ease-in-out" />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-screen bg-[#F5F5F5] items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <p className="text-[15px] font-medium text-zinc-900">{loadError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="h-9 px-4 rounded-md bg-[#0A6BFF] hover:bg-blue-600 text-white shadow-sm text-[13px] font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!ws || workspaces.length === 0) {
    return (
      <div className="flex h-screen bg-[#F5F5F5] items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-zinc-900">No automation yet</h1>
          <p className="text-zinc-500 mt-2 text-[15px]">
            Describe your business on the home page or finish onboarding â€” Anaos will compile your first workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <a
              href="/"
              className="px-5 py-2.5 rounded-xl bg-[#0A6BFF] text-white font-semibold text-[14px]"
            >
              Create with prompt
            </a>
            <a
              href="/onboarding"
              className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white font-semibold text-[14px]"
            >
              Finish setup
            </a>
          </div>
        </div>
      </div>
    );
  }

  const industryPreset = getIndustryPreset(ws.industry);

  return (
    <IndustryShell preset={industryPreset}>
    <div className="flex h-screen bg-white overflow-hidden font-sans relative">
      {/* High-Vibrancy Glowing Blur Blobs (Dashboard Root) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#00B0FF] opacity-[0.05] blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#3B82F6] opacity-[0.05] blur-[120px]" />
      </div>

      <Sidebar
        active={tab}
        onChange={handleTabChange}
        ws={ws}
        onWsChange={(w) => { setWs(w); handleTabChange("overview"); }}
        workspaces={workspaces}
        preset={industryPreset}
        user={user}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="dashboard-shell flex-1 flex flex-col overflow-hidden min-w-0 bg-transparent relative z-10">
        <Topbar 
          title={tabLabel[tab]} 
          ws={ws} 
          preset={industryPreset} 
          waStatus={waStatus} 
          integrations={integrations} 
          onMenuClick={() => setSidebarOpen(true)} 
        />
          
          <main
            className={`flex-1 overflow-y-auto overflow-x-hidden ${
              tab === "inbox" ? "overflow-hidden p-0" : "bg-[#F8F9FA]"
            }`}
          >
            <div className={tab === "inbox" || tab === "voice_agent" || tab === "calls" || tab === "ai_agent" || tab === "contacts" || tab === "bookings" || tab === "properties" || tab === "leads" || tab === "cleaning_bookings" || tab === "construction_projects" || tab === "maintenance_orders" || tab === "it_tickets" || tab === "fencing_estimates" ? "" : "px-4 py-6 md:px-10 md:pt-8 md:pb-8"}>
              {tab === "voice_agent" && <VoiceAgentHub />}
              {tab === "ai_agent"    && <AIAgentPage     ws={ws} />}
              {tab === "overview"    && <DashboardHome ws={ws} preset={industryPreset} roiMetrics={roiMetrics} />}
              {tab === "calls"       && <CallsPage />}
              {tab === "inbox"       && <InboxPage initialConversationId={inboxChatId} preset={industryPreset} />}
              {tab === "contacts"    && <ContactsHub />}
              {tab === "bookings"    && <BookingsHub />}
              {tab === "automations" && <AutomationsPage ws={ws} integrations={integrations} toggleAutomation={toggleAutomation} toggleLoading={toggleLoading} />}
              {tab === "templates"   && <TemplatesHub />}
              {tab === "broadcasts"  && <BroadcastsPage ws={ws} />}
              {tab === "analytics"   && <AnalyticsPage />}
              {tab === "team"        && <TeamSettingsPage />}
              {tab === "properties"  && <PropertiesEmbedPage />}
              {tab === "leads"       && <LeadsEmbedPage />}
              {tab === "cleaning_bookings" && <CleaningBookingsPage />}
              {tab === "construction_projects" && <ConstructionProjectsPage />}
              {tab === "maintenance_orders" && <MaintenanceOrdersPage />}
              {tab === "it_tickets" && <ITTicketsPage />}
              {tab === "fencing_estimates" && <FencingEstimatesPage />}
            </div>
          </main>
      </div>
    </div>
    </IndustryShell>
  );
}

