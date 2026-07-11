"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 py-16 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight mb-8">Data Deletion Instructions</h1>
        <p className="text-zinc-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-zinc max-w-none">
          <p>
            AnaOS provides a straightforward process for you to request the deletion of your account and all associated data, 
            in compliance with GDPR and Meta Platform Developer Policies.
          </p>

          <h3>How to Delete Your Data Automatically</h3>
          <p>
            If you wish to remove AnaOS's access to your Meta accounts (Facebook, Instagram, WhatsApp) and delete your integration data:
          </p>
          <ol>
            <li>Go to your Facebook account's <strong>Settings & Privacy</strong>.</li>
            <li>Click on <strong>Business Integrations</strong>.</li>
            <li>Find "AnaOS" in the list of active integrations.</li>
            <li>Click <strong>Remove</strong>. This revokes our access immediately.</li>
          </ol>
          <p>
            Upon receiving the deauthorization webhook from Meta, AnaOS will automatically scrub your access tokens and 
            integration configurations from our databases within 48 hours.
          </p>

          <h3>How to Request Full Account Deletion</h3>
          <p>
            If you want to completely close your AnaOS account and erase all historical CRM records, message logs, and AI training data:
          </p>
          <ul>
            <li>Log in to your AnaOS Dashboard.</li>
            <li>Navigate to <strong>Settings</strong> &gt; <strong>Account</strong>.</li>
            <li>Click on the <strong>Delete Account</strong> button at the bottom of the page and confirm.</li>
          </ul>

          <h3>Manual Data Request</h3>
          <p>
            Alternatively, you can email us at our support address with the subject line <strong>"Data Deletion Request"</strong>. 
            Please include your registered email address and AnaOS Workspace ID. We will process your manual request within 7 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
