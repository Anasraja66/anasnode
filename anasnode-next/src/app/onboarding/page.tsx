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
  Sun,
  Moon,
  Laptop,
  Briefcase,
  Code,
  Sliders,
  MessageSquare,
  TrendingUp,
  Activity,
  Globe
} from "lucide-react";

export default function OnboardingPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Configuring your Automation OS...");

  // Form states
  const [style, setStyle] = useState<"light" | "dark">("light");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [companySize, setCompanySize] = useState("");

  useEffect(() => {
    if (session?.user?.name && !fullName) {
      setFullName(session.user.name);
    }
  }, [session]);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate steps of workspace generation
    const stages = [
      "Configuring your custom Automation OS...",
      "Generating visual workflow canvas...",
      "Setting up sandbox environment...",
      "Deploying AI Operator agent grid...",
      "Finalizing workspace variables..."
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
          role,
          workspaceName: companyName || `${fullName}'s Business`,
          style
        })
      });

      if (response.ok) {
        // Trigger a session refresh so the name and dashboard update correctly
        await updateSession();
        
        clearInterval(interval);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 800);
      } else {
        alert("Something went wrong setting up your workspace. Please try again.");
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

  const roles = [
    { id: "founder", label: "Founder / Owner", icon: Briefcase, desc: "Building core automation for my own business" },
    { id: "developer", label: "Software Engineer / Dev", icon: Code, desc: "Writing integrations & custom node scripts" },
    { id: "operations", label: "Operations Manager", icon: Sliders, desc: "Streamlining data flows & team pipelines" },
    { id: "product", label: "Product Manager", icon: Laptop, desc: "Designing automation logic & customer journeys" },
    { id: "support", label: "Support Lead", icon: MessageSquare, desc: "Deploying conversational support agents" },
    { id: "marketing", label: "Sales / Marketing Lead", icon: TrendingUp, desc: "Automating campaigns & lead captures" },
    { id: "consultant", label: "Consultant / Agency", icon: Globe, desc: "Delivering custom workflow setups for clients" },
    { id: "other", label: "Other / Tech Enthusiast", icon: Activity, desc: "Exploring visual webhook integrations" }
  ];

  const companySizes = [
    { id: "solo", label: "Solo Operator", desc: "Just me building automation systems", icon: User },
    { id: "small", label: "2 - 20 people", desc: "Small team with growing workflow needs", icon: Users },
    { id: "medium", label: "21 - 200 people", desc: "Established company scaling operations", icon: Building2 },
    { id: "large", label: "200+ people", desc: "Enterprise scale data & API demands", icon: Building2 }
  ];

  // Motion page animations
  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.25, ease: "easeIn" as const } }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans">
      
      {/* Premium Sky Blue & Ice Blue Glow mesh backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-[#0A6BFF]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[50%] rounded-full bg-[#38BDF8]/10 blur-[140px] pointer-events-none" />
      
      {/* Top Bar Logo */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] bg-[#0A6BFF] flex items-center justify-center shadow-[0_2px_8px_rgba(10,107,255,0.2)]">
            <Zap className="w-4 h-4 text-white fill-current animate-pulse" />
          </div>
          <span className="text-[17px] font-extrabold text-zinc-950 tracking-tight">Anaos</span>
          <span className="text-[10px] bg-[#0A6BFF]/10 text-[#0A6BFF] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            OS Setup
          </span>
        </div>
        <div className="text-[13px] text-zinc-400 font-semibold font-mono uppercase tracking-widest">
          Step {step} of 4
        </div>
      </header>

      {/* Main card wizard container */}
      <main className="w-full max-w-[540px] my-auto relative z-10 py-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 border border-zinc-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-3xl backdrop-blur-2xl p-10 flex flex-col items-center justify-center text-center h-[380px]"
            >
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-100" />
                <div className="absolute inset-0 rounded-full border-4 border-[#0A6BFF] border-t-transparent animate-spin" />
              </div>
              <h3 className="text-[18px] font-bold text-zinc-950 mb-2 animate-pulse">{loadingText}</h3>
              <p className="text-[13.5px] text-zinc-500 font-medium">Please wait while we customize your operational canvas.</p>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white/85 border border-zinc-200/60 shadow-[0_20px_50px_rgba(10,107,255,0.05)] rounded-3xl backdrop-blur-2xl p-8 sm:p-10 relative"
            >
              {/* Step 1: Style / Mode Selector */}
              {step === 1 && (
                <div className="flex flex-col">
                  <h2 className="text-[26px] font-extrabold text-zinc-900 tracking-tight text-center leading-tight mb-2">
                    Pick your workspace style
                  </h2>
                  <p className="text-[14px] text-zinc-500 text-center font-medium mb-8">
                    Choose the design layout that fits your workflow environment.
                  </p>

                  <div className="grid grid-cols-2 gap-4.5 mb-8">
                    {/* Light option */}
                    <button
                      onClick={() => setStyle("light")}
                      className={`flex flex-col items-center p-4.5 rounded-2xl border text-left transition-all relative overflow-hidden select-none cursor-pointer ${
                        style === "light"
                          ? "border-[#0A6BFF] bg-[#0A6BFF]/5 ring-2 ring-[#0A6BFF]/20 shadow-md"
                          : "border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300"
                      }`}
                    >
                      <div className="w-full aspect-[1.4/1] rounded-lg bg-zinc-100 border border-zinc-200/60 flex mb-4 relative overflow-hidden p-1">
                        <div className="w-[30%] h-full bg-zinc-200/70 rounded-l flex flex-col gap-1 p-1">
                          <div className="w-6 h-1 bg-zinc-400 rounded-full" />
                          <div className="w-8 h-1 bg-zinc-300 rounded-full" />
                          <div className="w-5 h-1 bg-zinc-300 rounded-full" />
                        </div>
                        <div className="flex-1 h-full bg-white rounded-r p-1 flex flex-col gap-1 justify-center items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Sun className="w-4 h-4 text-amber-500" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[14.5px] font-bold text-zinc-900">Light Mode</span>
                      <span className="text-[11.5px] text-zinc-400 mt-0.5 font-medium">Ice Blue minimal canvas</span>
                      {style === "light" && (
                        <div className="absolute top-3 right-3 bg-[#0A6BFF] text-white p-1 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>

                    {/* Dark option */}
                    <button
                      onClick={() => setStyle("dark")}
                      className={`flex flex-col items-center p-4.5 rounded-2xl border text-left transition-all relative overflow-hidden select-none cursor-pointer ${
                        style === "dark"
                          ? "border-[#0A6BFF] bg-[#0A6BFF]/5 ring-2 ring-[#0A6BFF]/20 shadow-md"
                          : "border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300"
                      }`}
                    >
                      <div className="w-full aspect-[1.4/1] rounded-lg bg-zinc-900 border border-zinc-800 flex mb-4 relative overflow-hidden p-1 text-white">
                        <div className="w-[30%] h-full bg-zinc-850 rounded-l flex flex-col gap-1 p-1">
                          <div className="w-6 h-1 bg-zinc-700 rounded-full" />
                          <div className="w-8 h-1 bg-zinc-650 rounded-full" />
                          <div className="w-5 h-1 bg-zinc-650 rounded-full" />
                        </div>
                        <div className="flex-1 h-full bg-zinc-950 rounded-r p-1 flex flex-col gap-1 justify-center items-center">
                          <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
                            <Moon className="w-4 h-4 text-cyan-400" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[14.5px] font-bold text-zinc-900">Dark Mode</span>
                      <span className="text-[11.5px] text-zinc-400 mt-0.5 font-medium">Deep Space Neon accents</span>
                      {style === "dark" && (
                        <div className="absolute top-3 right-3 bg-[#0A6BFF] text-white p-1 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Name and Company */}
              {step === 2 && (
                <div className="flex flex-col">
                  <h2 className="text-[26px] font-extrabold text-zinc-900 tracking-tight text-center leading-tight mb-2">
                    Let's personalize your setup
                  </h2>
                  <p className="text-[14px] text-zinc-500 text-center font-medium mb-8">
                    We will configure your name and brand workspaces under the hood.
                  </p>

                  <div className="space-y-5.5 mb-8">
                    <div>
                      <label className="block text-[11px] font-bold font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Muhammad Qasim"
                          className="w-full h-12 bg-zinc-50/50 border border-zinc-200 rounded-xl pl-10.5 pr-4 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-2 focus:ring-[#0A6BFF]/10 transition-all font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                        Company or Project Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                          <Building2 className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Marina Realty or Olive & Oak"
                          className="w-full h-12 bg-zinc-50/50 border border-zinc-200 rounded-xl pl-10.5 pr-4 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-2 focus:ring-[#0A6BFF]/10 transition-all font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Role Selector */}
              {step === 3 && (
                <div className="flex flex-col">
                  <h2 className="text-[26px] font-extrabold text-zinc-900 tracking-tight text-center leading-tight mb-2">
                    Which role fits you best?
                  </h2>
                  <p className="text-[14px] text-zinc-500 text-center font-medium mb-6">
                    Anaos adapts templates and node parameters based on your business role.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 mb-8">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      return (
                        <button
                          key={r.id}
                          onClick={() => setRole(r.label)}
                          className={`flex items-start gap-3.5 p-3 rounded-xl border text-left transition-all select-none cursor-pointer ${
                            role === r.label
                              ? "border-[#0A6BFF] bg-[#0A6BFF]/5 ring-2 ring-[#0A6BFF]/10"
                              : "border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300"
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            role === r.label ? "bg-[#0A6BFF] text-white" : "bg-zinc-100 text-zinc-500"
                          }`}>
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <p className="text-[13.5px] font-bold text-zinc-900 leading-snug">{r.label}</p>
                            <p className="text-[11px] text-zinc-400 leading-normal mt-0.5 font-medium">{r.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Company Size */}
              {step === 4 && (
                <div className="flex flex-col">
                  <h2 className="text-[26px] font-extrabold text-zinc-900 tracking-tight text-center leading-tight mb-2">
                    How many people work at your company?
                  </h2>
                  <p className="text-[14px] text-zinc-500 text-center font-medium mb-8">
                    Help us understand your team size to customize webhook capacities.
                  </p>

                  <div className="space-y-3 mb-8">
                    {companySizes.map((size) => {
                      const Icon = size.icon;
                      return (
                        <button
                          key={size.id}
                          onClick={() => setCompanySize(size.label)}
                          className={`w-full flex items-center justify-between p-4.5 rounded-xl border text-left transition-all select-none cursor-pointer ${
                            companySize === size.label
                              ? "border-[#0A6BFF] bg-[#0A6BFF]/5 ring-2 ring-[#0A6BFF]/10"
                              : "border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                              companySize === size.label ? "bg-[#0A6BFF] text-white" : "bg-zinc-100 text-zinc-500"
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[14.5px] font-bold text-zinc-900">{size.label}</p>
                              <p className="text-[12px] text-zinc-400 font-medium">{size.desc}</p>
                            </div>
                          </div>
                          {companySize === size.label && (
                            <div className="w-5 h-5 rounded-full bg-[#0A6BFF] flex items-center justify-center text-white shrink-0">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-50 transition-all text-[13.5px] disabled:opacity-30 disabled:pointer-events-none cursor-pointer active:scale-98"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (step === 2 && (!fullName.trim() || !companyName.trim())) ||
                    (step === 3 && !role) ||
                    (step === 4 && !companySize)
                  }
                  className="h-11 px-6 rounded-xl bg-zinc-950 text-white font-bold hover:bg-zinc-900 disabled:opacity-40 transition-all flex items-center gap-1.5 text-[13.5px] cursor-pointer active:scale-98"
                >
                  <span>{step === 4 ? "Launch Workspace" : "Continue"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Step Dots */}
      <footer className="w-full max-w-6xl mx-auto flex justify-center items-center gap-1.5 pb-6 z-10">
        {[1, 2, 3, 4].map((i) => (
          <button
            key={i}
            onClick={() => {
              // Only allow moving backward or forward if we completed the step requirement
              if (i < step) setStep(i);
            }}
            disabled={i > step}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step 
                ? "w-7 bg-[#0A6BFF]" 
                : "w-2 bg-zinc-200 hover:bg-zinc-300 disabled:opacity-50 disabled:hover:bg-zinc-200"
            }`}
          />
        ))}
      </footer>
    </div>
  );
}
