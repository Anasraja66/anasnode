"use client";

/* ─── Footer link columns data ─── */
const footerColumns = [
  {
    title: "Company",
    links: [
      "About",
      "Careers",
      "Press & Media",
      "Contact",
      "Security",
      "Partners",
    ],
  },
  {
    title: "Product",
    links: [
      "Workflow Builder",
      "WhatsApp Agents",
      "AI Automation",
      "Integrations",
      "Templates",
      "Pricing",
    ],
  },
  {
    title: "Resources",
    links: [
      "Documentation",
      "API Reference",
      "Tutorials",
      "Blog",
      "Case Studies",
      "Community",
    ],
  },
  {
    title: "Legal",
    links: [
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
      "GDPR Compliance",
      "DPA",
      "Security Policy",
    ],
  },
  {
    title: "Connect",
    links: [
      "Discord",
      "X / Twitter",
      "LinkedIn",
      "YouTube",
      "GitHub",
      "Reddit",
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-white border-t border-zinc-100 overflow-hidden" suppressHydrationWarning>
      {/* Gemini-style Sky Blue & White background (Bottom) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[800px] opacity-80"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, #d6ebfc 0%, #ffffff 70%)'
          }}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-8 relative z-10">

        {/* ── Main grid: Logo left + columns right ── */}
        <div className="flex flex-col md:flex-row gap-12 mb-14">

          {/* Logo side */}
          <div className="shrink-0">
            <a href="#" className="inline-block">
              <span className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-200">
                <span className="text-white font-black text-sm italic">A</span>
              </span>
            </a>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-12 gap-y-8 flex-1">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h5 className="text-[13px] font-bold text-zinc-900 mb-5 uppercase tracking-wider">
                  {col.title}
                </h5>
                <ul className="space-y-3">
                  {col.links.map((label) => (
                    <li key={label}>
                      <a
                        href="#"
                        className="text-[13.5px] text-zinc-500 hover:text-blue-600 font-medium transition-colors duration-200"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Language selector ── */}
        <div className="flex items-center gap-1.5 text-[13px] text-zinc-400 mb-8 cursor-pointer hover:text-zinc-600 transition-colors w-fit font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          EN (English)
        </div>

        {/* ── Bottom bar ── */}
        <div className="h-px bg-zinc-100 mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-zinc-400 font-medium">
          <span>© {new Date().getFullYear()} Anaos Technologies Inc.</span>
          <span className="flex items-center gap-1.5">
            Built for operators with <span className="text-blue-500">AI</span>.
          </span>
        </div>
      </div>
    </footer>
  );
}
