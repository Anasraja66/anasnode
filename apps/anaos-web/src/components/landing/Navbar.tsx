"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ChevronDown, 
  BookOpen, 
  Terminal, 
  HelpCircle, 
  Layers, 
  Database, 
  ShoppingCart, 
  Star, 
  MessageSquare, 
  FileText, 
  Bell,
  Building2,
  ShoppingBag,
  Heart,
  Coffee,
  Truck,
  Sparkles
} from "lucide-react";

/* ─── Anaos SVG Logo (Recreated from image) ─── */
export function AnaosLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded Triangle Base */}
      <path
        d="M44.8 11.5C47.1 7.6 52.9 7.6 55.2 11.5L92.7 74.5C95 78.4 92.1 83.3 87.5 83.3H12.5C7.9 83.3 5 78.4 7.3 74.5L44.8 11.5Z"
        fill="#00B0FF"
      />
      {/* Left trace */}
      <path
        d="M30 71L46.5 24"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="30" cy="71" r="5" fill="white" />
      <circle cx="46.5" cy="24" r="5" fill="white" />

      {/* Middle trace */}
      <path
        d="M48 71L58.5 41"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="48" cy="71" r="5" fill="white" />
      <circle cx="58.5" cy="41" r="5" fill="white" />

      {/* Right trace */}
      <path
        d="M66 71L73.5 52L81 71"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="66" cy="71" r="5" fill="white" />
      <circle cx="73.5" cy="52" r="5" fill="white" />
      <circle cx="81" cy="71" r="5" fill="white" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"automations" | "industries" | "resources" | null>(null);

  // Mobile navigation expansion state
  const [mobileAutomationsOpen, setMobileAutomationsOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Automations data (Directly maps to the templates in Industries.tsx)
  const automations = [
    { label: "WhatsApp Lead Responder", desc: "Qualify leads & sync to Sheets/CRM", icon: <Database className="w-4 h-4 text-sky-500" /> },
    { label: "Abandoned Cart Recoverer", desc: "WhatsApp & SMS checkout reminders", icon: <ShoppingCart className="w-4 h-4 text-rose-500" /> },
    { label: "Google Reviews Collector", desc: "Auto-request post-purchase 5-star ratings", icon: <Star className="w-4 h-4 text-amber-500" /> },
    { label: "AI Helpdesk Support Bot", desc: "24/7 automated FAQ response on WhatsApp", icon: <MessageSquare className="w-4 h-4 text-emerald-500" /> },
    { label: "Billing & Stripe Sync", desc: "Auto-send PDF invoices to paid clients", icon: <FileText className="w-4 h-4 text-indigo-500" /> },
    { label: "Appointment Reminders", desc: "Reduce no-shows with scheduling alerts", icon: <Bell className="w-4 h-4 text-pink-500" /> },
  ];

  // Industries data
  const industries = [
    { label: "E-commerce & Retail", desc: "Checkout drops & review boosters", icon: <ShoppingBag className="w-4 h-4 text-rose-500" /> },
    { label: "Real Estate & Agencies", desc: "Buyer prequalification & touring schedules", icon: <Building2 className="w-4 h-4 text-amber-500" /> },
    { label: "Healthcare & Wellness", desc: "Patient reminders & followup campaigns", icon: <Heart className="w-4 h-4 text-emerald-500" /> },
    { label: "Restaurants & Food", desc: "Digital interactive menus & table bookings", icon: <Coffee className="w-4 h-4 text-sky-500" /> },
    { label: "Logistics & Dispatch", desc: "Shipping alerts & instant invoice triggers", icon: <Truck className="w-4 h-4 text-indigo-500" /> },
    { label: "SaaS & Tech Startups", desc: "Onboarding workflows & webhook routing", icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
  ];

  // Resources data
  const resources = [
    { label: "Documentation", desc: "Quickstart guides & workflow setups", icon: <BookOpen className="w-4 h-4 text-zinc-500" /> },
    { label: "API Reference", desc: "Integrate Anaos into your systems", icon: <Terminal className="w-4 h-4 text-blue-500" /> },
    { label: "Templates", desc: "Pre-built WhatsApp & CRM automation flows", icon: <Layers className="w-4 h-4 text-purple-500" /> },
    { label: "Help Center", desc: "FAQs, chat support, and documentation", icon: <HelpCircle className="w-4 h-4 text-teal-500" /> },
  ];

  return (
    <>
      <header
        suppressHydrationWarning
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-strong border-b border-zinc-200 shadow-sm"
            : "bg-white/50 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div suppressHydrationWarning className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          
          {/* Logo & Name */}
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2.5 group">
              <AnaosLogo className="w-7 h-7 transition-transform duration-300 group-hover:scale-[1.04]" />
              <span className="font-sans font-semibold text-[17px] tracking-[0.03em] text-[#111827]">
                ANAOS
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-[13.5px] text-[#4B5563] font-medium">
              
              {/* Automations Dropdown */}
              <div 
                className="relative py-4 cursor-pointer"
                onMouseEnter={() => setActiveDropdown("automations")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 hover:text-[#111827] transition-colors focus:outline-none">
                  Automations
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "automations" ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === "automations" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-[44px] w-[560px] bg-white rounded-xl border border-zinc-200/80 shadow-lg p-3.5 z-50 grid grid-cols-2 gap-2"
                    >
                      {automations.map((item) => (
                        <a
                          key={item.label}
                          href="#"
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors"
                        >
                          <span className="mt-0.5 p-1 rounded-md bg-zinc-50 border border-zinc-200/40">
                            {item.icon}
                          </span>
                          <div>
                            <div className="text-[13px] font-semibold text-[#111827]">{item.label}</div>
                            <div className="text-[11px] text-zinc-500 leading-normal mt-0.5">{item.desc}</div>
                          </div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Industries Dropdown */}
              <div 
                className="relative py-4 cursor-pointer"
                onMouseEnter={() => setActiveDropdown("industries")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 hover:text-[#111827] transition-colors focus:outline-none">
                  Industries
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "industries" ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === "industries" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-[44px] w-[560px] bg-white rounded-xl border border-zinc-200/80 shadow-lg p-3.5 z-50 grid grid-cols-2 gap-2"
                    >
                      {industries.map((item) => (
                        <a
                          key={item.label}
                          href="#industries"
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors"
                        >
                          <span className="mt-0.5 p-1 rounded-md bg-zinc-50 border border-zinc-200/40">
                            {item.icon}
                          </span>
                          <div>
                            <div className="text-[13px] font-semibold text-[#111827]">{item.label}</div>
                            <div className="text-[11px] text-zinc-500 leading-normal mt-0.5">{item.desc}</div>
                          </div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resources Dropdown */}
              <div 
                className="relative py-4 cursor-pointer"
                onMouseEnter={() => setActiveDropdown("resources")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 hover:text-[#111827] transition-colors focus:outline-none">
                  Resources
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "resources" ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === "resources" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-[44px] w-[280px] bg-white rounded-xl border border-zinc-200/80 shadow-lg p-2.5 z-50 grid gap-1"
                    >
                      {resources.map((item) => (
                        <a
                          key={item.label}
                          href="#"
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors"
                        >
                          <span className="mt-0.5 p-1 rounded-md bg-zinc-50 border border-zinc-200/40">
                            {item.icon}
                          </span>
                          <div>
                            <div className="text-[13px] font-semibold text-[#111827]">{item.label}</div>
                            <div className="text-[11px] text-zinc-500 mt-0.5 leading-normal">{item.desc}</div>
                          </div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="#" className="hover:text-[#111827] transition-colors">
                Community
              </a>
              <a href="#" className="hover:text-[#111827] transition-colors">
                Pricing
              </a>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            <a 
              href="/login" 
              className="hidden sm:inline-flex h-8 px-4 items-center text-[13.5px] font-semibold text-[#4B5563] hover:text-[#111827] transition-colors cursor-pointer"
            >
              Log in
            </a>
            <a 
              href="/signup" 
              className="hidden sm:inline-flex h-8.5 px-4.5 rounded-lg bg-[#0A6BFF] text-white text-[13.5px] font-semibold hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center shadow-sm"
            >
              Get started
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex items-center justify-center w-8 h-8 text-foreground cursor-pointer focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-white border-l border-zinc-100 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between px-6 h-14 border-b border-zinc-100">
                  <span className="text-[14.5px] font-bold text-zinc-900 uppercase tracking-wider">Navigation</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 cursor-pointer focus:outline-none"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="px-5 py-4 flex flex-col gap-0.5">
                  {/* Automations Mobile */}
                  <div>
                    <button
                      onClick={() => setMobileAutomationsOpen(!mobileAutomationsOpen)}
                      className="w-full py-3 flex items-center justify-between text-[14.5px] font-semibold text-zinc-800 border-b border-zinc-50"
                    >
                      Automations
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAutomationsOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobileAutomationsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-zinc-50/50 rounded-lg px-2 py-1.5 mt-1 grid gap-1.5"
                        >
                          {automations.map((item) => (
                            <a
                              key={item.label}
                              href="#"
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2.5 py-1.5 px-2 text-[13px] text-zinc-600 font-medium"
                            >
                              {item.icon}
                              {item.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Industries Mobile */}
                  <div>
                    <button
                      onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
                      className="w-full py-3 flex items-center justify-between text-[14.5px] font-semibold text-zinc-800 border-b border-zinc-50"
                    >
                      Industries
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileIndustriesOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobileIndustriesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-zinc-50/50 rounded-lg px-2 py-1.5 mt-1 grid gap-1.5"
                        >
                          {industries.map((item) => (
                            <a
                              key={item.label}
                              href="#industries"
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2.5 py-1.5 px-2 text-[13px] text-zinc-600 font-medium"
                            >
                              {item.icon}
                              {item.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Resources Mobile */}
                  <div>
                    <button
                      onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                      className="w-full py-3 flex items-center justify-between text-[14.5px] font-semibold text-zinc-800 border-b border-zinc-50"
                    >
                      Resources
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileResourcesOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobileResourcesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-zinc-50/50 rounded-lg px-2 py-1.5 mt-1 grid gap-1.5"
                        >
                          {resources.map((item) => (
                            <a
                              key={item.label}
                              href="#"
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2.5 py-1.5 px-2 text-[13px] text-zinc-600 font-medium"
                            >
                              {item.icon}
                              {item.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <a
                    href="#"
                    onClick={() => setMobileOpen(false)}
                    className="py-3.5 text-[14.5px] font-semibold text-zinc-800 border-b border-zinc-50"
                  >
                    Community
                  </a>
                  <a
                    href="#"
                    onClick={() => setMobileOpen(false)}
                    className="py-3.5 text-[14.5px] font-semibold text-zinc-800 border-b border-zinc-50"
                  >
                    Pricing
                  </a>
                </nav>
              </div>

              {/* Actions Mobile */}
              <div className="px-6 py-6 border-t border-zinc-100 flex flex-col gap-2.5 bg-zinc-50/30">
                <a
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="h-10 rounded-lg border border-zinc-200 bg-white text-[14px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center cursor-pointer"
                >
                  Log in
                </a>
                <a
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="h-10 rounded-lg bg-[#0A6BFF] text-white text-[14px] font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                >
                  Get started
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
