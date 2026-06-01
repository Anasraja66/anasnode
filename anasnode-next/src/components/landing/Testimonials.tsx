"use client";

import { FadeIn, Section, SectionLabel } from "./Section";

const items = [
  {
    quote: "We used to chase every lead by hand. Anaos replies, qualifies and books the viewing before I open my laptop.",
    name: "Bilal Ahmed", role: "Principal Agent", company: "Marina Realty, Dubai",
  },
  {
    quote: "Orders moved to WhatsApp in a week. Our floor staff are back to looking after guests instead of taking phone orders.",
    name: "Sara Khan", role: "Owner", company: "Olive & Oak, Karachi",
  },
  {
    quote: "Appointments and reminders run themselves. No-shows dropped, and the front desk finally has time for patients.",
    name: "Dr. Imran Qureshi", role: "Clinic Director", company: "Lahore Health Center",
  },
];

export function Testimonials() {
  return (
    <Section id="customers" className="bg-muted/40">
      <FadeIn>
        <SectionLabel number="03">Customers</SectionLabel>
        <h2 className="mt-5 text-[28px] sm:text-[40px] font-semibold text-foreground tracking-tight leading-[1.1] max-w-2xl">
          Trusted by operators who couldn't hire fast enough.
        </h2>
      </FadeIn>
      <div className="mt-12 grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        {items.map((t, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <figure className="bg-card p-7 h-full flex flex-col">
              <blockquote className="text-[15px] text-foreground leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-7 pt-5 border-t border-border">
                <p className="text-[13.5px] font-medium text-foreground">{t.name}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{t.role} · {t.company}</p>
              </figcaption>
            </figure>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
