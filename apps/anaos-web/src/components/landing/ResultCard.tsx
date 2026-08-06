"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Zap, Sparkles, Loader2, GitBranch } from "lucide-react";
import { useState, useEffect } from "react";
import { getIndustryPreset, resolveIndustryId, type IndustryId } from "@/lib/industry/presets";

interface Props {
  prompt?: string;
  workspace: {
    id: string;
    name: string;
    industry: string;
    slug: string;
    status: string;
    version: number;
    automations: {
      id: string;
      name: string;
      type: string;
      enabled: boolean;
      runs: number;
      lastRun: string;
    }[];
    variables: {
      key: string;
      value: string;
      confidence: number;
      ttl: string;
    }[];
  };
}

const INDUSTRY_COPY: Partial<
  Record<IndustryId, { whatsapp_flow: string; calendar: string; campaign: string }>
> = {
  health: {
    whatsapp_flow: "Patient triage & appointment booking via WhatsApp AI.",
    calendar: "Autonomous appointment management & reminders.",
    campaign: "AI-driven follow-ups & wellness check-ins.",
  },
  "real-estate": {
    whatsapp_flow: "Lead qualification & property inquiries on autopilot.",
    calendar: "AI-coordinated viewing schedules & calendar sync.",
    campaign: "Automated nurture flows for potential buyers.",
  },
  restaurant: {
    whatsapp_flow: "Digital ordering & reservation management.",
    calendar: "Real-time table booking & confirmations.",
    campaign: "AI marketing to re-engage past customers.",
  },
  salon: {
    whatsapp_flow: "Styling consultations & booking assistant.",
    calendar: "Smart slot management & visit reminders.",
    campaign: "Personalized loyalty offers & re-booking AI.",
  },
  ecommerce: {
    whatsapp_flow: "Shopify support & product discovery bot.",
    calendar: "Shipping updates & scheduled delivery support.",
    campaign: "Abandoned cart recovery & smart promotions.",
  },
};

const getAutomationDetails = (type: string, industry: string) => {
  const id = resolveIndustryId(industry);
  const copy = INDUSTRY_COPY[id];
  switch (type) {
    case "whatsapp_flow":
      return {
        label: "AI WhatsApp Agent",
        desc: copy?.whatsapp_flow || "Intelligent customer interactions on WhatsApp.",
      };
    case "instagram_flow":
      return {
        label: "AI Instagram Bot",
        desc: "Automated DM assistant and engagement engine.",
      };
    case "facebook_flow":
      return {
        label: "AI Messenger Bot",
        desc: "24/7 autonomous Facebook Messenger support.",
      };
    case "calendar":
      return {
        label: "Autonomous Scheduler",
        desc: copy?.calendar || "Smart booking and scheduling on autopilot.",
      };
    default:
      return {
        label: "Workflow Automator",
        desc: copy?.campaign || "Automated multi-channel marketing campaigns.",
      };
  }
};

export function ResultCard({ workspace, prompt = "" }: Props) {
  const [states, setStates] = useState<boolean[]>([]);
  const [mounted, setMounted] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [buildingWorkflow, setBuildingWorkflow] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (workspace?.automations) {
      setStates(workspace.automations.map((a) => a.enabled));
    }
  }, [workspace]);

  const toggleState = (idx: number) => {
    setStates((s) => s.map((v, i) => (i === idx ? !v : v)));
  };

  // ── Open Visual Workflow Builder with AI-generated nodes ─────────────────
  const handleOpenWorkflow = async () => {
    setBuildingWorkflow(true);
    setDeployError(null);
    try {
      const res = await fetch("/api/generate/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt || `Automation for ${workspace.name}` }),
      });
      const data = await res.json();
      if (data.success && data.workflow) {
        // Save to localStorage so WorkflowCanvas can load it
        const entry = {
          id: workspace.id,
          name: data.workflowName || workspace.name,
          workflow: data.workflow,
          industry: data.industry,
          prompt,
          createdAt: Date.now(),
        };
        localStorage.setItem("anaos_pending_workflow", JSON.stringify(entry));
        window.location.href = `/dashboard/workflows/${workspace.id}`;
        return;
      }
      setDeployError("Could not generate workflow. Try again.");
    } catch {
      setDeployError("Network error. Please try again.");
    } finally {
      setBuildingWorkflow(false);
    }
  };

  // ── Open Dashboard (existing flow) ───────────────────────────────────────
  const handleOpenDashboard = async () => {
    setDeploying(true);
    setDeployError(null);
    const updatedWorkspace = {
      ...workspace,
      automations: workspace.automations.map((a, i) => ({
        ...a,
        enabled: states[i] ?? a.enabled,
      })),
    };
    const whatsappOn = updatedWorkspace.automations.some(
      (a) => a.type === "whatsapp_flow" && a.enabled
    );
    try {
      const res = await fetch("/api/v1/workflows/from-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || `Automation for ${workspace.name}`,
          workspace: updatedWorkspace,
          save: true,
          activate: whatsappOn,
        }),
      });
      const data = await res.json();
      if (data.saved && data.workspace?.id) {
        window.location.href = `/dashboard?ws=${data.workspace.id}`;
        return;
      }
      if (data.requiresAuth) {
        const saved = localStorage.getItem("anaos_custom_workspaces");
        let workspacesList = saved ? JSON.parse(saved) : [];
        workspacesList = [
          updatedWorkspace,
          ...workspacesList.filter((w: { id: string }) => w.id !== workspace.id),
        ];
        localStorage.setItem("anaos_custom_workspaces", JSON.stringify(workspacesList));
        window.location.href = `/signup?next=/dashboard`;
        return;
      }
      setDeployError(data.error || "Could not deploy automation.");
    } catch {
      setDeployError("Network error. Try again or sign in first.");
    } finally {
      setDeploying(false);
    }
  };

  if (!mounted || !workspace) {
    return null;
  }

  const industryPreset = getIndustryPreset(workspace.industry);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-3xl mx-auto mt-12 rounded-[2.5rem] border border-zinc-200/60 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden text-left relative"
    >
      {/* AI Glow Decorative Element */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-50/50 blur-[100px] -z-10 pointer-events-none rounded-full" />
      
      {/* Top Status Bar */}
      <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="absolute w-4 h-4 rounded-full bg-emerald-500/20 animate-ping" />
          </div>
          <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-emerald-600/80">Workspace Ready</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-zinc-200/60 rounded-full shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-[11px] font-bold text-zinc-500">v{workspace.version}.0 AI Model</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-10 pt-8 pb-4">
        <div className="flex items-baseline gap-3 mb-2">
          <h3 className="text-[24px] font-semibold text-zinc-900 tracking-[-0.03em]">{workspace.name}</h3>
          <span className="text-zinc-300 text-[20px] font-light">/</span>
          <span className="text-[14px] font-bold text-zinc-400 font-mono tracking-tight">{workspace.slug}</span>
        </div>
        <p className="text-[16px] text-zinc-500 font-medium leading-relaxed">
          {industryPreset.label} Engine • {workspace.automations.length} AI-Powered workflows generated.
        </p>
      </div>

      {/* Automation Grid */}
      <div className="px-8 pb-8 pt-4 grid sm:grid-cols-2 gap-4">
        {workspace.automations.map((a, i) => {
          const details = getAutomationDetails(a.type, workspace.industry);
          const isEnabled = states[i] ?? a.enabled;

          return (
            <motion.div 
              key={a.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className={`group rounded-[1.5rem] p-5 flex flex-col justify-between border transition-all duration-300 ${
                isEnabled 
                ? "bg-white border-zinc-200 shadow-[0_4px_15px_rgba(0,0,0,0.03)]" 
                : "bg-zinc-50/50 border-transparent opacity-60"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-widest">{details.label}</span>
                  <p className="text-[15px] font-bold text-zinc-800">{a.name}</p>
                </div>
                
                {/* Modern Toggle */}
                <button
                  onClick={() => toggleState(i)}
                  className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 cursor-pointer ${
                    isEnabled ? "bg-[#0A6BFF] shadow-inner" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                      isEnabled ? "left-[22px]" : "left-1"
                    }`}
                  />
                </button>
              </div>
              
              <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">
                {details.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-10 py-6 border-t border-zinc-100 bg-zinc-50/20">
        {deployError && (
          <p className="text-[11px] font-bold text-red-500 mb-3 text-right animate-bounce">{deployError}</p>
        )}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-[14px] font-bold text-zinc-500">Agent Setup Complete</span>
          </div>

          <div className="flex items-center gap-3">
            {/* ── Visual Workflow Builder Button (PRIMARY) ── */}
            <button
              onClick={handleOpenWorkflow}
              disabled={buildingWorkflow || deploying}
              className="group relative h-12 px-7 rounded-full bg-[#0A6BFF] text-white text-[14px] font-bold flex items-center gap-2 hover:bg-blue-600 transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {buildingWorkflow ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Building Workflow...</span>
                </>
              ) : (
                <>
                  <GitBranch className="w-4 h-4" />
                  <span>Open Visual Builder</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* ── Dashboard shortcut ── */}
            <button
              onClick={handleOpenDashboard}
              disabled={deploying || buildingWorkflow}
              className="h-12 px-6 rounded-full border border-zinc-200 bg-white text-zinc-700 text-[14px] font-bold flex items-center gap-2 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {deploying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
