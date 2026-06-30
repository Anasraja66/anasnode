"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare as Facebook, Camera as Instagram, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { MetaEmbeddedSignup } from "@/components/integrations/MetaEmbeddedSignup";

export function OnboardingWizard() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedChannels, setSelectedChannels] = useState<("whatsapp"|"instagram"|"facebook")[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Check if onboarding was already completed
    const isCompleted = localStorage.getItem("anaos_onboarding_completed");
    if (isCompleted !== "true") {
      setShow(true);
      setStep(1);
    }

    // Still allow manual trigger
    const handleOpen = () => {
      setShow(true);
      setStep(1);
      setCompleted(false);
    };
    window.addEventListener("anaos-open-onboarding", handleOpen);
    return () => window.removeEventListener("anaos-open-onboarding", handleOpen);
  }, []);

  const handleComplete = () => {
    setCompleted(true);
    localStorage.setItem("anaos_onboarding_completed", "true");
    setTimeout(() => {
      setShow(false);
    }, 2500);
  };

  const toggleChannel = (c: "whatsapp"|"instagram"|"facebook") => {
    setSelectedChannels(prev => 
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  if (!show) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[100vh] sm:max-h-[90vh] flex flex-col relative custom-scrollbar"
      >
        <div className="p-6 sm:p-8 md:p-10 pb-10 sm:pb-12 md:pb-12">
          {!completed ? (
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">Where would you like to start?</h2>
                  <p className="text-zinc-500 mb-8 max-w-sm">
                    Connect your business channels to enable Anaos AI to reply to your customers automatically.
                  </p>

                  <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
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
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
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
                              {isSelected && <CheckCircle2 className={`w-4 h-4 ${c.color}`} />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={selectedChannels.length === 0}
                    onClick={() => setStep(2)}
                    className="mt-8 w-full max-w-md h-12 bg-zinc-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.setItem("anaos_onboarding_completed", "true");
                      setShow(false);
                    }}
                    className="mt-4 text-[13px] text-zinc-400 hover:text-zinc-600 font-medium"
                  >
                    Skip for now
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col items-center"
                >
                  <button 
                    onClick={() => setStep(1)}
                    className="self-start -mt-4 mb-4 text-zinc-400 hover:text-zinc-700 p-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  
                  <MetaEmbeddedSignup onSuccess={() => handleComplete()} />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-900 mb-2">Setup Complete!</h2>
              <p className="text-zinc-500 text-center max-w-xs">
                Your channels are successfully connected. Let's head to your dashboard!
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ArrowLeft since it's not imported at top
function ArrowLeft(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
