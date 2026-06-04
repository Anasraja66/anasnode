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
} from "lucide-react";
import { MetaOAuthConnect } from "@/components/dashboard/MetaOAuthConnect";
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
  const [loadingText, setLoadingText] = useState("Setting up your business desk...");

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
      `Preparing your ${selectedPreset.label} dashboard...`,
      "Connecting WhatsApp-ready automations...",
      "Training your AI assistant tone...",
      "Almost ready — opening your desk...",
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
      desc: "I run the business and want simple automation",
    },
    {
      id: "manager",
      label: "Manager",
      icon: Activity,
      desc: "I manage daily operations and customer replies",
    },
    {
      id: "sales",
      label: "Sales / Marketing",
      icon: TrendingUp,
      desc: "I handle leads, campaigns, and follow-ups",
    },
    {
      id: "support",
      label: "Customer Support",
      icon: MessageSquare,
      desc: "I answer customer messages every day",
    },
  ];

  const companySizes = [
    { id: "solo", label: "Just me", desc: "Solo business or freelancer", icon: User },
    { id: "small", label: "2 – 20 people", desc: "Small team", icon: Users },
    { id: "medium", label: "21 – 200 people", desc: "Growing company", icon: Building2 },
    { id: "large", label: "200+ people", desc: "Larger organization", icon: Building2 },
  ];

  const stepVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.05,
        delayChildren: 0.05,
      } 
    },
    exit: { 
      opacity: 0, 
      y: -12,
      transition: { 
        duration: 0.3, 
        ease: [0.16, 1, 0.3, 1] as const,
      } 
    },
  };

  const itemVariants = {
    initial: { y: 12, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      }
    },
    exit: { y: -8, opacity: 0 }
  };

  const accent = selectedPreset?.primary ?? "#0A6BFF";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans">
      {/* Clean Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-[8px] flex items-center justify-center shadow-sm"
            style={{ backgroundColor: accent }}
          >
            <Zap className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="text-[17px] font-extrabold text-zinc-950 tracking-tight">Anaos</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            Business setup
          </span>
        </div>
        <div className="text-[13px] text-zinc-400 font-semibold uppercase tracking-widest font-mono">
          Step {step} of 7
        </div>
      </header>

      <main className="w-full max-w-[560px] my-auto relative z-10 py-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/95 border border-zinc-200 bg-white/95 p-10 flex flex-col items-center justify-center text-center h-[380px] rounded-3xl shadow-xl relative backdrop-blur-md"
            >
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-100" />
                <div
                  className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: accent, borderTopColor: "transparent" }}
                />
              </div>
              <h3 className="text-[18px] font-bold text-zinc-950 mb-2 animate-pulse">
                {loadingText}
              </h3>
              <p className="text-[13.5px] text-zinc-500 font-medium">
                Your dashboard will open with a {selectedPreset?.label ?? "business"} layout — easy
                for owners, no coding.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white/95 border border-zinc-200 shadow-2xl rounded-3xl backdrop-blur-md p-8 sm:p-10 relative z-10"
            >              {step === 1 && (
                <div className="flex flex-col">
                  <motion.h2 
                    variants={itemVariants}
                    className="text-[26px] font-extrabold text-zinc-900 tracking-tight text-center leading-tight mb-2"
                  >
                    What type of business do you run?
                  </motion.h2>
                  <motion.p 
                    variants={itemVariants}
                    className="text-[14px] text-zinc-500 text-center font-medium mb-6"
                  >
                    Your dashboard will look and feel built for this industry.
                  </motion.p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1 mb-8">
                    {INDUSTRY_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const selected = industryId === opt.id;
                      return (
                        <motion.button
                          variants={itemVariants}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          key={opt.id}
                          type="button"
                          onClick={() => setIndustryId(opt.id)}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selected 
                              ? "border-transparent ring-2 shadow-lg" 
                              : "border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm hover:shadow-md"
                          }`}
                          style={
                            selected
                              ? {
                                  borderColor: opt.primary,
                                  backgroundColor: opt.softBg,
                                  boxShadow: `0 0 0 2px ${opt.primary}, 0 8px 24px -4px ${opt.primary}20`,
                                }
                              : undefined
                          }
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white transition-colors"
                            style={{ backgroundColor: selected ? opt.primary : "#e4e4e7" }}
                          >
                            <Icon className={`w-5 h-5 ${selected ? "" : "text-zinc-500"}`} />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-zinc-900">{opt.label}</p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">{opt.tagline}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col">
                  <motion.h2 
                    variants={itemVariants}
                    className="text-[26px] font-extrabold text-zinc-900 tracking-tight text-center leading-tight mb-2"
                  >
                    Your business details
                  </motion.h2>
                  <motion.p 
                    variants={itemVariants}
                    className="text-[14px] text-zinc-500 text-center font-medium mb-8"
                  >
                    {selectedPreset
                      ? `Setting up ${selectedPreset.label} for you.`
                      : "Tell us your name and brand."}
                  </motion.p>

                  <motion.div className="space-y-5 mb-8" variants={itemVariants}>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                        Your name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Muhammad Qasim"
                        className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-4 text-[14px] font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                        Business name
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
                              : "e.g. Your clinic or shop name"
                        }
                        className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-4 text-[14px] font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                      />
                    </div>
                  </motion.div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col">
                  <motion.h2 
                    variants={itemVariants}
                    className="text-[26px] font-extrabold text-zinc-900 tracking-tight text-center leading-tight mb-2"
                  >
                    What is your role?
                  </motion.h2>
                  <motion.p 
                    variants={itemVariants}
                    className="text-[14px] text-zinc-500 text-center font-medium mb-6"
                  >
                    We keep the dashboard simple — no developer jargon.
                  </motion.p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {ownerRoles.map((r) => {
                      const Icon = r.icon;
                      const selected = ownerRole === r.id;
                      return (
                        <motion.button
                          variants={itemVariants}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          key={r.id}
                          type="button"
                          onClick={() => setOwnerRole(r.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            selected 
                              ? "ring-2 shadow-lg" 
                              : "border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm hover:shadow-md"
                          }`}
                          style={
                            selected
                              ? { 
                                  borderColor: accent, 
                                  backgroundColor: `${accent}06`,
                                  boxShadow: `0 0 0 2px ${accent}, 0 8px 20px -4px ${accent}15`
                                }
                              : undefined
                          }
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              selected ? "text-white" : "bg-zinc-100 text-zinc-500"
                            }`}
                            style={selected ? { backgroundColor: accent } : undefined}
                          >
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <p className="text-[13.5px] font-bold text-zinc-900">{r.label}</p>
                            <p className="text-[11px] text-zinc-400 mt-0.5">{r.desc}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col">
                  <motion.h2 
                    variants={itemVariants}
                    className="text-[26px] font-extrabold text-zinc-900 tracking-tight text-center leading-tight mb-2"
                  >
                    How big is your team?
                  </motion.h2>
                  <motion.p 
                    variants={itemVariants}
                    className="text-[14px] text-zinc-500 text-center font-medium mb-8"
                  >
                    Optional — helps us suggest the right plan later.
                  </motion.p>

                  <div className="space-y-3 mb-8">
                    {companySizes.map((size) => {
                      const Icon = size.icon;
                      const selected = companySize === size.id;
                      return (
                        <motion.button
                          variants={itemVariants}
                          whileHover={{ scale: 1.01, y: -1 }}
                          whileTap={{ scale: 0.99 }}
                          key={size.id}
                          type="button"
                          onClick={() => setCompanySize(size.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            selected 
                              ? "ring-2 shadow-lg" 
                              : "border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm hover:shadow-md"
                          }`}
                          style={
                            selected
                              ? { 
                                  borderColor: accent, 
                                  backgroundColor: `${accent}06`,
                                  boxShadow: `0 0 0 2px ${accent}, 0 8px 20px -4px ${accent}15`
                                }
                              : undefined
                          }
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                selected ? "text-white" : "bg-zinc-100 text-zinc-500"
                              }`}
                              style={selected ? { backgroundColor: accent } : undefined}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[14.5px] font-bold text-zinc-900">
                                {size.label}
                              </p>
                              <p className="text-[12px] text-zinc-400">{size.desc}</p>
                            </div>
                          </div>
                          {selected && (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: accent }}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-col">
                  <motion.h2 
                    variants={itemVariants}
                    className="text-[26px] font-extrabold text-zinc-900 tracking-tight text-center leading-tight mb-2"
                  >
                    Customer languages
                  </motion.h2>
                  <motion.p 
                    variants={itemVariants}
                    className="text-[14px] text-zinc-500 text-center font-medium mb-4"
                  >
                    Every industry, every country — on WhatsApp Anaos auto-detects and replies in
                    the customer&apos;s language (same for any normal business).
                  </motion.p>
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center justify-center gap-2 mb-4 text-[#0A6BFF]"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-[13px] font-bold">45+ languages supported</span>
                  </motion.div>
                  <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto mb-4 pr-1">
                    {LANGUAGE_CATALOG.map((l) => {
                      const on = enabledLanguages.includes(l.code);
                      return (
                        <motion.button
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          key={l.code}
                          type="button"
                          onClick={() =>
                            setEnabledLanguages((prev) =>
                              on
                                ? prev.filter((c) => c !== l.code)
                                : [...prev, l.code]
                            )
                          }
                          className={`flex items-center gap-2 p-2 rounded-lg border text-[12px] cursor-pointer transition-all ${
                            on 
                              ? "border-[#0A6BFF] bg-blue-500/5 font-semibold shadow-sm" 
                              : "border-zinc-200 bg-white hover:bg-zinc-50"
                          }`}
                        >
                          <span>{l.flag}</span>
                          <span className="truncate">{l.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                  <motion.button
                    variants={itemVariants}
                    type="button"
                    onClick={() =>
                      setEnabledLanguages(LANGUAGE_CATALOG.map((l) => l.code))
                    }
                    className="text-[12px] font-bold text-[#0A6BFF] mx-auto hover:underline"
                  >
                    Select all languages
                  </motion.button>
                </div>
              )}

              {step === 6 && (
                <div className="flex flex-col items-center text-center">
                  <motion.h2 
                    variants={itemVariants}
                    className="text-[26px] font-extrabold text-zinc-900 tracking-tight leading-tight mb-2"
                  >
                    Connect your channels
                  </motion.h2>
                  <motion.p 
                    variants={itemVariants}
                    className="text-[14px] text-zinc-500 font-medium mb-8 max-w-sm mx-auto"
                  >
                    Select the business channels you want Anaos AI to manage for you.
                  </motion.p>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto mb-8">
                    {[
                      { id: "whatsapp" as const, name: "WhatsApp Business", icon: MessageCircle, color: "text-[#25D366]", bg: "bg-[#25D366]/10", border: "border-[#25D366]" },
                      { id: "instagram" as const, name: "Instagram DM", icon: Instagram, color: "text-[#E4405F]", bg: "bg-[#E4405F]/10", border: "border-[#E4405F]" },
                      { id: "facebook" as const, name: "Facebook Messenger", icon: Facebook, color: "text-[#1877F2]", bg: "bg-[#1877F2]/10", border: "border-[#1877F2]" },
                    ].map((c) => {
                      const isSelected = selectedChannels.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() => toggleChannel(c.id)}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected 
                              ? `${c.border} bg-zinc-50/50 shadow-sm` 
                              : `border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50`
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? c.bg : "bg-zinc-100"}`}>
                            <c.icon className={`w-5 h-5 ${isSelected ? c.color : "text-zinc-500"}`} />
                          </div>
                          <span className={`font-bold text-[15px] ${isSelected ? "text-zinc-900" : "text-zinc-600"}`}>
                            {c.name}
                          </span>
                          <div className="ml-auto">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? c.border + " " + c.bg : "border-zinc-300"}`}>
                              {isSelected && <Check className={`w-3.5 h-3.5 ${c.color}`} />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                </div>
              )}

              {step === 7 && (
                <div className="flex flex-col items-center">
                  <motion.h2 
                    variants={itemVariants}
                    className="text-[26px] font-extrabold text-zinc-900 tracking-tight leading-tight mb-2"
                  >
                    Link Accounts
                  </motion.h2>
                  <motion.p 
                    variants={itemVariants}
                    className="text-[14px] text-zinc-500 font-medium mb-8 text-center"
                  >
                    Authenticate with Meta to finish setup.
                  </motion.p>
                  <motion.div variants={itemVariants} className="w-full">
                    <MetaOAuthConnect 
                      channels={selectedChannels} 
                      onSuccess={handleSubmit} 
                    />
                  </motion.div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold text-[13.5px] hover:bg-zinc-50 disabled:opacity-30 cursor-pointer transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // If step 6 and no channels selected, we can let them skip by just doing handleSubmit()
                    if (step === 6 && selectedChannels.length === 0) {
                      handleSubmit();
                    } else if (step === 7) {
                      // Do nothing, they must click the Meta button to proceed
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
                  className="h-11 px-6 rounded-xl text-white font-bold disabled:opacity-40 flex items-center gap-1.5 text-[13.5px] cursor-pointer transition-all shadow-md hover:shadow-lg hover:brightness-105"
                >
                  <span>{step === 6 ? (selectedChannels.length === 0 ? "Skip for now" : "Continue") : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-6xl mx-auto flex justify-center items-center gap-1.5 pb-6 z-10">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (i < step) setStep(i);
            }}
            disabled={i > step}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? "w-7" : "w-2 bg-zinc-200"
            }`}
            style={i === step ? { backgroundColor: accent } : undefined}
          />
        ))}
      </footer>
    </div>
  );
}
