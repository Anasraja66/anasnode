"use client";

import React, { useState } from "react";
import { useDashboard } from "@/lib/context/DashboardContext";
import { InnerPageHeader } from "@/components/ui/InnerPageHeader";
import { Layers, ChevronRight, CheckCircle2, ArrowRight } from "lucide-react";
import BrandIcon from "@/components/ui/BrandIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  {
    id: "ai-voice",
    title: "High-Level AI & Voice Engines",
    description: "Power your automations with industry-leading AI models and voice synthesis.",
    integrations: [
      { id: "chatgpt", name: "ChatGPT (OpenAI)", desc: "Advanced language models for reasoning and text generation.", status: "connected", href: "/dashboard/setup" },
      { id: "elevenlabs", name: "ElevenLabs", desc: "Ultra-realistic text-to-speech engine for inbound/outbound calls.", status: "connected", href: "/dashboard/voice_agent" },
      { id: "vapi", name: "Vapi.ai", desc: "End-to-end voice AI platform for conversational agents.", status: "disconnected", href: "/dashboard/voice_agent" },
      { id: "retell", name: "Retell AI", desc: "Conversational voice APIs for building human-like agents.", status: "disconnected", href: "/dashboard/voice_agent" },
      { id: "bland", name: "Bland AI", desc: "Programmable phone calling via high-speed AI voice.", status: "disconnected", href: "/dashboard/voice_agent" },
    ]
  },
  {
    id: "messaging",
    title: "Messaging & Social Channels",
    description: "Connect the platforms where your customers and team already are.",
    integrations: [
      { id: "whatsapp", name: "WhatsApp Business", desc: "Automate chats and campaigns for your WhatsApp number.", status: "connected", href: "/dashboard/integrations/connect/whatsapp" },
      { id: "instagram", name: "Instagram DM", desc: "Auto-reply to stories, mentions, and direct messages.", status: "disconnected", href: "/dashboard/integrations/connect/instagram" },
      { id: "facebook", name: "Facebook Messenger", desc: "Engage with your Facebook page audience 24/7.", status: "disconnected", href: "/dashboard/integrations/connect/facebook" },
      { id: "email", name: "Twilio / SMS", desc: "Send and receive standard SMS text messages.", status: "disconnected", href: "/dashboard/integrations/connect/twilio" },
      { id: "slack", name: "Slack", desc: "Send team alerts and automate Slack channel messages.", status: "disconnected", href: "/dashboard/integrations/connect/slack" },
      { id: "telegram", name: "Telegram Bot", desc: "Automate Telegram groups and direct messages.", status: "disconnected", href: "/dashboard/integrations/connect/telegram" },
      { id: "discord", name: "Discord", desc: "Manage Discord servers and send channel messages.", status: "disconnected", href: "/dashboard/integrations/connect/discord" },
      { id: "mailchimp", name: "Mailchimp", desc: "Sync email subscribers and trigger campaigns.", status: "disconnected", href: "/dashboard/integrations/connect/mailchimp" },
    ]
  },
  {
    id: "tools",
    title: "CRM, E-commerce & Productivity Tools",
    description: "Sync your data and trigger workflows from your existing stack.",
    integrations: [
      { id: "shopify", name: "Shopify", desc: "Trigger abandoned cart flows and order status updates.", status: "disconnected", href: "/dashboard/integrations/connect/shopify" },
      { id: "woocommerce", name: "WooCommerce", desc: "Automate e-commerce orders and customer updates.", status: "disconnected", href: "/dashboard/integrations/connect/woocommerce" },
      { id: "hubspot", name: "HubSpot CRM", desc: "Sync leads and update deal stages automatically.", status: "disconnected", href: "/dashboard/integrations/connect/hubspot" },
      { id: "pipedrive", name: "Pipedrive CRM", desc: "Manage sales pipelines and automate lead entry.", status: "disconnected", href: "/dashboard/integrations/connect/pipedrive" },
      { id: "googlecalendar", name: "Google Calendar", desc: "Allow AI agents to book and manage appointments.", status: "disconnected", href: "/dashboard/integrations/connect/google_calendar" },
      { id: "calendly", name: "Calendly", desc: "Trigger automations when a new meeting is booked.", status: "disconnected", href: "/dashboard/integrations/connect/calendly" },
      { id: "zoom", name: "Zoom", desc: "Create meetings and automate post-call workflows.", status: "disconnected", href: "/dashboard/integrations/connect/zoom" },
      { id: "stripe", name: "Stripe", desc: "Recover failed payments and automate billing support.", status: "disconnected", href: "/dashboard/integrations/connect/stripe" },
      { id: "googlesheets", name: "Google Sheets", desc: "Read and write data directly to your spreadsheets.", status: "disconnected", href: "/dashboard/integrations/connect/google_sheets" },
      { id: "airtable", name: "Airtable", desc: "Sync database records and automate workflows.", status: "disconnected", href: "/dashboard/integrations/connect/airtable" },
      { id: "notion", name: "Notion", desc: "Create pages and update databases automatically.", status: "disconnected", href: "/dashboard/integrations/connect/notion" },
      { id: "asana", name: "Asana", desc: "Create tasks and manage project workflows.", status: "disconnected", href: "/dashboard/integrations/connect/asana" },
      { id: "trello", name: "Trello", desc: "Automate boards, lists, and card creation.", status: "disconnected", href: "/dashboard/integrations/connect/trello" },
      { id: "dropbox", name: "Dropbox", desc: "Manage files and trigger document workflows.", status: "disconnected", href: "/dashboard/integrations/connect/dropbox" },
    ]
  }
];

export default function IntegrationsRoute() {
  const { ws } = useDashboard();
  const router = useRouter();
  
  // Basic loading state just to ensure hydration is clean
  if (!ws) return <div className="min-h-screen bg-[#F7F8FA] animate-pulse"></div>;

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      <InnerPageHeader
        title="Integrations & Engines"
        subtitle="Connect your favorite apps and powerful AI voice engines to your AnaOS workspace."
        icon={Layers}
        backHref="/dashboard"
        backLabel="Back to dashboard"
      />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12 font-sans">
        
        {CATEGORIES.map((category) => (
          <div key={category.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">{category.title}</h2>
              <p className="text-[13px] text-zinc-500 font-medium mt-1">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {category.integrations.map((integration) => (
                <div 
                  key={integration.id} 
                  onClick={() => router.push(integration.href)}
                  className="bg-white border border-zinc-200/80 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <BrandIcon id={integration.id} className="w-6 h-6 text-zinc-700 group-hover:text-blue-600 transition-colors" />
                    </div>
                    
                    {integration.status === "connected" ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-100/50">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Connected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        Not Connected
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-zinc-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                      {integration.name}
                    </h3>
                    <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">
                      {integration.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {integration.status === "connected" ? "Manage settings" : "Connect integration"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-600 transition-colors transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
