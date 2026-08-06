"use client";

import React, { useState, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChevronRight, Search, Loader2, Bell, AlertCircle, CheckCircle2, ArrowUpRight } from "lucide-react";
import { useDashboard } from "@/lib/context/DashboardContext";
import { usePathname } from "next/navigation";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { ws, waStatus, integrations } = useDashboard();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!ws) return null;

  const activeTab = pathname.split('/').pop() || 'overview';
  const tabLabelMap: Record<string, string> = {
    overview: "Home",
    dashboard: "Home",
    inbox: "Inbox",
    approvals: "Approvals",
    contacts: "Contacts",
    bookings: "Calendar",
    automations: "Workflows",
    broadcasts: "Broadcasts",
    analytics: "Analytics",
    team: "Team Settings",
    integrations: "Integrations",
  };
  const title = tabLabelMap[activeTab] || activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  const hasIssue = waStatus.tokenExpired || waStatus.phoneNumberIdInvalid || waStatus.needsPublicWebhook || !integrations?.fastapi;

  let alertMessage = "";
  if (waStatus.tokenExpired) alertMessage = "Meta token expired — reconnect WhatsApp in Integrations.";
  else if (waStatus.phoneNumberIdInvalid) alertMessage = `Phone ID Error: ${waStatus.phoneNumberIdError || "Check settings"}`;
  else if (waStatus.needsPublicWebhook) alertMessage = "Public webhook missing — use tunnel for local testing.";
  else if (!integrations?.fastapi) alertMessage = "AI Engine (FastAPI) is offline — run 'fastapi dev main.py' in backend.";

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => { if (data.success) setSearchResults(data.results); })
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="flex flex-col shrink-0">
      <header className="h-16 border-b border-zinc-200 bg-white px-4 md:px-6 flex items-center justify-between shrink-0 relative z-[60]">
        <div className="flex items-center gap-3 text-[13.5px]">
          <button type="button" onClick={onMenuClick} className="md:hidden p-1 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
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
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search NLP indexed data..." className="h-9 pl-9 pr-4 rounded-lg border border-zinc-200 text-[13px] bg-zinc-50/50 focus:outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all w-64 md:w-80" />
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden max-h-[420px] overflow-y-auto">
                <div className="px-3 py-2 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-zinc-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center">
                      <Search className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TF-IDF Search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {searchResults.length > 0 && <span className="text-[9px] font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">{searchResults.length} results</span>}
                    {isSearching && <Loader2 className="w-3 h-3 animate-spin text-sky-500" />}
                  </div>
                </div>
                {searchResults.length === 0 && !isSearching ? (
                  <div className="p-6 text-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-2"><Search className="w-4 h-4 text-zinc-400" /></div>
                    <p className="text-zinc-500 text-[12px] font-medium">No indexed chats match this query.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-50">
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {searchResults.map((res: any) => {
                      const doc = res.document ?? res;
                      const score = res.score ?? null;
                      const data = doc.data;
                      return (
                        <div key={doc._id} className="p-3 hover:bg-zinc-50/80 transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[12px] text-zinc-800 font-semibold leading-snug flex-1 truncate">{data.originalText}</p>
                            {score !== null && <span className="text-[11px] font-bold text-sky-700 tabular-nums">{score.toFixed(3)}</span>}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wider">⚡ {data.intent}</span>
                          </div>
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
            <button type="button" onClick={() => setShowNotifications(!showNotifications)} className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 transition-all cursor-pointer bg-white shadow-sm">
              <Bell className="w-4.5 h-4.5 transition-transform group-hover:rotate-12" />
              {hasIssue && <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />}
            </button>
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <h3 className="text-[13px] font-bold text-zinc-900">Notifications</h3>
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
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-3 border border-zinc-100"><CheckCircle2 className="w-5 h-5 text-zinc-300" /></div>
                      <p className="text-[13px] font-bold text-zinc-900">All caught up!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {hasIssue && (
        <div className="bg-rose-500 text-white shadow-md px-6 py-3 flex flex-col md:flex-row md:items-center justify-between z-50 animate-in slide-in-from-top duration-300 border-b border-rose-600">
          <div className="flex items-center gap-3 mb-3 md:mb-0">
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shrink-0 shadow-sm" />
            <p className="text-[14px] font-bold tracking-wide">System Error: {alertMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
