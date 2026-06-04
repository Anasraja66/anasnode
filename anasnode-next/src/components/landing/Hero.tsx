"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PromptBox } from "./PromptBox";
import { ResultCard } from "./ResultCard";
import { X, Search, Plus } from "lucide-react";
import { Typewriter } from "./Typewriter";
import { WordRotator } from "./WordRotator";

export function Hero() {
  const [workspace, setWorkspace] = useState<any>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [showConnectors, setShowConnectors] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const businessConnectors = [
    { 
      name: "Gmail", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M1.5 3.5h3.3v13.5h-3.3z" fill="#4285f4"/>
          <path d="M19.2 3.5h3.3v13.5h-3.3z" fill="#34a853"/>
          <path d="M1.5 3.5l10.5 8 10.5-8v3.3l-10.5 8-10.5-8z" fill="#ea4335"/>
          <path d="M1.5 17h21v3.5h-21z" fill="#fbbc04"/>
        </svg>
      ), 
      category: "Email" 
    },
    { 
      name: "Google Calendar", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" fill="#4285F4"/>
        </svg>
      ), 
      category: "Productivity" 
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
      name: "TikTok", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5 bg-black">
          <g>
            <path d="M12.525.02c1.31 0 2.591.26 3.811.73v4.257c-.711-.31-1.481-.47-2.281-.47-2.92 0-5.29 2.37-5.29 5.29 0 .09.01.18.02.27v4.25c-.01-.09-.02-.18-.02-.27 0-5.28 4.29-9.57 9.57-9.57.81 0 1.58.1 2.31.29V.75C19.385.25 18.104 0 16.794 0h-4.269v16.706c0 2.214-1.801 4.015-4.015 4.015s-4.015-1.801-4.015-4.015 1.801-4.015 4.015-4.015c.253 0 .495.029.731.083v-4.172c-.24-.022-.482-.036-.731-.036-4.51 0-8.17 3.66-8.17 8.17 0 4.51 3.66 8.17 8.17 8.17s8.17-3.66 8.17-8.17v-10.08c1.505 1.225 3.411 1.956 5.49 1.956v-4.17c-3.13 0-5.67-2.54-5.67-5.67V.02h-4.25z" fill="#25F4EE" transform="translate(-0.4, -0.4)"/>
            <path d="M12.525.02c1.31 0 2.591.26 3.811.73v4.257c-.711-.31-1.481-.47-2.281-.47-2.92 0-5.29 2.37-5.29 5.29 0 .09.01.18.02.27v4.25c-.01-.09-.02-.18-.02-.27 0-5.28 4.29-9.57 9.57-9.57.81 0 1.58.1 2.31.29V.75C19.385.25 18.104 0 16.794 0h-4.269v16.706c0 2.214-1.801 4.015-4.015 4.015s-4.015-1.801-4.015-4.015 1.801-4.015 4.015-4.015c.253 0 .495.029.731.083v-4.172c-.24-.022-.482-.036-.731-.036-4.51 0-8.17 3.66-8.17 8.17 0 4.51 3.66 8.17 8.17 8.17s8.17-3.66 8.17-8.17v-10.08c1.505 1.225 3.411 1.956 5.49 1.956v-4.17c-3.13 0-5.67-2.54-5.67-5.67V.02h-4.25z" fill="#FE2C55" transform="translate(0.4, 0.4)"/>
            <path d="M12.525.02c1.31 0 2.591.26 3.811.73v4.257c-.711-.31-1.481-.47-2.281-.47-2.92 0-5.29 2.37-5.29 5.29 0 .09.01.18.02.27v4.25c-.01-.09-.02-.18-.02-.27 0-5.28 4.29-9.57 9.57-9.57.81 0 1.58.1 2.31.29V.75C19.385.25 18.104 0 16.794 0h-4.269v16.706c0 2.214-1.801 4.015-4.015 4.015s-4.015-1.801-4.015-4.015 1.801-4.015 4.015-4.015c.253 0 .495.029.731.083v-4.172c-.24-.022-.482-.036-.731-.036-4.51 0-8.17 3.66-8.17 8.17 0 4.51 3.66 8.17 8.17 8.17s8.17-3.66 8.17-8.17v-10.08c1.505 1.225 3.411 1.956 5.49 1.956v-4.17c-3.13 0-5.67-2.54-5.67-5.67V.02h-4.25z" fill="#FFFFFF"/>
          </g>
        </svg>
      ), 
      category: "Social" 
    },
    { 
      name: "HubSpot", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M21.5 12.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zM12 1.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zM2.5 12.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5z" fill="#FF7A59"/>
          <path d="M18 12.5c0-3.314-2.686-6-6-6-1.565 0-2.986.6-4.06 1.583L5.47 5.61a9.96 9.96 0 0 1 6.53-2.435c.42 0 .835.026 1.242.076V5.77c-.4-.04-.81-.06-1.242-.06-2.21 0-4 1.79-4 4 0 .53.1 1.03.28 1.49l-2.43 1.4c-.1-.4-.17-.81-.17-1.24 0-.43.07-.84.17-1.24L8.28 9.1c.18.46.28.96.28 1.49 0 2.21-1.79 4-4 4-.43 0-.84-.07-1.24-.17l-1.4 2.43c.46.18.96.28 1.49.28 3.314 0 6-2.686 6-6 0-.53-.1-1.03-.28-1.49l2.43-1.4c.1.4.17.81.17 1.24 0 .43-.07.84-.17 1.24l2.43 1.4c.18-.46.28-.96.28-1.49z" fill="#FF7A59"/>
        </svg>
      ), 
      category: "CRM" 
    },
    { 
      name: "ChatGPT", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M22.28 7.59c-.52-1.99-1.73-3.45-3.59-4.34a11.5 11.5 0 0 0-4.01-1.1c-2.02-.17-4.04-.17-6.06 0-1.35.11-2.69.49-4.01 1.1-1.86.89-3.07 2.35-3.59 4.34-.11.41-.18.82-.21 1.24v6.33c.03.42.1.83.21 1.24.52 1.99 1.73 3.45 3.59 4.34 1.32.61 2.66.99 4.01 1.1 2.02.17 4.04.17 6.06 0 1.35-.11 2.69-.49 4.01-1.1 1.86-.89 3.07-2.35 3.59-4.34.11-.41.18-.82.21-1.24V8.83c-.03-.42-.1-.83-.21-1.24zM12 16.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" fill="#10a37f"/>
        </svg>
      ), 
      category: "AI" 
    },
    { 
      name: "Gemini", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M12 2L9.12 9.12 2 12l7.12 2.88L12 22l2.88-7.12L22 12l-7.12-2.88L12 2z" fill="#4285F4"/>
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
      name: "Twilio", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.75c-3.728 0-6.75-3.022-6.75-6.75s3.022-6.75 6.75-6.75 6.75 3.022 6.75 6.75-3.022 6.75-6.75 6.75z" fill="#F22F46"/>
        </svg>
      ), 
      category: "Communication" 
    },
    { 
      name: "Claude", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path d="M12 2L4 20h3l2-5h6l2 5h3L12 2zm-2 10l2-5 2 5h-4z" fill="#D97757"/>
        </svg>
      ), 
      category: "AI" 
    },
    { 
      name: "Shopify", 
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full p-1.5">
          <path fill="#96bf48" d="M18.8 6.4L16.2 0H7.8L5.2 6.4L0 7.8L1.6 22.4L12 24L22.4 22.4L24 7.8L18.8 6.4Z" />
          <path fill="#fff" d="M12 19.2c-1.6 0-2.8-1-3.2-2l-.6-.8 1.8-.8.4.6c.2.4.8 1 1.6 1 .8 0 1.4-.4 1.4-1s-.4-.8-1.4-1.2c-1.6-.6-2.8-1.2-2.8-2.8 0-1.4 1-2.4 2.6-2.4 1.4 0 2.4.8 2.8 1.6l.6.8-1.8.8-.4-.6c-.2-.4-.6-.8-1.2-.8-.6 0-1 .4-1 .8 0 .4.4.6 1.2 1 1.6.6 2.8 1.2 2.8 2.8 0 1.4-1 2.8-2.8 2.8z" />
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
                  <h3 className="text-[18px] font-bold text-zinc-900 font-sans tracking-tight">New Connector</h3>
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
          className="text-[44px] sm:text-[68px] lg:text-[76px] font-extrabold text-[#111827] tracking-[-0.04em] leading-[1.04] font-sans min-h-[2.1em]"
        >
          <Typewriter text="Build something Automated" />
        </motion.h1>

        {/* Subtitle (Lovable Style) */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="text-[17px] sm:text-[19px] text-[#4B5563] mt-6 leading-relaxed max-w-[540px] mx-auto font-medium min-h-[56px] sm:min-h-[60px]"
        >
          Create{" "}
          <WordRotator 
            words={[
              "WhatsApp", 
              "Facebook", 
              "Instagram", 
              "Shopify", 
              "TikTok", 
              "Gmail", 
              "Google Drive", 
              "Calendar", 
              "Voice Calling", 
              "Twilio", 
              "HubSpot", 
              "WooCommerce", 
              "WordPress", 
              "Claude", 
              "ChatGPT", 
              "Gemini"
            ]} 
            className="text-blue-600 font-bold"
          />{" "}
          agents and operational workflows by chatting with AI
        </motion.p>

        {/* PromptBox – tight gap (Lovable Style) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-10"
        >
          <PromptBox
            onGenerate={(ws, prompt) => {
              setWorkspace(ws);
              setLastPrompt(prompt);
            }}
          />
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
                    <h4 className="text-[14px] font-bold text-zinc-900 leading-tight font-sans">Connectors are now available.</h4>
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
    </section>
  );
}

