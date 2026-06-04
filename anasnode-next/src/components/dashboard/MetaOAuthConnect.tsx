"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, MessageSquare as Facebook, Camera as Instagram, Loader2, Phone } from "lucide-react";

interface Props {
  onSuccess: () => void;
  channels: ("whatsapp" | "instagram" | "facebook")[];
}

export function MetaOAuthConnect({ onSuccess, channels }: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [step, setStep] = useState(0);

  const handleConnect = () => {
    setIsPopupOpen(true);
    setStep(1); // "Logging in..."
    setTimeout(() => {
      setStep(2); // "Select Business"
    }, 1500);
  };

  const handleSelectBusiness = () => {
    setStep(3); // "Linking channels..."
    setTimeout(() => {
      setStep(4); // Success
      setTimeout(() => {
        setIsPopupOpen(false);
        onSuccess();
      }, 1500);
    }, 2000);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-[#1877F2]/10 rounded-full flex items-center justify-center mb-6">
          <Facebook className="w-8 h-8 text-[#1877F2] fill-current" />
        </div>
        
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Connect Meta Business</h2>
        <p className="text-[14px] text-zinc-500 mb-8 max-w-sm">
          Link your WhatsApp, Instagram, and Facebook accounts in one click. No coding or Developer App required.
        </p>

        <button
          onClick={handleConnect}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white h-12 rounded-xl font-bold text-[15px] transition-all hover:shadow-md active:scale-[0.98]"
        >
          <Facebook className="w-5 h-5 fill-current" />
          Continue with Facebook
        </button>
        
        <p className="text-[12px] text-zinc-400 mt-4">
          By connecting, you agree to Meta's Business Terms of Service.
        </p>
      </div>

      {/* Simulated OAuth Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
            >
              {/* Fake Browser Header */}
              <div className="h-12 bg-[#F0F2F5] border-b border-[#E4E6EB] flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="ml-4 flex items-center gap-1.5 bg-white px-3 py-1 rounded-md text-[11px] text-zinc-500 font-mono border border-zinc-200">
                    <Facebook className="w-3 h-3 text-[#1877F2] fill-current" />
                    facebook.com/dialog/oauth
                  </div>
                </div>
              </div>

              <div className="p-8 min-h-[300px] flex flex-col">
                {step === 1 && (
                  <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                    <Loader2 className="w-10 h-10 text-[#1877F2] animate-spin mb-4" />
                    <h3 className="font-bold text-zinc-900 text-lg">Connecting to Meta...</h3>
                    <p className="text-zinc-500 text-[14px]">Securely verifying your identity</p>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
                        <img src="https://api.dicebear.com/7.x/initials/svg?seed=AB&backgroundColor=1877F2" className="w-16 h-16 rounded-full" alt="Profile" />
                      </div>
                    </div>
                    <h3 className="font-bold text-zinc-900 text-xl text-center mb-1">Select your business</h3>
                    <p className="text-zinc-500 text-[14px] text-center mb-6">Choose the assets to connect with Anaos</p>
                    
                    <div className="space-y-3">
                      <div 
                        onClick={handleSelectBusiness}
                        className="flex items-center justify-between p-4 rounded-xl border border-[#1877F2]/30 bg-[#1877F2]/5 cursor-pointer hover:border-[#1877F2] transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-200 overflow-hidden flex items-center justify-center text-lg font-bold text-zinc-500">
                            🏢
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-zinc-900 text-[14.5px]">My Business LLC</p>
                            <p className="text-[12px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                              {channels.includes("whatsapp") && <Phone className="w-3 h-3" />}
                              {channels.includes("facebook") && <Facebook className="w-3 h-3" />}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-[#1877F2] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                    <div className="relative">
                      <Loader2 className="w-12 h-12 text-[#1877F2] animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Facebook className="w-4 h-4 text-[#1877F2] fill-current" />
                      </div>
                    </div>
                    <h3 className="font-bold text-zinc-900 text-lg mt-6">Linking channels...</h3>
                    <p className="text-zinc-500 text-[14px] text-center max-w-[250px] mt-2">
                      Configuring webhooks and permissions for {channels.join(", ")}
                    </p>
                  </div>
                )}

                {step === 4 && (
                  <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-zinc-900 text-xl text-center mb-2">Successfully Connected!</h3>
                    <p className="text-zinc-500 text-[14px] text-center">
                      You can now close this window.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
