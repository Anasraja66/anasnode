"use client";

import Link from "next/link";
import { ArrowLeft, Layers, Zap, Shield, Sparkles } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function AIAdoptionStackPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-[#0A6BFF]/20 selection:text-[#0A6BFF]">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Header Section */}
        <div className="max-w-5xl mx-auto px-6 mb-16 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 mb-8 transition-colors bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm hover:shadow">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-tight">
            The Complete <span className="text-[#0A6BFF]">AI Adoption Stack</span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to integrate, scale, and govern Artificial Intelligence across your entire organization seamlessly.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          
          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-[#0A6BFF] rounded-2xl flex items-center justify-center mb-6">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Unified Integration Layer</h3>
            <p className="text-zinc-600 leading-relaxed">
              Connect to 750+ business apps including Salesforce, HubSpot, and Slack. Our adoption stack standardizes data flow so your AI agents have the context they need without complex engineering.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Multi-Model Orchestration</h3>
            <p className="text-zinc-600 leading-relaxed">
              Don't get locked into one vendor. Route requests dynamically between OpenAI, Anthropic, Meta Llama, and your own fine-tuned models based on cost, speed, and privacy requirements.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Workflow Automation OS</h3>
            <p className="text-zinc-600 leading-relaxed">
              Move beyond chatbots. Build complex, multi-step deterministic workflows powered by AI logic gates. Let agents execute actions across your stack autonomously.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Enterprise Guardrails</h3>
            <p className="text-zinc-600 leading-relaxed">
              Built-in PII redaction, prompt injection filtering, and RBAC (Role-Based Access Control) ensures your AI deployments are secure, compliant, and ready for the enterprise.
            </p>
          </div>

        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-6 mt-20 text-center">
          <div className="bg-zinc-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0A6BFF] rounded-full blur-[120px] opacity-20 -mr-20 -mt-20"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to adopt AI the right way?</h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Stop stitching together APIs. Deploy AnaOS as your centralized AI infrastructure today.
            </p>
            <div className="flex items-center justify-center gap-4 relative z-10">
              <Link href="/signup" className="px-8 py-4 bg-[#0A6BFF] hover:bg-blue-500 text-white font-bold rounded-full transition-colors shadow-lg shadow-blue-500/25">
                Start Building Free
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-colors backdrop-blur-sm">
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
