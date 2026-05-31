"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PromptBox } from "./PromptBox";
import { ResultCard } from "./ResultCard";

export function Hero() {
  const [industry, setIndustry] = useState<string | null>(null);

  return (
    <section className="pt-10 sm:pt-14 pb-14 px-6 relative">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-border/80 bg-muted/40 text-[11px] font-mono uppercase tracking-[0.06em] text-muted-foreground"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span>New · WhatsApp automations now live</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-5 text-[36px] sm:text-[52px] lg:text-[60px] font-semibold text-foreground tracking-[-0.03em] leading-[1.08]"
        >
          One prompt.<br />
          Your entire business, <span className="italic font-normal text-muted-foreground">automated.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-4 text-[15px] sm:text-[16px] text-muted-foreground max-w-xl mx-auto leading-relaxed"
        >
          Describe your business in one line. AnasNode assembles your WhatsApp agent,
          CRM and operational workflows in under a minute.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-7"
        >
          <PromptBox onGenerate={setIndustry} />
        </motion.div>

        {industry && <ResultCard industry={industry} />}
      </div>
    </section>
  );
}
