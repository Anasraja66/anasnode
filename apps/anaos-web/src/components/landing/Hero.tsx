"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PromptBox } from "./PromptBox";
import { IndustrySelector, Industry } from "./IndustrySelector";
import { ResultCard } from "./ResultCard";
import { X, Search, Plus } from "lucide-react";
import { Typewriter } from "./Typewriter";
import { WordRotator } from "./WordRotator";
import { WorkflowPreviewModal } from "./WorkflowPreviewModal";
import { WorkflowCanvas } from "./WorkflowCanvas";
import BrandIcon from "@/components/ui/BrandIcon";

export function Hero() {
  const [workspace, setWorkspace] = useState<any>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [showConnectors, setShowConnectors] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingIndustry, setLoadingIndustry] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  const businessConnectors = [
    { 
      name: "Twilio", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="#F22F46">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.222a9.778 9.778 0 1 1 0 19.556 9.778 9.778 0 0 1 0-19.556zM8.077 7.556a2.222 2.222 0 1 0 0 4.444 2.222 2.222 0 0 0 0-4.444zm7.846 0a2.222 2.222 0 1 0 0 4.444 2.222 2.222 0 0 0 0-4.444zM8.077 12a2.222 2.222 0 1 0 0 4.444 2.222 2.222 0 0 0 0-4.444zm7.846 0a2.222 2.222 0 1 0 0 4.444 2.222 2.222 0 0 0 0-4.444z"/>
        </svg>
      ), 
      category: "SMS" 
    },
    { 
      name: "Vapi AI", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10v4m4-8v12m4-10v8m4-12v16m4-10v4" stroke="#000000"/>
        </svg>
      ), 
      category: "Voice" 
    },
    { 
      name: "WhatsApp", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#25D366"/>
        </svg>
      ), 
      category: "Social" 
    },
    { 
      name: "ElevenLabs", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-2" fill="#000000">
          <path d="M4.6035 0v24h4.9317V0zm9.8613 0v24h4.9317V0z"/>
        </svg>
      ), 
      category: "Voice AI" 
    },
    { 
      name: "HubSpot", 
      icon: <BrandIcon id="hubspot" className="w-6 h-6" />, 
      category: "CRM" 
    },
    { 
      name: "ChatGPT", 
      icon: <BrandIcon id="openai" className="w-6 h-6" />, 
      category: "AI" 
    },
    { 
      name: "Gemini", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M12 24c.55-6.5 5.5-11.45 12-12-6.5-.55-11.45-5.5-12-12-.55 6.5-5.5 11.45-12 12 6.5.55 11.45 5.5 12 12z" fill="#1A73E8"/>
        </svg>
      ), 
      category: "AI" 
    },
    { 
      name: "Lovable", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF4D4D"/>
        </svg>
      ), 
      category: "AI" 
    },
    { 
      name: "Facebook", 
      icon: <BrandIcon id="facebook" className="w-6 h-6" />, 
      category: "Social" 
    },
    { 
      name: "Instagram", 
      icon: <BrandIcon id="instagram" className="w-6 h-6" />, 
      category: "Social" 
    },

    { 
      name: "Claude", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm3.33 13.92H13.6L12.3 12.3h-1.6v3.62H9V8.08h3.33c1.78 0 3.03 1.15 3.03 2.72 0 1.18-.72 2.15-1.77 2.53l1.74 2.59zM12 11.08h-1.3V9.28H12c.96 0 1.54.55 1.54 1.34 0 .8-.58 1.36-1.54 1.36z" fill="#D97757"/>
        </svg>
      ), 
      category: "AI" 
    },
    { 
      name: "Shopify", 
      icon: <BrandIcon id="shopify" className="w-6 h-6" />, 
      category: "E-commerce" 
    },
    { 
      name: "WooCommerce", 
      icon: <BrandIcon id="woocommerce" className="w-6 h-6" />, 
      category: "E-commerce" 
    },
    { 
      name: "Google Drive", 
      icon: <BrandIcon id="googledrive" className="w-6 h-6" />, 
      category: "Storage" 
    },
  ];

  return (
    <section className="pt-24 sm:pt-32 pb-10 sm:pb-16 px-6 relative overflow-hidden">
      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[440px] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[18px] font-bold text-zinc-900 tracking-tight">New Connector</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Search className="w-4.5 h-4.5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search apps..." 
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-11 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all font-medium"
                  />
                </div>

                {/* Custom Option */}
                <div className="flex items-center gap-4 p-3 hover:bg-zinc-50 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-zinc-100 mb-6">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-zinc-900">Custom Webhook</div>
                    <div className="text-[12px] text-zinc-500 font-medium">Connect any custom API endpoint</div>
                  </div>
                </div>

                {/* Featured List */}
                <div className="space-y-1">
                  <div className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider px-3 mb-2 font-sans">Featured</div>
                  <div className="max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                    {businessConnectors.map((connector) => (
                      <div key={connector.name} className="flex items-center gap-4 p-3 hover:bg-zinc-50 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-zinc-100 group">
                        {/* Icon rendering */}
                        <div className="w-10 h-10 rounded-full bg-white border border-zinc-100 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                          {connector.icon}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-zinc-900">{connector.name}</div>
                          <div className="text-[11px] text-zinc-400 font-semibold">{connector.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>



      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Top Label */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-[13px] sm:text-[14px] font-bold text-zinc-500 tracking-[0.2em] uppercase mb-4 font-sans"
        >
          AI Operations Layer
        </motion.p>

        {/* Heading (Lovable Style) */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-[32px] sm:text-[56px] lg:text-[72px] font-semibold text-[#111827] tracking-tight leading-[1.1]"
        >
          <span className="flex flex-col lg:flex-row items-center justify-center lg:gap-x-4 w-full">
            <span>Automate</span>
            <WordRotator 
              words={["customer follow-ups", "lead generation", "appointment booking", "support tickets", "sales outreach"]} 
              className="text-blue-500 overflow-visible lg:text-left h-[1.2em] flex items-center"
            />
          </span>
          <span className="mt-1 sm:mt-2 block text-zinc-800">and keep full control.</span>
        </motion.h1>

        {/* Subtitle (Lovable Style) */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="text-[15px] sm:text-[16px] text-[#4B5563] mt-2 leading-normal max-w-[850px] mx-auto font-medium font-sans"
        >
          Anaos gives small businesses an AI operations layer that captures leads, follows up with customers, books appointments, sends reminders, and keeps you in control — without needing to build workflows or hire an automation expert.
        </motion.p>

        {/* PromptBox and Industry Selector */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-2"
        >
          <div className="relative w-full z-20">
            <PromptBox 
              onGenerate={(data, prompt) => {
                if (data.success && data.workspace) {
                  const entry = {
                    id: "wf_" + Math.random().toString(36).substring(7),
                    name: data.workflowName || "AI Generated Workflow",
                    workflow: data.workspace,
                    industry: data.industry || "general",
                    prompt,
                    features: data.features || [],
                    createdAt: Date.now(),
                  };
                  setPreviewData(entry);
                } else {
                  console.error("Failed to generate workflow");
                  alert("Failed to generate workflow. Please try again.");
                }
              }}
            />
          </div>

          {/* We don't hide it when clicked, we just show a spinner on it */}
          <div className="mt-16">
              <motion.p 
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35 }}
                className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest mb-6 font-sans"
              >
                Or pick an industry template to start instantly
              </motion.p>
              <IndustrySelector 
                loadingId={loadingIndustry}
                onSelect={async (ind) => {
                  setLoadingIndustry(ind.id);
                  const prompt = `Build an automated system for my ${ind.name} business. It should: ${ind.workflows.join(', ')}. Enable draft mode for safety.`;
                  setLastPrompt(prompt);
                  
                  try {
                    const res = await fetch("/api/generate/workflow", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ prompt }),
                    });
                    const data = await res.json();
                    if (data.success && (data.workspace || data.workflow)) {
                      const entry = {
                        id: "wf_" + Math.random().toString(36).substring(7),
                        name: data.workflowName || `${ind.name} OS`,
                        workflow: data.workspace || data.workflow,
                        industry: ind.id,
                        prompt,
                        features: data.features || [],
                        createdAt: Date.now(),
                      };
                      setPreviewData(entry);
                      // Scroll slightly up so the modal is centered
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setLoadingIndustry(null);
                  }
                }} 
              />
            </div>
        </motion.div>

        {/* Stable container for ResultCard */}
        <div className="w-full flex flex-col items-center pb-4">
          {/* Grok-style Connectors Banner */}
          <AnimatePresence>
            {showConnectors && !workspace && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="mt-6 mx-auto w-full max-w-2xl"
              >
                <div className="bg-white/70 backdrop-blur-md border border-zinc-200/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  {/* Icons Stack - Grok Style Overlapping */}
                  <div className="flex -space-x-3 shrink-0 ml-1">
                    {[
                      "WhatsApp",
                      "Facebook",
                      "Instagram",
                      "Shopify",
                      "TikTok"
                    ].map((name, index) => (
                      <div 
                        key={name}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border-2 border-white overflow-hidden relative"
                        style={{ zIndex: 60 - index }}
                      >
                        <BrandIcon id={name} className="w-7 h-7" />
                      </div>
                    ))}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 text-left w-full text-center sm:text-left">
                    <h4 className="text-[14px] font-bold text-zinc-900 leading-tight">Connectors are now available.</h4>
                    <p className="text-[13px] text-zinc-500 mt-0.5 font-medium font-sans">Connectors allow Anaos to interact with apps directly in conversations.</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => setShowConnectors(false)}
                      className="text-[13px] font-bold text-zinc-400 hover:text-zinc-600 transition-colors font-sans"
                    >
                      Dismiss
                    </button>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-[#0A6BFF] text-white text-[13px] font-bold px-5 py-2 rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-sm font-sans"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ResultCard Output (Centrally aligned) */}
          <AnimatePresence>
            {workspace && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-8 w-full"
              >
                <ResultCard workspace={workspace} prompt={lastPrompt} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <WorkflowCanvas />

      <WorkflowPreviewModal 
        isOpen={!!previewData}
        onClose={() => setPreviewData(null)}
        previewData={previewData}
        onEdit={() => {
          if (previewData) {
            localStorage.setItem("anaos_pending_workflow", JSON.stringify(previewData));
            window.location.href = `/dashboard/workflows/${previewData.id}`;
          }
        }}
        onDeploy={(enabledFeatures) => {
          if (previewData) {
            const finalData = { ...previewData, enabledFeatures };
            localStorage.setItem("anaos_pending_workflow", JSON.stringify(finalData));
            window.location.href = `/dashboard?deploy=true`;
          }
        }}
      />
    </section>
  );
}
