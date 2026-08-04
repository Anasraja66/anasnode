import { AnaosLogo } from "@/components/ui/AnaosLogo";

/* ─── Footer link columns data ─── */
const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Workflow Builder", href: "/dashboard/automations" },
      { label: "Integrations", href: "/dashboard/integrations" },
      { label: "AI Automation", href: "/automations/ai-helpdesk-support-bot" },
      { label: "Pricing", href: "/pricing" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Automations",
    links: [
      { label: "WhatsApp Responder", href: "/automations/whatsapp-lead-responder" },
      { label: "Cart Recovery", href: "/automations/abandoned-cart-recoverer" },
      { label: "Appointment Reminders", href: "/automations/appointment-reminders" },
      { label: "Google Reviews", href: "/automations/google-reviews-collector" },
      { label: "AI Helpdesk Bot", href: "/automations/ai-helpdesk-support-bot" },
      { label: "Billing & Stripe Sync", href: "/automations/billing-stripe-sync" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "E-commerce & Retail", href: "/industries/e-commerce-and-retail" },
      { label: "Real Estate", href: "/industries/real-estate-and-agencies" },
      { label: "Healthcare", href: "/industries/healthcare-and-wellness" },
      { label: "Restaurants & Food", href: "/industries/restaurants-and-food" },
      { label: "Logistics & Dispatch", href: "/industries/logistics-and-dispatch" },
      { label: "SaaS & Tech Startups", href: "/industries/saas-and-tech-startups" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/resources/documentation" },
      { label: "API Reference", href: "/resources/api-reference" },
      { label: "Templates", href: "/resources/templates" },
      { label: "Help Center", href: "/resources/help-center" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Data Deletion", href: "/data-deletion" },
      { label: "AI Governance (UK)", href: "/ai-governance" },
      { label: "Contact Us", href: "/contact" },
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
                        {link.label === "AI Governance (UK)" && (
                          <span className="ml-1.5 text-[10px] font-bold bg-blue-100 text-[#0A6BFF] px-1.5 py-0.5 rounded-full align-middle">UK Gov</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="h-px bg-zinc-200 mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[14px] text-zinc-500 font-semibold">
          <span>© {new Date().getFullYear()} Anas Technologies Ltd. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built for every <span className="text-[#0A6BFF] font-bold">technology</span>. 🇬🇧
          </span>
        </div>
      </div>
    </footer>
  );
}
