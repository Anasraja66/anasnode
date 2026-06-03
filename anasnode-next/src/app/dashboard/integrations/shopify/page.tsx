"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Loader2, Store } from "lucide-react";

export default function ShopifyConnectPage() {
  const [shop, setShop] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const webhook = origin ? `${origin}/api/webhooks/shopify` : "/api/webhooks/shopify";

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/integrations/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "shopify",
          name: shop,
          credentials: { shop, accessToken },
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
          <div className="w-12 h-12 rounded-xl bg-[#96bf48] flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[24px] font-extrabold">Shopify store</h1>
        </div>
        <div className="bg-white rounded-2xl border p-6 space-y-4 shadow-sm">
          <p className="text-[14px] text-zinc-600">
            Cart recovery, order updates, shipping — automations trigger from your store.
          </p>
          {message && (
            <p className="text-[13px] text-emerald-800 bg-emerald-50 rounded-xl px-3 py-2">
              {message}
            </p>
          )}
          <input
            className="w-full border rounded-xl px-4 py-2.5"
            placeholder="my-store.myshopify.com"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
          />
          <input
            type="password"
            className="w-full border rounded-xl px-4 py-2.5"
            placeholder="Admin API access token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
          <div className="text-[12px] text-zinc-500 bg-zinc-50 p-3 rounded-xl">
            <p className="font-bold mb-1">Webhook URL (paste in Shopify)</p>
            <code className="break-all">{webhook}</code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(webhook)}
              className="mt-2 flex items-center gap-1 text-[#0A6BFF] font-bold"
            >
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="w-full py-3 rounded-xl bg-zinc-900 text-white font-bold flex justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Connect Shopify
          </button>
        </div>
      </div>
    </div>
  );
}
