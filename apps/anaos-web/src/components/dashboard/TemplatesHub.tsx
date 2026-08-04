"use client";

import { useState } from "react";
import { Download, LayoutTemplate, ArrowRight, Zap, Copy, CheckCircle2, ChevronRight, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import { InnerPageHeader } from "@/components/ui/InnerPageHeader";

const TEMPLATES = [
  {
    id: "abandoned-cart",
    name: "Abandoned Cart Recovery",
    category: "Ecommerce",
    description: "Automatically send a WhatsApp message with a discount code 30 minutes after cart abandonment.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50",
    nodes: ["Shopify Trigger", "Delay (30m)", "WhatsApp Button Message"]
  },
  {
    id: "real-estate-qualifier",
    name: "Real Estate AI Qualifier",
    category: "Real Estate",
    description: "An AI agent that chats with incoming leads, asks budget/location, and tags them in CRM.",
    icon: LayoutTemplate,
    color: "text-blue-500",
    bg: "bg-blue-50",
    nodes: ["WhatsApp Inbound", "AI Agent Node", "HubSpot CRM Update"]
  },
  {
    id: "appointment-reminder",
    name: "Appointment Reminders",
    category: "Scheduling",
    description: "Send automatic reminders 24 hours and 1 hour before an appointment via SMS and WhatsApp.",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    nodes: ["Google Calendar", "Condition", "Twilio SMS", "WhatsApp"]
  },
  {
    id: "support-auto-ticket",
    name: "Customer Support Auto-Ticket",
    category: "Support",
    description: "If a user sends an email to support, create a Slack notification and auto-reply with a ticket number.",
    icon: Copy,
    color: "text-purple-500",
    bg: "bg-purple-50",
    nodes: ["Email Trigger", "Slack Notification", "Email Reply"]
  },
  {
    id: "lead-magnet",
    name: "Lead Magnet Delivery",
    category: "Marketing",
    description: "When a user fills out a web form, instantly email them a PDF and add them to a nurture sequence.",
    icon: Download,
    color: "text-rose-500",
    bg: "bg-rose-50",
    nodes: ["Webhook Trigger", "Email Send", "Wait (1 Day)"]
  },
  {
    id: "payment-failed",
    name: "Failed Payment Recovery",
    category: "Finance",
    description: "Triggered by Stripe. Sends a courteous SMS to the customer with a link to update their card.",
    icon: Tags,
    color: "text-sky-500",
    bg: "bg-sky-50",
    nodes: ["Stripe Trigger", "Condition", "Twilio SMS"]
  }
];

export function TemplatesHub() {
  const [cloning, setCloning] = useState<string | null>(null);

  const router = useRouter();

  const handleClone = async (id: string) => {
    setCloning(id);
    setTimeout(() => {
      setCloning(null);
      // Route to builder with the template ID so it can be loaded
      router.push(`/dashboard/workflows/new?template=${id}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <InnerPageHeader
        title="Template Library"
        subtitle="1-Click install pre-built workflows designed for your industry."
        icon={LayoutTemplate}
        backHref="/dashboard"
        backLabel="Back to dashboard"
      />

      <div className="p-8 max-w-7xl mx-auto font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map(tpl => (
          <div key={tpl.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tpl.bg}`}>
                  <tpl.icon className={tpl.color} size={24} />
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold tracking-wide">
                  {tpl.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{tpl.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{tpl.description}</p>
              
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Workflow Steps</div>
                {tpl.nodes.map((node, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <ChevronRight size={14} className="text-gray-300" />
                    {node}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 p-4 bg-gray-50/50 mt-auto">
              <button 
                onClick={() => handleClone(tpl.id)}
                disabled={cloning === tpl.id}
                className="w-full py-2.5 bg-white border border-gray-200 text-gray-900 font-bold rounded-lg hover:border-purple-300 hover:text-purple-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {cloning === tpl.id ? (
                  <span className="animate-pulse">Installing...</span>
                ) : (
                  <>
                    <Download size={16} /> Install Template
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
