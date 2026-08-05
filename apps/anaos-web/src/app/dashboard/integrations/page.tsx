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
      { id: "claude", name: "Claude (Anthropic)", desc: "Highly capable AI models with massive context windows.", status: "disconnected", href: "/dashboard/setup" },
      { id: "gemini", name: "Google Gemini", desc: "Multimodal AI models natively integrated by Google.", status: "disconnected", href: "/dashboard/setup" },
    ]
  },
  {
    id: "messaging",
    title: "Messaging, Social & Marketing Ads",
    description: "Connect the platforms where your customers and team already are.",
    integrations: [
      { id: "whatsapp", name: "WhatsApp Business", desc: "Automate chats and campaigns for your WhatsApp number.", status: "connected", href: "/dashboard/integrations/connect/whatsapp" },
      { id: "instagram", name: "Instagram DM", desc: "Auto-reply to stories, mentions, and direct messages.", status: "disconnected", href: "/dashboard/integrations/connect/instagram" },
      { id: "facebook", name: "Facebook Messenger", desc: "Engage with your Facebook page audience 24/7.", status: "disconnected", href: "/dashboard/integrations/connect/facebook" },
      { id: "facebookleads", name: "Facebook Lead Ads", desc: "Instantly capture and route new leads from Meta ads.", status: "disconnected", href: "/dashboard/integrations/connect/facebookleads" },
      { id: "tiktokleads", name: "TikTok Lead Generation", desc: "Sync TikTok ad leads directly into your CRM and workflows.", status: "disconnected", href: "/dashboard/integrations/connect/tiktokleads" },
      { id: "linkedinads", name: "LinkedIn Ads", desc: "Automate B2B lead capture from LinkedIn campaigns.", status: "disconnected", href: "/dashboard/integrations/connect/linkedinads" },
      { id: "googleads", name: "Google Ads & Analytics", desc: "Track ad spend and conversion events automatically.", status: "disconnected", href: "/dashboard/integrations/connect/googleads" },
      { id: "email", name: "Twilio / SMS", desc: "Send and receive standard SMS text messages.", status: "disconnected", href: "/dashboard/integrations/connect/twilio" },
      { id: "slack", name: "Slack", desc: "Send team alerts and automate Slack channel messages.", status: "disconnected", href: "/dashboard/integrations/connect/slack" },
      { id: "telegram", name: "Telegram Bot", desc: "Automate Telegram groups and direct messages.", status: "disconnected", href: "/dashboard/integrations/connect/telegram" },
      { id: "discord", name: "Discord", desc: "Manage Discord servers and send channel messages.", status: "disconnected", href: "/dashboard/integrations/connect/discord" },
      { id: "mailchimp", name: "Mailchimp", desc: "Sync email subscribers and trigger campaigns.", status: "disconnected", href: "/dashboard/integrations/connect/mailchimp" },
    ]
  },
  {
    id: "tools",
    title: "CRM, E-commerce, Cloud & Utilities",
    description: "Sync your data and trigger workflows from your entire software stack.",
    integrations: [
      { id: "shopify", name: "Shopify", desc: "Trigger abandoned cart flows and order status updates.", status: "disconnected", href: "/dashboard/integrations/connect/shopify" },
      { id: "woocommerce", name: "WooCommerce", desc: "Automate e-commerce orders and customer updates.", status: "disconnected", href: "/dashboard/integrations/connect/woocommerce" },
      { id: "magento", name: "Magento", desc: "Enterprise e-commerce syncing and automation.", status: "disconnected", href: "/dashboard/integrations/connect/magento" },
      { id: "bigcommerce", name: "BigCommerce", desc: "Sync products, customers, and orders seamlessly.", status: "disconnected", href: "/dashboard/integrations/connect/bigcommerce" },
      { id: "salesforce", name: "Salesforce", desc: "Enterprise CRM automation and deep record syncing.", status: "disconnected", href: "/dashboard/integrations/connect/salesforce" },
      { id: "hubspot", name: "HubSpot CRM", desc: "Sync leads and update deal stages automatically.", status: "disconnected", href: "/dashboard/integrations/connect/hubspot" },
      { id: "zohocrm", name: "Zoho CRM", desc: "Manage contacts, accounts, and deals in Zoho.", status: "disconnected", href: "/dashboard/integrations/connect/zohocrm" },
      { id: "pipedrive", name: "Pipedrive CRM", desc: "Manage sales pipelines and automate lead entry.", status: "disconnected", href: "/dashboard/integrations/connect/pipedrive" },
      { id: "activecampaign", name: "ActiveCampaign", desc: "Automate marketing funnels and sales pipelines.", status: "disconnected", href: "/dashboard/integrations/connect/activecampaign" },
      { id: "googlecalendar", name: "Google Calendar", desc: "Allow AI agents to book and manage appointments.", status: "disconnected", href: "/dashboard/integrations/connect/google_calendar" },
      { id: "calendly", name: "Calendly", desc: "Trigger automations when a new meeting is booked.", status: "disconnected", href: "/dashboard/integrations/connect/calendly" },
      { id: "zoom", name: "Zoom", desc: "Create meetings and automate post-call workflows.", status: "disconnected", href: "/dashboard/integrations/connect/zoom" },
      { id: "stripe", name: "Stripe", desc: "Recover failed payments and automate billing support.", status: "disconnected", href: "/dashboard/integrations/connect/stripe" },
      { id: "paypal", name: "PayPal", desc: "Trigger actions on successful payments or refunds.", status: "disconnected", href: "/dashboard/integrations/connect/paypal" },
      { id: "razorpay", name: "Razorpay", desc: "Automate payment captures and subscription flows.", status: "disconnected", href: "/dashboard/integrations/connect/razorpay" },
      { id: "quickbooks", name: "QuickBooks Online", desc: "Create invoices and automate accounting tasks.", status: "disconnected", href: "/dashboard/integrations/connect/quickbooks" },
      { id: "xero", name: "Xero", desc: "Sync financial data and automate bookkeeping.", status: "disconnected", href: "/dashboard/integrations/connect/xero" },
      { id: "googlesheets", name: "Google Sheets", desc: "Read and write data directly to your spreadsheets.", status: "disconnected", href: "/dashboard/integrations/connect/google_sheets" },
      { id: "googledrive", name: "Google Drive", desc: "Automate file uploads, generation, and sharing.", status: "disconnected", href: "/dashboard/integrations/connect/googledrive" },
      { id: "googledocs", name: "Google Docs", desc: "Generate documents dynamically from templates.", status: "disconnected", href: "/dashboard/integrations/connect/googledocs" },
      { id: "onedrive", name: "Microsoft OneDrive", desc: "Sync and manage files in the Microsoft ecosystem.", status: "disconnected", href: "/dashboard/integrations/connect/onedrive" },
      { id: "docusign", name: "DocuSign", desc: "Automate contract creation and e-signature collection.", status: "disconnected", href: "/dashboard/integrations/connect/docusign" },
      { id: "airtable", name: "Airtable", desc: "Sync database records and automate workflows.", status: "disconnected", href: "/dashboard/integrations/connect/airtable" },
      { id: "notion", name: "Notion", desc: "Create pages and update databases automatically.", status: "disconnected", href: "/dashboard/integrations/connect/notion" },
      { id: "asana", name: "Asana", desc: "Create tasks and manage project workflows.", status: "disconnected", href: "/dashboard/integrations/connect/asana" },
      { id: "trello", name: "Trello", desc: "Automate boards, lists, and card creation.", status: "disconnected", href: "/dashboard/integrations/connect/trello" },
      { id: "monday", name: "Monday.com", desc: "Sync tasks and track project management workflows.", status: "disconnected", href: "/dashboard/integrations/connect/monday" },
      { id: "clickup", name: "ClickUp", desc: "Automate tasks, docs, and team productivity.", status: "disconnected", href: "/dashboard/integrations/connect/clickup" },
      { id: "jira", name: "Jira Software", desc: "Create issues and track development progress.", status: "disconnected", href: "/dashboard/integrations/connect/jira" },
      { id: "dropbox", name: "Dropbox", desc: "Manage files and trigger document workflows.", status: "disconnected", href: "/dashboard/integrations/connect/dropbox" },
      { id: "zendesk", name: "Zendesk", desc: "Automate customer support tickets and replies.", status: "disconnected", href: "/dashboard/integrations/connect/zendesk" },
      { id: "intercom", name: "Intercom", desc: "Sync conversations and manage customer leads.", status: "disconnected", href: "/dashboard/integrations/connect/intercom" },
      { id: "freshdesk", name: "Freshdesk", desc: "Manage support tickets and trigger agent alerts.", status: "disconnected", href: "/dashboard/integrations/connect/freshdesk" },
      { id: "typeform", name: "Typeform", desc: "Trigger workflows instantly when a form is submitted.", status: "disconnected", href: "/dashboard/integrations/connect/typeform" },
      { id: "googleforms", name: "Google Forms", desc: "Capture form responses and route data automatically.", status: "disconnected", href: "/dashboard/integrations/connect/googleforms" },
      { id: "wordpress", name: "WordPress", desc: "Publish posts and manage CMS data automatically.", status: "disconnected", href: "/dashboard/integrations/connect/wordpress" },
      { id: "webflow", name: "Webflow", desc: "Manage CMS items and automate site updates.", status: "disconnected", href: "/dashboard/integrations/connect/webflow" },
      { id: "mysql", name: "MySQL", desc: "Read, write, and sync data directly with your SQL database.", status: "disconnected", href: "/dashboard/integrations/connect/mysql" },
      { id: "postgres", name: "PostgreSQL", desc: "Execute queries and automate database operations.", status: "disconnected", href: "/dashboard/integrations/connect/postgres" },
      { id: "aws", name: "AWS", desc: "Trigger Lambda functions and manage cloud resources.", status: "disconnected", href: "/dashboard/integrations/connect/aws" },
      { id: "ftp", name: "FTP / SFTP", desc: "Automate file transfers securely to remote servers.", status: "disconnected", href: "/dashboard/integrations/connect/ftp" },
      { id: "webhooks", name: "Custom Webhooks", desc: "Catch payloads from any external app (like Zapier/Make).", status: "disconnected", href: "/dashboard/integrations/connect/webhooks" },
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
