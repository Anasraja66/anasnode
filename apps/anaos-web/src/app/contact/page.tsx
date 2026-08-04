"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, MapPin } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-900 py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column - Info */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Get in touch</h1>
            <p className="text-zinc-500 mb-10 leading-relaxed">
              Have questions about AnaOS? Whether you're looking for enterprise pricing, technical support, or just want to learn more about our automation platform, our team is ready to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#0A6BFF]" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 mb-1">Email us</h3>
                  <p className="text-sm text-zinc-500 mb-2">Our friendly team is here to help.</p>
                  <a href="mailto:support@anaos.ai" className="text-sm font-semibold text-[#0A6BFF] hover:underline">support@anaos.ai</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#0A6BFF]" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 mb-1">Live chat</h3>
                  <p className="text-sm text-zinc-500 mb-2">Available Mon-Fri, 9am-5pm EST.</p>
                  <button className="text-sm font-semibold text-[#0A6BFF] hover:underline">Start a chat</button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#0A6BFF]" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 mb-1">Office</h3>
                  <p className="text-sm text-zinc-500">
                    12 Lime Street<br />
                    Liverpool, L1 1JJ<br />
                    England, United Kingdom
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-[24px]">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Message sent!</h3>
                <p className="text-sm text-zinc-500">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-900">First name</label>
                    <input required type="text" className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A6BFF] focus:ring-1 focus:ring-[#0A6BFF] transition-all" placeholder="Jane" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-900">Last name</label>
                    <input required type="text" className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A6BFF] focus:ring-1 focus:ring-[#0A6BFF] transition-all" placeholder="Smith" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-900">Email</label>
                  <input required type="email" className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A6BFF] focus:ring-1 focus:ring-[#0A6BFF] transition-all" placeholder="jane@company.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-900">How can we help?</label>
                  <textarea required rows={4} className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0A6BFF] focus:ring-1 focus:ring-[#0A6BFF] transition-all resize-none" placeholder="Tell us about your project..."></textarea>
                </div>

                <button type="submit" className="w-full bg-[#0A6BFF] text-white font-bold rounded-xl px-4 py-3.5 hover:bg-blue-600 transition-colors shadow-sm">
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
