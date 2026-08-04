"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AIGovernancePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-10">
          <span className="inline-block bg-blue-50 text-[#0A6BFF] text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">UK Compliance</span>
          <h1 className="text-4xl font-bold tracking-tight mb-4">AI Governance &amp; Responsible AI Policy</h1>
          <p className="text-zinc-500 text-lg leading-relaxed">
            AnaOS, a product of <strong>Anas Technologies Ltd.</strong> (registered in England &amp; Wales), is committed to the responsible and transparent deployment of Artificial Intelligence in all our products and services. This policy outlines our compliance with the <strong>UK Government's AI Regulation Framework</strong> and our internal governance principles.
          </p>
          <p className="text-sm text-zinc-400 mt-4">Last updated: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>

        <div className="prose prose-zinc max-w-none space-y-10">

          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0A6BFF] text-sm font-bold flex items-center justify-center">1</span>
              Alignment with UK AI Regulation White Paper
            </h2>
            <p className="text-zinc-600 leading-relaxed">
              AnaOS operates in alignment with the UK Government's March 2023 <em>"A pro-innovation approach to AI regulation"</em> White Paper and subsequent updates. We design our AI systems around the five core cross-sector principles established by the UK government:
            </p>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Safety, Security & Robustness", desc: "Our AI systems are tested rigorously before deployment and continuously monitored for harmful outputs, data leakage, and adversarial vulnerabilities." },
                { label: "Appropriate Transparency & Explainability", desc: "Users and clients are always informed when they are interacting with or being processed by an AI system. Automated decisions can be reviewed and explained." },
                { label: "Fairness", desc: "We actively audit our AI models for biases across demographic groups and ensure equitable treatment in all automated processing pipelines." },
                { label: "Accountability & Governance", desc: "A named AI Officer within Anas Technologies Ltd. is responsible for the oversight of all AI systems. All third-party AI services (e.g., OpenAI) are bound by sub-processor agreements." },
                { label: "Contestability & Redress", desc: "End-users have the right to contest any automated decision made by an AnaOS system. Clear escalation pathways are provided via our support team." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <span className="w-2 h-2 rounded-full bg-[#0A6BFF] mt-2 shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-900">{item.label}: </span>
                    <span className="text-zinc-600">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0A6BFF] text-sm font-bold flex items-center justify-center">2</span>
              ICO Guidance on AI & UK GDPR
            </h2>
            <p className="text-zinc-600 leading-relaxed mb-4">
              In compliance with the <strong>UK Information Commissioner's Office (ICO)</strong> guidelines on AI and Data Protection (under UK GDPR and the Data Protection Act 2018), AnaOS adheres to the following:
            </p>
            <ul className="space-y-3">
              {[
                "We process personal data through AI systems only with a lawful basis (e.g., legitimate interests, consent, or contract performance).",
                "We conduct Data Protection Impact Assessments (DPIAs) for all high-risk AI processing activities.",
                "We do not use personal data of UK residents to train our core AI models without explicit consent.",
                "We provide clear opt-out mechanisms for AI-driven communications and profiling.",
                "All AI outputs involving personal data are subject to human review mechanisms where required by law.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <span className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                  <span className="text-zinc-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0A6BFF] text-sm font-bold flex items-center justify-center">3</span>
              Prohibited Uses of AnaOS AI
            </h2>
            <p className="text-zinc-600 leading-relaxed mb-4">
              In line with UK government guidance and industry best practices, the following use cases are strictly prohibited on the AnaOS platform:
            </p>
            <ul className="space-y-3">
              {[
                "Using AnaOS AI systems for discriminatory targeting based on race, religion, gender, age, or sexual orientation.",
                "Generating or distributing synthetic media (deepfakes) designed to deceive or defraud individuals.",
                "Automated processing of UK residents' special category data (health, biometric, political views) without explicit consent.",
                "Using AI-generated messaging to impersonate a human without disclosing the AI nature of the communication.",
                "Any application that falls under the definition of 'unacceptable risk' AI as defined by the EU AI Act (which AnaOS applies as best practice).",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                  <span className="text-zinc-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0A6BFF] text-sm font-bold flex items-center justify-center">4</span>
              Third-Party AI Sub-Processors
            </h2>
            <p className="text-zinc-600 leading-relaxed mb-4">
              AnaOS integrates with the following third-party AI service providers, all of whom are bound by Data Processing Agreements and are assessed for their own compliance posture:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-100">
                    <th className="text-left p-3 font-bold text-zinc-900 rounded-tl-xl">Provider</th>
                    <th className="text-left p-3 font-bold text-zinc-900">Purpose</th>
                    <th className="text-left p-3 font-bold text-zinc-900 rounded-tr-xl">Data Location</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { provider: "OpenAI", purpose: "Large Language Model (AI responses, workflow generation)", location: "USA (SCCs in place)" },
                    { provider: "Meta (WhatsApp/Instagram)", purpose: "Messaging delivery & receipt", location: "USA/EU (SCCs in place)" },
                    { provider: "Twilio", purpose: "SMS / Voice call delivery", location: "USA (SCCs in place)" },
                    { provider: "Google Cloud", purpose: "Infrastructure, Cloud Storage", location: "EU (London region preferred)" },
                    { provider: "Stripe", purpose: "Payment processing", location: "EU (Dublin)" },
                  ].map((row, i) => (
                    <tr key={i} className={`border-t border-zinc-100 ${i % 2 === 0 ? "bg-white" : "bg-zinc-50/50"}`}>
                      <td className="p-3 font-semibold text-zinc-900">{row.provider}</td>
                      <td className="p-3 text-zinc-600">{row.purpose}</td>
                      <td className="p-3 text-zinc-600">{row.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#0A6BFF] text-sm font-bold flex items-center justify-center">5</span>
              Incident Response & Reporting
            </h2>
            <p className="text-zinc-600 leading-relaxed">
              In the event of an AI-related incident (e.g., biased output causing harm, a data breach involving AI-processed data), Anas Technologies Ltd. will:
            </p>
            <ol className="mt-4 space-y-3 list-none">
              {[
                "Contain and assess the incident within 24 hours of discovery.",
                "Notify affected data subjects and the ICO within 72 hours if the incident constitutes a reportable breach under UK GDPR.",
                "Conduct a root cause analysis and publish a remediation report within 30 days.",
                "Report significant AI safety incidents to the relevant sectoral regulator as guided by the UK AI Safety Institute (AISI).",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <span className="w-6 h-6 rounded-full bg-[#0A6BFF] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="text-zinc-600">{item}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Contact */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-900 mb-2">AI Governance Contact</h3>
            <p className="text-zinc-600 text-sm mb-4">
              For questions regarding our AI Governance policy, to exercise your rights under UK GDPR, or to report an AI-related concern:
            </p>
            <div className="space-y-1 text-sm">
              <p><span className="font-bold">Email:</span> <a href="mailto:ai-governance@anaos.ai" className="text-[#0A6BFF] hover:underline">ai-governance@anaos.ai</a></p>
              <p><span className="font-bold">Company:</span> Anas Technologies Ltd.</p>
              <p><span className="font-bold">Registered Office:</span> 12 Lime Street, Liverpool, L1 1JJ, England, United Kingdom</p>
              <p><span className="font-bold">Regulator:</span> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#0A6BFF] hover:underline">Information Commissioner's Office (ICO)</a></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
