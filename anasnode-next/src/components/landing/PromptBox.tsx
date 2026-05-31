"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLES: { label: string; text: string }[] = [
  { label: "Real estate", text: "I run a real estate brokerage in Dubai. Qualify inbound leads, match listings to budget, and book viewings automatically." },
  { label: "Restaurant", text: "I own a restaurant. Handle WhatsApp orders, table reservations, and send the daily menu to regulars." },
  { label: "Clinic", text: "I manage a clinic. Book appointments, send reminders, and follow up with patients after visits." },
];

interface Props {
  onGenerate?: (workspace: any) => void;
  compact?: boolean;
}

export function PromptBox({ onGenerate, compact }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stages = [
    "Reading business...",
    "Drafting agent...",
    "Wiring up CRM...",
    "Done!",
  ];

  const handleGenerate = async () => {
    if (loading || !value.trim()) return;
    setLoading(true);
    setStage(0);
    
    // Visual progress increments
    const interval = setInterval(() => {
      setStage((s) => {
        if (s >= stages.length - 2) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 550);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });
      const data = await response.json();
      
      // End the visual stage gracefully
      clearInterval(interval);
      setStage(stages.length - 1); // "Done!"
      
      setTimeout(() => {
        setLoading(false);
        if (data.success && data.workspace) {
          onGenerate?.(data.workspace);
        }
      }, 500);
    } catch (e) {
      console.error(e);
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${compact ? "max-w-xl" : "max-w-2xl"} mx-auto text-left`}>
      <div className="rounded-xl border border-border bg-card focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-foreground/5 transition-all shadow-sm">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe your business in one sentence... (e.g. 'I run a dentist clinic')"
          rows={2}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[14px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none leading-relaxed"
        />
        
        {mounted && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 pb-3 pt-2 border-t border-border/50">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">Try:</span>
              {EXAMPLES.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setValue(chip.text)}
                  className="text-[11px] px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-all cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !value.trim()}
              className="h-8 px-3.5 rounded-lg bg-foreground text-background text-[12px] font-medium flex items-center justify-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                {loading ? (
                  <motion.span
                    key={stage}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5"
                  >
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-background animate-pulse" />
                      <span className="w-1 h-1 rounded-full bg-background animate-pulse" style={{ animationDelay: "150ms" }} />
                    </span>
                    <span className="font-mono text-[11px]">{stages[stage]}</span>
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                    <span>Generate workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-2.5 text-[11.5px] text-muted-foreground/75 text-center">
        Free for your first workspace. No credit card required.
      </p>
    </div>
  );
}
