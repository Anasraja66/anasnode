"use client";

import { motion } from "framer-motion";
import BrandIcon from "@/components/ui/BrandIcon";
import { Bot, Sparkles, ArrowRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export function WorkflowIndustry() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      key={key}
      className="relative w-full max-w-4xl mx-auto h-[440px] mt-16 mb-8 rounded-3xl border border-white/60 bg-gradient-to-br from-violet-50/40 to-white/60 backdrop-blur-3xl overflow-hidden hidden md:block" 
      style={{ boxShadow: '0 20px 60px -15px rgba(139,92,246,0.15)' }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B5CF60A_1px,transparent_1px),linear-gradient(to_bottom,#8B5CF60A_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-violet-400/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-amber-400/10 rounded-full blur-[80px] pointer-events-none" />

      {/* 1. User Prompt Input Box */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: [0, 1, 1, 0], y: [-20, 0, 0, -20] }}
        transition={{ duration: 13, times: [0, 0.05, 0.95, 1] }}
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[700px] bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-violet-100 p-4 z-20 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-violet-600" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-[12px] text-violet-500 font-semibold mb-1">Generate Workflow</div>
          <div className="text-[14px] text-zinc-700 font-medium whitespace-nowrap overflow-hidden border-r-2 border-violet-500"
               style={{ animation: 'typingInd 3s steps(50, end) 1s forwards, blinkInd .75s step-end infinite' }}>
            "When a new lead fills the Facebook form, qualify them via AI and book an appointment on Google Calendar."
          </div>
        </div>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, backgroundColor: ['#8b5cf6', '#7c3aed', '#8b5cf6'] }}
          transition={{ 
            scale: { delay: 4, duration: 0.3 }, 
            opacity: { delay: 4, duration: 0.3 },
            backgroundColor: { delay: 4.5, duration: 0.3 }
          }}
          className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0 shadow-md"
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      {/* CSS for typing effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes typingInd {
          from { width: 0 }
          to { width: 100% }
        }
        @keyframes blinkInd {
          from, to { border-color: transparent }
          50% { border-color: #8b5cf6; }
        }
      `}} />

      {/* 2. Generating Workflow Nodes */}
      <div className="absolute top-[120px] left-0 w-full h-[300px]">
        
        {/* Node 1: Facebook (Appears at 5s) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], y: [20, 0, 0, 20] }}
          transition={{ duration: 8, delay: 5, times: [0, 0.05, 0.95, 1] }}
          className="absolute top-1/2 -translate-y-1/2 left-[5%] w-56 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white p-3 z-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100/50 flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
              <BrandIcon id="facebook" className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-zinc-800">New Form Lead</div>
              <div className="text-[11px] text-blue-600 font-semibold">Facebook Ads</div>
            </div>
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        </motion.div>

        {/* Path 1: FB to AI (Appears at 5.5s) */}
        <motion.svg 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 7.5, delay: 5.5, times: [0, 0.05, 0.95, 1] }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <defs>
            <linearGradient id="gradient-fb-ai" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 5.5 }}
            d="M calc(5% + 224px + 12px) 150 C 350 150, 350 150, calc(40% - 12px) 150" 
            fill="none" 
            stroke="url(#gradient-fb-ai)" 
            strokeWidth="3"
          />
          <motion.circle r="4" fill="#8b5cf6">
            <motion.animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M calc(5% + 224px + 12px) 150 C 350 150, 350 150, calc(40% - 12px) 150"
            />
          </motion.circle>
        </motion.svg>

        {/* Node 2: AnaOS AI (Appears at 6s) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], y: [20, 0, 0, 20] }}
          transition={{ duration: 7, delay: 6, times: [0, 0.05, 0.95, 1] }}
          className="absolute top-1/2 -translate-y-1/2 left-[40%] w-56 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] border border-violet-100 p-4 z-10"
        >
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-violet-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-violet-500 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-zinc-900">Qualify Lead</div>
              <div className="text-[12px] text-violet-600 font-semibold">AnaOS Logic</div>
            </div>
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-violet-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-violet-500 rounded-full" />
          </div>
        </motion.div>

        {/* Path 2: AI to Calendar (Appears at 6.5s) */}
        <motion.svg 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 6.5, delay: 6.5, times: [0, 0.05, 0.95, 1] }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <defs>
            <linearGradient id="gradient-ai-cal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 6.5 }}
            d="M calc(40% + 224px + 12px) 150 C 600 150, 600 150, calc(75% - 12px) 150" 
            fill="none" 
            stroke="url(#gradient-ai-cal)" 
            strokeWidth="3"
          />
          <motion.circle r="4" fill="#f59e0b">
            <motion.animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M calc(40% + 224px + 12px) 150 C 600 150, 600 150, calc(75% - 12px) 150"
            />
          </motion.circle>
        </motion.svg>

        {/* Node 3: Google Calendar (Appears at 7s) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8], y: [20, 0, 0, 20] }}
          transition={{ duration: 6, delay: 7, times: [0, 0.05, 0.95, 1] }}
          className="absolute top-1/2 -translate-y-1/2 left-[75%] w-56 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white p-3 z-10"
        >
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-amber-200 rounded-full flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-amber-500 rounded-full" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center border border-amber-100 shadow-sm shrink-0">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-zinc-900">Book Meeting</div>
              <div className="text-[11px] text-amber-600 font-semibold">Google Calendar</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
