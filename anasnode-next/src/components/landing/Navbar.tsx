"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#how", label: "How it works" },
  { href: "#industries", label: "Industries" },
  { href: "#customers", label: "Customers" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-strong border-b border-border shadow-[0_1px_3px_0_oklch(0_0_0/0.04)]"
            : "bg-background/60 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
            <span className="w-5 h-5 rounded-[5px] bg-foreground flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-[2px] bg-primary" />
            </span>
            Anaos
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-muted-foreground">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button className="hidden sm:inline-flex h-8 px-3 items-center text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Log in
            </button>
            <button className="hidden sm:inline-flex h-8 px-4 rounded-full bg-foreground text-background text-[13px] font-medium hover:opacity-90 transition-opacity cursor-pointer">
              Get started
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex items-center justify-center w-8 h-8 text-foreground cursor-pointer"
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
              className="fixed inset-0 z-[60] bg-foreground/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-background border-l border-border shadow-xl"
            >
              <div className="flex items-center justify-between px-6 h-14 border-b border-border">
                <span className="text-[15px] font-semibold text-foreground">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="px-6 py-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 text-[15px] text-foreground hover:text-muted-foreground transition-colors border-b border-border/50"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="px-6 pt-2 flex flex-col gap-2">
                <button className="h-10 text-[14px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  Log in
                </button>
                <button className="h-10 rounded-full bg-foreground text-background text-[14px] font-medium hover:opacity-90 transition-opacity cursor-pointer">
                  Get started
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
