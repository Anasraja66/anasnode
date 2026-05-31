"use client";

import { FadeIn, Section, SectionLabel } from "./Section";

const steps = [
  { n: "01", title: "Describe", desc: "Write one sentence about what your business does. No jargon, no setup." },
  { n: "02", title: "Generate", desc: "AnasNode drafts the agents, CRM and flows that fit your operation." },
  { n: "03", title: "Go live", desc: "Connect WhatsApp, toggle the automations you want, start serving customers." },
];

export function HowItWorks() {
  return (
    <Section id="how">
      <FadeIn>
        <SectionLabel number="01">How it works</SectionLabel>
        <h2 className="mt-5 text-[28px] sm:text-[40px] font-semibold text-foreground tracking-tight leading-[1.1] max-w-2xl">
          From a sentence to a live workspace in under a minute.
        </h2>
      </FadeIn>

      <div className="mt-14 grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        {steps.map((s, i) => (
          <FadeIn key={s.n} delay={i * 0.08}>
            <div className="bg-card p-7 h-full">
              <span className="text-[11px] font-mono text-muted-foreground">{s.n}</span>
              <h3 className="mt-6 text-[18px] font-semibold text-foreground tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
