"use client";

 
 
 
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ArrowUpRight, Database, Mail, Calendar, Star, MessageSquare, ShoppingCart, ShoppingBag, Shield, Sparkles, CheckCircle, FileText, Bell } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Section, SectionLabel, FadeIn } from "./Section";
import { Typewriter } from "./Typewriter";

type Template = {
  name: string;
  tag: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Abandoned Cart Recoverer",
    tag: "Send automated WhatsApp/SMS checkout reminders and recover lost sales.",
    icon: ShoppingCart,
    status: "Recovery Sent",
    title: "Abandoned cart detected",
    subtitle: "10% discount reminder sent to customer.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Google Reviews Collector",
    tag: "Auto-trigger review requests post-delivery and filter out negative feedback.",
    icon: Star,
    status: "Review Collected",
    title: "5-Star Review Received",
    subtitle: "Post-service feedback auto-synced to Google.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "AI Helpdesk Support Bot",
    tag: "Resolve 90% of business FAQs 24/7 trained on your PDFs, docs & URLs.",
    icon: MessageSquare,
    status: "AI Responding",
    title: "Customer Query Resolved",
    subtitle: "Resolved via Store_Refund_Policy.pdf",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "WhatsApp Ordering & Booking",
    tag: "Let users view menus, select services, and place orders directly in chat.",
    icon: ShoppingBag,
    status: "Order Received",
    title: "New Digital Order",
    subtitle: "1x Artisanal Pizza ($14.99) · Paid via chat.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Billing & Stripe Sync",
    tag: "Automatically generate, send, and track PDF invoices upon payment/sale.",
    icon: FileText,
    status: "Invoice Sent",
    title: "Stripe Payment Sync",
    subtitle: "Paid $189.00 — Invoice #1042 dispatched.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
  }
];

import { WorkflowTemplates } from "./WorkflowTemplates";

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
              <a
                href="/login"
                className="group relative h-[400px] rounded-2xl overflow-hidden border border-zinc-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-end p-6 hover:shadow-lg hover:border-[#0A6BFF]/30 transition-all duration-300 active:scale-[0.99] select-none cursor-pointer"
              >
                {/* Background Image with Zoom on Hover */}
                <img
                  src={template.image}
                  alt={template.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:via-black/60 transition-colors duration-300" />

                {/* Card Content Overlay */}
                <div className="relative z-10 flex flex-col justify-between h-full w-full text-white">
                  
                  {/* Top Metric Badge */}
                  <div className="flex justify-between items-start">
                    <span className="bg-white/15 backdrop-blur-[3px] border border-white/20 text-white text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5">
                      <template.icon className="w-3 h-3" />
                      {template.status}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-7 h-7 rounded-full bg-white/20 backdrop-blur-[2px] flex items-center justify-center border border-white/20">
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </span>
                  </div>

                  {/* Text Details at the Bottom */}
                  <div className="mt-auto flex flex-col gap-3">
                    <div>
                      <h3 className="text-[21px] sm:text-[23px] font-bold text-white tracking-wide mb-2 leading-tight">
                        {template.name}
                      </h3>
                      <p className="text-[13px] text-zinc-200 leading-relaxed font-medium">
                        {template.tag}
                      </p>
                    </div>
                    
                    {/* Use Template Button */}
                    <div className="mt-2 flex items-center gap-2 group/btn">
                      <div className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 transition-all">
                        <span className="text-[13px] font-bold text-white">Use template</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-16">
            <WorkflowTemplates />
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
