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
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.602 6.04L0 24l6.117-1.605a11.837 11.837 0 005.925 1.586h.005c6.635 0 12.032-5.396 12.035-12.032a11.76 11.76 0 00-3.489-8.482z"/>
        </svg>
      ), 
      color: "bg-[#25D366]", 
      label: "WhatsApp" 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ), 
      color: "bg-[#1877F2]", 
      label: "Facebook" 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ), 
      color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]", 
      label: "Instagram" 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M18.8 6.4L16.2 0H7.8L5.2 6.4L0 7.8L1.6 22.4L12 24L22.4 22.4L24 7.8L18.8 6.4Z" />
          <path fill="#96bf48" d="M12 19.2c-1.6 0-2.8-1-3.2-2l-.6-.8 1.8-.8.4.6c.2.4.8 1 1.6 1 .8 0 1.4-.4 1.4-1s-.4-.8-1.4-1.2c-1.6-.6-2.8-1.2-2.8-2.8 0-1.4 1-2.4 2.6-2.4 1.4 0 2.4.8 2.8 1.6l.6.8-1.8.8-.4-.6c-.2-.4-.6-.8-1.2-.8-.6 0-1 .4-1 .8 0 .4.4.6 1.2 1 1.6.6 2.8 1.2 2.8 2.8 0 1.4-1 2.8-2.8 2.8z" />
        </svg>
      ), 
      color: "bg-[#96bf48]", 
      label: "Shopify" 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M12.525.02c1.31 0 2.591.26 3.811.73v4.257c-.711-.31-1.481-.47-2.281-.47-2.92 0-5.29 2.37-5.29 5.29 0 .09.01.18.02.27v4.25c-.01-.09-.02-.18-.02-.27 0-5.28 4.29-9.57 9.57-9.57.81 0 1.58.1 2.31.29V.75C19.385.25 18.104 0 16.794 0h-4.269v16.706c0 2.214-1.801 4.015-4.015 4.015s-4.015-1.801-4.015-4.015 1.801-4.015 4.015-4.015c.253 0 .495.029.731.083v-4.172c-.24-.022-.482-.036-.731-.036-4.51 0-8.17 3.66-8.17 8.17 0 4.51 3.66 8.17 8.17 8.17s8.17-3.66 8.17-8.17v-10.08c1.505 1.225 3.411 1.956 5.49 1.956v-4.17c-3.13 0-5.67-2.54-5.67-5.67V.02h-4.25z" />
        </svg>
      ), 
      color: "bg-black", 
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
            <h2 className="text-[32px] sm:text-[44px] font-bold text-zinc-900 tracking-tight text-center mb-16">
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
                <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center border-2 border-[#0A6BFF] group-hover:border-blue-600 transition-colors">
                  <Send className="w-3 h-3" />
                </div>
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center border-2 border-[#0A6BFF] group-hover:border-blue-600 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
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
