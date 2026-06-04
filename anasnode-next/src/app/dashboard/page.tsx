"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { InboxPage } from "@/components/dashboard/InboxPage";
import { ContactsHub } from "@/components/dashboard/ContactsHub";
import { IndustryShell } from "@/components/dashboard/IndustryShell";
import { IndustryWelcome } from "@/components/dashboard/IndustryWelcome";
import { getIndustryPreset, type IndustryPreset } from "@/lib/industry/presets";
import { AnaosAIHub } from "@/components/dashboard/AnaosAIHub";
import { BroadcastsHub } from "@/components/dashboard/BroadcastsHub";
import TeamSettingsPage from "@/components/dashboard/TeamSettingsPage";
import TodayBookingsWidget from "@/components/dashboard/TodayBookingsWidget";
import ChannelStatusWidget from "@/components/dashboard/ChannelStatusWidget";
import BrandIcon from "@/components/ui/BrandIcon";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "ai_agent" | "overview" | "inbox" | "contacts" | "automations" | "broadcasts" | "analytics" | "team";

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

// ─── OS Home Component (Manychat-inspired but Industry-Aware) ───────────

import { PromptBox } from "@/components/landing/PromptBox";
import { Typewriter } from "@/components/landing/Typewriter";
import { WordRotator } from "@/components/landing/WordRotator";

// ─── OS Home Component (Premium SaaS - Business Owner Focus) ──────────

import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";

function DashboardHome({ ws, preset }: { ws: Workspace; preset: IndustryPreset }) {
  const Icon = preset.icon;
  const [showConnectors, setShowConnectors] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [dateStr, setDateStr] = useState("");

  // Client-only: avoids SSR/client hydration mismatch
  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good morning");
    else if (hr < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    setDateStr(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const businessConnectors = [
    { 
      name: "WhatsApp", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#25D366"/>
        </svg>
      )
    },
    { 
      name: "Facebook", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
        </svg>
      )
    },
    { 
      name: "Instagram", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="#E4405F"/>
        </svg>
      )
    },
    { 
      name: "Shopify", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path fill="#96bf48" d="M18.8 6.4L16.2 0H7.8L5.2 6.4L0 7.8L1.6 22.4L12 24L22.4 22.4L24 7.8L18.8 6.4Z" />
          <path fill="#fff" d="M12 19.2c-1.6 0-2.8-1-3.2-2l-.6-.8 1.8-.8.4.6c.2.4.8 1 1.6 1 .8 0 1.4-.4 1.4-1s-.4-.8-1.4-1.2c-1.6-.6-2.8-1.2-2.8-2.8 0-1.4 1-2.4 2.6-2.4 1.4 0 2.4.8 2.8 1.6l.6.8-1.8.8-.4-.6c-.2-.4-.6-.8-1.2-.8-.6 0-1 .4-1 .8 0 .4.4.6 1.2 1 1.6.6 2.8 1.2 2.8 2.8 0 1.4-1 2.8-2.8 2.8z" />
        </svg>
      )
    },
    { 
      name: "TikTok", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5 bg-black rounded-full">
          <path d="M12.525.02c1.31 0 2.591.26 3.811.73v4.257c-.711-.31-1.481-.47-2.281-.47-2.92 0-5.29 2.37-5.29 5.29 0 .09.01.18.02.27v4.25c-.01-.09-.02-.18-.02-.27 0-5.28 4.29-9.57 9.57-9.57.81 0 1.58.1 2.31.29V.75C19.385.25 18.104 0 16.794 0h-4.269v16.706c0 2.214-1.801 4.015-4.015 4.015s-4.015-1.801-4.015-4.015 1.801-4.015 4.015-4.015c.253 0 .495.029.731.083v-4.172c-.24-.022-.482-.036-.731-.036-4.51 0-8.17 3.66-8.17 8.17 0 4.51 3.66 8.17 8.17 8.17s8.17-3.66 8.17-8.17v-10.08c1.505 1.225 3.411 1.956 5.49 1.956v-4.17c-3.13 0-5.67-2.54-5.67-5.67V.02h-4.25z" fill="#fff" />
        </svg>
      )
    }
  ];
  
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



  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-[28px] relative z-10"
    >
      <OnboardingWizard />
      {/* Background foundation removed for cleaner look */}
      <div className="relative z-10 space-y-[28px] max-w-6xl mx-auto font-sans">
        {/* Welcome Row (SaaS Style) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-150 pb-6">
          <div>
            <h1 className="text-[26px] font-black text-zinc-900 tracking-[-0.02em] leading-tight" suppressHydrationWarning>
              {greeting ? `${greeting}, Operator` : "Welcome, Operator"}
            </h1>
            <p className="text-[13px] text-zinc-500 font-medium mt-1" suppressHydrationWarning>
              Workspace: <span className="font-bold text-zinc-700">{ws.name}</span>{dateStr ? ` · ${dateStr}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-550 mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Production Workspace
            </span>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-white border border-zinc-200 text-zinc-700 text-[12.5px] font-bold hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 3-Column Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:border-zinc-300 transition-all duration-300">
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Total Conversations</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-[26px] font-bold text-zinc-900 leading-none">0</span>
              <span className="text-[12px] text-zinc-500 font-medium ml-1 bg-zinc-50 px-2 py-0.5 rounded-full">New Account</span>
            </div>
            <p className="text-[12px] text-zinc-500 mt-2">Active threads across Meta & WhatsApp</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:border-zinc-300 transition-all duration-300">
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.1em]">AI Resolution Rate</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-[26px] font-bold text-zinc-900 leading-none">0%</span>
              <span className="text-[12px] text-zinc-500 font-medium ml-1 bg-zinc-50 px-2 py-0.5 rounded-full">Calibrating</span>
            </div>
            <p className="text-[12px] text-zinc-500 mt-2">Resolved automatically by Anaos AI</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:border-zinc-300 transition-all duration-300">
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.1em]">Pending Bookings</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-[26px] font-bold text-zinc-900 leading-none">0</span>
              <span className="text-[12px] text-zinc-500 font-medium ml-1 bg-zinc-50 px-2 py-0.5 rounded-full">Today</span>
            </div>
            <p className="text-[12px] text-zinc-500 mt-2">Google Calendar synced slot bookings</p>
          </div>
        </div>

        {/* Compact Prompt Input Card */}
        <motion.div variants={itemVariants} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm relative z-20">
          <h2 className="text-[16px] font-bold text-zinc-900 mb-3 font-sans">Ask Anaos AI to build or edit automations</h2>
          <PromptBox />
          
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
                    <h4 className="text-[13px] font-bold text-zinc-900 leading-tight font-sans">Connectors are now available.</h4>
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
                      className="bg-zinc-900 hover:bg-zinc-800 text-white text-[12px] font-semibold px-4 py-1.5 rounded-lg transition-all shadow-sm font-sans"
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
            className="bg-white border border-zinc-200 rounded-xl p-6 space-y-6 shadow-sm hover:border-zinc-300 transition-all duration-300 flex flex-col group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-zinc-200 text-zinc-700 flex items-center justify-center shadow-sm">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-[14px] font-semibold text-zinc-900">Messaging</h3>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { name: "WhatsApp Business", id: "whatsapp" },
                { name: "Instagram DM", id: "instagram" },
                { name: "Facebook Messenger", id: "facebook" },
                { name: "Email & SMS", id: "smtp" }
              ].map((c) => (
                <div key={c.name} className="bg-white border border-zinc-200 px-4 py-3 rounded-xl text-[13px] font-semibold text-zinc-750 shadow-sm flex items-center justify-between hover:border-sky-300 transition-colors cursor-pointer group/item">
                  <div className="flex items-center gap-3">
                    <BrandIcon id={c.id} className="w-4.5 h-4.5 shrink-0" />
                    <span>{c.name}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* CENTER: Anaos Engine (The Brain) */}
          <div className="flex flex-col gap-6">
            <motion.div 
              variants={itemVariants}
              className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:border-zinc-300 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-700 mb-4 relative border border-zinc-200">
                 <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-semibold text-zinc-900">Anaos Engine</h3>
                <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                  ANASMIND MEMORY
                </p>
              </div>
            </motion.div>

            {/* BOTTOM: Content & Growth */}
            <motion.div 
              variants={itemVariants}
              className="bg-white border border-zinc-200 rounded-xl p-6 space-y-6 shadow-sm hover:border-zinc-300 transition-all duration-300 flex-1 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-zinc-200 text-zinc-700 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-[14px] font-semibold text-zinc-900">Growth AI</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "TikTok Ads", id: "tiktok" },
                  { name: "YouTube", id: "youtube" },
                  { name: "LinkedIn", id: "linkedin" },
                  { name: "Blog Posts", id: "blog" }
                ].map((c) => (
                  <div key={c.name} className="bg-white border border-zinc-200 px-3 py-2.5 rounded-xl text-[12px] font-semibold text-zinc-750 shadow-sm flex items-center gap-2.5 hover:border-sky-300 transition-colors cursor-pointer">
                    <BrandIcon id={c.id} className="w-4.5 h-4.5 shrink-0" />
                    <span className="truncate">{c.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Business Integrations */}
          <motion.div 
            variants={itemVariants}
            className="bg-white border border-zinc-200 rounded-xl p-6 space-y-6 shadow-sm hover:border-zinc-300 transition-all duration-300 flex flex-col group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-zinc-200 text-zinc-700 flex items-center justify-center shadow-sm">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-[14px] font-semibold text-zinc-900">Integrations</h3>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { name: "Shopify Store", id: "shopify" },
                { name: "Google Calendar", id: "googlecalendar" },
                { name: "HubSpot CRM", id: "hubspot" },
                { name: "Stripe Payments", id: "stripe" }
              ].map((c) => (
                <div key={c.name} className="bg-white border border-zinc-200 px-4 py-3 rounded-xl text-[13px] font-semibold text-zinc-750 shadow-sm flex items-center justify-between hover:border-sky-300 transition-colors cursor-pointer group/item">
                  <div className="flex items-center gap-3">
                    <BrandIcon id={c.id} className="w-4.5 h-4.5 shrink-0" />
                    <span>{c.name}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover/item:text-sky-500 transition-colors" />
                </div>
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

// ─── Left Sidebar Component ──────────────────────────────────────────────────

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

  const isAgent = user?.role === "agent";

  const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview",    label: "Home",           icon: Home },
    { id: "inbox",       label: "Inbox",          icon: Inbox },
    { id: "contacts",    label: "Contacts",       icon: Users },
  ];

  if (!isAgent) {
    NAV_ITEMS.push({ id: "automations", label: "Workflows", icon: GitBranch });
    NAV_ITEMS.push({ id: "broadcasts",  label: "Broadcasts", icon: Megaphone });
  }

  NAV_ITEMS.push({ id: "ai_agent",    label: "Knowledge Base",    icon: FileText });

  return (
    <aside className={`dashboard-sidebar w-[260px] shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full z-40 transition-transform duration-300 md:translate-x-0 md:static fixed inset-y-0 left-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Professional Branding Logo */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-100 relative bg-white">
        <div className="flex items-center gap-2">
          <div className="w-6.5 h-6.5 rounded-md bg-zinc-900 flex items-center justify-center text-white text-[11px] font-bold">
            A
          </div>
          <span className="text-[14px] font-bold text-zinc-900 tracking-tight leading-none">AnasNode</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="md:hidden p-1 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Workspace switcher */}
      <div className="px-3 py-4 border-b border-zinc-100 relative">
        <button
          type="button"
          onClick={() => setWsOpen(!wsOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 transition-all cursor-pointer text-left border border-transparent hover:border-zinc-200 group"
        >
          <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center shrink-0 text-[13px] font-semibold text-zinc-800">
            {ws.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-zinc-800 truncate leading-snug">
              {ws.name}
            </p>
            <p className="text-[11px] font-medium text-zinc-400 truncate">{preset.label}</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-300 shrink-0 transition-transform ${wsOpen ? "rotate-180" : ""}`}
          />
        </button>

        {wsOpen && (
          <div className="absolute left-3 right-3 top-full mt-1 rounded-xl border border-zinc-200 bg-white shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
            {workspaces.map((w) => (
              <button
                key={w.id}
                onClick={() => { onWsChange(w); setWsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-50 transition-colors cursor-pointer ${ws.id === w.id ? "bg-zinc-50" : ""}`}
              >
                <div className="w-6 h-6 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-zinc-600">{w.name[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-zinc-700 truncate">{w.name}</p>
                  <p className="text-[10px] text-zinc-400">{w.industry}</p>
                </div>
                {ws.id === w.id && (
                  <Check className="w-4 h-4 shrink-0 text-zinc-800" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`w-full flex items-center gap-3 h-11 px-3 rounded-xl text-[13px] transition-all cursor-pointer group border-l-4 ${
                isActive
                  ? "bg-[#E6F0FF] text-[#0A6BFF] font-bold border-[#0A6BFF] rounded-l-none pl-2 shadow-sm"
                  : "text-zinc-550 font-medium hover:bg-zinc-100 hover:text-zinc-855 border-transparent pl-2"
              }`}
            >
              <Icon
                className={`w-[20px] h-[20px] shrink-0 transition-colors ${
                  isActive ? "text-[#0A6BFF] stroke-[2.5]" : "text-zinc-400 group-hover:text-zinc-600 stroke-[2]"
                }`}
              />
              {label}
            </button>
          );
        })}

        {!isAgent && (
          <>
            <div className="pt-6 pb-2 px-3">
              <span className="text-[9px] font-black tracking-[0.25em] text-zinc-400 uppercase">Insights</span>
            </div>
            
            <button
              type="button"
              onClick={() => onChange("analytics")}
              className={`w-full flex items-center gap-3 h-11 px-3 rounded-xl text-[13px] transition-all cursor-pointer group border-l-4 ${
                active === "analytics"
                  ? "bg-[#E6F0FF] text-[#0A6BFF] font-bold border-[#0A6BFF] rounded-l-none pl-2 shadow-sm"
                  : "text-zinc-550 font-medium hover:bg-zinc-100 hover:text-zinc-855 border-transparent pl-2"
              }`}
            >
              <BarChart2
                className={`w-[20px] h-[20px] shrink-0 transition-colors ${
                  active === "analytics" ? "text-[#0A6BFF] stroke-[2.5]" : "text-zinc-400 group-hover:text-zinc-600 stroke-[2]"
                }`}
              />
              Analytics
            </button>
          </>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div className="px-3 py-4 border-t border-zinc-100 space-y-1 bg-transparent">
        {!isAgent && (
          <button
            type="button"
            onClick={() => onChange("team")}
            className={`w-full flex items-center gap-3 h-11 px-3 rounded-xl text-[13px] font-medium transition-all group cursor-pointer border-l-4 ${
              active === "team"
                ? "bg-[#E6F0FF] text-[#0A6BFF] font-bold border-[#0A6BFF] rounded-l-none pl-2 shadow-sm"
                : "text-zinc-450 hover:bg-zinc-100 hover:text-zinc-700 border-transparent pl-2"
            }`}
          >
            <Users className={`w-[18px] h-[18px] group-hover:text-zinc-500 stroke-[2] ${active === "team" ? "text-[#0A6BFF]" : "text-zinc-300"}`} />
            Team Settings
          </button>
        )}
        <a
          href="/dashboard/integrations"
          className="w-full flex items-center gap-3 h-11 px-3 rounded-xl text-[13px] font-medium text-zinc-450 hover:bg-zinc-100 hover:text-zinc-700 transition-all group border-l-4 border-transparent pl-2"
        >
          <Plug className="w-[18px] h-[18px] text-zinc-300 group-hover:text-zinc-500 stroke-[2]" />
          Integrations
        </a>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 h-11 px-3 rounded-xl text-[13px] font-medium text-zinc-450 hover:bg-zinc-100 hover:text-zinc-700 transition-all group border-l-4 border-transparent pl-2 cursor-pointer"
        >
          <LogOut className="w-[18px] h-[18px] text-zinc-300 group-hover:text-zinc-500 stroke-[2]" />
          Log out
        </button>
        
        <div className="flex items-center gap-3 px-3 pt-4 mt-3 border-t border-zinc-100">
          <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-white/10">
            <span className="text-[13px] font-bold text-white uppercase text-center w-full">
              {user?.name ? user.name.slice(0, 2) : (user?.email ? user.email.slice(0, 2) : "UN")}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black text-zinc-800 truncate tracking-tight">{user?.name || "User"}</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {user?.role ? `${user.role} OS` : "Agent OS"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
// ─── Topbar Component ─────────────────────────────────────────────────────────

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

  // Determine if we show the alert banner
  const hasIssue = waStatus.tokenExpired || waStatus.phoneNumberIdInvalid || waStatus.needsPublicWebhook || !integrations.fastapi;
  
  let alertMessage = "";
  if (waStatus.tokenExpired) alertMessage = "Meta token expired — reconnect WhatsApp in Integrations.";
  else if (waStatus.phoneNumberIdInvalid) alertMessage = `Phone ID Error: ${waStatus.phoneNumberIdError || "Check settings"}`;
  else if (waStatus.needsPublicWebhook) alertMessage = "Public webhook missing — use tunnel for local testing.";
  else if (!integrations.fastapi) alertMessage = "AI Engine (FastAPI) is offline — run 'fastapi dev main.py' in backend.";

  return (
    <div className="flex flex-col shrink-0">
      {/* Global OS Alert Banner (Only shows when there's an issue) */}
      {hasIssue && (
        <div className="bg-zinc-950 text-white px-5 py-2 flex items-center justify-between z-50 animate-in slide-in-from-top duration-300">
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
        <div className="bg-emerald-600 text-white px-5 py-1.5 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
            <p className="text-[11px] font-bold tracking-tight uppercase">System Status: All systems operational</p>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">WhatsApp Connected</span>
          </div>
        </div>
      )}

      <header className="h-16 border-b border-zinc-200 bg-white px-4 md:px-6 flex items-center justify-between shrink-0">
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
          <div className="relative group hidden md:block">
            <Search className="w-4 h-4 text-zinc-300 absolute left-3 top-2.5 transition-colors group-focus-within:text-zinc-500" />
            <input
              type="text"
              placeholder="Search everything..."
              className="h-9 pl-9 pr-4 rounded-lg border border-zinc-100 text-[13px] bg-zinc-50/50 focus:outline-none focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-100/50 transition-all w-64"
            />
          </div>
          <div className="h-6 w-px bg-zinc-100" />
          <button
            type="button"
            className="w-9 h-9 rounded-lg border border-zinc-100 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 transition-all cursor-pointer relative group"
          >
            <Bell className="w-4.5 h-4.5 transition-transform group-hover:rotate-12" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-zinc-800 border-2 border-white" />
          </button>
        </div>
      </header>
    </div>
  );
}


// ─── Status Badge Component ────────────────────────────────────────────────

function StatusBadge({ status }: { status: Workspace["status"] }) {
  const config = {
    live: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-100", label: "Live" },
    draft: { bg: "bg-zinc-100", text: "text-zinc-600", border: "border-zinc-200", label: "Draft" },
    paused: { bg: "bg-zinc-100", text: "text-zinc-500", border: "border-zinc-200", label: "Paused" },
  };
  const { bg, text, border, label } = config[status] || config.draft;
  return (
    <span className={`px-2 py-0.5 rounded-full border ${bg} ${text} ${border} text-[10px] font-black uppercase tracking-widest`}>
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

// ─── Page: Analytics ──────────────────────────────────────────────────────────

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
        <h1 className="text-3xl font-black text-zinc-800 tracking-tight">Analytics</h1>
        <p className="text-[15px] text-zinc-500 font-medium leading-relaxed">
          Real-time performance from your workflows — last 7 days
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
                <span className="text-[26px] font-bold text-zinc-900 tabular-nums mt-3 block tracking-tight leading-none">
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
              <div>
                <h2 className="text-[17px] font-black text-zinc-800 tracking-tight">Workflow activity</h2>
                <p className="text-[13px] text-zinc-500 font-bold mt-1">
                  Triggers vs successful runs ({stats.executionsLast7Days} this week)
                </p>
              </div>
              <div className="flex items-center gap-6 text-[12px] text-zinc-400 font-black uppercase tracking-wider">
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
                      <span className="text-[11px] font-black font-mono text-zinc-400 uppercase tracking-tighter">
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

// ─── Page: Automations (Channel-Aware State Machine) ──────────────────────────

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
  instagram:       { label: "Instagram",       color: "#E4405F", connectHref: "/dashboard/integrations" },
  facebook:        { label: "Facebook",        color: "#1877F2", connectHref: "/dashboard/integrations" },
  shopify:         { label: "Shopify",         color: "#96bf48", connectHref: "/dashboard/integrations/shopify" },
  smtp:            { label: "Email",           color: "#6366F1", connectHref: "/dashboard/integrations/email" },
  google_calendar: { label: "Google Calendar", color: "#EA4335", connectHref: "/dashboard/integrations" },
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
    needs_connection: { label: "Needs Connection", bg: "bg-sky-50/50",   text: "text-sky-600/90",   border: "border-sky-100/70",  dot: "bg-sky-400" },
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
  prompt: string;
  runs: number;
  lastRun: string;
  enabled: boolean;
}

function AutomationsPage({ ws, integrations, toggleAutomation, toggleLoading }: { ws: Workspace; integrations: { whatsapp: boolean; shopify: boolean; fastapi: boolean }; toggleAutomation: (id: string) => Promise<void>; toggleLoading: string | null }) {
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
    if (channelId === "shopify") return integrations.shopify;
    return false;
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
            const allConn = channels.every((c) => isConnected(c));
            const isEnabled = w.isActive ?? false;
            const state: AutomationChannelState = !allConn ? "needs_connection" : isEnabled ? "live" : "draft";
            const runs = w.stats?.runs ?? 0;
            const lastRun = w.lastRunAt ? new Date(w.lastRunAt).toLocaleDateString() : "Never";
            return { id: w.id, name: w.name, description: w.description || `Automation for ${ws.name}`, channels, state, prompt: "", runs, lastRun, enabled: isEnabled };
          });
          setApiAutomations(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingList(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws.id, integrations.whatsapp, integrations.shopify]);

  useEffect(() => {
    if (!prompt.trim()) { setDetectedChannels([]); setShowConnectPrompt(false); return; }
    const channels = detectChannels(prompt);
    setDetectedChannels(channels);
    setShowConnectPrompt(channels.some((c) => !isConnected(c)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, integrations.whatsapp, integrations.shopify]);

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
      const channels = detectChannels(prompt);
      const allConn = channels.every((c) => isConnected(c));
      setGenerated((prev) => [{
        id: data.workflow?.id || `local-${Date.now()}`,
        name: data.workflow?.name || "New Automation",
        description: prompt.slice(0, 90) + (prompt.length > 90 ? "…" : ""),
        channels,
        state: allConn ? "live" : "needs_connection",
        prompt,
        runs: 0,
        lastRun: "Just now",
        enabled: allConn,
      }, ...prev]);
      setPrompt("");
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setBuilding(false);
    }
  };

  const wsAutomations: GeneratedAutomation[] = ws.automations.map((a) => {
    const channels = detectChannels(a.name + " " + a.type);
    const allConn = channels.every((c) => isConnected(c));
    return {
      id: a.id, name: a.name,
      description: `Compiled from prompt for ${ws.name} (${ws.industry})`,
      channels,
      state: !allConn ? "needs_connection" : a.enabled ? "live" : "draft",
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

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-black text-zinc-900 tracking-tight leading-none">Automations</h1>
          <p className="text-[13.5px] text-zinc-400 font-medium mt-1.5 leading-snug">
            Describe a flow in plain language — Anaos builds it. Connect the channel to go live.
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-[11px] font-bold text-sky-600 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              {needsCount} Needs Connection
            </span>
          )}
        </div>
      </div>

      {/* ── Build with Prompt Card ── */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-zinc-100">
          <p className="text-[15px] font-semibold text-zinc-900 leading-snug">Build with prompt</p>
          <p className="text-[13px] text-zinc-500 font-medium mt-0.5">
            Describe your flow — Anaos detects the channel automatically
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
                  Some channels aren&apos;t connected — automation will be saved as <span className="italic font-bold">Needs Connection</span>.
                </p>
              </div>
              <a href="/dashboard/integrations" className="shrink-0 text-[11.5px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors whitespace-nowrap">
                Connect now →
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
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Building…</>
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

      {/* ── All Automations List ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.18em]">All Automations</h2>
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
              Use the prompt above to create your first flow — takes 30 seconds.
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
                        : a.state === "needs_connection" ? "#0A6BFF"
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
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-[10.5px] font-bold text-sky-600 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
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
                        <span className="text-[11.5px] text-zinc-300">·</span>
                        <span className="text-[12px] text-zinc-400">{a.runs} runs · {a.lastRun}</span>
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
                          href={CHANNEL_META[a.channels[0]]?.connectHref ?? "/dashboard/integrations"}
                          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#0A6BFF] bg-[#EBF2FF] border border-sky-200 px-3.5 py-2 rounded-xl hover:bg-sky-100 transition-colors shadow-sm whitespace-nowrap"
                        >
                          Connect
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

      {/* ── Bottom CTA ── */}
      {needsCount > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4.5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
            <div>
              <p className="text-[13.5px] font-semibold text-zinc-950">
                {needsCount} automation{needsCount > 1 ? "s" : ""} waiting for connection
              </p>
              <p className="text-[12.5px] text-zinc-500 font-medium mt-0.5">
                Connect your channels once — automations go live instantly.
              </p>
            </div>
          </div>
          <a
            href="/dashboard/integrations"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[12.5px] font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            Connect now <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Main Root Dashboard ──────────────────────────────────────────────────────

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
  const [integrations, setIntegrations] = useState({ whatsapp: false, shopify: false, fastapi: false });
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
      q === "contacts" ||
      q === "automations" ||
      q === "broadcasts" ||
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
          const hasDefaultWorkspace = data.workspaces.some(
            (w: { name: string }) => w.name === "My First Workspace"
          );

          if (hasDefaultWorkspace) {
            router.push("/onboarding");
            return;
          }

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
    ai_agent:    "Automate",
    overview:    "Home",
    inbox:       "Inbox",
    contacts:    "Contacts",
    automations: "Workflows",
    broadcasts:  "Broadcasts",
    analytics:   "Analytics",
    team:        "Team Settings",
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
          
          <h2 className="text-xl font-bold text-zinc-900 mb-2">
            {isDeployingAgent ? "Deploying Your AI Agent..." : "Loading Dashboard..."}
          </h2>
          
          <p className="text-[13px] text-zinc-500 font-medium mb-8">
            {isDeployingAgent 
              ? "We are building your workspace and wiring up your automations to the AI engine." 
              : "Syncing your secure workspace data."}
          </p>

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
            className="h-9 px-4 rounded-md bg-zinc-900 text-white text-[13px] font-medium"
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
            Describe your business on the home page or finish onboarding — Anaos will compile your first workflow.
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
            <div className={tab === "inbox" || tab === "ai_agent" || tab === "contacts" ? "" : "px-4 py-6 md:px-10 md:pt-8 md:pb-8"}>
              {tab === "ai_agent"    && <AIAgentPage     ws={ws} />}
              {tab === "overview"    && <DashboardHome ws={ws} preset={industryPreset} />}
              {tab === "inbox"       && <InboxPage initialConversationId={inboxChatId} preset={industryPreset} />}
              {tab === "contacts"    && <ContactsHub />}
              {tab === "automations" && <AutomationsPage ws={ws} integrations={integrations} toggleAutomation={toggleAutomation} toggleLoading={toggleLoading} />}
              {tab === "broadcasts"  && <BroadcastsPage ws={ws} />}
              {tab === "analytics"   && <AnalyticsPage />}
              {tab === "team"        && <TeamSettingsPage />}
            </div>
          </main>
      </div>
    </div>
    </IndustryShell>
  );
}
