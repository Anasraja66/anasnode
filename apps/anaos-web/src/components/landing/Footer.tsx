import { AnaosLogo } from "@/components/ui/AnaosLogo";

/* ─── Footer link columns data ─── */
const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press & Media", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Workflow Builder", href: "#" },
      { label: "WhatsApp Agents", href: "#" },
      { label: "AI Automation", href: "#" },
      { label: "Integrations", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Tutorials", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Data Deletion", href: "/data-deletion" },
      { label: "Security Policy", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "X / Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-white/60 backdrop-blur-xl border-t border-zinc-200 overflow-hidden" suppressHydrationWarning>
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-8 relative z-10">

        {/* ── Main grid: Logo left + columns right ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-16">

          {/* Logo side */}
          <div className="shrink-0 flex flex-col items-start gap-4 lg:w-[280px]">
            <a href="#" className="flex items-center gap-2.5 group">
              <AnaosLogo className="w-10 h-10 transition-transform duration-300 group-hover:scale-[1.04]" />
              <span className="font-sans font-bold text-[22px] tracking-[0.02em] text-zinc-900">AnaOS</span>
            </a>
            <p className="text-[14px] text-zinc-600 font-medium leading-relaxed">
              The all-in-one automation OS for modern businesses. Build, deploy, and scale AI agents in minutes.
            </p>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-10 flex-1">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h5 className="text-[14px] font-bold text-zinc-900 mb-5 uppercase tracking-wider">
                  {col.title}
                </h5>
                <ul className="space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[14px] text-zinc-600 hover:text-[#0A6BFF] font-semibold transition-colors duration-200 block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Language selector ── */}
        <div className="flex items-center gap-2 text-[14px] text-zinc-500 mb-8 cursor-pointer hover:text-zinc-900 transition-colors w-fit font-bold">
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          EN (English)
        </div>

        {/* ── Bottom bar ── */}
        <div className="h-px bg-zinc-200 mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[14px] text-zinc-500 font-semibold">
          <span>© {new Date().getFullYear()} Anaos Technologies Inc.</span>
          <span className="flex items-center gap-1.5">
            Built for operators with <span className="text-[#0A6BFF] font-bold">AI</span>.
          </span>
        </div>
      </div>
    </footer>
  );
}
