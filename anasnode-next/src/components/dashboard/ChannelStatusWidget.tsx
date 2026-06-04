"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Calendar, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";

import BrandIcon from "../ui/BrandIcon";

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
    return <BrandIcon id={id} className="w-5 h-5" />;
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
    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm hover:border-zinc-350 transition-all flex flex-col h-full font-sans group">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#0A6BFF] flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-zinc-900 leading-none">Channel Status</h3>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mt-1">Integrations Health</p>
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
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                    {getChannelIcon(channel.id)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-850 truncate">{channel.name}</p>
                    <p className="text-[11.5px] text-zinc-450 truncate mt-0.5">
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
