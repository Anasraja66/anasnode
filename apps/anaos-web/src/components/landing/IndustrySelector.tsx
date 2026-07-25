"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Building, Coffee, ShoppingBag, Stethoscope, Scissors, HeartPulse, Hammer, ChevronRight, Wand2 } from "lucide-react";

export interface Industry {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  workflows: string[];
}

const industries: Industry[] = [
  {
    id: "dental",
    name: "Dental & Medical",
    icon: <Stethoscope className="w-5 h-5" />,
    description: "Book appointments, send reminders, and collect reviews.",
    workflows: [
      "Missed Call to Text (Booking Link)",
      "Appointment Reminder (24h before)",
      "Google Review Request (Post-visit)"
    ]
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: <Building className="w-5 h-5" />,
    description: "Qualify leads, schedule viewings, and follow up.",
    workflows: [
      "Facebook Lead Ad Follow-up",
      "Viewing Schedule Confirmation",
      "Property Alert to Contacts"
    ]
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: <ShoppingBag className="w-5 h-5" />,
    description: "Recover abandoned carts and answer FAQs.",
    workflows: [
      "Abandoned Cart Recovery via WhatsApp",
      "Order Tracking Update",
      "Customer Support AI Agent"
    ]
  },
  {
    id: "services",
    name: "Home Services",
    icon: <Hammer className="w-5 h-5" />,
    description: "Quote requests, dispatching, and invoicing.",
    workflows: [
      "Instant Quote Estimate via AI",
      "Technician Dispatch Notification",
      "Invoice Payment Follow-up"
    ]
  }
];

export function IndustrySelector({ onSelect, loadingId }: { onSelect: (industry: Industry) => void, loadingId?: string | null }) {
  const handleSelect = (ind: Industry) => {
    if (loadingId) return;
    onSelect(ind);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 relative rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group">
      {/* Background Layer with Light Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-[1.02] opacity-60"
        style={{ backgroundImage: "url('/light-aesthetic-bg.png')" }}
      />
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-white/70 backdrop-blur-xl border border-zinc-200/60" />

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Choose your industry</h3>
          <p className="text-[14px] sm:text-[15px] font-medium text-zinc-500 mt-1">Get pre-built, high-converting workflows in seconds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {industries.map((ind) => (
            <motion.div
              key={ind.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(ind)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col gap-2 ${
                loadingId === ind.id 
                  ? "border-blue-600 bg-blue-50/50" 
                  : "border-zinc-100 hover:border-zinc-200 bg-white/80 backdrop-blur-md"
              } ${loadingId ? "opacity-70 pointer-events-none" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                  loadingId === ind.id ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-600"
                }`}>
                  {loadingId === ind.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    ind.icon
                  )}
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-zinc-900 text-[14px]">{ind.name}</div>
                  <div className="text-[12px] text-zinc-500 line-clamp-1">{ind.description}</div>
                </div>
                <ChevronRight className={`w-4 h-4 ${loadingId === ind.id ? "text-blue-600" : "text-zinc-300"}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
