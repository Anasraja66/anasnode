"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plug, Search } from "lucide-react";
import { PROVIDERS, pluginsByProvider } from "@/lib/integrations/plugins";
import { AnalyticsPromoCard, IntegrationCard, IntegrationStatus } from "./IntegrationCard";

type ApiItem = {
  id: string;
  status: IntegrationStatus;
};

export function IntegrationsHub() {
  const [statusMap, setStatusMap] = useState<Record<string, IntegrationStatus>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [summary, setSummary] = useState({ connected: 0, total: 0 });

  useEffect(() => {
    fetch("/api/integrations/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const map: Record<string, IntegrationStatus> = {};
          data.integrations.forEach((i: ApiItem) => {
            map[i.id] = i.status;
          });
          setStatusMap(map);
          setSummary(data.summary);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const sections = PROVIDERS.map((prov) => ({
    ...prov,
    plugins: pluginsByProvider(prov.id).filter(
      (p) =>
        !filter ||
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.description.toLowerCase().includes(filter.toLowerCase())
    ),
  })).filter((c) => c.plugins.length > 0);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 hover:text-zinc-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0A6BFF] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Plug className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-[28px] font-extrabold text-zinc-900 tracking-tight">
                  Connect your business
                </h1>
                <p className="text-[15px] text-zinc-500 mt-1 max-w-xl font-medium">
                  Connect here once — WhatsApp, email, store. Anaos runs automations; you
                  keep using your phone normally.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <p className="text-[13px] font-bold text-[#0A6BFF]">
                    {summary.connected} of {summary.total} connected
                  </p>
                  <Link
                    href="/dashboard/setup"
                    className="text-[12px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    First time? Setup Help
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="search"
                placeholder="Search tools…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-[14px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-56 rounded-2xl bg-white border border-zinc-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          sections.map((section) => (
            <section key={section.id} className="space-y-4">
              <div>
                <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-zinc-800">
                  {section.label}
                </h2>
                <p className="text-[12.5px] text-zinc-400 font-semibold mt-0.5">
                  {section.description}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.plugins.map((p) => (
                  <IntegrationCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    description={p.description}
                    ownerHint={p.ownerHint}
                    status={(statusMap[p.id] || p.status) as IntegrationStatus}
                    connectLabel={p.connectLabel}
                    href={p.href}
                  />
                ))}
                {section.id === "meta" && <AnalyticsPromoCard />}
              </div>
            </section>
          ))
        )}

        <div className="rounded-xl border border-dashed border-zinc-300 bg-white/60 p-8 text-center">
          <p className="text-[14px] font-bold text-zinc-800">
            Prompt: &quot;My WhatsApp number is +1 300... — help qualify leads&quot;
          </p>
          <p className="text-[13px] text-zinc-500 mt-2 max-w-lg mx-auto">
            First Anaos generates your workflow plan, then you connect here — setup takes 5 minutes.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-[13px] font-bold transition-all"
          >
            Try prompt on home
          </Link>
        </div>
      </div>
    </div>
  );
}
