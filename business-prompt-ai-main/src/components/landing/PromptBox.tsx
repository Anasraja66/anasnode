import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLES: { label: string; text: string }[] = [
  { label: "Real estate", text: "I run a real estate brokerage in Dubai. Qualify inbound leads, match listings to budget, and book viewings automatically." },
  { label: "Restaurant", text: "I own a restaurant. Handle WhatsApp orders, table reservations, and send the daily menu to regulars." },
  { label: "Clinic", text: "I manage a clinic. Book appointments, send reminders, and follow up with patients after visits." },
];

interface Props {
  onGenerate?: (industry: string) => void;
  compact?: boolean;
}

export function PromptBox({ onGenerate, compact }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);

  const stages = [
    "Reading your business…",
    "Drafting your WhatsApp agent…",
    "Wiring up your CRM…",
    "Finalizing workspace…",
  ];

  const handleGenerate = () => {
    if (loading) return;
    setLoading(true);
    setStage(0);
    const interval = setInterval(() => {
      setStage((s) => {
        if (s >= stages.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            onGenerate?.(detectIndustry(value));
          }, 600);
          return s;
        }
        return s + 1;
      });
    }, 650);
  };

  const detectIndustry = (v: string) => {
    const l = v.toLowerCase();
    if (l.includes("restaurant") || l.includes("menu")) return "Restaurant";
    if (l.includes("real estate") || l.includes("property") || l.includes("brokerage")) return "Real Estate";
    if (l.includes("clinic") || l.includes("doctor") || l.includes("patient")) return "Clinic";
    return "Restaurant";
  };

  return (
    <div className={`w-full ${compact ? "max-w-xl" : "max-w-2xl"} mx-auto text-left`}>
      <div className="rounded-2xl border border-border bg-card focus-within:border-foreground/30 transition-colors">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe your business in one sentence — what you sell, who you serve, what you'd like automated."
          rows={3}
          className="w-full resize-none rounded-2xl bg-transparent px-4 py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/80 focus:outline-none leading-relaxed"
        />
        <div className="flex flex-wrap items-center gap-1.5 px-3 pb-3 pt-1 border-t border-border/60">
          <span className="text-[11px] text-muted-foreground/70 mr-1 font-mono uppercase tracking-wider">Try</span>
          {EXAMPLES.map((chip) => (
            <button
              key={chip.label}
              onClick={() => setValue(chip.text)}
              className="text-[12px] px-2.5 py-1 rounded-md bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="mt-3 w-full h-11 rounded-xl bg-primary text-primary-foreground text-[14px] font-medium flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-90"
      >
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.span
              key={stage}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="flex gap-1">
                <span className="w-1 h-1 rounded-full bg-primary-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1 h-1 rounded-full bg-primary-foreground animate-bounce" style={{ animationDelay: "120ms" }} />
                <span className="w-1 h-1 rounded-full bg-primary-foreground animate-bounce" style={{ animationDelay: "240ms" }} />
              </span>
              {stages[stage]}
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
              Generate workspace <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <p className="mt-2.5 text-[12px] text-muted-foreground text-center">
        Free for your first workspace. No credit card required.
      </p>
    </div>
  );
}
