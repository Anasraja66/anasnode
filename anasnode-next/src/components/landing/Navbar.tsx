"use client";

import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-background/85 backdrop-blur-md transition-colors ${
        scrolled ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
          <span className="w-5 h-5 rounded-[5px] bg-foreground flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-[2px] bg-primary" />
          </span>
          AnasNode
        </a>
        <nav className="hidden md:flex items-center gap-7 text-[13px] text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#industries" className="hover:text-foreground transition-colors">Industries</a>
          <a href="#customers" className="hover:text-foreground transition-colors">Customers</a>
        </nav>
        <div className="flex items-center gap-1">
          <button className="hidden sm:inline-flex h-8 px-3 items-center text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </button>
          <button className="h-8 px-3.5 rounded-md bg-foreground text-background text-[13px] font-medium hover:opacity-90 transition-opacity">
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
