"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { WordRotator } from "@/components/landing/WordRotator";
import { PageData } from "@/lib/page-data";
import Link from "next/link";

export function DynamicPageTemplate({ data }: { data: PageData }) {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center pt-10 sm:pt-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="uppercase tracking-wider">{data.type}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
              {data.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {data.subtitle}
            </p>

            {/* Typewriter Box */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl p-4 sm:p-6 text-left flex items-center gap-3 h-16 sm:h-20">
                <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="text-zinc-600 text-sm sm:text-lg font-medium flex-1 overflow-hidden h-full flex items-center">
                  <WordRotator
                    words={data.typewriterExamples}
                    interval={4000}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-[#0A6BFF] hover:bg-blue-600 text-white rounded-xl font-semibold text-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(10,107,255,0.25)] flex items-center justify-center gap-2 group"
              >
                {data.ctaText || "Get Started for Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features & Benefits Split */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-32">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-8">Core Features</h2>
              <div className="space-y-8">
                {data.features.map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900 mb-1">{feature.title}</h3>
                      <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-50 rounded-3xl p-8 sm:p-10 border border-zinc-100"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-8">Why it matters</h2>
              <div className="space-y-6">
                {data.benefits.map((benefit, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-base font-semibold text-zinc-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
