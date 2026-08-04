"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { AnaosLogo } from "@/components/ui/AnaosLogo";


export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"platform" | "industries" | "resources" | null>(null);

  // Mobile navigation expansion state
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);
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

  // Platform Features data
  const platformFeatures = [
    { label: "AI Adoption Stack", href: "/platform/ai-adoption-stack" },
    { label: "AI Agents", href: "/platform/ai-agents" },
    { label: "Control & Governance", href: "/ai-governance" },
    { label: "Deployment & Cost", href: "/platform/deployment-cost" },
  ];

  const platformIntegrations = [
    { label: "Gmail", icon: "https://img.icons8.com/fluency/48/new-post.png", href: "/dashboard/integrations" },
    { label: "OpenAI", icon: "https://img.icons8.com/color/48/chatgpt.png", href: "/dashboard/integrations" },
    { label: "Slack", icon: "https://img.icons8.com/color/48/slack-new.png", href: "/dashboard/integrations" },
    { label: "Notion", icon: "https://img.icons8.com/color/48/notion--v1.png", href: "/dashboard/integrations" },
    { label: "HubSpot", icon: "https://cdn.simpleicons.org/hubspot/ff7a59", href: "/dashboard/integrations" },
  ];

  // Industries data
  const industries = [
    { label: "E-commerce & Retail", href: "/industries/e-commerce-and-retail" },
    { label: "Real Estate & Agencies", href: "/industries/real-estate-and-agencies" },
    { label: "Healthcare & Wellness", href: "/industries/healthcare-and-wellness" },
    { label: "Restaurants & Food", href: "/industries/restaurants-and-food" },
    { label: "Logistics & Dispatch", href: "/industries/logistics-and-dispatch" },
    { label: "SaaS & Tech Startups", href: "/industries/saas-and-tech-startups" },
  ];

  // Resources data
  const resources = [
    { label: "Docs", href: "/resources/documentation" },
    { label: "Support Forum", href: "/community" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "Discord", href: "https://discord.com" },
  ];

  return (
    <>
      <header
        suppressHydrationWarning
        className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[96%] max-w-[1200px]`}
      >
        <div suppressHydrationWarning className={`w-full h-14 sm:h-16 rounded-[2rem] flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border border-zinc-200/80' : 'bg-white/90 backdrop-blur-sm border border-zinc-200/50'}`}>
          
          {/* Logo Section */}
          <div className="relative flex items-center h-full rounded-l-[2rem] pl-6 sm:pl-8 pr-4">
            <Link href="/" className="flex items-center gap-2.5 group z-10">
              <AnaosLogo className="w-10 h-10 sm:w-11 sm:h-11 transition-transform duration-300 group-hover:scale-[1.04]" />
              <span className="font-sans font-bold text-[18px] tracking-[0.02em] text-zinc-900 hidden sm:block">
                AnaOS
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-between pl-4 sm:pl-8 pr-2 sm:pr-3">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-[14px] text-zinc-600 font-medium">
              
              {/* Platform Dropdown */}
              <div 
                className="relative py-4 cursor-pointer"
                onMouseEnter={() => setActiveDropdown("platform")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 hover:text-[#0A6BFF] transition-colors focus:outline-none">
                  Platform
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "platform" ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === "platform" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-[44px] w-[560px] bg-white rounded-xl border border-zinc-200/80 shadow-xl p-6 z-50 flex gap-8"
                    >
                      {/* Left Column - Platform Features */}
                      <div className="flex-1 flex flex-col gap-1 border-r border-zinc-100 pr-6">
                        {platformFeatures.map((item) => (
                          <Link 
                            key={item.label}
                            href={item.href} 
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                          >
                            <div className="w-1.5 h-1.5 bg-zinc-700 rounded-sm group-hover:bg-[#0A6BFF] transition-colors"></div>
                            <span className="text-[14px] font-semibold text-zinc-900 group-hover:text-[#0A6BFF] transition-colors">{item.label}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Right Column - Integrations */}
                      <div className="w-[220px] flex flex-col">
                        <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3 px-2">
                          756+ INTEGRATIONS
                        </div>
                        <div className="flex flex-col gap-1 mb-3">
                          {platformIntegrations.map((integration) => (
                            <Link 
                              key={integration.label}
                              href={integration.href} 
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors"
                            >
                              <img src={integration.icon} alt={integration.label} className="w-4 h-4 object-contain" />
                              <span className="text-[13px] font-medium text-zinc-700">{integration.label}</span>
                            </Link>
                          ))}
                        </div>
                        <Link 
                          href="/dashboard/integrations" 
                          onClick={() => setActiveDropdown(null)}
                          className="px-2 text-[12px] font-semibold text-[#0A6BFF] hover:underline flex items-center gap-1"
                        >
                          View all <ChevronDown className="w-3 h-3 -rotate-90" />
                        </Link>
                      </div>
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
                <button className="flex items-center gap-1.5 hover:text-[#0A6BFF] transition-colors focus:outline-none">
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
                      className="absolute left-0 top-[44px] w-[240px] bg-white rounded-xl border border-zinc-200/80 shadow-xl p-3 z-50 flex flex-col gap-1"
                    >
                      {industries.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                        >
                          <div className="w-1.5 h-1.5 bg-zinc-700 rounded-sm group-hover:bg-[#0A6BFF] transition-colors"></div>
                          <span className="text-[14px] font-semibold text-zinc-900 group-hover:text-[#0A6BFF] transition-colors">{item.label}</span>
                        </Link>
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
                <button className="flex items-center gap-1.5 hover:text-[#0A6BFF] transition-colors focus:outline-none">
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
                      className="absolute left-0 top-[44px] w-[200px] bg-white rounded-xl border border-zinc-200/80 shadow-xl p-3 z-50 flex flex-col gap-1"
                    >
                      {resources.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                        >
                          <div className="w-1.5 h-1.5 bg-zinc-700 rounded-sm group-hover:bg-[#0A6BFF] transition-colors"></div>
                          <span className="text-[14px] font-semibold text-zinc-900 group-hover:text-[#0A6BFF] transition-colors">{item.label}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/community" className="hover:text-[#0A6BFF] transition-colors">
                Community
              </Link>
              <Link href="/pricing" className="hover:text-[#0A6BFF] transition-colors">
                Pricing
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-5 ml-auto">
              <Link 
                href="/login" 
                className="hidden sm:inline-flex items-center text-[14px] font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                Log in
              </Link>
              <Link 
                href="/signup" 
                className="hidden sm:inline-flex h-[40px] px-6 rounded-[20px] bg-[#0A6BFF] text-white text-[14px] font-semibold hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center shadow-sm"
              >
                Get started
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 text-zinc-900 cursor-pointer focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
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
                  {/* Platform Mobile */}
                  <div>
                    <button
                      onClick={() => setMobilePlatformOpen(!mobilePlatformOpen)}
                      className="w-full py-3 flex items-center justify-between text-[14.5px] font-semibold text-zinc-800 border-b border-zinc-50"
                    >
                      Platform
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobilePlatformOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobilePlatformOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-zinc-50/50 rounded-lg px-3 py-3 mt-1 grid gap-4"
                        >
                          <div className="flex flex-col gap-2">
                            {platformFeatures.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2.5 py-1 text-[13.5px] text-zinc-800 font-semibold"
                              >
                                <div className="w-1 h-1 bg-zinc-800 rounded-sm"></div>
                                {item.label}
                              </Link>
                            ))}
                          </div>
                          <div className="pt-3 border-t border-zinc-200/60">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                              756+ INTEGRATIONS
                            </div>
                            <div className="flex flex-col gap-2.5">
                              {platformIntegrations.map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-2.5 text-[13px] text-zinc-600 font-medium"
                                >
                                  <img src={item.icon} alt={item.label} className="w-4 h-4 object-contain" />
                                  {item.label}
                                </Link>
                              ))}
                              <Link
                                href="/dashboard/integrations"
                                onClick={() => setMobileOpen(false)}
                                className="text-[12px] font-semibold text-[#0A6BFF] hover:underline flex items-center gap-1 mt-1"
                              >
                                View all <ChevronDown className="w-3 h-3 -rotate-90" />
                              </Link>
                            </div>
                          </div>
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
                          className="overflow-hidden bg-zinc-50/50 rounded-lg px-3 py-3 mt-1 flex flex-col gap-2"
                        >
                          {industries.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2.5 py-1 text-[13.5px] text-zinc-800 font-semibold"
                            >
                              <div className="w-1 h-1 bg-zinc-800 rounded-sm"></div>
                              {item.label}
                            </Link>
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
                          className="overflow-hidden bg-zinc-50/50 rounded-lg px-3 py-3 mt-1 flex flex-col gap-2"
                        >
                          {resources.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2.5 py-1 text-[13.5px] text-zinc-800 font-semibold"
                            >
                              <div className="w-1 h-1 bg-zinc-800 rounded-sm"></div>
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    href="/community"
                    onClick={() => setMobileOpen(false)}
                    className="py-3.5 text-[14.5px] font-semibold text-zinc-800 border-b border-zinc-50"
                  >
                    Community
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="py-3.5 text-[14.5px] font-semibold text-zinc-800 border-b border-zinc-50"
                  >
                    Pricing
                  </Link>
                </nav>
              </div>

              {/* Actions Mobile */}
              <div className="px-6 py-6 border-t border-zinc-100 flex flex-col gap-2.5 bg-zinc-50/30">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="h-10 rounded-lg border border-zinc-200 bg-white text-[14px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center cursor-pointer"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="h-10 rounded-lg bg-[#0A6BFF] text-white text-[14px] font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                >
                  Get started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
