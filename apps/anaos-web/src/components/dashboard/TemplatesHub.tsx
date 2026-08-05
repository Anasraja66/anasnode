"use client";

import { useState } from "react";
import { Download, LayoutTemplate, ArrowRight, Zap, Copy, CheckCircle2, ChevronRight, Tags, Bot, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { InnerPageHeader } from "@/components/ui/InnerPageHeader";
import { useDashboard } from "@/lib/context/DashboardContext";

const BASE_TEMPLATES = [
  {
    id: "chatgpt-voice-agent",
    name: "ChatGPT Voice AI Agent",
    category: "Voice & AI",
    description: "Deploy a human-like voice agent powered by ChatGPT and ElevenLabs to answer calls 24/7.",
    icon: Mic,
    color: "text-purple-600",
    bg: "bg-purple-100",
    nodes: ["Inbound Call", "ChatGPT Node", "ElevenLabs TTS", "CRM Update"]
  },
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
    color: "text-blue-500",
    bg: "bg-blue-50",
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
  }
];

export function TemplatesHub() {
  const [cloning, setCloning] = useState<string | null>(null);
  const router = useRouter();
  const { preset } = useDashboard();

  // Dynamically add an industry-specific template based on the active preset
  const industryTemplate = {
    id: `industry-${preset.id}-qualifier`,
    name: `${preset.label} AI Qualifier`,
    category: preset.label,
    description: preset.welcomeBody,
    icon: preset.icon || LayoutTemplate,
    color: "text-white",
    bg: "bg-[#0A6BFF]", // Premium AnaOS blue
    nodes: ["WhatsApp Inbound", "ChatGPT Node", "Update CRM"]
  };

  const templates = [industryTemplate, ...BASE_TEMPLATES];

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
        subtitle="1-Click install pre-built workflows integrated with ChatGPT Cloud."
        icon={LayoutTemplate}
        backHref="/dashboard"
        backLabel="Back to dashboard"
      />

      <div className="p-8 max-w-7xl mx-auto font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl, idx) => (
          <div key={tpl.id} className={`bg-white border ${idx === 0 ? 'border-blue-200 shadow-md ring-1 ring-blue-100' : 'border-gray-200 shadow-sm'} rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full relative`}>
            
            {idx === 0 && (
              <div className="absolute top-0 right-0 bg-[#0A6BFF] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Recommended for you
              </div>
            )}
            
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4 mt-2">
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
                className={`w-full py-2.5 bg-white border ${idx === 0 ? 'border-[#0A6BFF] text-[#0A6BFF]' : 'border-gray-200 text-gray-900'} font-bold rounded-lg hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50`}
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

export default TemplatesHub;
