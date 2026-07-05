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
                    <div className="flex flex-col h-full">
                      <div className="text-center mb-8 flex flex-col items-center">
                        <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4 border border-zinc-200 shadow-sm">
                          <Sparkles className="w-6 h-6" style={{ color: accent }} />
                        </div>
                        <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
                          Your AI Operations Layer is Ready
                        </h2>
                        <p className="text-[15px] text-zinc-500">
                          {pendingWorkflow 
                            ? "Based on your prompt, we are installing the following workflow:"
                            : "Based on your industry, we will install the following workflows automatically:"}
                        </p>
                      </div>

                      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 mb-8">
                        <ul className="space-y-4">
                          {pendingWorkflow ? (
                            <>
                              <li className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-[15px] font-medium text-zinc-800">
                                  Trigger: {pendingWorkflow.trigger?.label || "New Message"}
                                </span>
                              </li>
                              {pendingWorkflow.steps?.map((step: any, idx: number) => (
                                <li key={idx} className="flex items-center gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                  <span className="text-[15px] font-medium text-zinc-800">
                                    {step.label || step.pluginId}
                                  </span>
                                </li>
                              ))}
                            </>
                          ) : (
                            recommendedWorkflows().map((workflow, idx) => (
                              <li key={idx} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                <span className="text-[15px] font-medium text-zinc-800">{workflow}</span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>

                      <div className="mt-auto">
                        <p className="text-center text-[13px] text-zinc-500">
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
