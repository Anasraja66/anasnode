"use client";

import Link from "next/link";
import { ArrowLeft, Bot, MessageSquare, Phone, Workflow } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function AIAgentsPage() {
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
            Autonomous <span className="text-[#0A6BFF]">AI Agents</span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
            Deploy intelligent agents that don't just chat, but take action. Automate sales, support, and operations 24/7 across any channel.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          
          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Omnichannel Text Agents</h3>
            <p className="text-zinc-600 leading-relaxed">
              Deploy agents instantly to WhatsApp, Instagram, Messenger, and Web Chat. They understand natural language, intent, and sentiment to qualify leads and resolve tickets autonomously.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Conversational Voice AI</h3>
            <p className="text-zinc-600 leading-relaxed">
              Build inbound and outbound voice agents with sub-500ms latency. Perfect for taking restaurant reservations, conducting phone screens, or chasing unpaid invoices.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-[#0A6BFF] rounded-2xl flex items-center justify-center mb-6">
              <Workflow className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Action-Oriented Execution</h3>
            <p className="text-zinc-600 leading-relaxed">
              Our agents can read and write to your database, book meetings on Google Calendar, create Stripe invoices, and update CRM records during a conversation.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-zinc-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-4">Custom Knowledge Base</h3>
            <p className="text-zinc-600 leading-relaxed">
              Train your agents in minutes by uploading PDFs, scraping your website, or syncing with Notion. Guaranteed zero hallucination with strict retrieval-augmented generation (RAG).
            </p>
          </div>

        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-6 mt-20 text-center">
          <div className="bg-zinc-900 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A6BFF] rounded-full blur-[120px] opacity-20 -ml-20 -mb-20"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Hire your first AI employee today</h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Build and deploy a custom AI agent in under 5 minutes without writing a single line of code.
            </p>
            <div className="flex items-center justify-center gap-4 relative z-10">
              <Link href="/signup" className="px-8 py-4 bg-[#0A6BFF] hover:bg-blue-500 text-white font-bold rounded-full transition-colors shadow-lg shadow-blue-500/25">
                Create an Agent
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
