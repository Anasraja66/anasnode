"use client";

import { useState, useEffect } from "react";
import { ArrowUp, Plus, Mic, ChevronDown, RefreshCw, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLES = [
  { label: "Real estate", text: "Create a WhatsApp AI for my real estate agency. It should qualify leads, show available listings based on their budget, and book viewings on my calendar." },
  { label: "Restaurant", text: "Build an automated WhatsApp assistant for my restaurant. It should handle table bookings, show the menu, and collect customer reviews after they dine." },
  { label: "Dental Clinic", text: "Set up a patient coordinator for my dental clinic. It needs to handle appointment scheduling, send reminders, and answer common questions about services." },
];

interface Props {
  onGenerate?: (workspace: any, prompt: string) => void;
  compact?: boolean;
  staticPlaceholder?: string;
  onSubmitPrompt?: (prompt: string) => void;
}

export function PromptBox({ onGenerate, compact, staticPlaceholder, onSubmitPrompt }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [selectedAction, setSelectedAction] = useState("Build");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Typewriter effect state
  const placeholders = [
    "Create a WhatsApp AI that handles my car rental bookings...",
    "Build a lead qualification agent for my solar business...",
    "Set up an automated support bot for my Shopify store...",
    "Automate my clinic's patient scheduling and reminders..."
  ];
  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    
    const currentText = placeholders[placeholderIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && placeholderText.length < currentText.length) {
      timeout = setTimeout(() => setPlaceholderText(currentText.slice(0, placeholderText.length + 1)), 50);
    } else if (!isDeleting && placeholderText.length === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && placeholderText.length > 0) {
      timeout = setTimeout(() => setPlaceholderText(currentText.slice(0, placeholderText.length - 1)), 30);
    } else if (isDeleting && placeholderText.length === 0) {
      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, placeholderIndex, mounted]);
  const stages = [
    "Reading requirements...",
    "Drafting agent schema...",
    "Wiring up CRM database...",
    "Workspace ready!",
  ];

  const handleGenerate = async () => {
    if (loading || !value.trim()) return;

    if (onSubmitPrompt) {
      onSubmitPrompt(value.trim());
      return;
    }

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
          onGenerate?.(data.workspace, value.trim());
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
      <div className="rounded-[32px] border border-zinc-200 bg-white p-2 hover:border-zinc-300 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group/box">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={mounted && !value ? (staticPlaceholder || placeholderText) : (staticPlaceholder || "Describe your business automation...")}
          rows={3}
          disabled={loading}
          className="w-full resize-none bg-transparent px-4 sm:px-6 pt-4 sm:pt-5 pb-2 text-[15px] sm:text-[16px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none leading-relaxed"
        />
        
        {mounted && (
          <div className="flex flex-col md:flex-row md:items-center justify-between px-2 sm:px-3 pb-2.5 pt-1 gap-4 md:gap-0">
            {/* Left circular plus button & Presets */}
            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto overflow-hidden">
              <button
                type="button"
                className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm flex items-center justify-center text-zinc-400 hover:text-zinc-800 transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
              
              {!loading && (
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide whitespace-nowrap pr-2 pb-1 md:pb-0" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                  <span className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest mr-1 shrink-0">Try Presets:</span>
                  {EXAMPLES.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setValue(chip.text)}
                      className="text-[11px] sm:text-[12px] font-bold px-3 py-1.5 md:px-4 md:py-1.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right-aligned action controls */}
            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2 md:gap-4 shrink-0 border-t border-zinc-100 md:border-none pt-2 md:pt-0">
              {/* Dropdown Action Selector */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[14px] font-bold text-zinc-600 hover:text-zinc-900 transition-all px-3 py-1.5 rounded-xl hover:bg-zinc-200/50 cursor-pointer"
                >
                  <span>{selectedAction}</span>
                  <ChevronDown className="w-4 h-4 opacity-60" />
                </button>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                {/* File Upload icon */}
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all cursor-pointer hover:bg-zinc-200/40 rounded-full"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Voice icon */}
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-all cursor-pointer hover:bg-zinc-200/40 rounded-full"
                >
                  <Mic className="w-5 h-5" />
                </button>

                {/* Send Button */}
                <button
                  onClick={handleGenerate}
                  disabled={loading || !value.trim()}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-zinc-400/80 hover:bg-blue-600 text-white flex items-center justify-center shadow-sm transition-all disabled:opacity-40 disabled:hover:bg-zinc-400/80 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                  style={{ backgroundColor: value.trim() ? '#0A6BFF' : undefined }}
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <ArrowUp className="w-5 sm:w-5.5 h-5 sm:h-5.5 stroke-[3]" />
                  )}
                </button>
              </div>
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
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-3.5 text-[12px] text-zinc-400 font-medium text-center"
        >
          Free for your first workspace. No credit card required.
        </motion.p>
      )}
    </div>
  );
}
