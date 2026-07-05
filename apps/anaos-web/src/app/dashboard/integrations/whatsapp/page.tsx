"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, MessageCircle, ArrowRight } from "lucide-react";
import { MetaEmbeddedSignup } from "@/components/integrations/MetaEmbeddedSignup";

export default function WhatsAppSetupPage() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 hover:text-zinc-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All connections
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold text-zinc-900">WhatsApp Business</h1>
              <p className="text-[14px] text-zinc-500 font-medium mt-0.5">
                Connect your WhatsApp number with Anaos in 1-click.
              </p>
            </div>
          </div>
        </div>

        {!connected ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm flex flex-col items-center text-center max-w-lg mx-auto">
            <h2 className="text-[20px] font-bold text-zinc-900 mb-2">Connect WhatsApp</h2>
            <p className="text-[14px] text-zinc-500 mb-8 max-w-sm">
              Authorize AnaOS to access your WhatsApp Business Account to automatically reply to conversations.
            </p>
            <div className="w-full">
              <MetaEmbeddedSignup onSuccess={() => setConnected(true)} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-[20px] font-bold text-zinc-900 mb-2">WhatsApp is Active</h2>
            <p className="text-[14px] text-zinc-500 mb-8 max-w-sm">
              Your WhatsApp Business number is successfully connected. Anaos AI will now automatically handle incoming messages according to your workflows.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0A6BFF] hover:bg-blue-600 text-white shadow-sm font-bold text-[14px] hover:bg-zinc-800 transition-all hover:shadow-md"
            >
              Back to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
