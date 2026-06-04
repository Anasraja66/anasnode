"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, Megaphone, MoreHorizontal, Plus, Shield, Zap } from "lucide-react";
import { META_BROADCAST_RULES } from "@/lib/broadcast/meta-policy";

type Campaign = {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  sentCount: number;
  dailyCap: number;
};

export function BroadcastsHub({ workspaceName }: { workspaceName: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/broadcasts");
    const data = await res.json();
    if (data.success) setCampaigns(data.campaigns || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createFromPrompt = async () => {
    if (!prompt.trim()) return;
    setCreating(true);
    setError(null);
    const res = await fetch("/api/broadcasts/from-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, workspaceName }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setError(data.error || "Could not create");
      return;
    }
    window.location.href = `/dashboard/broadcasts/${data.campaign.id}`;
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 py-10 relative z-10 pb-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-[26px] font-bold text-zinc-900 tracking-tight leading-tight">Mass Broadcasts</h1>
          <p className="text-sm text-zinc-500 font-medium max-w-2xl leading-relaxed">
            Send bulk messages via WhatsApp while staying compliant with 
            <span className="text-emerald-600 font-bold mx-1">Meta Business Rules</span>.
          </p>
        </div>
        <Link
          href="/dashboard/broadcasts/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#0A6BFF] text-white text-[13px] font-semibold hover:bg-blue-600 transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Draft
        </Link>
      </div>

      {/* AI OS: Prompt to Campaign */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-white">
            <Zap className="w-5 h-5 fill-current text-emerald-400" />
          </div>
          <h2 className="text-[15px] font-bold text-zinc-900 tracking-tight">AI Campaign Generator</h2>
        </div>
        
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Describe your goal (e.g., 'Send 50 leads a morning update about Marina apartments with an opt-out option')..."
            className="w-full text-sm border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100 transition-all resize-none bg-white"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
           <p className="text-[12px] text-zinc-400 font-black uppercase tracking-[0.2em]">
             ⚡ Powered by AnasNode AI OS
           </p>
           <button
            type="button"
            disabled={creating || !prompt.trim()}
            onClick={createFromPrompt}
            className="inline-flex items-center gap-3 h-11 px-8 rounded-xl bg-[#0A6BFF] text-white text-[14px] font-black hover:bg-blue-600 transition-all shadow-sm disabled:opacity-30 active:scale-95 cursor-pointer"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5" />}
            {creating ? "GENERATING..." : "GENERATE CAMPAIGN"}
          </button>
        </div>
        {error && <p className="text-[13px] text-red-600 font-bold bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}
      </div>

      <details className="group rounded-xl border border-zinc-200 bg-white overflow-hidden transition-all shadow-sm">
        <summary className="px-6 py-4 font-semibold text-zinc-900 cursor-pointer hover:bg-zinc-50 flex items-center justify-between list-none">
          <span className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-zinc-400" />
            Meta Broadcast Rules (Required Reading)
          </span>
          <ChevronRight className="w-5 h-5 text-zinc-300 transition-transform group-open:rotate-90" />
        </summary>
        <div className="px-6 pb-5 pt-2">
          <ul className="space-y-3">
            {META_BROADCAST_RULES.map((r) => (
              <li key={r} className="flex items-start gap-4 text-[13px] text-zinc-500 font-medium">
                <div className="w-2 h-2 rounded-full bg-zinc-300 mt-1.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </details>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-zinc-900 uppercase tracking-[0.1em]">Active Drafts & History</h2>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-500">
            {campaigns.length} TOTAL
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-zinc-100">
                {["Campaign Name", "Status", "Delivery", "Last Updated", ""].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-300 mx-auto mb-4" />
                    <p className="text-[11px] text-zinc-400 font-black uppercase tracking-widest">Fetching Campaigns...</p>
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-zinc-400 font-bold text-[15px]">
                    No broadcasts found. Start with the AI generator above.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/broadcasts/${c.id}`}
                        className="text-[13px] font-semibold text-zinc-900 hover:text-blue-600 transition-colors tracking-tight"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        c.status === 'live' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-zinc-900 tabular-nums">{c.sentCount}</span>
                        <span className="text-[11px] text-zinc-400 font-semibold uppercase">/ {c.dailyCap} SENT</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-zinc-500 font-medium">
                      {new Date(c.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200 text-zinc-400 hover:text-zinc-900 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
