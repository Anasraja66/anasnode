"use client";

import { useState, useEffect } from "react";
import { ArrowUp, Plus, Mic, ChevronDown, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLES = [
  { label: "Real estate", text: "I run a real estate agency in Dubai. Qualify inbound leads, match listings to budget, and book viewings automatically." },
  { label: "Restaurant", text: "I own a busy restaurant. Handle WhatsApp ordering, reservation slot qualification, and review follow-ups." },
  { label: "Dental Clinic", text: "I manage a clinic. Schedule patient visits, check AXA insurance coverage, and send dentist appointment reminders." },
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
  const [selectedAction, setSelectedAction] = useState("Build");

  useEffect(() => {
    setMounted(true);
  }, []);

  const stages = [
    "Reading requirements...",
    "Drafting agent schema...",
    "Wiring up CRM database...",
    "Workspace ready!",
  ];

  const handleGenerate = async () => {
    if (loading || !value.trim()) return;
    setLoading(true);
    setStage(0);
    
    const interval = setInterval(() => {
      setStage((s) => {
        if (s >= stages.length - 2) {
          clearInterval(interval);
          return s;
        }
        return s + 1;
      });
    }, 600);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });
      const data = await response.json();
      
      clearInterval(interval);
      setStage(stages.length - 1); // "Workspace ready!"
      
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
    <div className={`w-full ${compact ? "max-w-xl" : "max-w-3xl"} mx-auto text-left relative z-10`}>
      <div className="rounded-[32px] border border-[#E5E5E0] bg-[#FBF9F6] p-2 hover:border-[#CCCCCC] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Anaos to automate a WhatsApp operator that..."
          rows={3}
          disabled={loading}
          className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-[15px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none leading-relaxed"
        />
        
        {mounted && (
          <div className="flex items-center justify-between px-4 pb-2.5 pt-2">
            {/* Left circular plus button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-8.5 h-8.5 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-white flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
              
              {/* Examples suggestions overlay (hidden during loading) */}
              {!loading && (
                <div className="hidden md:flex items-center gap-1.5 ml-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Try Presets:</span>
                  {EXAMPLES.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setValue(chip.text)}
                      className="text-[11px] font-bold px-3 py-1 rounded-full bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200 transition-all cursor-pointer shadow-sm"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right-aligned action controls */}
            <div className="flex items-center gap-2">
              {/* Dropdown Action Selector */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 text-[13px] font-bold text-zinc-500 hover:text-zinc-800 transition-all px-2 py-1 rounded-lg hover:bg-zinc-100 cursor-pointer"
                >
                  <span>{selectedAction}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Voice icon */}
              <button
                type="button"
                className="w-8.5 h-8.5 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-all cursor-pointer"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Send Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !value.trim()}
                className="w-8.5 h-8.5 rounded-full bg-zinc-800 hover:bg-zinc-950 text-white flex items-center justify-center shadow-md transition-all disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowUp className="w-4.5 h-4.5 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Floating loading overlay stages */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#FBF9F6]/90 rounded-[32px] flex flex-col items-center justify-center gap-3 z-20"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4.5 h-4.5 text-[#0a6bff] animate-spin" />
                <span className="font-bold text-zinc-800 text-[14.5px] leading-none">{stages[stage]}</span>
              </div>
              <div className="w-40 h-1 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0a6bff] transition-all duration-500 rounded-full"
                  style={{ width: `${((stage + 1) / stages.length) * 100}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {!loading && (
        <p className="mt-3.5 text-[12px] text-zinc-400 font-medium text-center">
          Free for your first workspace. No credit card required.
        </p>
      )}
    </div>
  );
}
