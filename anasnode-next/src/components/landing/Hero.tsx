"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PromptBox } from "./PromptBox";
import { ResultCard } from "./ResultCard";

export function Hero() {
  const [workspace, setWorkspace] = useState<any>(null);

  return (
    <section className="pt-16 sm:pt-24 pb-20 px-6 relative overflow-hidden bg-white">
      {/* High-Vibrancy Glowing Blur Blobs (Lovable Style) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Deep Sky Blue Blob (Top Right) */}
        <div className="absolute top-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#00B0FF] opacity-35 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Soft Blue Blob (Top Left) */}
        <div className="absolute top-[-25%] left-[-15%] w-[480px] h-[480px] rounded-full bg-[#3B82F6] opacity-30 blur-[100px]" />
        {/* Bright Hot Magenta Blob (Bottom Left) */}
        <div className="absolute bottom-[-20%] left-[-20%] w-[650px] h-[650px] rounded-full bg-[#FF007F] opacity-40 blur-[130px] animate-pulse" style={{ animationDuration: '10s' }} />
        {/* Bright Pink Blob (Bottom Right) */}
        <div className="absolute bottom-[-25%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#EC4899] opacity-30 blur-[110px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Heading (Lovable Style) */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-[44px] sm:text-[68px] lg:text-[76px] font-extrabold text-[#111827] tracking-[-0.04em] leading-[1.04]"
        >
          Build something Automated
        </motion.h1>

        {/* Subtitle (Lovable Style) */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-4 text-[16px] sm:text-[18.5px] text-[#4B5563] max-w-2xl mx-auto leading-relaxed font-semibold"
        >
          Create WhatsApp agents and operational workflows by chatting with AI
        </motion.p>

        {/* PromptBox – tight gap (Lovable Style) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-10"
        >
          <PromptBox onGenerate={setWorkspace} />
        </motion.div>

        {/* ResultCard Output (Centrally aligned) */}
        {workspace && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <ResultCard workspace={workspace} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
