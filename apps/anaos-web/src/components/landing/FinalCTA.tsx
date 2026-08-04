"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn, Section } from "./Section";
import { Typewriter } from "./Typewriter";
import { WordRotator } from "./WordRotator";
import { 
  MessageSquare, 
  Cpu, 
  Puzzle, 
  Send, 
  Zap, 
  CheckCircle2, 
  Globe, 
  Smartphone,
  MessageCircle,
  Hash
} from "lucide-react";
import BrandIcon from "@/components/ui/BrandIcon";

const features = [
  {
    icon: Globe,
    title: "Brand-consistent AI identity",
    desc: "Trained on your workflows, integrated with your tools."
  },
  {
    icon: Cpu,
    title: "Persistent memory & computer",
    desc: "24/7 cloud assistant that keeps full context and memory."
  },
  {
    icon: Puzzle,
    title: "Custom skills",
    desc: "Equip your assistant with expert knowledge in specific areas."
  },
  {
    icon: MessageSquare,
    title: "Works in your messenger",
    desc: "Available on WhatsApp, Telegram, Line, and Slack."
  }
];

export function FinalCTA() {
  const messengerIcons = [
    { 
      icon: <BrandIcon id="whatsapp" className="w-10 h-10" />, 
      color: "bg-white", 
      label: "WhatsApp" 
    },
    { 
      icon: <BrandIcon id="facebook" className="w-10 h-10" />, 
      color: "bg-white", 
      label: "Facebook" 
    },
    { 
      icon: <BrandIcon id="instagram" className="w-10 h-10" />, 
      color: "bg-white", 
      label: "Instagram" 
    },
    { 
      icon: <BrandIcon id="shopify" className="w-10 h-10" />, 
      color: "bg-white", 
      label: "Shopify" 
    },
    { 
      icon: <BrandIcon id="tiktok" className="w-10 h-10" />, 
      color: "bg-white", 
      label: "TikTok" 
    },
  ];

  return (
    <Section id="cta" className="relative pb-24 overflow-hidden bg-white border-t border-zinc-100">
      {/* Background Glow Blobs - Hero Theme */}
      <div className="absolute top-0 left-0 right-0 h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] bg-[#0A6BFF] blur-[120px] rounded-full opacity-[0.03] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] bg-[#38BDF8] blur-[120px] rounded-full opacity-[0.03] mix-blend-multiply" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center">
          {/* Visual Deployment Graphic (Manus Style) */}
          <div className="relative mb-12 flex items-center justify-center pt-20">
            {/* Orbiting Icons */}
            <div className="absolute inset-0 flex items-center justify-center">
              {messengerIcons.map((m, i) => {
                const angle = (i / messengerIcons.length) * Math.PI - Math.PI;
                const radius = 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    className={`absolute w-14 h-14 rounded-full ${m.color} text-white flex items-center justify-center shadow-xl z-20 border-4 border-white`}
                    style={{ x, y }}
                  >
                    {m.icon}
                  </motion.div>
                );
              })}
            </div>

            {/* Central Phone Mockup - Real Image Style */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative w-[300px] h-[360px] bg-white rounded-t-[48px] border-x border-t border-zinc-200 shadow-[0_-30px_60px_rgba(0,0,0,0.05)] flex flex-col items-center pt-4 overflow-hidden"
            >
              {/* Phone Content - Real App Conversation Mockup */}
              <div className="w-full h-full relative px-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-zinc-100 rounded-full mb-6" />
                
                {/* Chat UI Mockup */}
                <div className="mt-8 space-y-4">
                  {/* Incoming Message */}
                  <div className="flex flex-col items-start">
                    <div className="bg-zinc-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                      <p className="text-[12px] text-zinc-900 font-medium leading-tight">I'm looking for a commercial property in Dubai. My budget is 2M AED.</p>
                    </div>
                  </div>

                  {/* AI Response (Anaos) */}
                  <div className="flex flex-col items-end">
                    <div className="bg-blue-600 rounded-2xl rounded-tr-none p-3 max-w-[85%] shadow-lg shadow-blue-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-200" />
                        <span className="text-[10px] font-bold text-blue-100 uppercase tracking-wider">Anaos AI</span>
                      </div>
                      <p className="text-[12px] text-white font-medium leading-tight">Found 3 properties matching your criteria! Would you like me to book a viewing for tomorrow?</p>
                    </div>
                  </div>

                  {/* Customer Reply */}
                  <div className="flex flex-col items-start">
                    <div className="bg-zinc-100 rounded-2xl rounded-tl-none p-3 max-w-[70%]">
                      <p className="text-[12px] text-zinc-900 font-medium leading-tight">Yes, please. 2 PM works best.</p>
                    </div>
                  </div>

                  {/* Final AI Action */}
                  <div className="flex flex-col items-end">
                    <div className="bg-zinc-900 rounded-2xl rounded-tr-none p-3 max-w-[85%]">
                      <p className="text-[11px] text-zinc-300 font-medium leading-tight italic">✓ Viewing booked for Tomorrow at 2:00 PM. Calendar invite sent.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Heading */}
          <FadeIn>
            <h2 className="text-[24px] sm:text-[44px] font-bold text-zinc-900 tracking-tight text-center mb-16">
              Deploy your agent for{" "}
              <WordRotator 
                words={[
                  "automation",
                  "CRM sync",
                  "workflows",
                  "enterprise scale",
                  "lead generation",
                  "customer support",
                  "voice calling",
                  "API integration"
                ]} 
                className="text-blue-600"
              />
            </h2>
          </FadeIn>

          {/* Feature Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-16">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white rounded-3xl p-7 border border-zinc-100 h-full hover:border-blue-100 transition-colors duration-300">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center mb-6 text-zinc-600">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-[17px] font-bold text-zinc-900 mb-2">{f.title}</h3>
                  <p className="text-[14px] text-zinc-500 leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Final CTA Button */}
          <FadeIn delay={0.5}>
            <button className="group relative bg-[#0A6BFF] text-white px-8 py-4 rounded-full font-bold text-[15px] flex items-center gap-3 hover:bg-blue-600 transition-all shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-[#0A6BFF] group-hover:border-blue-600 transition-colors overflow-hidden">
                  <BrandIcon id="telegram" className="w-4 h-4" />
                </div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-[#0A6BFF] group-hover:border-blue-600 transition-colors overflow-hidden">
                  <BrandIcon id="whatsapp" className="w-4 h-4" />
                </div>
              </div>
              <span>Get started for free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
