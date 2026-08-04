"use client";

import { motion } from "framer-motion";
import BrandIcon from "@/components/ui/BrandIcon";
import { Bot, Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function WorkflowCanvas() {
  const [key, setKey] = useState(0);

  // Re-trigger animation every 14 seconds to create a perfect looping "video" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      key={key}
      className="relative w-full max-w-4xl mx-auto h-[500px] mt-16 mb-8 rounded-3xl border border-white/60 bg-gradient-to-br from-blue-50/40 to-white/60 backdrop-blur-3xl overflow-hidden hidden md:block" 
      style={{ boxShadow: '0 20px 60px -15px rgba(10,107,255,0.15)' }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A6BFF0A_1px,transparent_1px),linear-gradient(to_bottom,#0A6BFF0A_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-[80px] pointer-events-none" />

      {/* 1. User Prompt Input Box */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: [0, 1, 1, 0], y: [-20, 0, 0, -20] }}
        transition={{ duration: 13, times: [0, 0.05, 0.95, 1] }}
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[700px] bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-blue-100 p-4 z-20 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-[12px] text-blue-500 font-semibold mb-1">Generate Workflow</div>
          <div className="text-[14px] text-zinc-700 font-medium whitespace-nowrap overflow-hidden border-r-2 border-blue-500"
               style={{ animation: 'typing 3s steps(50, end) 1s forwards, blink .75s step-end infinite' }}>
            "When someone messages on WhatsApp, Facebook, or Instagram, analyze intent and create a deal in HubSpot or alert Sales on Slack."
          </div>
        </div>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, backgroundColor: ['#2563eb', '#1d4ed8', '#2563eb'] }}
          transition={{ 
            scale: { delay: 4, duration: 0.3 }, 
            opacity: { delay: 4, duration: 0.3 },
            backgroundColor: { delay: 4.5, duration: 0.3 }
          }}
          className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md"
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      {/* CSS for typing effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: #3b82f6; }
        }
      `}} />

      {/* 2. Generating Workflow Nodes */}
      <div className="absolute top-[120px] left-0 w-full h-[360px]">
        
        {/* Node 1a: WhatsApp (Appears at 5s) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], x: [-20, 0, 0, -20] }}
          transition={{ duration: 8, delay: 5, times: [0, 0.05, 0.95, 1] }}
          className="absolute top-[50px] -translate-y-1/2 left-[5%] w-56 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white p-3 z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100/50 flex items-center justify-center border border-green-100 shadow-sm shrink-0">
              <BrandIcon id="whatsapp" className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-zinc-800">New Message</div>
              <div className="text-[11px] text-green-600 font-semibold">WhatsApp</div>
            </div>
          </div>
          {/* Output Handle */}
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-green-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        </motion.div>

        {/* Node 1b: Instagram (Appears at 5.2s) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], x: [-20, 0, 0, -20] }}
          transition={{ duration: 7.8, delay: 5.2, times: [0, 0.05, 0.95, 1] }}
          className="absolute top-[180px] -translate-y-1/2 left-[5%] w-56 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white p-3 z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-50 to-rose-100/50 flex items-center justify-center border border-pink-100 shadow-sm shrink-0">
              <BrandIcon id="instagram" className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-zinc-800">New Message</div>
              <div className="text-[11px] text-pink-600 font-semibold">Instagram</div>
            </div>
          </div>
          {/* Output Handle */}
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-pink-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-pink-500 rounded-full" />
          </div>
        </motion.div>

        {/* Node 1c: Facebook (Appears at 5.4s) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], x: [-20, 0, 0, -20] }}
          transition={{ duration: 7.6, delay: 5.4, times: [0, 0.05, 0.95, 1] }}
          className="absolute top-[310px] -translate-y-1/2 left-[5%] w-56 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white p-3 z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100/50 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
              <BrandIcon id="facebook" className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-zinc-800">New Message</div>
              <div className="text-[11px] text-blue-600 font-semibold">Facebook</div>
            </div>
          </div>
          {/* Output Handle */}
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        </motion.div>

        {/* Path 1: Inputs to AI (Appears at 5.8s) */}
        <motion.svg 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 7.2, delay: 5.8, times: [0, 0.05, 0.95, 1] }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <defs>
            <linearGradient id="gradient-whatsapp" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="gradient-instagram" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="gradient-facebook" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* WhatsApp to AI */}
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 5.8 }}
            d="M calc(5% + 224px + 12px) 50 C 320 50, 320 180, calc(40% - 12px) 180" 
            fill="none" 
            stroke="url(#gradient-whatsapp)" 
            strokeWidth="3"
          />
          <motion.circle r="4" fill="#0A6BFF">
            <motion.animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path="M calc(5% + 224px + 12px) 50 C 320 50, 320 180, calc(40% - 12px) 180"
            />
          </motion.circle>

          {/* Instagram to AI */}
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 5.8 }}
            d="M calc(5% + 224px + 12px) 180 C 320 180, 320 180, calc(40% - 12px) 180" 
            fill="none" 
            stroke="url(#gradient-instagram)" 
            strokeWidth="3"
          />
          <motion.circle r="4" fill="#0A6BFF">
            <motion.animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M calc(5% + 224px + 12px) 180 C 320 180, 320 180, calc(40% - 12px) 180"
            />
          </motion.circle>

          {/* Facebook to AI */}
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 5.8 }}
            d="M calc(5% + 224px + 12px) 310 C 320 310, 320 180, calc(40% - 12px) 180" 
            fill="none" 
            stroke="url(#gradient-facebook)" 
            strokeWidth="3"
          />
          <motion.circle r="4" fill="#0A6BFF">
            <motion.animateMotion
              dur="2.2s"
              repeatCount="indefinite"
              path="M calc(5% + 224px + 12px) 310 C 320 310, 320 180, calc(40% - 12px) 180"
            />
          </motion.circle>
        </motion.svg>

        {/* Node 2: AnaOS AI (Appears at 6.2s) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], x: [-20, 0, 0, -20] }}
          transition={{ duration: 6.8, delay: 6.2, times: [0, 0.05, 0.95, 1] }}
          className="absolute top-[180px] -translate-y-1/2 left-[40%] w-56 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] border border-blue-100 p-4 z-10"
        >
          {/* Input Handle */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-zinc-900">AI Classifier</div>
              <div className="text-[12px] text-blue-600 font-semibold">AnaOS Logic</div>
            </div>
          </div>
          {/* Output Handle */}
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        </motion.div>

        {/* Path 2 & 3: Outputs (Appears at 6.6s) */}
        <motion.svg 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 6.4, delay: 6.6, times: [0, 0.05, 0.95, 1] }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <defs>
            <linearGradient id="gradient-hubspot" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="gradient-slack" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 6.6 }}
            d="M calc(40% + 224px + 12px) 180 C 650 180, 650 90, calc(75% - 12px) 90" 
            fill="none" 
            stroke="url(#gradient-hubspot)" 
            strokeWidth="3"
          />
          <motion.circle r="4" fill="#f97316">
            <motion.animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M calc(40% + 224px + 12px) 180 C 650 180, 650 90, calc(75% - 12px) 90"
            />
          </motion.circle>
          
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 6.6 }}
            d="M calc(40% + 224px + 12px) 180 C 650 180, 650 270, calc(75% - 12px) 270" 
            fill="none" 
            stroke="url(#gradient-slack)" 
            strokeWidth="3"
          />
          <motion.circle r="4" fill="#a855f7">
            <motion.animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M calc(40% + 224px + 12px) 180 C 650 180, 650 270, calc(75% - 12px) 270"
            />
          </motion.circle>
        </motion.svg>

        {/* Node 3: CRM (Appears at 7s) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], x: [-20, 0, 0, -20] }}
          transition={{ duration: 6, delay: 7, times: [0, 0.05, 0.95, 1] }}
          className="absolute top-[90px] -translate-y-1/2 left-[75%] w-56 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white p-3 z-10"
        >
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-orange-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
              <BrandIcon id="hubspot" className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-zinc-900">Create Deal</div>
              <div className="text-[11px] text-orange-600 font-semibold">HubSpot CRM</div>
            </div>
          </div>
        </motion.div>

        {/* Node 4: Slack (Appears at 7s) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], x: [-20, 0, 0, -20] }}
          transition={{ duration: 6, delay: 7, times: [0, 0.05, 0.95, 1] }}
          className="absolute top-[270px] -translate-y-1/2 left-[75%] w-56 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white p-3 z-10"
        >
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-purple-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-fuchsia-50 flex items-center justify-center border border-purple-100 shadow-sm shrink-0">
              <BrandIcon id="slack" className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-zinc-900">Send Alert</div>
              <div className="text-[11px] text-purple-600 font-semibold">Slack</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

