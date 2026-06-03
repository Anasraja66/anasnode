import type { IndustryPreset } from "@/lib/industry/presets";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <div
      className="rounded-[32px] border-2 p-10 sm:p-12 shadow-2xl shadow-zinc-200/20 relative overflow-hidden backdrop-blur-md"
      style={{
        borderColor: preset.softBorder,
        background: `linear-gradient(145deg, ${preset.gradientFrom}cc 0%, ${preset.gradientTo}cc 100%)`,
      }}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-white/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-10 relative z-10">
        <div
          className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-2xl ring-8 ring-white/20 transform hover:scale-105 transition-transform duration-500"
          style={{ backgroundColor: preset.primary, color: "white" }}
        >
          <Icon className="w-12 h-12" />
        </div>
        <div className="flex-1 space-y-3">
          <p
            className="text-[12px] font-black uppercase tracking-[0.3em] opacity-80"
            style={{ color: preset.accent }}
          >
            {preset.label} · ANASNODE OS
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-950 leading-[1.05] tracking-tight">
            {preset.welcomeTitle}
          </h2>
          <p className="text-[18px] text-zinc-800/70 font-bold max-w-2xl leading-relaxed">
            {preset.welcomeBody}
          </p>
          <div className="flex items-center gap-4 pt-4">
             <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-4 border-white bg-zinc-200 shadow-sm" />
                ))}
             </div>
             <p className="text-[14px] text-zinc-600 font-bold">
               <span className="text-zinc-900">{ws.name}</span> — {activeCount}{" "}
               automation{activeCount === 1 ? "" : "s"} live
             </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-5 mt-12 relative z-10">
        <Link
          href="/dashboard/integrations/whatsapp"
          className="inline-flex items-center gap-3 h-14 px-10 rounded-[20px] text-white text-[15px] font-black shadow-xl hover:scale-105 transition-all active:scale-95 shadow-blue-500/20"
          style={{ backgroundColor: preset.primary }}
        >
          {preset.connectWhatsApp}
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/dashboard?tab=inbox"
          className="inline-flex items-center gap-3 h-14 px-10 rounded-[20px] border-2 bg-white/60 backdrop-blur-md text-[15px] font-black text-zinc-900 hover:bg-white transition-all shadow-sm active:scale-95"
          style={{ borderColor: preset.softBorder }}
        >
          Launch Inbox
        </Link>
      </div>
    </div>
  );
}
