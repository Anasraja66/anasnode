"use client";

import Link from "next/link";
import { ArrowLeft, Cloud, Server, CreditCard, BarChart } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function DeploymentCostPage() {
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
            Flexible <span className="text-[#0A6BFF]">Deployment</span> & Transparent <span className="text-emerald-500">Costs</span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
            Scale your AI operations predictably. Choose how you deploy AnaOS and only pay for the compute and actions you actually use.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          
          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-[#0A6BFF] rounded-2xl flex items-center justify-center mb-6">
              <Cloud className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Fully Managed Cloud</h3>
            <p className="text-zinc-600 leading-relaxed">
              Our standard offering. Hosted securely on Google Cloud (London/EU regions available). Zero maintenance, automatic scaling, and 99.99% uptime SLA for your mission-critical agents.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-zinc-100 text-zinc-700 rounded-2xl flex items-center justify-center mb-6">
              <Server className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">On-Premise / VPC Deployment</h3>
            <p className="text-zinc-600 leading-relaxed">
              For enterprises with strict data residency requirements. Deploy the entire AnaOS stack within your own AWS, Azure, or GCP Virtual Private Cloud. Keep all data behind your firewall.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <CreditCard className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Pay-As-You-Go Billing</h3>
            <p className="text-zinc-600 leading-relaxed">
              No hidden seat licenses. You pay a flat platform fee plus usage costs based on LLM tokens processed and workflow actions executed. Perfect alignment with your ROI.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <BarChart className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Granular Cost Analytics</h3>
            <p className="text-zinc-600 leading-relaxed">
              See exactly which workflows, agents, and users are driving your costs. Set budget alerts and automatically fallback to cheaper LLM models for low-priority tasks.
            </p>
          </div>

        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-6 mt-20 text-center">
          <div className="bg-zinc-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0A6BFF] rounded-full blur-[150px] opacity-10"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Want to discuss enterprise deployment?</h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Our engineering team can help you architect the perfect deployment model for your specific compliance and scale requirements.
            </p>
            <div className="flex items-center justify-center gap-4 relative z-10">
              <Link href="/pricing" className="px-8 py-4 bg-[#0A6BFF] hover:bg-blue-500 text-white font-bold rounded-full transition-colors shadow-lg shadow-blue-500/25">
                View Pricing
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-colors backdrop-blur-sm">
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
