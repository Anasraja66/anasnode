"use client";

import { motion } from "framer-motion";
import { Building2, ShoppingBag, Heart, Shield, Sparkles, Coffee, Truck, ArrowRight } from "lucide-react";
import { FadeIn } from "./Section";

type IndustryItem = {
  name: string;
  desc: string;
  icon: React.ReactNode;
  metric: string;
  metricLabel: string;
  automations: string[];
  color: string;
};

const INDUSTRIES: IndustryItem[] = [
  {
    name: "E-commerce & Retail",
    desc: "Recover lost checkouts, automate customer support, and collect 5-star Google ratings post-purchase.",
    icon: <ShoppingBag className="w-5 h-5 text-rose-500" />,
    metric: "18%",
    metricLabel: "Cart recovery rate",
    automations: ["Abandoned cart reminders", "WhatsApp receipt delivery", "Post-visit review collectors"],
    color: "from-rose-500/10 to-rose-600/5",
  },
  {
    name: "Real Estate & Agencies",
    desc: "Route inbound property inquiries, qualify buyer budgets, and coordinate home tour bookings 24/7.",
    icon: <Building2 className="w-5 h-5 text-amber-500" />,
    metric: "10x",
    metricLabel: "Faster lead qualification",
    automations: ["Budget qualification bots", "PDF brochure delivery", "Calendar booking links"],
    color: "from-amber-500/10 to-amber-600/5",
  },
  {
    name: "Healthcare & Wellness",
    desc: "Coordinate patient appointments, reduce no-shows with reminder alerts, and route inquiries securely.",
    icon: <Heart className="w-5 h-5 text-emerald-500" />,
    metric: "-85%",
    metricLabel: "Reduction in no-shows",
    automations: ["Auto-reminder notifications", "Treatment followup pings", "Feedback collections"],
    color: "from-emerald-500/10 to-emerald-600/5",
  },
  {
    name: "Restaurants & Hospitality",
    desc: "Provide interactive chat menus, automate booking table reservations, and send live order updates.",
    icon: <Coffee className="w-5 h-5 text-sky-500" />,
    metric: "92%",
    metricLabel: "Auto-order resolution",
    automations: ["WhatsApp interactive menus", "Table reservation systems", "Delivery status alerts"],
    color: "from-sky-500/10 to-sky-600/5",
  },
  {
    name: "Logistics & Operations",
    desc: "Automate dispatch alerts, keep customers updated with shipping statuses, and sync deliveries to Stripe.",
    icon: <Truck className="w-5 h-5 text-indigo-500" />,
    metric: "99.9%",
    metricLabel: "On-time delivery alerts",
    automations: ["Auto-dispatch updates", "Stripe payment triggers", "Proof of delivery logs"],
    color: "from-indigo-500/10 to-indigo-600/5",
  },
  {
    name: "SaaS & Tech Startups",
    desc: "Automate client onboarding workflows, trigger billing invoices, and sync webhook databases instantly.",
    icon: <Sparkles className="w-5 h-5 text-purple-500" />,
    metric: "95%",
    metricLabel: "Workflow auto-run",
    automations: ["Client onboarding alerts", "Stripe billing integrations", "Internal database routers"],
    color: "from-purple-500/10 to-purple-600/5",
  },
];

export function IndustrySection() {
  return (
    <section id="industries" className="py-20 sm:py-28 px-6 bg-[#FDF8F4] border-t border-[#F0E6DC] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[5%] w-[400px] h-[400px] rounded-full bg-sky-500/[0.02] blur-[100px]" />
        <div className="absolute bottom-[-100px] right-[5%] w-[400px] h-[400px] rounded-full bg-amber-500/[0.02] blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Title Block */}
        <FadeIn delay={0.1}>
          <div className="max-w-3xl mb-16">
            <h2 className="text-[34px] sm:text-[46px] font-black text-[#111827] tracking-tight leading-tight">
              Built for every industry
            </h2>
            <p className="text-[16px] sm:text-[18px] text-zinc-500 mt-3 font-medium leading-relaxed max-w-2xl">
              From fast-growing retail brands to local service operators, Anaos scales workflow automations across any business vertical.
            </p>
          </div>
        </FadeIn>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRIES.map((item, idx) => (
            <FadeIn key={item.name} delay={0.15 + idx * 0.06}>
              <div className="bg-white rounded-2xl border border-[#F0E6DC] p-6 flex flex-col justify-between h-full hover:shadow-md hover:border-zinc-300 transition-all duration-300 group">
                <div>
                  
                  {/* Top Icon & Metric */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/50 flex items-center justify-center">
                      {item.icon}
                    </span>
                    <div className="text-right">
                      <div className="text-[20px] font-extrabold text-[#111827]">{item.metric}</div>
                      <div className="text-[9.5px] font-bold text-[#00B0FF] uppercase tracking-wider">{item.metricLabel}</div>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-[17px] font-extrabold text-[#111827] mb-2 group-hover:text-[#00B0FF] transition-colors cursor-pointer">
                    {item.name}
                  </h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed mb-5">
                    {item.desc}
                  </p>

                  {/* Automations list */}
                  <div className="border-t border-[#F0E6DC]/40 pt-4 space-y-2">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Example Workflows:</div>
                    {item.automations.map((a) => (
                      <div key={a} className="flex items-center gap-2 text-[12.5px] text-zinc-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00B0FF]" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Footer Action link */}
                <div className="mt-6 pt-4 border-t border-[#F0E6DC]/40 flex items-center justify-between text-[13px] font-bold text-zinc-400 group-hover:text-[#00B0FF] transition-colors cursor-pointer">
                  <span>Explore workflows</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
