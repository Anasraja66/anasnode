"use client";

import type { IndustryPreset } from "@/lib/industry/presets";
import type { ReactNode } from "react";

export function IndustryShell({
  preset,
  children,
}: {
  preset: IndustryPreset;
  children: ReactNode;
}) {
  return (
    <div
      className="min-h-full industry-themed"
      data-industry={preset.id}
      style={
        {
          "--industry-primary": preset.primary,
          "--industry-primary-hover": preset.primaryHover,
          "--industry-accent": preset.accent,
          "--industry-soft-bg": preset.softBg,
          "--industry-soft-border": preset.softBorder,
          "--industry-gradient-from": preset.gradientFrom,
          "--industry-gradient-to": preset.gradientTo,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
