"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Users, ArrowRight, MessageSquare, BookOpen, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center pt-10 sm:pt-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              <span className="uppercase tracking-wider">Community</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
              Join the AnaOS Community
            </h1>
            
            <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with thousands of automation experts, share your workflows, and learn how to scale your operations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#"
                className="w-full sm:w-auto px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-semibold text-lg transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(88,101,242,0.25)] flex items-center justify-center gap-2 group"
              >
                <MessageSquare className="w-5 h-5" />
                Join our Discord
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-32">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Learn Together</h3>
              <p className="text-zinc-600">Discover new automation strategies and get feedback on your workflows from experienced users.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-6">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Network</h3>
              <p className="text-zinc-600">Find partners, hire automation experts, or offer your own services to the community.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-3">Direct Support</h3>
              <p className="text-zinc-600">Get direct access to the AnaOS core team for feature requests and bug reports.</p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
