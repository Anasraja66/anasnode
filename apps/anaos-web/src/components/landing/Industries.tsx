"use client";

import { ArrowUpRight, Database, Mail, Calendar, Star, MessageSquare, ShoppingCart, ShoppingBag, Shield, Sparkles, CheckCircle, FileText, Bell } from "lucide-react";
import { Section, SectionLabel, FadeIn } from "./Section";
import { Typewriter } from "./Typewriter";

type Template = {
  name: string;
  tag: string;
  icon: any;
  status: string;
  title: string;
  subtitle: string;
  image: string;
};

const TEMPLATES: Template[] = [
  {
    name: "WhatsApp Lead Responder",
    tag: "Instantly capture, qualify, and sync inbound leads to Google Sheets or CRMs.",
    icon: Database,
    status: "Lead Qualified",
    title: "New lead from WhatsApp",
    subtitle: "High value property inquiry sync'd to Sheets.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Abandoned Cart Recoverer",
    tag: "Send automated WhatsApp/SMS checkout reminders and recover lost sales.",
    icon: ShoppingCart,
    status: "Recovery Sent",
    title: "Abandoned cart detected",
    subtitle: "10% discount reminder sent to customer.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Google Reviews Collector",
    tag: "Auto-trigger review requests post-delivery and filter out negative feedback.",
    icon: Star,
    status: "Review Collected",
    title: "5-Star Review Received",
    subtitle: "Post-service feedback auto-synced to Google.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "AI Helpdesk Support Bot",
    tag: "Resolve 90% of business FAQs 24/7 trained on your PDFs, docs & URLs.",
    icon: MessageSquare,
    status: "AI Responding",
    title: "Customer Query Resolved",
    subtitle: "Resolved via Store_Refund_Policy.pdf",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "WhatsApp Ordering & Booking",
    tag: "Let users view menus, select services, and place orders directly in chat.",
    icon: ShoppingBag,
    status: "Order Received",
    title: "New Digital Order",
    subtitle: "1x Artisanal Pizza ($14.99) · Paid via chat.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Billing & Stripe Sync",
    tag: "Automatically generate, send, and track PDF invoices upon payment/sale.",
    icon: FileText,
    status: "Invoice Sent",
    title: "Stripe Payment Sync",
    subtitle: "Paid $189.00 — Invoice #1042 dispatched.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80"
  }
];

function SaaSGraphic({ template }: { template: Template }) {
  const Icon = template.icon;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden group bg-zinc-50">
      {/* Real Background Image - Much brighter and cleaner */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={template.image}
          alt={template.name}
          className="w-full h-full object-cover opacity-60 mix-blend-multiply grayscale-[20%] transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Sky blue subtle gradient instead of dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/40 via-transparent to-white/20" />
      </div>
      
      {/* High-End Floating Card - Minimal & Sharp */}
      <div className="relative w-[88%] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-200/50 p-5 flex flex-col gap-4 transition-all duration-500 group-hover:translate-y-[-4px] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-[#00B0FF] text-white shadow-md shadow-blue-100">
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50/50 border border-blue-100/50 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {template.status}
          </div>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-[15px] font-bold text-zinc-900 tracking-tight leading-tight">{template.title}</h4>
          <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">{template.subtitle}</p>
        </div>

        <div className="h-px bg-zinc-100 w-full" />
        
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-zinc-50 border border-zinc-100" />
          <div className="flex-1 space-y-2">
            <div className="h-1.5 w-3/4 bg-zinc-100 rounded-full" />
            <div className="h-1 w-1/2 bg-zinc-50 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Industries() {
  return (
    <Section id="templates" className="relative bg-white overflow-hidden border-t border-zinc-100">
      {/* Background Glow Blobs - Matching Hero exactly */}
      <div className="absolute top-0 left-0 right-0 h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] bg-[#0A6BFF] blur-[120px] rounded-full opacity-[0.03] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] bg-[#38BDF8] blur-[120px] rounded-full opacity-[0.03] mix-blend-multiply" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn>
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-[24px] sm:text-[48px] font-bold text-zinc-900 tracking-tight leading-[1.1] max-w-2xl">
              <Typewriter text="Don't start from scratch." />
              <span className="block text-zinc-400">
                <Typewriter text="Ship in minutes, not days." delay={2} />
              </span>
            </h2>
          </div>
        </FadeIn>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TEMPLATES.map((template, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="group relative flex flex-col h-full bg-white rounded-[32px] border border-zinc-100 hover:border-blue-100 transition-all duration-500 overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,176,255,0.08)]">
                <div className="aspect-[1.3] w-full overflow-hidden border-b border-zinc-50">
                  <SaaSGraphic template={template} />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-[18px] font-bold text-zinc-900 mb-2 tracking-tight">{template.name}</h3>
                  <p className="text-[14px] text-zinc-500 leading-relaxed flex-1 font-medium">
                    {template.tag}
                  </p>
                  <div className="mt-8 flex items-center justify-between group/btn">
                    <span className="text-[14px] font-bold text-zinc-900 group-hover/btn:text-[#00B0FF] transition-colors">Use template</span>
                    <div className="w-9 h-9 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100 transition-all duration-300 group-hover:bg-[#00B0FF] group-hover:border-[#00B0FF] group-hover:text-white">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}
