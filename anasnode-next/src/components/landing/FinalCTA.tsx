"use client";

import { useState } from "react";
import { FadeIn, Section } from "./Section";
import { PromptBox } from "./PromptBox";
import { ResultCard } from "./ResultCard";

export function FinalCTA() {
  const [workspace, setWorkspace] = useState<any>(null);

  return (
    <Section id="cta" className="relative pb-0 overflow-hidden">
      <FadeIn>
        <div className="relative z-10 text-center max-w-2xl mx-auto pt-16 sm:pt-24 pb-32 sm:pb-40">
          <p className="text-[14px] font-bold text-zinc-500 tracking-widest uppercase mb-4">
            All-In-One Automation OS
          </p>
          <h2 className="text-[40px] sm:text-[56px] font-semibold text-zinc-900 tracking-tight leading-[1.1]">
            Ready to automate?
          </h2>
          
          <div className="mt-12 relative z-20 flex justify-center w-full px-4">
            <div className="w-full max-w-[800px]">
              <PromptBox onGenerate={setWorkspace} compact />
            </div>
          </div>
          {workspace && (
            <div className="mt-8 relative z-20 px-4">
              <ResultCard workspace={workspace} />
            </div>
          )}
        </div>

        {/* Continuous Flowing Animated Gradient Glow at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[400px] pointer-events-none z-0 overflow-visible">
          {/* Main animated color blobs */}
          <div className="absolute bottom-[-150px] left-[-10%] right-[-10%] h-[400px] flex justify-center items-center opacity-60">
            <div className="absolute w-[60%] h-full bg-[#0A6BFF] blur-[100px] rounded-[100%] animate-blob mix-blend-multiply" />
            <div className="absolute w-[50%] h-[80%] bg-[#38BDF8] blur-[120px] rounded-[100%] translate-x-1/4 mix-blend-multiply opacity-80 animate-blob animation-delay-2000" />
            <div className="absolute w-[40%] h-[90%] bg-[#00D0FF] blur-[100px] rounded-[100%] -translate-x-1/4 mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
          </div>
          {/* Smooth fade-out to white at the top edge of the glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-white pointer-events-none" />
        </div>
      </FadeIn>
    </Section>
  );
}
