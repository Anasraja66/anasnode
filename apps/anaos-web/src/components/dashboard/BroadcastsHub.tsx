"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Loader2, Megaphone, MoreHorizontal, Plus, Shield } from "lucide-react";
import { META_BROADCAST_RULES } from "@/lib/broadcast/meta-policy";
import BroadcastForm from "@/components/broadcasts/BroadcastForm";

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
  const [isCreating, setIsCreating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/broadcasts");
    const data = await res.json();
    if (data.broadcasts) setCampaigns(data.broadcasts || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createFromPrompt = async () => {
    if (!prompt.trim()) return;
    setIsCreating(true); // Open the ManyChat UI with the prompt context!
  };

  if (isCreating) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <BroadcastForm 
          onBack={() => setIsCreating(false)} 
          onSaved={() => {
            load();
            setIsCreating(false);
          }} 
          initialPrompt={prompt}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-6 py-10 relative z-10 pb-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-[22px] font-bold text-zinc-900 tracking-tight leading-tight flex items-center gap-2">
            <Megaphone className="text-[#0A6BFF]" size={24} />
            Bulk Broadcasts
          </h1>
          <p className="text-[14px] text-zinc-500 font-medium max-w-2xl leading-relaxed mt-2">
            Send bulk messages via WhatsApp, Voice Calls, or Emails to your real estate leads while staying compliant with 
            <span className="text-emerald-600 font-bold mx-1">Meta Business Rules</span>.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#0A6BFF] text-white text-[14px] font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          New Broadcast
        </button>
      </div>

      {/* AI OS: Prompt to Campaign */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="text-[15px] font-bold text-zinc-900 tracking-tight">Create Campaign via AI</h2>
          <p className="text-[12.5px] text-zinc-500 mt-0.5">Describe your target audience and goal to instantly generate a ManyChat-style broadcast template.</p>
        </div>
        
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Describe your goal (e.g., 'Send 50 leads a morning update about Marina apartments with an opt-out option')... (You can paste anything here)"
            className="w-full text-sm border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none bg-white"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
           <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
             <span className="text-yellow-500 text-[14px]">⚡</span> Powered by AnaOS AI Engine
           </p>
           <button
            type="button"
            disabled={creating || !prompt.trim()}
            onClick={createFromPrompt}
            className="inline-flex items-center gap-3 h-11 px-8 rounded-xl bg-[#0A6BFF] text-white text-[14px] font-bold hover:bg-blue-600 transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5" />}
            {creating ? "GENERATING..." : "GENERATE IN BUILDER"}
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
                    <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">Fetching Campaigns...</p>
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-zinc-400 font-bold text-[15px]">
                    No broadcasts found. Click "New Broadcast" to start marketing.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-semibold text-zinc-900 hover:text-purple-600 transition-colors tracking-tight">
                        {c.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        c.status === 'sent' || c.status === 'live' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-zinc-900 tabular-nums">{c.sentCount}</span>
                        <span className="text-[11px] text-zinc-400 font-semibold uppercase">SENT</span>
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
