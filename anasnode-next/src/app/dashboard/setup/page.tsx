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
      setError("App Secret dubara likho — khali ya galat lag raha hai.");
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
            ? "Pehle login karo — /login"
            : `Server error (${res.status}). npm run dev restart karo.`
        );
        return;
      }
      if (!res.ok) {
        setError(data.error || "Save nahi hua");
        return;
      }
      setMessage(data.message || "Meta save ho gaya!");
      setAlreadySaved(true);
      setStep(4);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        setError("Bahut der — server chal raha hai? npm run dev restart karo.");
      } else {
        setError("Internet / server error — login + dev server check karo.");
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
        step === n ? "text-[#0A6BFF]" : "text-zinc-500"
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
    <div className="min-h-screen bg-[#F0F2F5] py-10 px-6">
      <div className="max-w-lg mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <h1 className="text-[28px] font-extrabold text-zinc-900">Setup Help</h1>
        <p className="text-[15px] text-zinc-600 mt-2 font-medium">
          Sirf <strong>ek dafa</strong> — phir har client sirf Connect dabayega. Koi .env
          file nahi.
        </p>

        <div className="grid gap-2 mt-8 mb-6">
          <StepDot n={1} label="1. Meta site kholo" />
          <StepDot n={2} label="2. Teen cheezein copy karo" />
          <StepDot n={3} label="3. Yahan paste + Save" />
          <StepDot n={4} label="4. WhatsApp Connect" />
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4">
          {message && (
            <p className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-[14px] font-medium">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[14px]">
              {error}
            </p>
          )}

          {step === 1 && (
            <>
              <p className="text-[15px] text-zinc-700">
                Facebook / Meta par jao — wahan app banegi (Anaos ke liye, client ke liye
                nahi).
              </p>
              <a
                href="https://developers.facebook.com/apps/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#1877F2] text-white font-bold"
              >
                Meta kholo <ExternalLink className="w-4 h-4" />
              </a>
              <ol className="text-[14px] text-zinc-600 space-y-2 list-decimal list-inside">
                <li>Create App → type <strong>Business</strong></li>
                <li>Add product → <strong>WhatsApp</strong></li>
              </ol>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-[#0A6BFF] text-white font-bold flex items-center justify-center gap-2"
              >
                Ho gaya, agla <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-[14px] font-bold text-zinc-800">Yeh 3 copy karo:</p>
              <div className="space-y-3 text-[14px]">
                <div className="bg-zinc-50 rounded-xl p-3 border">
                  <p className="font-bold text-zinc-800">① App ID</p>
                  <p className="text-zinc-500 mt-1">
                    App → Settings → Basic → top par <strong>App ID</strong>
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border">
                  <p className="font-bold text-zinc-800">② App Secret</p>
                  <p className="text-zinc-500 mt-1">
                    Same page → Show → <strong>App secret</strong>
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border">
                  <p className="font-bold text-zinc-800">③ Configuration ID</p>
                  <p className="text-zinc-500 mt-1">
                    Facebook Login for Business → Configurations → WhatsApp Embedded
                    template → ID copy
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-3 rounded-xl bg-[#0A6BFF] text-white font-bold"
              >
                Teen copy ho gaye — paste karta hoon
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-[14px] text-zinc-600">Neeche paste karo — Save dabao.</p>
              <label className="block text-[12px] font-bold text-zinc-500">App ID</label>
              <input
                className="w-full border rounded-xl px-4 py-2.5 mb-3"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="123456789012345"
              />
              <label className="block text-[12px] font-bold text-zinc-500">App Secret</label>
              <input
                type="password"
                className="w-full border rounded-xl px-4 py-2.5 mb-3"
                value={appSecret}
                onChange={(e) => setAppSecret(e.target.value)}
                placeholder="Secret from Meta"
              />
              <label className="block text-[12px] font-bold text-zinc-500">
                Configuration ID
              </label>
              <input
                className="w-full border rounded-xl px-4 py-2.5 mb-4"
                value={configId}
                onChange={(e) => setConfigId(e.target.value)}
                placeholder="Config ID"
              />
              <button
                type="button"
                disabled={saving || !appId || !appSecret || !configId}
                onClick={saveMeta}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save — Anaos mein
              </button>
            </>
          )}

          {step === 4 && (
            <>
              <p className="text-[15px] text-zinc-700">
                Ab WhatsApp connect karo — neela button <strong>Connect with Meta</strong>.
              </p>
              <Link
                href="/dashboard/integrations/whatsapp"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 text-white font-bold"
              >
                WhatsApp Connect <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
