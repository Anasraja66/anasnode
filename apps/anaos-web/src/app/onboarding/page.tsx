"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Loader2,
  BrainCircuit,
  MessageSquare,
  Phone,
} from "lucide-react";
import {
  INDUSTRY_OPTIONS,
  type IndustryId,
  getIndustryPreset,
} from "@/lib/industry/presets";
import { LANGUAGE_CATALOG } from "@/lib/i18n/languages";
import { AnaosLogo } from "@/components/ui/AnaosLogo";

export default function OnboardingPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Setting up your workspace...");

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industryId, setIndustryId] = useState<IndustryId | "">("");
  const [pendingWorkflow, setPendingWorkflow] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("anaos_pending_workflow");
      if (stored) {
        setPendingWorkflow(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (session?.user?.name && !fullName) {
      setFullName(session.user.name);
    }
  }, [session, fullName]);

  const selectedPreset = industryId ? getIndustryPreset(industryId) : null;
  const accent = selectedPreset?.primary ?? "#000000";

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!selectedPreset) return;
    setLoading(true);

    const stages = [
      `Provisioning ${selectedPreset.label} environment...`,
      "Configuring AI workflow templates...",
      "Setting up communication channels...",
      "Finalizing workspace setup...",
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length - 1) {
        currentStage++;
        setLoadingText(stages[currentStage]);
      }
    }, 900);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          industry: selectedPreset.label,
          industryId: selectedPreset.id,
          ownerRole: "owner",
          workspaceName: companyName || `${fullName}'s Business`,
          languageSettings: {
            mode: "auto" as const,
            enabled: LANGUAGE_CATALOG.map((l) => l.code),
          },
        }),
      });

      if (response.ok) {
        await updateSession();
        clearInterval(interval);
        setTimeout(() => {
          router.push("/dashboard?tab=overview");
          router.refresh();
        }, 800);
      } else {
        alert("Something went wrong. Please try again.");
        setLoading(false);
        clearInterval(interval);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit onboarding data.");
      setLoading(false);
      clearInterval(interval);
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const recommendedWorkflows = () => {
    switch (industryId) {
      case "real-estate": return ["Lead Qualification", "Property Viewing Follow-up", "Missed Call Text-Back"];
      case "restaurant": return ["Table Reservations", "Menu Orders", "Review Requests"];
      case "health": return ["Appointment Reminders", "Missed Call Text-Back", "Review Requests"];
      case "ecommerce": return ["Cart Recovery", "Order Updates", "Customer Support"];
      case "salon": return ["Booking Reminders", "Follow-up & Reviews", "Missed Call Text-Back"];
      default: return ["Missed Call Text-Back", "Lead Follow-Up Sequence", "Payment Reminders", "Review Requests"];
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative selection:bg-zinc-200">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

      <div className="absolute top-8 left-8 flex items-center gap-2.5 z-10">
        <AnaosLogo className="w-8 h-8" />
        <span className="font-semibold text-[17px] tracking-tight">Anaos</span>
      </div>

      <main className="w-full max-w-[640px] relative z-10">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors duration-500"
              style={{
                backgroundColor: i <= step ? accent : "#E4E4E7",
                opacity: i <= step ? 1 : 0.6
              }}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-10 flex flex-col items-center justify-center text-center min-h-[400px]"
              >
                <Loader2 className="w-10 h-10 animate-spin mb-6" style={{ color: accent }} />
                <h3 className="text-xl font-semibold text-zinc-900 mb-2 tracking-tight">
                  {loadingText}
                </h3>
                <p className="text-[14px] text-zinc-500">
                  Please wait while we initialize your {selectedPreset?.label ?? "workspace"}.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${step}`}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col h-full"
              >
                <div className="p-8 sm:p-10 flex-1">
                  {step === 1 && (
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
                        What type of business do you run?
                      </h2>
                      <p className="text-[15px] text-zinc-500 mb-8">
                        Your workspace and AI will be tailored for this industry.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {INDUSTRY_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          const selected = industryId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setIndustryId(opt.id)}
                              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                                selected 
                                  ? "bg-zinc-50 shadow-sm" 
                                  : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                              }`}
                              style={selected ? { borderColor: opt.primary, boxShadow: `0 0 0 1px ${opt.primary}` } : undefined}
                            >
                              <div className={`mt-0.5 ${selected ? "" : "text-zinc-400"}`} style={selected ? { color: opt.primary } : undefined}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className={`text-[15px] font-medium ${selected ? "text-zinc-900" : "text-zinc-700"}`}>
                                  {opt.label}
                                </p>
                                <p className="text-[13px] text-zinc-500 mt-0.5">{opt.tagline}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
                        Workspace Details
                      </h2>
                      <p className="text-[15px] text-zinc-500 mb-8">
                        {selectedPreset
                          ? `Setting up a ${selectedPreset.label} environment.`
                          : "Tell us a bit about yourself."}
                      </p>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-[13px] font-medium text-zinc-700 mb-2">
                            Your full name
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full h-11 bg-white border border-zinc-200 rounded-lg px-3 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-medium text-zinc-700 mb-2">
                            Business or company name
                          </label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder={
                              industryId === "real-estate"
                                ? "e.g. Marina Realty"
                                : industryId === "restaurant"
                                  ? "e.g. Olive & Oak"
                                  : "e.g. Acme Corp"
                            }
                            className="w-full h-11 bg-white border border-zinc-200 rounded-lg px-3 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-500 relative">
                      {/* AI Glowing Background */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#0A6BFF]/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />
                      
                      <div className="text-center mb-6 flex flex-col items-center relative z-10">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-[#0A6BFF] blur-xl opacity-30 animate-pulse rounded-full" />
                          <div className="w-14 h-14 bg-gradient-to-br from-zinc-900 to-black rounded-2xl flex items-center justify-center relative shadow-lg ring-1 ring-white/10">
                            <Sparkles className="w-6 h-6 text-[#0A6BFF] animate-pulse" />
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight mb-2">
                          AnaOS AI Analysis Complete
                        </h2>
                        <p className="text-[14px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                          We've analyzed your prompt and structured your operational layer. Here is your custom workspace blueprint.
                        </p>
                      </div>

                      {/* The Analysis Card - Dark Premium AI Feel */}
                      <div className="bg-[#09090b] border border-zinc-800/80 shadow-[0_0_40px_-10px_rgba(10,107,255,0.15)] rounded-2xl overflow-hidden mb-6 relative z-10">
                        {/* Terminal Header */}
                        <div className="bg-zinc-900/80 border-b border-zinc-800 px-5 py-3 flex justify-between items-center backdrop-blur-md">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                            </div>
                            <span className="text-[11px] font-mono text-zinc-400 ml-2">system_build.log</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.1)] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Ready to deploy
                          </span>
                        </div>
                        
                        <div className="p-5 space-y-6 relative overflow-hidden">
                          {/* Inner glowing grid */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
                          
                          <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div className="space-y-1.5 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Detected Intent</p>
                               <p className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
                                 <BrainCircuit className="w-4 h-4 text-[#0A6BFF]" /> {pendingWorkflow?.name || "Lead Gen & Booking"}
                               </p>
                            </div>
                            <div className="space-y-1.5 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Primary Channels</p>
                               <div className="flex flex-wrap gap-2">
                                 <span className="inline-flex items-center gap-1.5 bg-[#25D366]/10 text-[#25D366] px-2 py-1 rounded-md text-[11px] font-bold ring-1 ring-[#25D366]/30"><MessageSquare className="w-3.5 h-3.5" /> WhatsApp</span>
                                 <span className="inline-flex items-center gap-1.5 bg-zinc-800/50 text-zinc-300 px-2 py-1 rounded-md text-[11px] font-bold ring-1 ring-zinc-700"><Phone className="w-3.5 h-3.5" /> Voice</span>
                               </div>
                            </div>
                          </div>

                          <div className="pt-2 relative z-10">
                             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                               <span className="w-1.5 h-1.5 rounded-full bg-[#0A6BFF] animate-pulse shadow-[0_0_8px_#0A6BFF]"></span>
                               Provisioned Nodes
                             </p>
                             <div className="space-y-2.5">
                               {pendingWorkflow ? (
                                 pendingWorkflow.steps?.map((step: any, idx: number) => (
                                   <div key={idx} className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-xl hover:border-[#0A6BFF]/40 transition-colors group">
                                     <div className="w-8 h-8 rounded-lg bg-black/60 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-[#0A6BFF]/50 transition-colors">
                                       <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                     </div>
                                     <span className="text-[13px] font-medium text-zinc-300 group-hover:text-white transition-colors font-mono">{step.label || step.pluginId}</span>
                                   </div>
                                 ))
                               ) : (
                                 recommendedWorkflows().map((workflow, idx) => (
                                   <div key={idx} className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800/80 p-3 rounded-xl hover:border-[#0A6BFF]/40 transition-colors group">
                                     <div className="w-8 h-8 rounded-lg bg-black/60 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-[#0A6BFF]/50 transition-colors">
                                       <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                     </div>
                                     <span className="text-[13px] font-medium text-zinc-300 group-hover:text-white transition-colors font-mono">{workflow}</span>
                                   </div>
                                 ))
                               )}
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto relative z-10">
                        <p className="text-center text-[12px] text-zinc-400 font-medium">
                          You can always customize these workflows later in your dashboard.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-8 sm:px-10 py-5 bg-zinc-50/80 border-t border-zinc-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1}
                    className={`text-[14px] font-medium transition-colors ${
                      step === 1 ? "text-zinc-300 cursor-not-allowed" : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    style={{ backgroundColor: accent }}
                    disabled={
                      (step === 1 && !industryId) ||
                      (step === 2 && (!fullName.trim() || !companyName.trim()))
                    }
                    className="h-10 px-5 rounded-lg text-white font-medium disabled:opacity-50 flex items-center gap-2 text-[14px] transition-all hover:brightness-110 active:scale-95 shadow-sm"
                  >
                    <span>{step === 3 ? "Launch Workspace" : "Continue"}</span>
                    {step !== 3 && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #E4E4E7;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
}
