"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react";

type Step = 1 | 2 | 3 | 4;

export default function SetupHelpPage() {
  const [step, setStep] = useState<Step>(1);
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [configId, setConfigId] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alreadySaved, setAlreadySaved] = useState(false);

  useEffect(() => {
    fetch("/api/platform/meta")
      .then((r) => r.json())
      .then((data) => {
        if (data.configured) {
          setAlreadySaved(true);
          setAppId(data.appId || "");
          setConfigId(data.configId || "");
        }
      })
      .catch(() => {});
  }, []);

  const saveMeta = async () => {
    if (!appSecret.trim() || appSecret.includes("•")) {
      setError("Please re-enter your App Secret — it appears empty or invalid.");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch("/api/platform/meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, appSecret, configId }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      let data: { error?: string; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError(
          res.status === 401
            ? "Please log in first — /login"
            : `Server error (${res.status}). Please restart your dev server.`
        );
        return;
      }
      if (!res.ok) {
        setError(data.error || "Save failed");
        return;
      }
      setMessage(data.message || "Meta settings saved successfully!");
      setAlreadySaved(true);
      setStep(4);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setError("Request timed out. Is the dev server running? Try restarting the server.");
      } else {
        setError("Network or server error. Please check your login session and dev server.");
      }
    } finally {
      clearTimeout(timeout);
      setSaving(false);
    }
  };

  const StepDot = ({ n, label }: { n: Step; label: string }) => (
    <button
      type="button"
      onClick={() => setStep(n)}
      className={`flex items-center gap-2 text-left text-[13px] font-bold ${
        step === n ? "text-[#3B82F6]" : "text-zinc-500"
      }`}
    >
      {step > n || (n === 4 && alreadySaved) ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
      ) : (
        <Circle className="w-5 h-5 shrink-0" />
      )}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-6 font-sans">
      <div className="max-w-lg mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 mb-6 hover:text-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <h1 className="text-[28px] font-extrabold text-zinc-950 tracking-tight">Setup Help</h1>
        <p className="text-[14px] text-zinc-500 mt-2 font-medium">
          Only <strong>one-time setup</strong> — then every client simply clicks Connect. No .env files needed.
        </p>

        <div className="grid gap-2 mt-8 mb-6">
          <StepDot n={1} label="1. Open Meta Developers portal" />
          <StepDot n={2} label="2. Copy three parameters" />
          <StepDot n={3} label="3. Paste & save here" />
          <StepDot n={4} label="4. Connect WhatsApp" />
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm space-y-4">
          {message && (
            <p className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-[14px] font-medium animate-in fade-in">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[14px] font-medium animate-in fade-in">
              {error}
            </p>
          )}

          {step === 1 && (
            <>
              <p className="text-[14px] text-zinc-600 leading-relaxed">
                Go to the Facebook / Meta Developers portal. You will create a Meta app here for your workspace platform (not for the individual client).
              </p>
              <a
                href="https://developers.facebook.com/apps/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-[14px] transition-all"
              >
                Open Meta Developers <ExternalLink className="w-4 h-4" />
              </a>
              <ol className="text-[13px] text-zinc-500 space-y-1 list-decimal list-inside leading-relaxed">
                <li>Create App → Select type <strong>Business</strong></li>
                <li>Add product → <strong>WhatsApp</strong></li>
              </ol>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Done, next step <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-[14px] font-bold text-zinc-800">Copy these 3 parameters:</p>
              <div className="space-y-3 text-[13px] leading-normal">
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200">
                  <p className="font-bold text-zinc-950">① App ID</p>
                  <p className="text-zinc-500 mt-1">
                    App → App settings → Basic → find the <strong>App ID</strong> at the top
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200">
                  <p className="font-bold text-zinc-950">② App Secret</p>
                  <p className="text-zinc-500 mt-1">
                    Same page → Click Show → <strong>App secret</strong>
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-200">
                  <p className="font-bold text-zinc-950">③ Configuration ID</p>
                  <p className="text-zinc-500 mt-1">
                    Facebook Login for Business → Configurations → WhatsApp Embedded template → copy the Configuration ID
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-[14px] transition-all cursor-pointer"
              >
                All three copied — proceed to paste
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-[14px] text-zinc-600">Paste them below and click Save.</p>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">App ID</label>
                <input
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2 text-[14px] focus:outline-none focus:border-[#3B82F6]"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="123456789012345"
                />
              </div>
              <div className="space-y-1 mt-3">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">App Secret</label>
                <input
                  type="password"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2 text-[14px] focus:outline-none focus:border-[#3B82F6]"
                  value={appSecret}
                  onChange={(e) => setAppSecret(e.target.value)}
                  placeholder="Secret from Meta"
                />
              </div>
              <div className="space-y-1 mt-3">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Configuration ID</label>
                <input
                  className="w-full border border-zinc-200 rounded-xl px-4 py-2 text-[14px] focus:outline-none focus:border-[#3B82F6]"
                  value={configId}
                  onChange={(e) => setConfigId(e.target.value)}
                  placeholder="Config ID"
                />
              </div>
              <button
                type="button"
                disabled={saving || !appId || !appSecret || !configId}
                onClick={saveMeta}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 mt-4 transition-all cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save in Anaos
              </button>
            </>
          )}

          {step === 4 && (
            <>
              <p className="text-[14px] text-zinc-600">
                Now connect your WhatsApp — click the <strong>Connect with Meta</strong> button inside integrations.
              </p>
              <Link
                href="/dashboard/integrations/whatsapp"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[14px] transition-all"
              >
                Go to WhatsApp Integration <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
