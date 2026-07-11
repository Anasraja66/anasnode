"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-zinc max-w-none">
          <h3>1. Introduction</h3>
          <p>
            Welcome to AnaOS ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website or use our 
            services, including our Meta integrations (WhatsApp, Instagram, Messenger).
          </p>

          <h3>2. Data We Collect</h3>
          <p>
            When you connect your Meta business accounts to AnaOS, we collect and process the following data necessary for providing our automation services:
          </p>
          <ul>
            <li><strong>Messaging Data:</strong> Content of incoming and outgoing messages across connected Meta platforms.</li>
            <li><strong>Profile Data:</strong> Names and public profiles of users interacting with your connected business pages.</li>
            <li><strong>Account Information:</strong> Access tokens and configuration IDs required to securely authenticate with Meta's Graph API.</li>
          </ul>

          <h3>3. How We Use Your Data</h3>
          <p>We use the data we collect solely to:</p>
          <ul>
            <li>Provide, maintain, and improve the AnaOS automation services.</li>
            <li>Process AI-generated responses based on your configured workflows.</li>
            <li>Maintain logs for debugging and analytics within your isolated dashboard.</li>
          </ul>
          <p><strong>We do not sell your personal data or your customers' data to any third parties.</strong></p>

          <h3>4. Data Security</h3>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, 
            or accessed in an unauthorized way. Access to your personal data is limited to those employees, agents, contractors, 
            and other third parties who have a business need to know.
          </p>

          <h3>5. Third-Party Services</h3>
          <p>
            Our service utilizes the official Meta Graph API. By using our service, you also agree to be bound by Meta's 
            Terms of Service and Privacy Policy regarding your use of their platforms.
          </p>

          <h3>6. Your Rights</h3>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, or erasure of your personal data.
            Please see our <Link href="/data-deletion" className="text-blue-600 hover:underline">Data Deletion Policy</Link> for instructions on how to request the removal of your data.
          </p>

          <h3>7. Contact Us</h3>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at our registered support email.
          </p>
        </div>
      </div>
    </div>
  );
}
