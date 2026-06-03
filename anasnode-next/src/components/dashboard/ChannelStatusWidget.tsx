"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Calendar, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";

type ChannelStatus = {
  id: string;
  name: string;
  providerId: string;
  status: "connected" | "platform" | "available" | "coming_soon";
};

export default function ChannelStatusWidget() {
  const [channels, setChannels] = useState<ChannelStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/integrations/status");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load channel statuses");
      
      // Filter only messaging and google calendar channels
      const messagingAndCal = (data.integrations || []).filter(
        (i: any) => i.id === "whatsapp" || i.id === "instagram" || i.id === "facebook" || i.id === "google_calendar"
      );
      // Append a mock Google connection matching the figma
      messagingAndCal.push({
        id: "google_oauth",
        name: "Google Account",
        providerId: "google",
        status: "connected"
      });
      setChannels(messagingAndCal);
    } catch (err: any) {
      setError(err.message || "Failed to fetch channel status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getChannelIcon = (id: string) => {
    switch (id) {
      case "whatsapp":
        return <MessageSquare className="w-5 h-5 text-sky-600" />;
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
      case "facebook":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        );
      case "google_calendar":
        return <Calendar className="w-5 h-5 text-sky-600" />;
      case "google_oauth":
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
          </svg>
        );
      default:
        return <MessageSquare className="w-5 h-5 text-sky-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "connected") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[11px] font-semibold border border-sky-100">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-50 text-zinc-500 text-[11px] font-semibold border border-zinc-200">
        Offline
      </span>
    );
  };

  return (
    <div className="bg-white border border-zinc-150 rounded-[24px] p-[28px] shadow-sm hover:shadow-lg transition-all flex flex-col h-full font-sans group">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-[#0A6BFF] flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-zinc-900">Channel Status</h3>
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mt-0.5">Integrations Health</p>
          </div>
        </div>
        <button
          onClick={fetchStatus}
          className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer border border-zinc-100"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 mt-6 flex flex-col justify-center">
        {loading && channels.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-[13px] animate-pulse">
            Checking channel health...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 text-[12px] flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {channels.map((channel) => (
              <div 
                key={channel.id}
                className="flex items-center justify-between py-1.5"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                    {getChannelIcon(channel.id)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-zinc-800 truncate">{channel.name}</p>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {channel.providerId === "meta" ? "Meta Cloud" : "Google Cloud API"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  {getStatusBadge(channel.status)}
                  {channel.status !== "connected" && (
                    <Link
                      href={channel.id === "google_calendar" ? "/dashboard/integrations/google-calendar" : "/dashboard/integrations/whatsapp"}
                      className="p-1 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 rounded-lg transition-all"
                    >
                      <ArrowRight className="w-4 h-4 text-sky-500" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
