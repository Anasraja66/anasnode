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

export function Hero() {
  const [workspace, setWorkspace] = useState<any>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [showConnectors, setShowConnectors] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
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
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M21.35 11.14l-3.34-1.74a7.92 7.92 0 0 0-.25-1.52l1.9-3.23a1.73 1.73 0 1 0-1.42-2.31l-1.9 3.23a7.9 7.9 0 0 0-1.41-.65V1.27a1.73 1.73 0 1 0-2.6 0v3.65a7.9 7.9 0 0 0-1.4.65L8.98 2.34a1.73 1.73 0 1 0-1.42 2.31l1.9 3.23a7.9 7.9 0 0 0-.26 1.52l-3.33 1.74a1.73 1.73 0 1 0 0 2.7l3.33 1.74c.06.52.14 1.03.26 1.52l-1.9 3.23a1.73 1.73 0 1 0 1.42 2.31l1.9-3.23c.44.27.91.49 1.4.65v3.65a1.73 1.73 0 1 0 2.6 0v-3.65c.5-.16.96-.38 1.41-.65l1.9 3.23a1.73 1.73 0 1 0 1.42-2.31l-1.9-3.23c.12-.5.2-1 .25-1.52l3.34-1.74a1.73 1.73 0 1 0 0-2.7z" fill="#FF7A59"/>
        </svg>
      ), 
      category: "CRM" 
    },
    { 
      name: "ChatGPT", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M22.28 9.82a6 6 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9 6.07 6.07 0 0 0-10.27-1.28 6 6 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9 6 6 0 0 0 9.77 1.3 6.06 6.06 0 0 0 3.76-2.9 6.06 6.06 0 0 0-.75-7.07zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.79.79 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.53-3.01l.14.08 4.78 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.49 4.49 0 0 1 2.37-1.97v6.67a.77.77 0 0 0 .39.68l5.81 3.35-2.02 1.17a.08.08 0 0 1-.07 0L4.01 15A4.5 4.5 0 0 1 2.34 7.9zm16.1 3.86l-5.84-3.37a.77.77 0 0 0-.78 0L5.97 11.75v-2.33a.08.08 0 0 1 .03-.06l3.98-2.3a4.5 4.5 0 0 1 6.14 1.65 4.47 4.47 0 0 1 .54 3.01l-.14-.08-4.78-2.76zM21.66 16.1a4.49 4.49 0 0 1-2.37 1.97v-6.67a.77.77 0 0 0-.39-.68L13.09 8.37l2.02-1.17a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1 1.65 6.11zM10.75 10.97l2.02-1.16 2.02 1.16v2.33l-2.02 1.17-2.02-1.17v-2.33z" fill="#10a37f"/>
        </svg>
      ), 
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
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
        </svg>
      ), 
      category: "Social" 
    },
    { 
      name: "Instagram", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="#E4405F"/>
        </svg>
      ), 
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
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="#7AB55C">
          <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/>
        </svg>
      ), 
      category: "E-commerce" 
    },
    { 
      name: "WooCommerce", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm4 11l-4-6-4 6h8z" fill="#96588a"/>
        </svg>
      ), 
      category: "E-commerce" 
    },
    { 
      name: "Google Drive", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M7.714 3.34L10.93 8.9H2.66l3.216-5.56zm4.57 5.56l3.217 5.56-8.273.01L12.284 8.9zm.644-5.56l8.273.01-4.136 7.15-4.137-7.16z" fill="#4285F4"/>
          <path d="M12.284 8.9l4.137 7.16-4.137 7.16-4.137-7.16 4.137-7.16z" fill="#34A853"/>
          <path d="M20.928 8.9l3.216 5.56-8.272.01 5.056-5.57z" fill="#FBBC05"/>
        </svg>
      ), 
      category: "Storage" 
    },
  ];

  return (
    <section className="pt-16 sm:pt-24 pb-20 px-6 relative overflow-hidden">
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
          All-In-One Automation OS
        </motion.p>

        {/* Heading (Lovable Style) */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-[24px] sm:text-[48px] lg:text-[48px] font-semibold text-[#111827] tracking-[-0.03em] leading-[1.1]"
        >
          <span className="flex flex-col lg:flex-row items-center justify-center lg:gap-x-4 w-full">
            <span>Automate</span>
            <WordRotator 
              words={["customer follow-ups", "lead generation", "appointment booking", "support tickets", "sales outreach"]} 
              className="text-blue-500 overflow-visible lg:text-left h-[1.2em] flex items-center"
            />
          </span>
          <span className="mt-1 sm:mt-2 block">Keep control.</span>
        </motion.h1>

        {/* Subtitle (Lovable Style) */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="text-[15px] sm:text-[16px] text-[#4B5563] mt-6 leading-relaxed max-w-[540px] mx-auto font-medium font-sans"
        >
          Build <WordRotator 
            words={["lead capture", "customer support", "appointment booking", "sales outreach"]} 
            className="text-blue-500 font-bold overflow-visible inline-flex items-center justify-center mx-1"
          /> agents for your business — without hiring an automation expert.
        </motion.p>

        {/* PromptBox and Industry Selector */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-10"
        >
          <div className="relative w-full z-20">
            <PromptBox 
              onGenerate={async (ws, prompt) => {
                try {
                  const res = await fetch("/api/generate/workflow", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: prompt || `Automation for ${ws.name}` }),
                  });
                  const data = await res.json();
                  if (data.success && data.workflow) {
                    const entry = {
                      id: ws.id,
                      name: data.workflowName || ws.name,
                      workflow: data.workflow,
                      industry: data.industry,
                      prompt,
                      features: data.features || [],
                      createdAt: Date.now(),
                    };
                    setPreviewData(entry);
                  } else {
                    setWorkspace(ws);
                    setLastPrompt(prompt);
                  }
                } catch (e) {
                  setWorkspace(ws);
                  setLastPrompt(prompt);
                }
              }}
            />
          </div>

          {!selectedIndustry && (
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
                onSelect={(ind) => {
                  setSelectedIndustry(ind);
                  const prompt = `Build an automated system for my ${ind.name} business. It should: ${ind.workflows.join(', ')}. Enable draft mode for safety.`;
                  setLastPrompt(prompt);
                  setIsModalOpen(true);
                  setShowConnectors(false);
                  
                  const pendingId = "wf_" + Math.random().toString(36).substring(7);
                  localStorage.setItem("anaos_pending_workflow", JSON.stringify({
                    id: pendingId,
                    prompt: prompt,
                    name: `${ind.name} OS`,
                    industry: ind.id
                  }));
                  window.location.href = `/dashboard/workflows/${pendingId}`;
                }} 
              />
            </div>
          )}
        </motion.div>

        {/* Stable container to prevent layout jumping when ResultCard appears */}
        <div className="min-h-[500px] w-full flex flex-col items-center">
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
                        {businessConnectors.find(c => c.name === name)?.icon}
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
