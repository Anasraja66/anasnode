"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Globe,
  Loader2,
  MessageCircle,
  Smartphone,
} from "lucide-react";
import { PLATFORM_LANGUAGES } from "@/lib/i18n/platform";
import { MetaEmbeddedSignup } from "@/components/integrations/MetaEmbeddedSignup";

export default function WhatsAppSetupPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [displayPhone, setDisplayPhone] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const webhookUrl = origin ? `${origin}/api/webhooks/whatsapp` : "/api/webhooks/whatsapp";
  const verifyToken = "anaos_secret_verify_token";

  const discoverFromToken = async () => {
    if (!accessToken.trim()) {
      setError("Paste your access token first, then click Auto-detect.");
      return;
    }
    setDiscovering(true);
    setError(null);
    try {
      const res = await fetch("/api/integrations/whatsapp/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: accessToken.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not detect Phone number ID");
        return;
      }
      setPhoneNumberId(data.phoneNumberId || "");
      if (data.displayPhone) setDisplayPhone(data.displayPhone);
      setMessage(
        `Found Phone number ID: ${data.phoneNumberId}${data.displayPhone ? ` (${data.displayPhone})` : ""}`
      );
    } catch {
      setError("Network error while detecting ID");
    } finally {
      setDiscovering(false);
    }
  };

  const saveManual = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/integrations/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whatsapp",
          name: displayPhone || "WhatsApp",
          credentials: { accessToken, phoneNumberId, displayPhone, aiAutoReply: true },
          activateDefaultWorkflow: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setMessage(data.message);
      setConnected(true);
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage("Copied");
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="max-w-xl mx-auto px-6 py-10">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 hover:text-zinc-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All connections
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-[26px] font-extrabold text-zinc-900">WhatsApp</h1>
            <p className="text-[14px] text-zinc-500 font-medium">
              Connect like ManyChat — Meta popup, no developer console for your clients
            </p>
          </div>
        </div>

        {message && (
          <p className="mb-4 text-[13px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 text-[13px] font-medium text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-6">
          {!connected ? (
            <>
              <div>
                <h2 className="text-[18px] font-bold text-zinc-900">
                  Connect your business WhatsApp
                </h2>
                <p className="text-[14px] text-zinc-600 mt-2">
                  Business name, number, and permissions — Meta official flow. Anaos saves
                  everything and turns on automations.
                </p>
              </div>

              <MetaEmbeddedSignup
                activateWorkflow
                onSuccess={(msg) => {
                  setMessage(msg);
                  setConnected(true);
                  setError(null);
                }}
                onError={(msg) => setError(msg)}
              />

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-950">
                <p className="font-bold">Local PC? Run tunnel (required for replies)</p>
                <p className="mt-1 opacity-90">
                  Meta cannot reach localhost. In a second terminal:{" "}
                  <code className="bg-white/80 px-1 rounded">npm run tunnel</code> — copy the
                  https URL into Meta → WhatsApp → Configuration → Webhook callback:{" "}
                  <code className="bg-white/80 px-1 rounded break-all">
                    YOUR-URL/api/webhooks/whatsapp
                  </code>
                </p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-4 flex gap-3">
                <Smartphone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-[13px] text-emerald-900">
                  <p className="font-bold">Text replies only (voice later)</p>
                  <p className="mt-1 opacity-90">
                    AI answers in text on WhatsApp. Customer voice notes are understood; replies
                    are text for now.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#0A6BFF]/20 bg-[#0A6BFF]/5 p-4 flex gap-3">
                <Globe className="w-5 h-5 text-[#0A6BFF] shrink-0 mt-0.5" />
                <div className="text-[13px] text-zinc-800">
                  <p className="font-bold">
                    {PLATFORM_LANGUAGES.shortLabel} — every industry & country
                  </p>
                  <p className="mt-1 text-zinc-600">{PLATFORM_LANGUAGES.whatsappLine}</p>
                  <Link
                    href="/dashboard/settings/languages"
                    className="inline-block mt-2 text-[12px] font-bold text-[#0A6BFF] hover:underline"
                  >
                    Manage languages →
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-[16px] font-bold text-zinc-900">WhatsApp connected</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-[13px]"
              >
                Open dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-[13px] font-bold text-zinc-500 pt-4 border-t border-zinc-100"
          >
            Manual setup (developers only)
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-2">
              <p className="text-[12px] text-zinc-500">
                Only if Embedded Signup is unavailable. Clients should never see this.
              </p>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                  Display phone (what customers see)
                </label>
                <input
                  type="tel"
                  placeholder="+1 555 202 4564"
                  value={displayPhone}
                  onChange={(e) => setDisplayPhone(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                  Access token (from Meta API Setup)
                </label>
                <input
                  type="password"
                  placeholder="EAAS…"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                  Phone number ID (long digits only — NOT your + phone)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1181035561752559"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value.replace(/\D/g, ""))}
                  className="w-full border rounded-xl px-4 py-2.5 text-[14px] mt-1 font-mono"
                />
                <p className="text-[11px] text-amber-700 mt-1.5">
                  Meta → WhatsApp → API Setup → copy &quot;Phone number ID&quot; (15–16 digits).
                  Your +1 555… number goes in Display phone above — not here.
                </p>
                <button
                  type="button"
                  onClick={discoverFromToken}
                  disabled={discovering || !accessToken.trim()}
                  className="mt-2 text-[12px] font-bold text-[#0A6BFF] disabled:opacity-50"
                >
                  {discovering ? "Detecting…" : "Auto-detect Phone number ID from token"}
                </button>
              </div>
              <div className="text-[12px] bg-zinc-50 p-3 rounded-lg space-y-2">
                <p className="font-bold">Webhook (Meta dashboard)</p>
                <code className="block break-all">{webhookUrl}</code>
                <button
                  type="button"
                  onClick={() => copy(webhookUrl)}
                  className="flex items-center gap-1 text-[#0A6BFF] font-bold"
                >
                  <Copy className="w-3 h-3" /> Copy URL
                </button>
                <p className="text-zinc-500">Verify token: {verifyToken}</p>
              </div>
              <button
                type="button"
                disabled={saving || !accessToken || !phoneNumberId}
                onClick={saveManual}
                className="w-full py-2.5 rounded-xl bg-zinc-800 text-white font-bold disabled:opacity-50 flex justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save manually
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-[12px] text-zinc-400 mt-6">
          Platform setup guide: <code className="text-zinc-600">META_WHATSAPP_SETUP.md</code>
        </p>
      </div>
    </div>
  );
}
