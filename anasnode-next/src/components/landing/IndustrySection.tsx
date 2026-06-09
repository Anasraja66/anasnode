"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "./Section";
import { Typewriter } from "./Typewriter";

type IndustryItem = {
  name: string;
  desc: string;
  image: string;
  metric: string;
  metricLabel: string;
  link: string;
};

const INDUSTRIES: IndustryItem[] = [
  {
    name: "E-commerce & Retail",
    desc: "Recover lost carts over WhatsApp, automate receipt delivery, and boost Google reviews post-purchase.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    metric: "18% Recovery",
    metricLabel: "Cart recovery rate",
    link: "#"
  },
  {
    name: "Real Estate & Agencies",
    desc: "Qualify inbound property inquiries, share listing PDF brochures, and coordinate tours on your calendar.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    metric: "10x Faster",
    metricLabel: "Lead qualification",
    link: "#"
  },
  {
    name: "Healthcare & Wellness",
    desc: "Send automated booking reminders, followup instructions, and coordinate patient surveys securely.",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    metric: "-85% No-Shows",
    metricLabel: "Fewer skipped bookings",
    link: "#"
  },
  {
    name: "Restaurants & Hospitality",
    desc: "Provide interactive WhatsApp menus, automate table bookings, and dispatch live order statuses.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    metric: "92% Auto-Orders",
    metricLabel: "Resolved via chat",
    link: "#"
  },
  {
    name: "Logistics & Dispatch",
    desc: "Send automated dispatch alerts, share real-time tracking links, and trigger invoices upon delivery.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    metric: "99.9% Uptime",
    metricLabel: "On-time updates",
    link: "#"
  },
  {
    name: "Agencies & Tech Startups",
    desc: "Automate onboarding checklists, generate Stripe billing invoices, and sync databases instantly.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
    metric: "95% Auto-run",
    metricLabel: "Zero manual touch",
    link: "#"
  }
];

export function IndustrySection() {
  return (
    <section id="industries" className="py-24 sm:py-32 px-6 bg-white border-t border-zinc-100 relative overflow-hidden">
      {/* Background Glow Blobs to match Hero */}
      <div className="absolute top-0 left-0 right-0 h-full pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[50%] bg-[#0A6BFF] blur-[120px] rounded-full opacity-5 mix-blend-multiply animate-blob" />
        <div className="absolute bottom-[20%] right-[-10%] w-[45%] h-[60%] bg-[#38BDF8] blur-[130px] rounded-full opacity-5 mix-blend-multiply animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Block */}
        <FadeIn delay={0.1}>
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-[36px] sm:text-[50px] font-black text-[#111827] tracking-tight leading-[1.08] font-display">
              <Typewriter text="Built for every industry" />
            </h2>
            <p className="text-[17px] sm:text-[19px] text-[#4B5563] mt-4 font-semibold leading-relaxed max-w-2xl mx-auto">
              Choose your vertical to explore real-world, high-performing automation workflows.
            </p>
          </div>
        </FadeIn>

        {/* Visually Immersive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map((item, idx) => (
            <FadeIn key={item.name} delay={0.15 + idx * 0.06}>
              <a
                href={item.link}
                className="group relative h-[380px] rounded-2xl overflow-hidden border border-zinc-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-end p-6 hover:shadow-lg hover:border-zinc-300 transition-all duration-300 active:scale-[0.99] select-none cursor-pointer"
              >
                {/* Background Image with Zoom on Hover */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 group-hover:via-black/45 transition-colors duration-300" />

                {/* Card Content Overlay */}
                <div className="relative z-10 flex flex-col justify-between h-full w-full text-white">
                  
                  {/* Top Metric Badge */}
                  <div className="flex justify-between items-start">
                    <span className="bg-white/15 backdrop-blur-[3px] border border-white/20 text-white text-[11px] px-2.5 py-1 rounded-full font-bold">
                      {item.metric}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-7 h-7 rounded-full bg-white/20 backdrop-blur-[2px] flex items-center justify-center border border-white/20">
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </span>
                  </div>

                  {/* Text Details at the Bottom */}
                  <div>
                    <h3 className="text-[21px] sm:text-[23px] font-black text-white tracking-wide mb-2 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-[13px] text-zinc-200 leading-relaxed font-medium mb-1">
                      {item.desc}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      {item.metricLabel}
                    </span>
                  </div>

                </div>
              </a>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
