import { useState } from "react";
import { FadeIn, Section } from "./Section";
import { PromptBox } from "./PromptBox";
import { ResultCard } from "./ResultCard";

export function FinalCTA() {
  const [industry, setIndustry] = useState<string | null>(null);
  return (
    <Section id="cta">
      <FadeIn>
        <div className="rounded-3xl border border-border bg-muted/40 px-6 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-[28px] sm:text-[40px] font-semibold text-foreground tracking-tight leading-[1.1]">
              Your business deserves an operator on every channel.
            </h2>
            <p className="mt-4 text-[15px] text-muted-foreground">
              Spin up a workspace in a single sentence. No card, no setup call.
            </p>
          </div>
          <div className="mt-10">
            <PromptBox onGenerate={setIndustry} compact />
          </div>
          {industry && <ResultCard industry={industry} />}
        </div>
      </FadeIn>
    </Section>
  );
}
