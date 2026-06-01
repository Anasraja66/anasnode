"use client";

import { motion } from "framer-motion";
import { MessageCircle, CalendarCheck, Megaphone, ArrowRight, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
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

const getAutomationDetails = (type: string) => {
  switch (type) {
    case "whatsapp_flow":
      return { icon: MessageCircle, desc: "Interactive automated conversations on WhatsApp." };
    case "calendar":
      return { icon: CalendarCheck, desc: "Schedule bookings, viewings, or appointments." };
    default:
      return { icon: Megaphone, desc: "Broadcast campaigns and follow-up templates." };
  }
};

export function ResultCard({ workspace }: Props) {
  const [states, setStates] = useState<boolean[]>([]);
  const [mounted, setMounted] = useState(false);

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

  const handleOpenDashboard = () => {
    const saved = localStorage.getItem("anaos_custom_workspaces");
    let workspacesList = saved ? JSON.parse(saved) : [];

    const updatedWorkspace = {
      ...workspace,
      automations: workspace.automations.map((a, i) => ({
        ...a,
        enabled: states[i] ?? a.enabled,
      })),
    };

    workspacesList = [updatedWorkspace, ...workspacesList.filter((w: any) => w.id !== workspace.id)];
    localStorage.setItem("anaos_custom_workspaces", JSON.stringify(workspacesList));

    window.location.href = `/dashboard?ws=${updatedWorkspace.id}`;
  };

  if (!mounted || !workspace) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-2xl mx-auto mt-6 rounded-xl border border-border bg-card overflow-hidden text-left shadow-sm"
    >
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[11.5px] font-mono uppercase tracking-wider text-success font-semibold">Workspace ready</span>
        </div>
        <span className="text-[10.5px] font-mono text-muted-foreground">/{workspace.slug}</span>
      </div>

      <div className="px-5 pt-4 pb-2">
        <h3 className="text-[16px] font-semibold text-foreground tracking-tight">{workspace.name}</h3>
        <p className="text-[12.5px] text-muted-foreground mt-0.5">
          {workspace.industry} · {workspace.automations.length} custom automations configured
        </p>
      </div>

      <div className="px-3 pb-3 grid sm:grid-cols-2 gap-2">
        {workspace.automations.map((a, i) => {
          const details = getAutomationDetails(a.type);
          const Icon = details.icon;
          const isEnabled = states[i] ?? a.enabled;

          return (
            <div key={a.id} className="rounded-lg p-3 flex items-start gap-3 hover:bg-muted/45 transition-colors border border-transparent hover:border-border/30">
              <div className="w-7 h-7 rounded-md bg-muted text-foreground flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-medium text-foreground truncate">{a.name}</p>
                <p className="text-[11.5px] text-muted-foreground mt-0.5 leading-snug">{details.desc}</p>
              </div>
              <button
                onClick={() => toggleState(i)}
                className={`relative w-7.5 h-[16px] rounded-full transition-colors shrink-0 mt-1 cursor-pointer ${
                  isEnabled ? "bg-emerald-500" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 bg-card rounded-full transition-all ${
                    isEnabled ? "left-[14px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3.5 border-t border-border flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground font-mono">
          <Check className="w-3.5 h-3.5 text-success" /> Setup complete
        </div>
        <button
          onClick={handleOpenDashboard}
          className="h-8 px-3.5 rounded-lg bg-foreground text-background text-[12.5px] font-medium flex items-center gap-1 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <span>Open dashboard</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
