import { FadeIn, Section, SectionLabel } from "./Section";

const variables = [
  { k: "BUDGET", v: "AED 2.2M" },
  { k: "LOCATION", v: "Dubai Marina" },
  { k: "BEDROOMS", v: "3" },
  { k: "LANGUAGE", v: "Arabic" },
];

const points = [
  "Cross-channel memory across WhatsApp, voice, and Instagram",
  "Automatic variable extraction from every conversation",
  "Confidence scoring so agents never act on stale context",
];

export function AnasMind() {
  return (
    <Section id="anasmind">
      <div className="grid md:grid-cols-2 gap-14 lg:gap-20 items-center">
        <FadeIn>
          <SectionLabel number="03">AnasMind</SectionLabel>
          <h2 className="mt-5 text-[28px] sm:text-[40px] font-semibold text-foreground tracking-tight leading-[1.1]">
            It remembers, so your customer doesn't repeat themselves.
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed max-w-md">
            A customer mentions their budget once. AnasMind pins it to their profile.
            Next conversation, on any channel, your agent already knows.
          </p>
          <ul className="mt-7 space-y-3.5">
            {points.map((p) => (
              <li key={p} className="flex items-baseline gap-3 text-[14px] text-foreground">
                <span className="w-1 h-1 rounded-full bg-foreground shrink-0 translate-y-[-3px]" />
                {p}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                anasmind / contact
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success" /> live
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-[13px] font-semibold">
                  AH
                </div>
                <div>
                  <p className="text-[14px] font-medium text-foreground">Ahmed Hassan</p>
                  <p className="text-[12px] text-muted-foreground font-mono">+971 50 ••• 4567</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                  Pinned variables
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {variables.map((v) => (
                    <div key={v.k} className="rounded-lg border border-border px-3 py-2.5">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{v.k}</p>
                      <p className="text-[13px] font-medium text-foreground mt-0.5">{v.v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-5 pt-4 border-t border-border text-[11px] text-muted-foreground font-mono">
                Last updated · WhatsApp · 2h ago
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
