import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 sm:py-28 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
      <span className="text-foreground">{number}</span>
      <span className="w-6 h-px bg-border" />
      <span>{children}</span>
    </div>
  );
}
