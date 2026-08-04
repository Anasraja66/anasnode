"use client";

import { motion } from "framer-motion";
import BrandIcon from "@/components/ui/BrandIcon";
import { Users, Bot, Zap, Mail, Send, Hash, LayoutGrid, BookOpen, Calendar, Folder, Code } from "lucide-react";

const APPS = [
  { id: "whatsapp", name: "WhatsApp", icon: <BrandIcon id="whatsapp" className="w-8 h-8" /> },
  { id: "slack", name: "Slack", icon: <BrandIcon id="slack" className="w-8 h-8" /> },
  { id: "hubspot", name: "HubSpot", icon: <BrandIcon id="hubspot" className="w-8 h-8" /> },
  { id: "notion", name: "Notion", icon: <BrandIcon id="notion" className="w-8 h-8" /> },
  { id: "openai", name: "OpenAI", icon: <BrandIcon id="openai" className="w-8 h-8" /> },
  { id: "stripe", name: "Stripe", icon: <BrandIcon id="stripe" className="w-8 h-8" /> },
  { id: "google_calendar", name: "Calendar", icon: <BrandIcon id="googlecalendar" className="w-8 h-8" /> },
  { id: "shopify", name: "Shopify", icon: <BrandIcon id="shopify" className="w-8 h-8" /> },
  { id: "discord", name: "Discord", icon: <Hash className="w-8 h-8 text-[#5865F2]" /> },
  { id: "mailchimp", name: "Mailchimp", icon: <Mail className="w-8 h-8 text-[#FFE01B]" /> },
  { id: "asana", name: "Asana", icon: <BookOpen className="w-8 h-8 text-[#FC636B]" /> },
  { id: "github", name: "GitHub", icon: <Code className="w-8 h-8 text-[#24292F]" /> },
  { id: "gemini", name: "Gemini", icon: <Bot className="w-8 h-8 text-[#4285F4]" /> },
  { id: "dropbox", name: "Dropbox", icon: <Folder className="w-8 h-8 text-[#0061FF]" /> },
  { id: "trello", name: "Trello", icon: <LayoutGrid className="w-8 h-8 text-[#0052CC]" /> },
];

// Duplicate the array to create a seamless loop
const SCROLL_ITEMS = [...APPS, ...APPS];

export function AppScroll() {
  return (
    <div className="w-full overflow-hidden py-10 relative">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F7F8FA] to-transparent z-10 pointer-events-none dark:from-[#0F172A]" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F7F8FA] to-transparent z-10 pointer-events-none dark:from-[#0F172A]" />
      
      <div className="flex w-max">
        <motion.div
          className="flex gap-12 sm:gap-16 items-center shrink-0 pr-12 sm:pr-16"
          animate={{ x: "-100%" }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {SCROLL_ITEMS.map((app, index) => (
            <div 
              key={`${app.id}-${index}`} 
              className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0"
            >
              {app.icon}
              <span className="font-semibold text-zinc-700 text-lg hidden sm:block">{app.name}</span>
            </div>
          ))}
        </motion.div>
        
        {/* We need a second track right behind it to make it seamless */}
        <motion.div
          className="flex gap-12 sm:gap-16 items-center shrink-0 pr-12 sm:pr-16"
          animate={{ x: "-100%" }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {SCROLL_ITEMS.map((app, index) => (
            <div 
              key={`second-${app.id}-${index}`} 
              className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0"
            >
              {app.icon}
              <span className="font-semibold text-zinc-700 text-lg hidden sm:block">{app.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
