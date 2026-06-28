"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Globe, Loader2 } from "lucide-react";
import {
  LANGUAGE_CATALOG,
  type LanguageCode,
} from "@/lib/i18n/languages";
import type { WorkspaceLanguageSettings } from "@/lib/i18n/settings";

export default function LanguagesSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<"auto" | "fixed">("auto");
  const [fixedLanguage, setFixedLanguage] = useState<LanguageCode>("en");
  const [enabled, setEnabled] = useState<LanguageCode[]>([]);

  useEffect(() => {
    fetch("/api/workspace/languages")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setMode(data.settings.mode);
          setFixedLanguage(data.settings.fixedLanguage || "en");
          setEnabled(data.settings.enabled || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleLang = (code: LanguageCode) => {
    setEnabled((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const selectAll = () => {
    setEnabled(LANGUAGE_CATALOG.map((l) => l.code));
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/workspace/languages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        fixedLanguage: mode === "fixed" ? fixedLanguage : undefined,
        enabled: enabled.length ? enabled : LANGUAGE_CATALOG.map((l) => l.code),
      } satisfies WorkspaceLanguageSettings),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setMessage("Saved — your AI will reply in customer languages.");
    } else {
      setMessage(data.error || "Save failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 hover:text-zinc-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#0A6BFF]/10 flex items-center justify-center">
            <Globe className="w-6 h-6 text-[#0A6BFF]" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-zinc-900">Languages</h1>
            <p className="text-[14px] text-zinc-500">
              Platform-wide for WhatsApp: every industry, every country. AI detects the
              customer&apos;s language and replies the same way (text or voice).
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-sm">
            <div>
              <p className="text-[13px] font-bold text-zinc-800 mb-3">Reply mode</p>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-zinc-50">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "auto"}
                    onChange={() => setMode("auto")}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-[14px]">Auto-detect (recommended)</p>
                    <p className="text-[12px] text-zinc-500">
                      Italian, Arabic, Urdu, Hindi, Spanish, French, Chinese, and 40+ more — match the customer.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-zinc-50">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "fixed"}
                    onChange={() => setMode("fixed")}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[14px]">Always reply in one language</p>
                    {mode === "fixed" && (
                      <select
                        value={fixedLanguage}
                        onChange={(e) => setFixedLanguage(e.target.value as LanguageCode)}
                        className="mt-2 w-full border rounded-lg px-3 py-2 text-[14px]"
                      >
                        {LANGUAGE_CATALOG.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.flag} {l.label} ({l.nativeLabel})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {mode === "auto" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[13px] font-bold text-zinc-800">Languages you support</p>
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-[12px] font-bold text-[#0A6BFF]"
                  >
                    Select all
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[420px] overflow-y-auto">
                  {LANGUAGE_CATALOG.map((l) => {
                    const on = enabled.includes(l.code);
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => toggleLang(l.code)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-[13px] transition-colors ${
                          on
                            ? "border-[#0A6BFF] bg-[#0A6BFF]/5 font-semibold"
                            : "border-zinc-200 hover:bg-zinc-50"
                        }`}
                      >
                        <span>{l.flag}</span>
                        <span className="truncate">{l.label}</span>
                        {on && <Check className="w-3.5 h-3.5 text-[#0A6BFF] ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {message && (
              <p className="text-[13px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-[#0A6BFF] text-white font-bold text-[14px] disabled:opacity-50 flex justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save languages
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
