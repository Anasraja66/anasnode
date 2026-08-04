"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Check, Zap, Building2, Rocket, ChevronDown, ChevronUp, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    icon: Zap,
    color: "#64748B",
    monthly: 0,
    annual: 0,
    desc: "Basic features to help you start automating for free.",
    badge: null,
    features: [
      "1 Workspace",
      "500 automation runs/month",
      "Basic Integration: WhatsApp, Facebook, Instagram",
      "Basic CRM Sync: HubSpot, Google Sheets",
      "3 active workflows",
      "Community support",
    ],
    cta: "Start Free",
    ctaHref: "/signup",
  },
  {
    name: "Starter",
    icon: Rocket,
    color: "#0A6BFF",
    monthly: 15,
    annual: 12,
    desc: "Perfect for growing businesses that need AI and broadcasting.",
    badge: "Most Popular",
    features: [
      "3 Workspaces",
      "5,000 automation runs/month",
      "Full Integration: WhatsApp, FB, Insta, HubSpot",
      "Broadcasting messages",
      "Payments: Stripe, PayPal",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    ctaHref: "/signup",
  },
  {
    name: "Pro",
    icon: Building2,
    color: "#7C3AED",
    monthly: 49,
    annual: 39,
    desc: "Everything you need: voice agents and all app integrations.",
    badge: null,
    features: [
      "All-in-one automation",
      "50,000 automation runs/month",
      "Voice Agents",
      "All Integrations (Shopify, Slack, Notion, etc.)",
      "Advanced AI (Claude + GPT-4)",
      "Custom workflow templates",
    ],
    cta: "Start Free Trial",
    ctaHref: "/signup",
  },
  {
    name: "Custom",
    icon: Shield,
    color: "#059669",
    monthly: "Custom",
    annual: "Custom",
    desc: "All-over automation tailored exactly to your enterprise needs.",
    badge: null,
    features: [
      "Unlimited Workspaces",
      "Unlimited automation runs",
      "Custom AI model training",
      "White-label options",
      "Dedicated account manager",
      "SLA guarantees",
    ],
    cta: "Chat on WhatsApp",
    ctaHref: "https://wa.me/447000000000",
  },
];

const faqs = [
  {
    q: "Can I change my plan anytime?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we prorate the billing.",
  },
  {
    q: "What counts as an automation run?",
    a: "Each time a workflow executes from start to finish counts as one run. Workflows that are triggered but don't complete due to conditions not being met do not count.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes! All plans come with a 14-day free trial, no credit card required. You get full access to all features during the trial.",
  },
  {
    q: "What happens when I hit my run limit?",
    a: "We'll notify you at 80% usage. Your automations continue running but you'll need to upgrade to avoid interruption at 100%.",
  },
  {
    q: "Can I use my own AI API keys?",
    a: "Yes, on Growth and Scale plans you can connect your own OpenAI, Claude, or Groq API keys instead of using our shared quota.",
  },
  {
    q: "Is WhatsApp Business API included?",
    a: "Yes, WhatsApp via Meta Cloud API is supported on all plans. You'll need a Meta Business Account and WhatsApp Business number.",
  },
];

const comparison = [
  { feature: "Workspaces", free: "1", starter: "3", pro: "Unlimited", custom: "Unlimited" },
  { feature: "Automation runs", free: "500", starter: "5,000", pro: "50,000", custom: "Unlimited" },
  { feature: "Active workflows", free: "3", starter: "10", pro: "Unlimited", custom: "Unlimited" },
  { feature: "WhatsApp", free: "✓ (Basic)", starter: "✓", pro: "✓", custom: "✓" },
  { feature: "Broadcasting", free: "—", starter: "✓", pro: "✓", custom: "✓" },
  { feature: "AI Integration", free: "—", starter: "✓ (Basic)", pro: "✓ (Advanced)", custom: "✓ (Custom Models)" },
  { feature: "Voice Agents", free: "—", starter: "—", pro: "✓", custom: "✓" },
  { feature: "All Integrations", free: "—", starter: "—", pro: "✓", custom: "✓" },
  { feature: "Support", free: "Community", starter: "Priority Email", pro: "24/7 Chat", custom: "Dedicated Manager" },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              Simple, transparent pricing
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 mb-5 leading-tight">
              Start automating your<br />
              <span className="text-[#0A6BFF]">business today</span>
            </h1>
            <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10">
              14-day free trial. No credit card required. Cancel anytime.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-4 bg-zinc-100 rounded-2xl p-1.5">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${!annual ? "bg-white shadow text-zinc-900" : "text-zinc-500"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${annual ? "bg-white shadow text-zinc-900" : "text-zinc-500"}`}
              >
                Annual
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Save 20%</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* Pricing cards */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto mb-24">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              const price = annual ? plan.annual : plan.monthly;
              const isPopular = plan.badge === "Most Popular";
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative rounded-3xl p-8 border ${isPopular ? "border-violet-200 bg-gradient-to-b from-violet-50 to-white shadow-xl shadow-violet-100/50 scale-[1.02]" : "border-zinc-200 bg-white shadow-sm"}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                      style={{ background: plan.color + "15" }}
                    >
                      <Icon className="w-6 h-6" style={{ color: plan.color }} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-1">{plan.name}</h2>
                    <p className="text-sm text-zinc-500">{plan.desc}</p>
                  </div>

                  <div className="mb-8 h-20">
                    <div className="flex items-end gap-1">
                      {price === "Custom" ? (
                        <span className="text-4xl font-bold text-zinc-900">Custom</span>
                      ) : (
                        <>
                          <span className="text-5xl font-bold text-zinc-900">${price}</span>
                          <span className="text-zinc-500 mb-2">/month</span>
                        </>
                      )}
                    </div>
                    {annual && price !== "Custom" && price !== 0 && (
                      <p className="text-xs text-emerald-600 font-semibold mt-1">
                        Billed annually (${(price as number) * 12}/yr)
                      </p>
                    )}
                    {price === 0 && (
                      <p className="text-xs text-zinc-500 font-medium mt-1">
                        Forever free
                      </p>
                    )}
                  </div>

                  <Link
                    href={plan.ctaHref}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all mb-8 ${
                      isPopular
                        ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-700">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-zinc-900 text-center mb-12">Compare plans</h2>
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="text-left px-6 py-4 font-semibold text-zinc-900">Feature</th>
                  <th className="px-6 py-4 font-semibold text-zinc-900 text-center">Free</th>
                  <th className="px-6 py-4 font-semibold text-blue-700 text-center bg-blue-50/50">Starter</th>
                  <th className="px-6 py-4 font-semibold text-violet-700 text-center">Pro</th>
                  <th className="px-6 py-4 font-semibold text-emerald-700 text-center">Custom</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-zinc-100 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}`}>
                    <td className="px-6 py-3.5 font-medium text-zinc-700">{row.feature}</td>
                    <td className="px-6 py-3.5 text-center text-zinc-600">{row.free}</td>
                    <td className="px-6 py-3.5 text-center text-zinc-700 font-medium bg-blue-50/20">{row.starter}</td>
                    <td className="px-6 py-3.5 text-center text-zinc-600">{row.pro}</td>
                    <td className="px-6 py-3.5 text-center text-zinc-600 font-medium">{row.custom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-zinc-900 text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-zinc-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
                >
                  {faq.q}
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-zinc-600 text-sm leading-relaxed border-t border-zinc-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-10 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Need a custom plan?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
              For agencies, enterprises, or high-volume use cases — we'll build a plan that fits exactly what you need.
            </p>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-colors"
            >
              Talk to us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
