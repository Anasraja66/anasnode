"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Phone, Calendar, Mail, Plug } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookMessenger } from "react-icons/fa";
import BrandIcon from "@/components/ui/BrandIcon";
import { MetaEmbeddedSignup } from "@/components/integrations/MetaEmbeddedSignup";

export function OnboardingWizard() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [filteredChannels, setFilteredChannels] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    // Still allow manual trigger or trigger with prompt
    const handleOpen = (e: any) => {
      setShow(true);
      setStep(1);
      setCompleted(false);

      if (e && e.detail && (e.detail.pendingWorkflow || e.detail.prompt)) {
        const detected: string[] = [];
        
        // Dynamic detection from backend nodes
        if (e.detail.pendingWorkflow && e.detail.pendingWorkflow.nodes) {
          e.detail.pendingWorkflow.nodes.forEach((node: any) => {
            if (node.data?.provider) {
              const p = node.data.provider.toLowerCase();
              if (!detected.includes(p)) detected.push(p);
            }
          });
        }
        
        const text = (e.detail.prompt || "").toLowerCase();
        if (text.includes("whatsapp") || text.includes("wa")) if (!detected.includes("whatsapp")) detected.push("whatsapp");
        if (text.includes("instagram") || text.includes("ig")) if (!detected.includes("instagram")) detected.push("instagram");
        if (text.includes("facebook") || text.includes("messenger") || text.includes("fb")) if (!detected.includes("facebook")) detected.push("facebook");
        if (text.includes("call") || text.includes("phone") || text.includes("voice") || text.includes("vapi")) if (!detected.includes("phone")) detected.push("phone");
        if (text.includes("calendar") || text.includes("book") || text.includes("meeting") || text.includes("appoint")) if (!detected.includes("calendar")) detected.push("calendar");
        if (text.includes("email") || text.includes("gmail") || text.includes("mail")) if (!detected.includes("email")) detected.push("email");
        if (text.includes("sms") || text.includes("message")) {
            if (!detected.includes("whatsapp") && !detected.includes("sms") && !detected.includes("instagram") && !detected.includes("facebook")) {
              detected.push("whatsapp"); // Default generic message to WhatsApp
            }
        }
        
        // Filter out non-integrations or internal tools
        const finalDetected = detected.filter(d => !["ai", "condition", "trigger", "openai", "groq", "anaos", "system"].includes(d));
        setFilteredChannels(finalDetected);
      } else {
        setFilteredChannels([]);
      }
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

  const toggleChannel = (c: string) => {
    setSelectedChannels(prev => 
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  if (!mounted || !show || typeof document === "undefined") return null;

  return createPortal(
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

                  <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Where would you like to start?</h2>
                  <p className="text-zinc-500 mb-8 max-w-sm">
                    Connect your business channels to enable Anaos AI to reply to your customers automatically.
                  </p>

                  <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
                    {(() => {
                      const knownChannels: Record<string, any> = {
                        "whatsapp": { name: "WhatsApp Business", icon: FaWhatsapp, color: "text-[#25D366]", bg: "bg-[#25D366]/10", border: "border-[#25D366]" },
                        "instagram": { name: "Instagram DM", icon: FaInstagram, color: "text-[#E4405F]", bg: "bg-[#E4405F]/10", border: "border-[#E4405F]" },
                        "facebook": { name: "Facebook Messenger", icon: FaFacebookMessenger, color: "text-[#1877F2]", bg: "bg-[#1877F2]/10", border: "border-[#1877F2]" },
                        "phone": { name: "AI Voice Agent", icon: Phone, color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", border: "border-[#8B5CF6]" },
                        "calendar": { name: "Google Calendar", icon: Calendar, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", border: "border-[#F59E0B]" },
                        "email": { name: "Email Automation", icon: Mail, color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]" },
                      };
                      
                      const visibleChannels = filteredChannels.length > 0 
                        ? filteredChannels.map(id => {
                            if (knownChannels[id]) return { id, ...knownChannels[id] };
                            // Create dynamic generic channel
                            return {
                              id,
                              name: id.charAt(0).toUpperCase() + id.slice(1) + " Integration",
                              icon: Plug,
                              color: "text-[#0A6BFF]",
                              bg: "bg-[#0A6BFF]/10",
                              border: "border-[#0A6BFF]"
                            };
                          })
                        : [
                            { id: "whatsapp", ...knownChannels["whatsapp"] },
                            { id: "instagram", ...knownChannels["instagram"] },
                            { id: "facebook", ...knownChannels["facebook"] }
                          ];

                      return visibleChannels.map((c) => {
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
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? "bg-white shadow-sm border border-zinc-100" : "bg-zinc-100/50"}`}>
                            <BrandIcon id={c.id} className="w-7 h-7" />
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
                    });
                  })()}
                  </div>

                  <button
                    disabled={selectedChannels.length === 0}
                    onClick={() => setStep(2)}
                    className="mt-8 w-full max-w-md h-12 bg-[#0A6BFF] hover:bg-blue-600 text-white shadow-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="flex flex-col items-center w-full"
                >
                  <button 
                    onClick={() => setStep(1)}
                    className="self-start -mt-4 mb-4 text-zinc-400 hover:text-zinc-700 p-2 flex items-center gap-2 text-sm font-bold"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  
                  <div className="w-full space-y-6">
                    {/* Render Meta Signup if any Meta channel is selected */}
                    {(selectedChannels.includes("whatsapp") || selectedChannels.includes("instagram") || selectedChannels.includes("facebook")) && (
                      <div className="border rounded-2xl p-6 bg-zinc-50/50">
                        <h3 className="text-lg font-bold text-zinc-900 mb-4">Connect Meta Accounts</h3>
                        <MetaEmbeddedSignup onSuccess={() => {}} />
                      </div>
                    )}
                    
                    {/* Render Phone Integration */}
                    {selectedChannels.includes("phone") && (
                      <div className="border rounded-2xl p-6 bg-zinc-50/50">
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Connect Voice Agent</h3>
                        <p className="text-sm text-zinc-500 mb-4">Purchase a phone number via Vapi/Twilio to start receiving AI voice calls.</p>
                        <button className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                          <BrandIcon id="phone" className="w-5 h-5 filter brightness-0 invert" /> Buy Phone Number
                        </button>
                      </div>
                    )}

                    {/* Render Calendar Integration */}
                    {selectedChannels.includes("calendar") && (
                      <div className="border rounded-2xl p-6 bg-zinc-50/50">
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Connect Google Calendar</h3>
                        <p className="text-sm text-zinc-500 mb-4">Allow Anaos AI to automatically schedule appointments from leads.</p>
                        <button className="w-full h-11 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm">
                          <BrandIcon id="calendar" className="w-5 h-5" /> Sign in with Google
                        </button>
                      </div>
                    )}

                    {/* Render Email Integration */}
                    {selectedChannels.includes("email") && (
                      <div className="border rounded-2xl p-6 bg-zinc-50/50">
                        <h3 className="text-lg font-bold text-zinc-900 mb-2">Connect Email Automation</h3>
                        <p className="text-sm text-zinc-500 mb-4">Connect your SMTP or Gmail account to send follow-ups.</p>
                        <button className="w-full h-11 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm">
                          <BrandIcon id="email" className="w-5 h-5" /> Connect Mailbox
                        </button>
                      </div>
                    )}
                    
                    {/* Render Generic Integrations (Any channel not handled explicitly above) */}
                    {selectedChannels.filter(c => !["whatsapp", "instagram", "facebook", "phone", "calendar", "email"].includes(c)).map(c => (
                      <div key={c} className="border rounded-2xl p-6 bg-zinc-50/50">
                        <h3 className="text-lg font-bold text-zinc-900 mb-2 capitalize">Connect {c}</h3>
                        <p className="text-sm text-zinc-500 mb-4">Authenticate your {c.charAt(0).toUpperCase() + c.slice(1)} account using OAuth or API Key.</p>
                        <button className="w-full h-11 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm">
                          <BrandIcon id={c} className="w-5 h-5" /> Connect {c.charAt(0).toUpperCase() + c.slice(1)}
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={handleComplete}
                      className="mt-6 w-full h-12 bg-[#0A6BFF] hover:bg-blue-600 text-white shadow-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      Complete Setup <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
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
              <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Setup Complete!</h2>
              <p className="text-zinc-500 text-center max-w-xs">
                Your channels are successfully connected. Let's head to your dashboard!
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
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
