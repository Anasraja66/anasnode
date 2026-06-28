"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";
import { DAILY_LIMIT_PRESETS, META_BROADCAST_RULES } from "@/lib/broadcast/meta-policy";

type Campaign = {
  id: string;
  name: string;
  bodyText: string;
  footerText: string;
  optOutLine: string;
  category: string;
  languageCode: string;
  outside24h: boolean;
  dailyCap: number;
  status: string;
  audienceFilter: string;
};

export default function BroadcastEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [audienceCount, setAudienceCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const [name, setName] = useState("New broadcast");
  const [bodyText, setBodyText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [optOutLine, setOptOutLine] = useState("Reply STOP to opt out.");
  const [category, setCategory] = useState("marketing");
  const [outside24h, setOutside24h] = useState(true);
  const [dailyCap, setDailyCap] = useState(250);
  const [tagFilter, setTagFilter] = useState("");
  const [devMode, setDevMode] = useState(false);

  const audienceFilter = {
    match: "all" as const,
    tags: tagFilter
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    excludeOptedOut: true,
  };

  const refreshAudience = useCallback(async () => {
    const res = await fetch("/api/broadcasts/audience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filter: audienceFilter }),
    });
    const data = await res.json();
    if (data.success) setAudienceCount(data.count);
  }, [tagFilter]);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    fetch(`/api/broadcasts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.campaign) {
          const c = data.campaign as Campaign;
          setName(c.name);
          setBodyText(c.bodyText);
          setFooterText(c.footerText);
          setOptOutLine(c.optOutLine);
          setCategory(c.category);
          setOutside24h(c.outside24h);
          setDailyCap(c.dailyCap);
          try {
            const af = JSON.parse(c.audienceFilter || "{}");
            setTagFilter((af.tags || []).join(", "));
          } catch {
            /* ignore */
          }
          setAudienceCount(data.audienceCount || 0);
        }
        setLoading(false);
      });
  }, [id, isNew]);

  useEffect(() => {
    const t = setTimeout(refreshAudience, 400);
    return () => clearTimeout(t);
  }, [refreshAudience]);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const payload = {
      name,
      bodyText,
      footerText,
      optOutLine,
      category,
      outside24h,
      dailyCap,
      audienceFilter,
    };

    const res = isNew
      ? await fetch("/api/broadcasts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/broadcasts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error || "Save failed");
      return;
    }
    setMessage("Saved");
    if (isNew && data.campaign?.id) {
      router.replace(`/dashboard/broadcasts/${data.campaign.id}`);
    }
  };

  const sendNow = async () => {
    setSending(true);
    setMessage(null);
    let campaignId = id;

    if (isNew) {
      const saveRes = await fetch("/api/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bodyText,
          footerText,
          optOutLine,
          category,
          outside24h,
          dailyCap,
          audienceFilter,
        }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        setSending(false);
        setMessage(saveData.error || "Save failed");
        return;
      }
      campaignId = saveData.campaign.id;
      router.replace(`/dashboard/broadcasts/${campaignId}`);
    }

    const res = await fetch(`/api/broadcasts/${campaignId}/send`, { method: "POST" });
    const data = await res.json();
    setSending(false);
    if (!res.ok) {
      setMessage(data.error || "Send failed");
      return;
    }
    setMessage(`Sent to ${data.sent} contacts (${data.failed} failed)`);
  };

  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="text-[13px] text-zinc-500 flex items-center gap-1">
        <Link href="/dashboard?tab=broadcasts" className="hover:text-zinc-800">
          Broadcasts
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-zinc-800 font-medium truncate">{name}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-[18px] font-medium text-zinc-900 border-b border-transparent focus:border-zinc-300 focus:outline-none flex-1"
        />
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="h-9 px-4 rounded-md border border-zinc-300 text-[13px] font-medium cursor-pointer"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={sendNow}
            disabled={sending}
            className="h-9 px-4 rounded-md bg-zinc-900 text-white text-[13px] font-medium disabled:opacity-40 cursor-pointer"
          >
            {sending ? "Sending…" : "Send now"}
          </button>
        </div>
      </div>

      {message && (
        <p className="text-[13px] text-zinc-700 bg-zinc-100 rounded-md px-3 py-2">{message}</p>
      )}

      <section className="rounded-lg border border-zinc-200 bg-white">
        <div className="px-4 py-3 border-b border-zinc-100">
          <h2 className="text-[13px] font-medium text-zinc-800">Message template</h2>
          <p className="text-[12px] text-zinc-500 mt-0.5">
            {outside24h
              ? "Outside 24-hour window — needs Meta-approved template in production."
              : "Inside 24-hour window — session message."}
          </p>
        </div>
        <div className="p-4 space-y-3">
          <label className="flex items-center gap-2 text-[13px] text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={outside24h}
              onChange={(e) => setOutside24h(e.target.checked)}
            />
            Send outside 24 hour window (template mode)
          </label>
          <p className="text-[11px] text-zinc-500">
            Personalize:{" "}
            <code className="bg-zinc-100 px-1 rounded">{"{{first_name}}"}</code>,{" "}
            <code className="bg-zinc-100 px-1 rounded">{"{{email}}"}</code>,{" "}
            <code className="bg-zinc-100 px-1 rounded">{"{{full_name}}"}</code> — plus any
            column from your import (e.g.{" "}
            <code className="bg-zinc-100 px-1 rounded">{"{{company}}"}</code>).
          </p>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={8}
            className="w-full border border-zinc-200 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:border-zinc-400"
            placeholder="Hi {{first_name}}, we have new listings for you…"
          />
          <input
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="Footer (business name)"
            className="w-full h-9 border border-zinc-200 rounded-md px-3 text-[13px]"
          />
          <input
            value={optOutLine}
            onChange={(e) => setOptOutLine(e.target.value)}
            placeholder="Opt-out line"
            className="w-full h-9 border border-zinc-200 rounded-md px-3 text-[13px]"
          />
          <div className="flex gap-3 flex-wrap">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 border border-zinc-200 rounded-md px-2 text-[13px]"
            >
              <option value="marketing">Marketing</option>
              <option value="utility">Utility</option>
            </select>
            <select
              value={dailyCap}
              onChange={(e) => setDailyCap(Number(e.target.value))}
              className="h-9 border border-zinc-200 rounded-md px-2 text-[13px]"
            >
              {DAILY_LIMIT_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white">
        <div className="px-4 py-3 border-b border-zinc-100 flex justify-between items-center">
          <h2 className="text-[13px] font-medium text-zinc-800">Target audience</h2>
          <span className="text-[13px] text-zinc-600">
            {audienceCount} contacts will receive this
          </span>
        </div>
        <div className="p-4 space-y-2">
          <label className="text-[12px] text-zinc-500">Tags (comma separated, optional)</label>
          <input
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="leads, dubai, vip"
            className="w-full h-9 border border-zinc-200 rounded-md px-3 text-[13px]"
          />
          <p className="text-[12px] text-zinc-500">
            Contacts opt out when tagged STOP or marked opted out. Empty tags = all
            WhatsApp contacts (up to daily cap).
          </p>
        </div>
      </section>

      <div className="flex gap-2 text-[12px]">
        <button
          type="button"
          onClick={() => setDevMode(false)}
          className={`px-3 py-1 rounded-md border ${!devMode ? "border-zinc-800 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600"}`}
        >
          Owner view
        </button>
        <button
          type="button"
          onClick={() => setDevMode(true)}
          className={`px-3 py-1 rounded-md border ${devMode ? "border-zinc-800 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600"}`}
        >
          Developer
        </button>
      </div>

      {devMode && (
        <pre className="text-[11px] font-mono bg-zinc-950 text-zinc-100 rounded-lg p-4 overflow-auto">
          {JSON.stringify(
            {
              name,
              category,
              outside24h,
              dailyCap,
              audienceFilter,
              bodyText,
              footerText,
              optOutLine,
            },
            null,
            2
          )}
        </pre>
      )}

      <details className="text-[12px] text-zinc-600">
        <summary className="font-medium cursor-pointer">Meta policy checklist</summary>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          {META_BROADCAST_RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
