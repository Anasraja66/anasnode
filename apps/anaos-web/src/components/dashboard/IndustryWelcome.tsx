import type { IndustryPreset } from "@/lib/industry/presets";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

type Ws = {
  name: string;
  automations: { enabled: boolean }[];
};

export function IndustryWelcome({
  preset,
  ws,
}: {
  preset: IndustryPreset;
  ws: Ws;
}) {
  const Icon = preset.icon;
  const activeCount = ws.automations.filter((a) => a.enabled).length;

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
      {/* Decorative clean background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-[80px] pointer-events-none -mr-10 -mt-10" />

      <div className="flex flex-col sm:flex-row sm:items-start gap-8 relative z-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-150 bg-zinc-50 text-zinc-900 shadow-sm">
          <Icon className="w-8 h-8" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#0A6BFF]" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                {preset.label} Intelligence
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-tight tracking-tight max-w-2xl">
              {preset.welcomeTitle}
            </h2>
          </div>
          
          <p className="text-[16px] text-zinc-500 font-medium max-w-2xl leading-relaxed">
            {preset.welcomeBody}
          </p>
          
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[12px] font-bold text-emerald-700">
                {activeCount} {activeCount === 1 ? "Agent" : "Agents"} Live
              </p>
            </div>
            <p className="text-[13px] text-zinc-400 font-medium">
              Running in <span className="text-zinc-700 font-bold">{ws.name}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-10 relative z-10 border-t border-zinc-100 pt-8">
        <Link
          href="/dashboard/integrations/connect/whatsapp"
          className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-zinc-900 text-white text-[14px] font-bold shadow-sm hover:bg-zinc-800 transition-colors"
        >
          {preset.connectWhatsApp}
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard?tab=inbox"
          className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-zinc-200 bg-white text-[14px] font-bold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm"
        >
          Open Inbox
        </Link>
      </div>
    </div>
  );
}
