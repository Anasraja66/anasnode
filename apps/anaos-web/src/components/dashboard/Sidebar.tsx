"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";
import {
  Home, Inbox, CheckSquare, Users, Calendar, LayoutTemplate,
  Building2, LayoutDashboard, Scissors, Briefcase, GitBranch,
  Megaphone, PhoneCall, FileText, ChevronLeft, ChevronDown,
  Pin, Plus, Plug, LogOut, BarChart2
} from "lucide-react";
import { AnaosLogo } from "@/components/ui/AnaosLogo";
import { useDashboard } from "@/lib/context/DashboardContext";

export function Sidebar({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const { user, workspaces, ws, setWs, industryPreset } = useDashboard();
  const pathname = usePathname();
  
  const [wsOpen, setWsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!ws || !industryPreset) return null;

  const isAgent = user?.role === "agent";
  const activeTab = pathname.split('/').pop() || 'overview';
  const active = activeTab === 'dashboard' ? 'overview' : activeTab; // Handle /dashboard root

  type Tab = string;
  const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Home", icon: Home },
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "approvals", label: "Approvals", icon: CheckSquare },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "bookings", label: "Calendar", icon: Calendar },
    { id: "templates", label: "Templates", icon: LayoutTemplate },
  ];

  if (industryPreset.id === "real-estate") {
    NAV_ITEMS.push({ id: "properties", label: "Properties", icon: Building2 });
    NAV_ITEMS.push({ id: "leads", label: "Lead Pipeline", icon: LayoutDashboard });
  } else if (industryPreset.id === "cleaning") {
    NAV_ITEMS.push({ id: "cleaning_bookings", label: "Bookings", icon: Calendar });
  } else if (industryPreset.id === "construction") {
    NAV_ITEMS.push({ id: "construction_projects", label: "Projects & Bids", icon: Building2 });
  } else if (industryPreset.id === "maintenance") {
    NAV_ITEMS.push({ id: "maintenance_orders", label: "Work Orders", icon: Scissors });
  } else if (industryPreset.id === "it") {
    NAV_ITEMS.push({ id: "it_tickets", label: "Support Tickets", icon: Briefcase });
  } else if (industryPreset.id === "fencing") {
    NAV_ITEMS.push({ id: "fencing_estimates", label: "Estimates", icon: Building2 });
  }

  if (!isAgent) {
    NAV_ITEMS.push({ id: "automations", label: "Workflows", icon: GitBranch });
    NAV_ITEMS.push({ id: "broadcasts", label: "Broadcasts", icon: Megaphone });
  }

  NAV_ITEMS.push({ id: "calls", label: "Call Logs", icon: PhoneCall });
  NAV_ITEMS.push({ id: "voice_agent", label: "Voice AI", icon: PhoneCall });
  NAV_ITEMS.push({ id: "ai_agent", label: "Knowledge Base", icon: FileText });

  return (
    <aside
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => { setIsCollapsed(true); setWsOpen(false); }}
      className={`dashboard-sidebar shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full z-40 transition-all duration-300 md:translate-x-0 md:static fixed inset-y-0 left-0 ${open ? "translate-x-0" : "-translate-x-full"} ${isCollapsed ? "w-[68px]" : "w-[260px]"}`}
    >
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
            onClick={() => { setIsCollapsed(true); setOpen(false); }}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors cursor-pointer shrink-0 md:hidden"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

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
              <div className="absolute -bottom-1.5 -right-2 bg-zinc-800 text-white text-[8px] font-bold px-1.5 py-[1px] rounded-[3px] border border-white shadow-sm whitespace-nowrap tracking-wide">
                30 DAYS LEFT
              </div>
            )}
          </div>
          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1 flex items-center">
                <p className="text-[14px] font-medium text-zinc-900 truncate">{ws.name}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${wsOpen ? "rotate-180" : ""}`} />
            </>
          )}
        </button>

        {wsOpen && !isCollapsed && (
          <div className="absolute left-3 right-3 top-full mt-1 rounded-lg border border-zinc-200 bg-white shadow-xl overflow-hidden z-20 py-1">
            {workspaces.map((w) => (
              <button
                key={w.id}
                onClick={() => { setWs(w); setWsOpen(false); }}
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
                    <span className="bg-zinc-800 text-white text-[10px] font-bold px-1.5 py-[1px] rounded-sm tracking-wide">FREE TRIAL</span>
                    <Pin className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                </div>
              </button>
            ))}
            <div className="px-3 pt-2 pb-1 mt-1 border-t border-zinc-100">
              <button className="w-full py-1.5 rounded-md border border-zinc-200 text-[13px] text-zinc-600 flex items-center justify-center gap-1.5 hover:bg-zinc-50 transition-colors font-medium cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> New Account
              </button>
            </div>
          </div>
        )}
      </div>

      <nav className={`flex-1 pt-4 space-y-1 overflow-y-auto custom-scrollbar ${isCollapsed ? "px-2" : "px-3"}`}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          const href = id === "overview" ? "/dashboard" : `/dashboard/${id}`;
          return (
            <Link
              key={id}
              href={href}
              onClick={() => { if (window.innerWidth < 768) setOpen(false); }}
              title={isCollapsed ? label : undefined}
              className={`w-full flex items-center h-10 rounded-[8px] transition-all cursor-pointer group ${isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"} ${isActive ? "bg-[#0A6BFF]/10 text-[#0A6BFF] font-semibold" : "text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900"}`}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? "text-[#0A6BFF] stroke-[2]" : "text-zinc-400 group-hover:text-zinc-600 stroke-[2]"}`} />
              {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
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
            <Link
              href="/dashboard/analytics"
              onClick={() => { if (window.innerWidth < 768) setOpen(false); }}
              title={isCollapsed ? "Analytics" : undefined}
              className={`w-full flex items-center h-10 rounded-[8px] transition-all cursor-pointer group ${isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"} ${active === "analytics" ? "bg-[#0A6BFF]/10 text-[#0A6BFF] font-semibold" : "text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900"}`}
            >
              <BarChart2 className={`w-[18px] h-[18px] shrink-0 transition-colors ${active === "analytics" ? "text-[#0A6BFF] stroke-[2]" : "text-zinc-400 group-hover:text-zinc-600 stroke-[2]"}`} />
              {!isCollapsed && <span className="whitespace-nowrap">Analytics</span>}
            </Link>
          </>
        )}
      </nav>

      <div className={`py-4 border-t border-zinc-100 space-y-1 bg-transparent shrink-0 ${isCollapsed ? "px-2" : "px-3"}`}>
        {!isAgent && (
          <Link
            href="/dashboard/team"
            onClick={() => { if (window.innerWidth < 768) setOpen(false); }}
            title={isCollapsed ? "Team Settings" : undefined}
            className={`w-full flex items-center h-10 rounded-[8px] transition-all cursor-pointer group ${isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"} ${active === "team" ? "bg-[#0A6BFF]/10 text-[#0A6BFF] font-semibold" : "text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900"}`}
          >
            <Users className={`w-[18px] h-[18px] shrink-0 transition-colors ${active === "team" ? "text-[#0A6BFF]" : "text-zinc-400 group-hover:text-zinc-600"} stroke-[2]`} />
            {!isCollapsed && <span className="whitespace-nowrap">Team Settings</span>}
          </Link>
        )}
        <Link
          href="/dashboard/integrations"
          title={isCollapsed ? "Integrations" : undefined}
          className={`w-full flex items-center h-10 rounded-[8px] text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer group ${isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"}`}
        >
          <Plug className="w-[18px] h-[18px] shrink-0 transition-colors text-zinc-400 group-hover:text-zinc-600 stroke-[2]" />
          {!isCollapsed && <span className="whitespace-nowrap">Integrations</span>}
        </Link>
        <button
          onClick={async () => {
            try { await firebaseSignOut(auth); } catch (e) { }
            try { await fetch("/api/auth/session", { method: "DELETE" }); } catch (e) { }
            window.location.href = "/";
          }}
          title={isCollapsed ? "Log out" : undefined}
          className={`w-full flex items-center h-10 rounded-[8px] text-zinc-500 font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer group ${isCollapsed ? "justify-center px-0" : "gap-3 px-3.5"}`}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0 transition-colors text-zinc-400 group-hover:text-zinc-600 stroke-[2]" />
          {!isCollapsed && <span className="whitespace-nowrap">Log out</span>}
        </button>

        <div className={`mt-3 border-t border-zinc-100 ${isCollapsed ? "pt-3 flex justify-center" : "pt-4 px-3 flex items-center gap-3"}`}>
          <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 shadow-lg ring-2 ring-white/10">
            <span className="text-[13px] font-bold text-white uppercase text-center w-full">
              {user?.name ? user.name.slice(0, 2) : (user?.email ? user.email.slice(0, 2) : "UN")}
            </span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-zinc-800 truncate tracking-tight">{user?.name || "User"}</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user?.role ? `${user.role} OS` : "Agent OS"}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
