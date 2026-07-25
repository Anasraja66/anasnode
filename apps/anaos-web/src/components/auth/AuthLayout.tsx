"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AnaosLogo } from "@/components/ui/AnaosLogo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  cardMaxWidth?: string;
  cardRadius?: string;
  cardBorderColor?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
  cardMaxWidth = "480px",
  cardRadius = "32px",
  cardBorderColor = "#C2C6D8",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Video Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          src="/hero-video-25.mp4"
        />
        {/* Soft overlay to ensure readability */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
      </div>

      {/* Premium minimal background grid over video */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#0A6BFF] opacity-[0.08] blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8 w-full z-10"
      >
        <Link href="/" className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-sm border border-zinc-200/80 mb-6 group hover:shadow-md transition-all">
          <AnaosLogo className="w-14 h-14 transform group-hover:scale-110 transition-transform" />
        </Link>
        <h1 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-zinc-900 mb-2">{title}</h1>
        <p className="text-[14px] sm:text-[15px] text-zinc-500 font-medium">{subtitle}</p>
      </motion.div>

      {/* Login Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 bg-white w-full"
        style={{
          maxWidth: cardMaxWidth,
          borderRadius: cardRadius,
          border: `1px solid ${cardBorderColor}`,
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.04)"
        }}
      >
        {children}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center z-10"
      >
        <p className="text-[14px] text-zinc-500 font-medium">
          {footerText}{" "}
          <Link href={footerLinkHref} className="text-[#0A6BFF] hover:text-blue-600 font-bold transition-colors">
            {footerLinkText}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
