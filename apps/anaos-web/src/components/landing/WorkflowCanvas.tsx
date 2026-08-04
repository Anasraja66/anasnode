"use client";

import { motion } from "framer-motion";
import BrandIcon from "@/components/ui/BrandIcon";
import { Bot, Zap } from "lucide-react";

export function WorkflowCanvas() {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px] mt-16 mb-8 rounded-3xl border border-zinc-200/50 bg-white/40 backdrop-blur-3xl shadow-xl overflow-hidden hidden md:block">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Node 1: Trigger (WhatsApp) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="absolute top-1/2 -translate-y-1/2 left-[10%] w-64 bg-white rounded-2xl shadow-lg border border-zinc-200 p-4 z-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <BrandIcon id="whatsapp" className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-zinc-900">New Message</div>
            <div className="text-[12px] text-zinc-500 font-medium">WhatsApp Trigger</div>
          </div>
        </div>
        <div className="bg-zinc-50 rounded-lg p-2 border border-zinc-100">
          <p className="text-[11px] text-zinc-600 font-medium italic">"Hi, I want to book a demo."</p>
        </div>
        {/* Output Handle */}
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-zinc-300 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-zinc-400 rounded-full" />
        </div>
      </motion.div>

      {/* Path 1 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <motion.path 
          d="M calc(10% + 256px + 12px) 200 C 400 200, 400 120, calc(50% - 128px - 12px) 120" 
          fill="none" 
          stroke="#E5E7EB" 
          strokeWidth="3"
        />
        {/* Animated Particle */}
        <motion.circle r="4" fill="#0A6BFF">
          <motion.animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M calc(10% + 256px + 12px) 200 C 400 200, 400 120, calc(50% - 128px - 12px) 120"
          />
        </motion.circle>
      </svg>

      {/* Path 2 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <motion.path 
          d="M calc(10% + 256px + 12px) 200 C 400 200, 400 280, calc(50% - 128px - 12px) 280" 
          fill="none" 
          stroke="#E5E7EB" 
          strokeWidth="3"
        />
        {/* Animated Particle */}
        <motion.circle r="4" fill="#0A6BFF">
          <motion.animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M calc(10% + 256px + 12px) 200 C 400 200, 400 280, calc(50% - 128px - 12px) 280"
          />
        </motion.circle>
      </svg>

      {/* Node 2: AI Processor */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="absolute top-[30%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-xl border-2 border-blue-500/20 p-4 z-10"
        style={{ boxShadow: "0 0 40px -10px rgba(10, 107, 255, 0.15)" }}
      >
        {/* Input Handle */}
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-zinc-300 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-zinc-900">AnaOS AI</div>
            <div className="text-[12px] text-blue-500 font-medium">Intent Classifier</div>
          </div>
        </div>
        <div className="bg-blue-50/50 rounded-lg p-2 border border-blue-100">
          <p className="text-[11px] text-zinc-600 font-medium font-mono">Intent: Book_Meeting</p>
        </div>
        {/* Output Handle */}
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-zinc-300 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-zinc-400 rounded-full" />
        </div>
      </motion.div>

      {/* Path 3 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <motion.path 
          d="M calc(50% + 128px + 12px) 120 C 700 120, 700 200, calc(90% - 256px - 12px) 200" 
          fill="none" 
          stroke="#E5E7EB" 
          strokeWidth="3"
        />
        <motion.circle r="4" fill="#0A6BFF">
          <motion.animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M calc(50% + 128px + 12px) 120 C 700 120, 700 200, calc(90% - 256px - 12px) 200"
          />
        </motion.circle>
      </svg>

      {/* Node 3: CRM Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="absolute top-[70%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-2xl shadow-lg border border-zinc-200 p-4 z-10"
      >
        {/* Input Handle */}
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-zinc-300 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-zinc-400 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <BrandIcon id="hubspot" className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-zinc-900">Create Deal</div>
            <div className="text-[12px] text-zinc-500 font-medium">HubSpot CRM</div>
          </div>
        </div>
      </motion.div>

      {/* Node 4: Final Action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="absolute top-1/2 -translate-y-1/2 right-[10%] w-64 bg-white rounded-2xl shadow-lg border border-zinc-200 p-4 z-10"
      >
        {/* Input Handle */}
        <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border-2 border-zinc-300 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-zinc-400 rounded-full" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <BrandIcon id="slack" className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-zinc-900">Send Alert</div>
            <div className="text-[12px] text-zinc-500 font-medium">Slack</div>
          </div>
        </div>
        <div className="bg-zinc-50 rounded-lg p-2 border border-zinc-100">
          <p className="text-[11px] text-zinc-600 font-medium italic">"#sales: New lead from WhatsApp"</p>
        </div>
      </motion.div>
    </div>
  );
}
