"use client";

import { ArrowUpRight, Database, Mail, Calendar, Star, MessageSquare, ShoppingCart, Shield, Sparkles, CheckCircle, FileText, Bell } from "lucide-react";
import { FadeIn } from "./Section";

type Template = {
  name: string;
  tag: string;
  renderGraphic: () => React.ReactNode;
};

const TEMPLATES: Template[] = [
  {
    name: "WhatsApp Lead Responder",
    tag: "Instantly capture, qualify, and sync inbound leads to Google Sheets or CRMs.",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#EBF5FF] p-4 flex flex-col justify-between select-none">
        <div className="flex justify-between items-center">
          <span className="text-[#00B0FF] text-[8px] font-mono tracking-widest font-bold uppercase">LEAD ROUTER</span>
          <span className="bg-emerald-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
            <Database className="w-1.5 h-1.5" /> SHEET SYNC
          </span>
        </div>
        
        {/* Chat simulation */}
        <div className="my-2 space-y-1.5">
          <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm max-w-[85%] border border-zinc-100">
            <p className="text-[7.5px] font-bold text-zinc-800">Hi! I want to quote a commercial property.</p>
          </div>
          <div className="bg-[#00B0FF]/10 border border-[#00B0FF]/20 p-2 rounded-lg rounded-tr-none shadow-sm max-w-[85%] ml-auto text-right">
            <p className="text-[7.5px] font-bold text-[#00B0FF] leading-snug">Got it. Lead scored: High Value. Added to Sheets! ✅</p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-[2px] p-2 rounded-lg shadow-sm border border-zinc-200/50 flex items-center justify-between">
          <span className="text-[8px] font-bold text-zinc-700">Lead: Enterprise · 50+ Users</span>
          <span className="text-[7px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Routed ➔ Sheets</span>
        </div>
      </div>
    ),
  },
  {
    name: "Abandoned Cart Recoverer",
    tag: "Send automated WhatsApp/SMS checkout reminders and recover lost sales.",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#FAF7F2] p-4 flex flex-col justify-between select-none">
        <div className="flex justify-between items-center text-[7px] tracking-widest text-zinc-500 font-semibold">
          <span>CART RECOVERY</span>
          <span className="text-[#00B0FF] font-bold">MONITORED</span>
        </div>
        <div className="my-auto text-left flex flex-col justify-center">
          <span className="text-[13px] sm:text-[14px] font-black text-zinc-800 uppercase leading-none mb-1">
            CART CONVERSION
          </span>
          <p className="text-[5.8px] leading-[1.3] text-zinc-500 max-w-[95%] font-medium my-1 font-mono whitespace-pre-wrap">
            {`if (cart.status == "abandoned") {\n  whatsapp.sendOffer("10% OFF discount link");\n}`}
          </p>
          <span className="text-[5px] text-[#00B0FF] font-mono tracking-widest uppercase font-bold mt-1">
            ➔ RECOVERED $12,480 THIS MONTH
          </span>
        </div>
        <div className="h-1 bg-zinc-200/60 rounded-full w-full overflow-hidden">
          <div className="bg-[#00B0FF] h-full w-[75%]" />
        </div>
      </div>
    ),
  },
  {
    name: "Google Reviews Collector",
    tag: "Auto-trigger review requests post-delivery and filter out negative feedback.",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#FFF9E6] p-4 flex flex-col justify-between select-none">
        <div className="flex justify-between items-center">
          <span className="text-[#FFB300] text-[8px] font-mono tracking-widest font-bold uppercase">REVIEWS BOOSTER</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-2 h-2 fill-[#FFB300] stroke-[#FFB300]" />
            ))}
          </div>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-amber-200/40 shadow-sm my-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[6px] font-bold">✓</span>
            <span className="text-[8.5px] font-bold text-zinc-800">Job completed: AC Service</span>
          </div>
          <p className="text-[7.5px] text-zinc-500 mt-1 leading-snug">"Trigger WhatsApp feedback request. If 5-star, link to Google Review page."</p>
        </div>

        <div className="flex items-center justify-between text-[7px] text-zinc-400 font-mono font-semibold">
          <span>Reviews sent: +180</span>
          <span className="text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">Rating: 4.9★</span>
        </div>
      </div>
    ),
  },
  {
    name: "AI Helpdesk Support Bot",
    tag: "Resolve 90% of business FAQs 24/7 trained on your PDFs, docs & URLs.",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#F4F4F9] p-4 flex flex-col justify-between select-none">
        <div className="flex justify-between items-center">
          <span className="text-[#00B0FF] text-[8px] font-mono tracking-widest font-bold uppercase">AI HELPDESK</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B0FF] animate-pulse" />
        </div>
        
        <div className="my-auto text-center flex flex-col items-center">
          <div className="bg-white/80 border border-zinc-200/50 p-2 rounded-lg shadow-sm w-full">
            <p className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest text-left">TRAINED SOURCE</p>
            <div className="flex items-center gap-1.5 mt-1">
              <FileText className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="text-[8px] font-bold text-zinc-700 truncate">Store_Refund_Policy.pdf</span>
            </div>
          </div>
          <span className="text-[7px] text-[#00B0FF] font-mono font-bold mt-2">✔ Responding instantly on WhatsApp</span>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 px-2 py-1 rounded text-[7px] font-bold text-emerald-700 flex items-center justify-between">
          <span>Tickets Resolved</span>
          <span>92.4%</span>
        </div>
      </div>
    ),
  },
  {
    name: "WhatsApp Ordering & Booking",
    tag: "Let users view menus, select services, and place orders directly in chat.",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#FCF9F5] p-4 flex flex-col justify-between select-none">
        <div className="flex justify-between items-center">
          <span className="text-zinc-500 text-[8px] font-mono tracking-widest font-bold uppercase">DIGITAL MENU</span>
          <ShoppingCart className="w-3.5 h-3.5 text-zinc-500" />
        </div>
        
        <div className="my-auto space-y-1">
          <div className="bg-white border border-zinc-200/40 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px]">🍕</span>
              <div className="text-left">
                <p className="text-[8px] font-bold text-zinc-800 leading-none">Pepperoni Pizza</p>
                <p className="text-[6.5px] text-zinc-400 mt-0.5">$14.99</p>
              </div>
            </div>
            <span className="bg-[#00B0FF] text-white text-[7.5px] font-bold px-2 py-0.5 rounded-full">Add ＋</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[7.5px] font-mono text-zinc-400 font-bold">
          <span>Cart: 1 item ($14.99)</span>
          <span className="text-[#00B0FF]">Checkout ➔</span>
        </div>
      </div>
    ),
  },
  {
    name: "Billing & Stripe Sync",
    tag: "Automatically generate, send, and track PDF invoices upon payment/sale.",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#F5F9F6] p-4 flex flex-col justify-between select-none">
        <div className="flex justify-between items-center">
          <span className="text-emerald-600 text-[8px] font-mono tracking-widest font-bold uppercase">STRIPE DISPATCH</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-emerald-600" />
          </span>
        </div>
        
        <div className="my-auto bg-white p-2.5 rounded-xl border border-emerald-100 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-[#10B981] font-extrabold text-[15px]">$189.00</span>
          <span className="text-[6.5px] text-zinc-400 font-mono mt-0.5 uppercase">Invoice #1042 Paid</span>
          <span className="text-[6.5px] font-bold text-[#00B0FF] bg-[#00B0FF]/5 border border-[#00B0FF]/15 px-2 py-0.5 rounded-full mt-2">
            PDF Invoice sent via WhatsApp
          </span>
        </div>

        <div className="flex items-center justify-between text-[7px] text-zinc-400 font-mono font-semibold">
          <span>Automated Billing</span>
          <span className="text-emerald-600">Sync OK</span>
        </div>
      </div>
    ),
  },
  {
    name: "Appointment Reminders",
    tag: "Reduce no-shows by automatically texting customers scheduling confirmations.",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#FAF5F7] p-3.5 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between border-b border-pink-100 pb-1.5">
          <span className="text-[7.5px] font-bold text-pink-600 font-mono tracking-wider">APPOINTMENTS</span>
          <span className="text-[7px] font-bold text-[#00B0FF]">REMINDER TRIGGERED</span>
        </div>

        <div className="bg-white p-2 rounded-lg border border-pink-100 shadow-sm my-auto">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <div className="text-left leading-none">
              <span className="text-[8px] font-bold text-zinc-800">Booking: Haircut & Styling</span>
              <p className="text-[6px] text-zinc-400 mt-0.5">Tomorrow at 2:00 PM</p>
            </div>
          </div>
          <p className="text-[5.5px] text-zinc-500 mt-1 leading-[1.3] font-semibold border-t border-zinc-50 pt-1">
            "Your appointment is confirmed. Press 1 to reschedule, 2 to cancel."
          </p>
        </div>

        <div className="h-1 bg-pink-100 rounded-full w-full overflow-hidden">
          <div className="bg-pink-500 h-full w-[95%]" />
        </div>
      </div>
    ),
  },
  {
    name: "AI Outreach Agent",
    tag: "Reactively nurture cold leads, request callbacks, and close deals via SMS.",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#EAE6DF]">
        <img
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
          alt="AI Outreach"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale contrast-115 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/25 flex items-end justify-center p-2.5">
          <div className="w-full bg-white/95 backdrop-blur-[2px] p-2 rounded shadow-sm border border-black/5 flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="text-[7.5px] font-bold text-zinc-800 tracking-tight leading-snug line-clamp-1">
                Campaign: Inactive Leads
              </span>
              <span className="text-[6px] text-blue-600 font-semibold mt-0.5 uppercase tracking-wide">
                42 Followups sent today
              </span>
            </div>
            <ArrowUpRight className="w-2.5 h-2.5 text-zinc-700 shrink-0" />
          </div>
        </div>
      </div>
    ),
  },
];

export function Industries() {
  return (
    <section id="industries" className="py-20 sm:py-24 px-6 bg-white border-t border-zinc-100 z-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-[34px] sm:text-[42px] font-black text-[#111827] tracking-[-0.03em] leading-tight font-sans">
                Real-World Automations
              </h2>
              <p className="text-[15px] sm:text-[16px] text-zinc-500 mt-1 font-medium">
                Choose a pre-built template to automate your small business workflows instantly.
              </p>
            </div>
            <button
              type="button"
              className="h-10 px-5.5 rounded-xl border border-zinc-200 hover:border-[#111827] bg-white hover:bg-zinc-50 text-[13.5px] font-bold text-zinc-700 shadow-sm transition-all sm:self-center cursor-pointer shrink-0 active:scale-95 hover:text-[#111827]"
            >
              View all templates
            </button>
          </div>
        </FadeIn>

        {/* Templates 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {TEMPLATES.map((tpl, i) => (
            <FadeIn key={i} delay={0.15 + (i * 0.08)}>
              <div className="group relative flex flex-col">
                
                {/* Media Card (aspect ratio 1.6/1) */}
                <div className="aspect-[1.6/1] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative transition-all duration-300 group-hover:shadow-md group-hover:border-zinc-300 flex items-center justify-center select-none">
                  {tpl.renderGraphic()}
                </div>

                {/* Template Meta Information */}
                <div className="mt-3.5 flex flex-col">
                  <h3 className="text-[14.5px] font-bold text-zinc-900 leading-snug group-hover:text-[#00B0FF] transition-colors cursor-pointer">
                    {tpl.name}
                  </h3>
                  <p className="text-[12.5px] text-zinc-500 leading-relaxed font-semibold mt-0.5">
                    {tpl.tag}
                  </p>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
