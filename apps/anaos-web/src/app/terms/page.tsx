"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        <p className="text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-zinc max-w-none">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using AnaOS, you agree to be bound by these Terms of Service. If you do not agree to these terms, 
            please do not use our services.
          </p>

          <h3>2. Description of Service</h3>
          <p>
            AnaOS is a SaaS platform that provides automated messaging, AI agents, and CRM features via official API integrations 
            with third-party providers, including Meta (WhatsApp, Instagram, Facebook Messenger). We act as a Technology Provider 
            facilitating these connections.
          </p>

          <h3>3. Acceptable Use</h3>
          <p>
            You agree to use AnaOS solely for lawful business purposes. You must not:
          </p>
          <ul>
            <li>Use the service to send spam, unsolicited promotions, or harassing messages.</li>
            <li>Violate the Terms of Service or Commerce Policies of Meta Platforms, Inc.</li>
            <li>Attempt to reverse-engineer, disrupt, or compromise the integrity of the AnaOS platform.</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these terms or applicable platform policies.</p>

          <h3>4. Meta API Compliance</h3>
          <p>
            When utilizing our Meta integration features (e.g., WhatsApp Business API), you must maintain compliance with 
            Meta's Business and Commerce policies. AnaOS is not liable for any account restrictions or bans imposed by Meta 
            due to your messaging practices.
          </p>

          <h3>5. Limitation of Liability</h3>
          <p>
            AnaOS provides its services "as is" and without any warranty. We shall not be liable for any indirect, incidental, 
            or consequential damages resulting from the use or inability to use our services, including data loss or business interruption.
          </p>

          <h3>6. Changes to Terms</h3>
          <p>
            We may modify these terms at any time. We will provide notice of significant changes, and your continued use of the 
            service constitutes acceptance of the updated terms.
          </p>
        </div>
      </div>
    </div>
  );
}
