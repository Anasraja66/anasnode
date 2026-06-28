import { useState } from "react";
import { motion } from "framer-motion";
import { PromptBox } from "./PromptBox";
import { ResultCard } from "./ResultCard";

export function Hero() {
  const [industry, setIndustry] = useState<string | null>(null);

  return (
    <section className="pt-16 sm:pt-24 pb-20 px-6 relative">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          New · AnasMind memory now in beta
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-7 text-[36px] sm:text-[56px] lg:text-[64px] font-semibold text-foreground tracking-[-0.02em] leading-[1.02]"
        >
          One prompt.<br />
          Your entire business, <span className="italic font-normal text-muted-foreground">automated.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-6 text-[15px] sm:text-[17px] text-muted-foreground max-w-xl mx-auto leading-relaxed"
        >
          Describe your business in one line. AnasNode assembles your WhatsApp agent,
          CRM and operational workflows in under a minute.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-10"
        >
          <PromptBox onGenerate={setIndustry} />
        </motion.div>

        {industry && <ResultCard industry={industry} />}
      </div>
    </section>
  );
}
