"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  User,
  Building2,
  Users,
  Check,
  ArrowRight,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Activity,
  Globe,
  MessageSquare as Facebook,
  Camera as Instagram,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { MetaEmbeddedSignup } from "@/components/integrations/MetaEmbeddedSignup";
import {
  INDUSTRY_OPTIONS,
  type IndustryId,
  getIndustryPreset,
} from "@/lib/industry/presets";
import {
  LANGUAGE_CATALOG,
  type LanguageCode,
} from "@/lib/i18n/languages";

export default function OnboardingPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Setting up your workspace...");

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industryId, setIndustryId] = useState<IndustryId | "">("");
  const [ownerRole, setOwnerRole] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [enabledLanguages, setEnabledLanguages] = useState<LanguageCode[]>(
    () => LANGUAGE_CATALOG.map((l) => l.code)
  );

  // --- Meta Auth State ---
  const [selectedChannels, setSelectedChannels] = useState<("whatsapp"|"instagram"|"facebook")[]>([]);
  const toggleChannel = (c: "whatsapp"|"instagram"|"facebook") => {
    setSelectedChannels((prev) => 
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  useEffect(() => {
    if (session?.user?.name && !fullName) {
      setFullName(session.user.name);
    }
  }, [session, fullName]);

  const selectedPreset = industryId ? getIndustryPreset(industryId) : null;
  const accent = selectedPreset?.primary ?? "#000000"; // Fallback to black for ultra-clean look if no industry

  const handleNext = () => {
    if (step < 7) {
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
      "Configuring communication channels...",
      "Initializing AI models...",
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
          ownerRole,
          workspaceName: companyName || `${fullName}'s Business`,
          languageSettings: {
            mode: "auto" as const,
            enabled: enabledLanguages,
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

  const ownerRoles = [
    {
      id: "owner",
      label: "Business Owner",
      icon: Briefcase,
      desc: "I run the business and need full control",
    },
    {
      id: "manager",
      label: "Manager",
      icon: Activity,
      desc: "I oversee daily operations and team",
    },
    {
      id: "sales",
      label: "Sales / Marketing",
      icon: TrendingUp,
      desc: "I handle growth, leads, and campaigns",
    },
    {
      id: "support",
      label: "Customer Support",
      icon: MessageSquare,
      desc: "I interact with customers directly",
    },
  ];

  const companySizes = [
    { id: "solo", label: "Just me", desc: "Solo business or freelancer", icon: User },
    { id: "small", label: "2 – 20 people", desc: "Small team", icon: Users },
    { id: "medium", label: "21 – 200 people", desc: "Growing company", icon: Building2 },
    { id: "large", label: "200+ people", desc: "Larger organization", icon: Building2 },
  ];

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative selection:bg-zinc-200">
      {/* Clean subtle dot background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

      {/* Top Left Branding */}
      <div className="absolute top-8 left-8 flex items-center gap-2.5 z-10">
        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shadow-sm">
          <Zap className="w-4 h-4 text-white fill-current" />
        </div>
        <span className="font-semibold text-[17px] tracking-tight">Anaos</span>
      </div>

      <main className="w-full max-w-[640px] relative z-10">
        {/* Sleek Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
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
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
                        What is your role?
                      </h2>
                      <p className="text-[15px] text-zinc-500 mb-8">
                        We'll adapt the dashboard experience to your needs.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ownerRoles.map((r) => {
                          const Icon = r.icon;
                          const selected = ownerRole === r.id;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setOwnerRole(r.id)}
                              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                                selected 
                                  ? "border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50 shadow-sm" 
                                  : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                              }`}
                            >
                              <Icon className={`mt-0.5 w-5 h-5 ${selected ? "text-zinc-900" : "text-zinc-400"}`} />
                              <div>
                                <p className={`text-[15px] font-medium ${selected ? "text-zinc-900" : "text-zinc-700"}`}>
                                  {r.label}
                                </p>
                                <p className="text-[13px] text-zinc-500 mt-0.5">{r.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
                        How big is your team?
                      </h2>
                      <p className="text-[15px] text-zinc-500 mb-8">
                        This helps us configure collaboration features.
                      </p>

                      <div className="space-y-3">
                        {companySizes.map((size) => {
                          const Icon = size.icon;
                          const selected = companySize === size.id;
                          return (
                            <button
                              key={size.id}
                              type="button"
                              onClick={() => setCompanySize(size.id)}
                              className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                                selected 
                                  ? "border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50 shadow-sm" 
                                  : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${selected ? "text-zinc-900" : "text-zinc-400"}`} />
                                <div>
                                  <p className={`text-[15px] font-medium ${selected ? "text-zinc-900" : "text-zinc-700"}`}>
                                    {size.label}
                                  </p>
                                  <p className="text-[13px] text-zinc-500 mt-0.5">{size.desc}</p>
                                </div>
                              </div>
                              {selected && <Check className="w-4 h-4 text-zinc-900" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
                        Customer Languages
                      </h2>
                      <p className="text-[15px] text-zinc-500 mb-6">
                        Anaos AI auto-detects and replies in your customers' native language. Select the ones you frequently encounter.
                      </p>
                      
                      <div className="flex items-center gap-2 mb-6 px-4 py-2.5 bg-zinc-50 rounded-lg border border-zinc-200 text-zinc-700">
                        <Globe className="w-4 h-4 text-zinc-400" />
                        <span className="text-[13px] font-medium">45+ languages supported out of the box.</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto mb-4 pr-2 custom-scrollbar">
                        {LANGUAGE_CATALOG.map((l) => {
                          const on = enabledLanguages.includes(l.code);
                          return (
                            <button
                              key={l.code}
                              type="button"
                              onClick={() =>
                                setEnabledLanguages((prev) =>
                                  on ? prev.filter((c) => c !== l.code) : [...prev, l.code]
                                )
                              }
                              className={`flex items-center gap-2 p-2.5 rounded-lg border text-[13px] transition-all ${
                                on 
                                  ? "border-zinc-900 bg-zinc-900 text-white font-medium shadow-sm" 
                                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                              }`}
                            >
                              <span className="text-base">{l.flag}</span>
                              <span className="truncate">{l.label}</span>
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setEnabledLanguages(LANGUAGE_CATALOG.map((l) => l.code))}
                        className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors self-start"
                      >
                        Select all languages
                      </button>
                    </div>
                  )}

                  {step === 6 && (
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
                        Connect Communication Channels
                      </h2>
                      <p className="text-[15px] text-zinc-500 mb-8">
                        Select the platforms where your customers reach out. You can change this later.
                      </p>

                      <div className="space-y-3">
                        {[
                          { id: "whatsapp" as const, name: "WhatsApp Business", icon: MessageCircle, brand: "text-[#25D366]" },
                          { id: "instagram" as const, name: "Instagram DM", icon: Instagram, brand: "text-[#E4405F]" },
                          { id: "facebook" as const, name: "Facebook Messenger", icon: Facebook, brand: "text-[#1877F2]" },
                        ].map((c) => {
                          const isSelected = selectedChannels.includes(c.id);
                          return (
                            <button
                              key={c.id}
                              onClick={() => toggleChannel(c.id)}
                              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                isSelected 
                                  ? "border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50 shadow-sm" 
                                  : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <c.icon className={`w-5 h-5 ${isSelected ? c.brand : "text-zinc-400"}`} />
                                <span className={`text-[15px] font-medium ${isSelected ? "text-zinc-900" : "text-zinc-700"}`}>
                                  {c.name}
                                </span>
                              </div>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? "border-zinc-900 bg-zinc-900" : "border-zinc-300"}`}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 7 && (
                    <div className="flex flex-col items-center">
                      <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-2">
                        Link Meta Accounts
                      </h2>
                      <p className="text-[15px] text-zinc-500 mb-8 text-center">
                        Authenticate securely to grant Anaos access to your selected channels.
                      </p>
                      <div className="w-full">
                        <MetaEmbeddedSignup onSuccess={() => handleSubmit()} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions inside Card */}
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
                    onClick={() => {
                      if (step === 6 && selectedChannels.length === 0) {
                        handleSubmit();
                      } else if (step === 7) {
                        // Wait for Meta popup
                      } else {
                        handleNext();
                      }
                    }}
                    style={step === 7 ? { display: 'none' } : { backgroundColor: accent }}
                    disabled={
                      (step === 1 && !industryId) ||
                      (step === 2 && (!fullName.trim() || !companyName.trim())) ||
                      (step === 3 && !ownerRole) ||
                      (step === 4 && !companySize) ||
                      (step === 5 && enabledLanguages.length === 0)
                    }
                    className="h-10 px-5 rounded-lg text-white font-medium disabled:opacity-50 flex items-center gap-2 text-[14px] transition-all hover:brightness-110 active:scale-95 shadow-sm"
                  >
                    <span>{step === 6 ? (selectedChannels.length === 0 ? "Skip for now" : "Continue") : "Continue"}</span>
                    {step !== 6 || selectedChannels.length > 0 ? (
                      <ArrowRight className="w-4 h-4" />
                    ) : null}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      {/* Global CSS for custom scrollbar hidden in normal tailwind */}
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
