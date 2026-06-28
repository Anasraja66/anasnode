"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

export default function EmailConnectPage() {
  const [host, setHost] = useState("smtp.gmail.com");
  const [port, setPort] = useState("587");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [fromName, setFromName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/integrations/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "smtp",
          name: fromName || user || "Business Email",
          credentials: { host, port, user, password, fromName },
        }),
      });
      const data = await res.json();
      setMessage(res.ok ? data.message : data.error);
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] px-6 py-10">
      <div className="max-w-lg mx-auto">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[24px] font-extrabold">Business email</h1>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4 shadow-sm">
          <p className="text-[14px] text-zinc-600">
            Gmail app password or any SMTP — automations send receipts and follow-ups.
          </p>
          {message && (
            <p className="text-[13px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              {message}
            </p>
          )}
          <input
            className="w-full border rounded-xl px-4 py-2.5 text-[14px]"
            placeholder="Your name (From: Marina Realty)"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
          />
          <input
            className="w-full border rounded-xl px-4 py-2.5 text-[14px]"
            placeholder="Email address"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            type="password"
            className="w-full border rounded-xl px-4 py-2.5 text-[14px]"
            placeholder="App password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              className="border rounded-xl px-4 py-2.5 text-[14px]"
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
            <input
              className="border rounded-xl px-4 py-2.5 text-[14px]"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </div>
          <button
            type="button"
            disabled={saving || !user || !password}
            onClick={save}
            className="w-full py-3 rounded-xl bg-[#0A6BFF] text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Connect email
          </button>
        </div>
      </div>
    </div>
  );
}
