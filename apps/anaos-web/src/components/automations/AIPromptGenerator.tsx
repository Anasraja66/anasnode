"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, X, CheckCircle, 
  Bot, Settings, Zap, ArrowDown, Activity, Play, Edit3 
} from "lucide-react";

type NodeSummary = {
  id: string;
  type: string;
  name: string;
};

const NODE_TYPE_MAP: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  trigger_whatsapp: { label: "WhatsApp Message Received", icon: MessageCircleIcon, color: "text-green-500 bg-green-50" },
  trigger_lead_created: { label: "New CRM Lead", icon: UsersIcon, color: "text-blue-500 bg-blue-50" },
  trigger_stage_changed: { label: "Lead Stage Changed", icon: Activity, color: "text-amber-500 bg-amber-50" },
  send_whatsapp: { label: "Send WhatsApp", icon: MessageCircleIcon, color: "text-green-600 bg-green-50" },
  send_email: { label: "Send Email", icon: MailIcon, color: "text-purple-500 bg-purple-50" },
  ai_respond: { label: "AI Response", icon: Bot, color: "text-indigo-500 bg-indigo-50" },
  ai_classify: { label: "AI Classification", icon: Sparkles, color: "text-pink-500 bg-pink-50" },
  condition: { label: "Condition Check", icon: Settings, color: "text-zinc-600 bg-zinc-100" },
  wait: { label: "Wait / Delay", icon: ClockIcon, color: "text-orange-500 bg-orange-50" },
  crm_update_lead_stage: { label: "Update CRM Stage", icon: Activity, color: "text-blue-600 bg-blue-50" },
  crm_assign_agent: { label: "Assign to Agent", icon: UsersIcon, color: "text-cyan-600 bg-cyan-50" },
};

function MailIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
function MessageCircleIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>;
}
function UsersIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function ClockIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

export function AIPromptGenerator() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>(null);
  const [parsedNodes, setParsedNodes] = useState<NodeSummary[]>([]);
  const [savingAction, setSavingAction] = useState<"deploy" | "edit" | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsModalOpen(true);
    setLoading(true);
    setError("");
    setGeneratedWorkflow(null);
    setParsedNodes([]);

    try {
      const res = await fetch("/api/workflows/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate automation");
      }

      setGeneratedWorkflow(data.workflow);
      
      // Try to parse nodes for summary visualization
      const nodes = Array.isArray(data.workflow?.nodes) ? data.workflow.nodes : [];
      // Sort nodes simply by x position for a rough sequential representation
      const sortedNodes = [...nodes].sort((a, b) => {
        const ax = a.position?.x || 0;
        const bx = b.position?.x || 0;
        return ax - bx;
      });
      
      setParsedNodes(sortedNodes.map(n => ({
        id: n.id,
        type: n.type,
        name: n.name || n.type
      })));
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndRedirect = async (action: "deploy" | "edit") => {
    if (!generatedWorkflow) return;
    setSavingAction(action);
    
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "AI Generated Automation",
          description: prompt,
          definition: JSON.stringify(generatedWorkflow),
          isActive: action === "deploy", // If deploy, make it active
        }),
      });
      const data = await res.json();
      
      if (data.workflow?.id) {
        setIsModalOpen(false);
        if (action === "edit") {
          router.push(`/dashboard/automations/builder/${data.workflow.id}`);
        } else {
          router.push(`/dashboard/automations`);
          router.refresh(); // Refresh the list
        }
      }
    } catch (err) {
      alert("Failed to save workflow");
    } finally {
      setSavingAction(null);
    }
  };

  return (
    <>
      {/* ── Main Input Box ── */}
      <div className="relative group max-w-4xl mx-auto mb-16">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-2 pr-3 border border-zinc-100">
          <div className="pl-4 pr-3 text-indigo-500">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if(e.key === "Enter") handleGenerate() }}
            placeholder="Describe what you want to automate... e.g. 'When a lead comes from Facebook, assign an agent and send a WhatsApp greeting'"
            className="w-full bg-transparent border-none text-zinc-900 placeholder:text-zinc-400 text-lg py-4 focus:outline-none focus:ring-0"
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="flex-shrink-0 bg-zinc-900 hover:bg-black disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            Generate
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-sm font-medium text-zinc-500 mt-4">
          Powered by AnaOS Intelligence. Just describe your workflow in plain English.
        </p>
      </div>

      {/* ── AI Build Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
              onClick={() => { if(!loading && !savingAction) setIsModalOpen(false) }}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 leading-tight">AI Automation Builder</h2>
                    <p className="text-sm text-zinc-500 font-medium">Translating your thoughts into workflows</p>
                  </div>
                </div>
                {!loading && !savingAction && (
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-600">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto flex-1">
                {loading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="relative w-24 h-24 mb-8">
                      <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Analyzing your prompt...</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto">
                      Connecting logic nodes and mapping variables to build a production-ready automation.
                    </p>
                  </div>
                ) : error ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">Failed to build</h3>
                    <p className="text-red-600 font-medium">{error}</p>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="mt-6 px-6 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl font-semibold transition"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3 mb-8">
                      <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-green-800">Successfully built!</h4>
                        <p className="text-green-600 text-sm font-medium">Here is a visual summary of what the AI constructed for you.</p>
                      </div>
                    </div>

                    {/* Nodes Summary UI */}
                    <div className="relative max-w-md mx-auto">
                      {parsedNodes.map((node, i) => {
                        const meta = NODE_TYPE_MAP[node.type] || { label: node.name || node.type, icon: Settings, color: "text-zinc-600 bg-zinc-100" };
                        const Icon = meta.icon;
                        
                        return (
                          <div key={node.id} className="relative z-10">
                            {/* The Node Card */}
                            <div className="bg-white border border-zinc-200 shadow-sm rounded-xl p-4 flex items-center gap-4 hover:border-blue-300 hover:shadow-md transition-all">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${meta.color}`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                                  {i === 0 ? "Trigger" : "Action"}
                                </div>
                                <div className="font-bold text-zinc-900 truncate">
                                  {meta.label}
                                </div>
                              </div>
                            </div>
                            
                            {/* Connecting Line */}
                            {i < parsedNodes.length - 1 && (
                              <div className="flex justify-center py-2 relative">
                                <div className="w-0.5 h-6 bg-zinc-200" />
                                <div className="absolute top-1/2 -translate-y-1/2 bg-white text-zinc-400">
                                  <ArrowDown className="w-4 h-4" />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              {!loading && !error && generatedWorkflow && (
                <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex gap-4">
                  <button
                    onClick={() => handleSaveAndRedirect("edit")}
                    disabled={savingAction !== null}
                    className="flex-1 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {savingAction === "edit" ? "Saving..." : (
                      <>
                        <Edit3 className="w-4 h-4" />
                        Edit in Builder
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSaveAndRedirect("deploy")}
                    disabled={savingAction !== null}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {savingAction === "deploy" ? "Deploying..." : (
                      <>
                        <Play className="w-5 h-5 fill-current" />
                        Deploy Agent Now
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
