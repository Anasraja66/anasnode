import { motion } from "framer-motion";
import { MessageCircle, CalendarCheck, Megaphone, Sparkles, ArrowRight, Check } from "lucide-react";
import { useState } from "react";

const automations = [
  { icon: MessageCircle, title: "WhatsApp Orders", desc: "Accept and confirm orders 24/7.", on: true },
  { icon: CalendarCheck, title: "Reservations", desc: "Book tables without staff time.", on: true },
  { icon: Megaphone, title: "Daily Specials", desc: "Broadcast today's menu to regulars.", on: false },
  { icon: Sparkles, title: "Review Collector", desc: "Request a review after every visit.", on: false },
];

export function ResultCard({ industry }: { industry: string }) {
  const [states, setStates] = useState(automations.map((a) => a.on));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl mx-auto mt-8 rounded-2xl border border-border bg-card overflow-hidden text-left"
    >
      <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-[12px] font-mono uppercase tracking-wider text-success">Workspace ready</span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">/{industry.toLowerCase().replace(" ", "-")}</span>
      </div>

      <div className="px-6 pt-5 pb-2">
        <h3 className="text-[17px] font-semibold text-foreground tracking-tight">Your {industry} workspace</h3>
        <p className="text-[13px] text-muted-foreground mt-0.5">4 automations configured · ready to enable</p>
      </div>

      <div className="px-3 pb-3 grid sm:grid-cols-2 gap-2">
        {automations.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="rounded-xl p-3.5 flex items-start gap-3 hover:bg-muted/60 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground">{a.title}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{a.desc}</p>
              </div>
              <button
                onClick={() => setStates((s) => s.map((v, idx) => (idx === i ? !v : v)))}
                className={`relative w-8 h-[18px] rounded-full transition-colors shrink-0 mt-0.5 ${states[i] ? "bg-success" : "bg-border"}`}
              >
                <span className={`absolute top-0.5 w-3.5 h-3.5 bg-card rounded-full transition-all ${states[i] ? "left-[15px]" : "left-0.5"}`} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Check className="w-3 h-3 text-success" /> Auto-saved
        </div>
        <button className="h-9 px-4 rounded-md bg-foreground text-background text-[13px] font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity">
          Open dashboard <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
