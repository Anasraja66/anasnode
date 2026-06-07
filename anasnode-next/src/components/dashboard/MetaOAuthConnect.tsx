"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2, Info } from "lucide-react";

// --- Authentic Meta Brand SVGs ---
const FacebookLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.181 35.87C29.094 34.791 36 27.202 36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.442 5.811 15.526 13.652 17.471L14 34v-8.954H9.397v-5.285H14v-3.84c0-4.57 2.766-7.054 6.843-7.054 1.942 0 3.968.349 3.968.349v4.382h-2.235c-2.213 0-2.898 1.378-2.898 2.782v3.38H25l-1.022 5.285h-4.298v11.455c1.171.18 2.378.272 3.601.272.96 0 1.905-.084 2.83-.243l.07-.012z" />
  </svg>
);

const WhatsAppLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2.457c-7.465 0-13.543 6.077-13.543 13.543 0 2.385.626 4.717 1.808 6.77L2.457 29.543l6.953-1.825a13.435 13.435 0 0 0 6.59 1.722c7.464 0 13.543-6.078 13.543-13.543S23.465 2.457 16 2.457zm0 24.847a11.192 11.192 0 0 1-5.713-1.572l-.41-.243-4.24 1.113 1.134-4.135-.266-.423A11.172 11.172 0 0 1 4.72 16C4.72 9.78 9.78 4.72 16 4.72S27.28 9.78 27.28 16c0 6.222-5.06 11.28-11.28 11.28zm6.183-8.455c-.34-.17-2.008-.99-2.32-.1105-.31.114-.54.34-.73.662-.19.322-.38.36-.72.19-.34-.17-1.433-.528-2.73-1.686-1.01-.9-1.69-2.01-1.89-2.35-.19-.34-.02-.524.15-.694.15-.15.34-.397.51-.595.17-.198.23-.34.34-.567.11-.227.06-.425-.03-.595-.08-.17-.76-1.842-1.04-2.522-.27-.662-.55-.567-.76-.582-.19-.015-.41-.015-.63-.015s-.59.085-.9.425C9.43 11.28 8.5 12.16 8.5 13.974c0 1.814 1.13 3.57 1.29 3.782.15.212 2.58 3.94 6.25 5.526 2.87 1.247 3.51 1.218 4.14 1.162.63-.057 2.01-.822 2.29-1.616.28-.794.28-1.474.2-1.616-.08-.14-.31-.227-.65-.397z"/>
  </svg>
);

const InstagramLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3.123c4.183 0 4.677.016 6.33.091 1.528.07 2.358.324 2.91.538.733.284 1.256.626 1.805 1.176.55.55.892 1.072 1.176 1.805.215.552.468 1.382.538 2.91.076 1.652.091 2.146.091 6.33s-.015 4.678-.091 6.33c-.07 1.528-.323 2.358-.538 2.91-.284.733-.626 1.255-1.176 1.805-.55.55-1.072.892-1.805 1.176-.552.215-1.382.468-2.91.538-1.653.076-2.147.091-6.33.091s-4.677-.015-6.33-.091c-1.528-.07-2.358-.323-2.91-.538-.733-.284-1.255-.626-1.805-1.176-.55-.55-.892-1.072-1.176-1.805-.215-.552-.468-1.382-.538-2.91-.076-1.653-.091-2.147-.091-6.33s.015-4.677.091-6.33c.07-1.528.323-2.358.538-2.91.284-.733.626-1.256 1.176-1.805.55-.55 1.072-.892 1.805-1.176.552-.214 1.382-.467 2.91-.538 1.653-.075 2.147-.091 6.33-.091zm0-2.836c-4.253 0-4.786.018-6.455.094-1.666.076-2.802.34-3.797.727a7.618 7.618 0 0 0-2.732 1.78A7.625 7.625 0 0 0 1.235 5.62c-.387.994-.651 2.131-.727 3.797C.432 11.085.414 11.618.414 15.87c0 4.254.018 4.787.094 6.456.076 1.665.34 2.802.727 3.796.402 1.034.938 1.91 1.78 2.733.823.842 1.699 1.378 2.733 1.78.994.387 2.13.651 3.796.727 1.67.076 2.203.094 6.456.094 4.254 0 4.787-.018 6.456-.094 1.665-.076 2.802-.34 3.796-.727a7.619 7.619 0 0 0 2.733-1.78c.842-.823 1.378-1.699 1.78-2.732.387-.995.651-2.131.727-3.797.076-1.669.094-2.202.094-6.455 0-4.253-.018-4.786-.094-6.455-.076-1.666-.34-2.802-.727-3.797a7.615 7.615 0 0 0-1.78-2.732 7.625 7.625 0 0 0-2.733-1.78c-.994-.387-2.131-.651-3.796-.727-1.669-.076-2.202-.094-6.456-.094z"/>
    <path d="M16 7.575a8.295 8.295 0 1 0 0 16.59 8.295 8.295 0 0 0 0-16.59zM16 21.33A5.46 5.46 0 1 1 16 10.41a5.46 5.46 0 0 1 0 10.92z"/>
    <path d="M25.042 8.718a1.888 1.888 0 1 1-3.777 0 1.888 1.888 0 0 1 3.777 0z"/>
  </svg>
);

const MetaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.96 5.56C19.74 5.56 22 7.82 22 10.6c0 2.78-2.26 5.04-5.04 5.04-1.92 0-3.6-1.07-4.43-2.67-.83 1.6-2.51 2.67-4.43 2.67-2.78 0-5.04-2.26-5.04-5.04 0-2.78 2.26-5.04 5.04-5.04 1.92 0 3.6 1.07 4.43 2.67.83-1.6 2.51-2.67 4.43-2.67z" />
  </svg>
);

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
      <div className="w-full bg-white/70 backdrop-blur-sm border border-zinc-200/80 rounded-3xl p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.02)] flex flex-col items-center text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#1877F2]/20">
          <FacebookLogo className="w-11 h-11 text-[#1877F2]" />
        </div>
        
        <h2 className="text-[22px] font-extrabold text-zinc-900 mb-2 tracking-tight">Connect Meta Business</h2>
        <p className="text-[14.5px] text-zinc-500 mb-8 max-w-[320px] leading-relaxed">
          Link your WhatsApp, Instagram, and Facebook accounts in one click. No coding or Developer App required.
        </p>

        <button
          onClick={handleConnect}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white h-12 rounded-2xl font-bold text-[15px] transition-all shadow-[0_4px_14px_0_rgba(24,119,242,0.39)] hover:shadow-[0_6px_20px_rgba(24,119,242,0.23)] hover:brightness-105 active:scale-[0.98]"
        >
          <FacebookLogo className="w-5 h-5" />
          Continue with Facebook
        </button>
        
        <div className="flex items-center gap-2 text-[12px] text-zinc-400 mt-6 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-100">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>By connecting, you agree to Meta's Business Terms of Service.</span>
        </div>
      </div>

      {/* Simulated Authentic Meta OAuth Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-[2px] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative border border-zinc-200/50"
            >
              {/* Fake Browser Header (Mac style) */}
              <div className="h-14 bg-zinc-100/80 backdrop-blur-md border-b border-zinc-200/80 flex items-center px-4 relative">
                <div className="flex gap-2 absolute left-4">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="mx-auto flex items-center justify-center gap-2 bg-white px-6 py-1.5 rounded-lg text-[13px] text-zinc-600 font-medium border border-zinc-200 shadow-sm w-[60%]">
                  <span className="text-zinc-400">🔒</span> facebook.com
                </div>
              </div>

              <div className="p-8 min-h-[380px] flex flex-col bg-white">
                {step === 1 && (
                  <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                    <MetaLogo className="w-12 h-12 text-[#1877F2] animate-pulse mb-6" />
                    <Loader2 className="w-6 h-6 text-zinc-300 animate-spin absolute" />
                    <h3 className="font-bold text-zinc-900 text-lg mt-4">Connecting to Meta...</h3>
                    <p className="text-zinc-500 text-[14px]">Securely verifying your identity</p>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-white border border-zinc-200 shadow-sm rounded-full flex items-center justify-center relative overflow-hidden p-1">
                        <img src="https://api.dicebear.com/7.x/initials/svg?seed=AB&backgroundColor=1877F2" className="w-full h-full rounded-full" alt="Profile" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                           <FacebookLogo className="w-4 h-4 text-[#1877F2]" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-zinc-900 text-xl text-center mb-1 tracking-tight">Select your business</h3>
                    <p className="text-zinc-500 text-[14.5px] text-center mb-8">Choose the Meta Business assets to connect with Anaos</p>
                    
                    <div className="space-y-3">
                      <div 
                        onClick={handleSelectBusiness}
                        className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white cursor-pointer hover:border-[#1877F2] hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-xl font-bold border border-zinc-200 shadow-sm">
                            🏢
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-zinc-900 text-[15px]">My Business LLC</p>
                            <div className="flex items-center gap-2 mt-1">
                              {channels.includes("whatsapp") && <WhatsAppLogo className="w-3.5 h-3.5 text-[#25D366]" />}
                              {channels.includes("facebook") && <FacebookLogo className="w-3.5 h-3.5 text-[#1877F2]" />}
                              {channels.includes("instagram") && <InstagramLogo className="w-3.5 h-3.5 text-[#E4405F]" />}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-[#1877F2] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                    <div className="mt-auto pt-6 text-center">
                        <p className="text-[12px] text-zinc-400">By selecting, you give Anaos permission to manage pages and messages.</p>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-zinc-100" />
                      <div className="w-20 h-20 rounded-full border-4 border-[#1877F2] border-t-transparent animate-spin absolute inset-0" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MetaLogo className="w-8 h-8 text-[#1877F2]" />
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
                    <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="font-bold text-zinc-900 text-xl text-center mb-2 tracking-tight">Successfully Connected!</h3>
                    <p className="text-zinc-500 text-[15px] text-center">
                      Meta authorization complete. You can now close this window.
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
