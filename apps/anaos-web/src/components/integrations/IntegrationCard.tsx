"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  BarChart2,
} from "lucide-react";
import BrandIcon from "../ui/BrandIcon";

export type IntegrationStatus =
  | "connected"
  | "platform"
  | "action_required"
  | "available"
  | "coming_soon";

const ACCENT: Record<string, string> = {
  whatsapp: "from-emerald-500/15 to-emerald-600/5 border-emerald-200",
  shopify: "from-[#96bf48]/20 to-[#5E8E3E]/5 border-[#96bf48]/40",
  smtp: "from-blue-500/15 to-blue-600/5 border-blue-200",
  default: "from-zinc-100 to-white border-zinc-200",
};

type Props = {
  id: string;
  name: string;
  description: string;
  ownerHint: string;
  status: IntegrationStatus;
  connectLabel: string;
  href?: string;
  onConnect?: () => void;
};

export function IntegrationCard({
  id,
  name,
  description,
  ownerHint,
  status,
  connectLabel,
  href,
  onConnect,
}: Props) {
  const accent = ACCENT[id] || ACCENT.default;
  const isLive = status === "connected" || status === "platform";
  const isSoon = status === "coming_soon";

  const statusBadge = () => {
    if (status === "connected")
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3" /> Connected
        </span>
      );
    if (status === "platform")
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3 h-3" /> Live on server
        </span>
      );
    if (status === "action_required")
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
          Action required
        </span>
      );
    if (isSoon)
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full">
          <Clock className="w-3 h-3" /> Soon
        </span>
      );
    return (
      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        Not connected
      </span>
    );
  };

  const actionClass =
    "inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-bold transition-all";

  return (
    <article
      className={`flex flex-col h-full rounded-2xl border bg-gradient-to-br ${accent} p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center shadow-sm">
          <BrandIcon id={id} className="w-6 h-6" />
        </div>
        {statusBadge()}
      </div>

      <h3 className="text-[16px] font-bold text-zinc-900 leading-tight">{name}</h3>
      <p className="text-[13px] text-zinc-600 mt-2 leading-relaxed flex-1">{description}</p>
      <p className="text-[11px] text-zinc-400 mt-3 font-medium">{ownerHint}</p>

      <div className="mt-5 pt-4 border-t border-zinc-200/60">
        {isSoon ? (
          <button
            type="button"
            disabled
            className={`${actionClass} bg-zinc-100 text-zinc-400 cursor-not-allowed`}
          >
            {connectLabel}
          </button>
        ) : href ? (
          <Link
            href={href}
            className={`${actionClass} ${
              isLive
                ? "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50"
                : "bg-[#0A6BFF] text-white hover:bg-[#0958d4]"
            }`}
          >
            {isLive ? "Manage connection" : connectLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className={`${actionClass} bg-[#0A6BFF] text-white hover:bg-[#0958d4]`}
          >
            {connectLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </article>
  );
}

type ProviderChannelItem = {
  id: string;
  name: string;
  status: IntegrationStatus;
  href?: string;
};

type ProviderIntegrationCardProps = {
  id: string;
  label: string;
  description: string;
  channels: ProviderChannelItem[];
  href: string;
};

function ProviderStatusBadge({ status }: { status: IntegrationStatus }) {
  if (status === "connected") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> Connected
      </span>
    );
  }
  if (status === "platform") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> Live on server
      </span>
    );
  }
  if (status === "action_required") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
        Action required
      </span>
    );
  }
  if (status === "coming_soon") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full">
        <Clock className="w-3 h-3" /> Soon
      </span>
    );
  }
  return (
    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      Not connected
    </span>
  );
}

function resolveProviderStatus(channels: ProviderChannelItem[]): IntegrationStatus {
  if (channels.some((c) => c.status === "action_required")) return "action_required";
  if (channels.some((c) => c.status === "connected")) return "connected";
  if (channels.some((c) => c.status === "platform")) return "platform";
  if (channels.length > 0 && channels.every((c) => c.status === "coming_soon")) return "coming_soon";
  return "available";
}

export function ProviderIntegrationCard({ id, label, description, channels, href }: ProviderIntegrationCardProps) {
  const status = resolveProviderStatus(channels);
  const actionClass =
    "inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-bold transition-all";
  const isLive = status === "connected" || status === "platform";

  return (
    <article className="flex flex-col h-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-center shadow-sm">
          <BrandIcon id={id} className="w-6 h-6" />
        </div>
        <ProviderStatusBadge status={status} />
      </div>

      <h3 className="text-[16px] font-bold text-zinc-900 leading-tight">{label}</h3>
      <p className="text-[13px] text-zinc-600 mt-2 leading-relaxed flex-1">{description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {channels.map((c) => (
          <Link
            key={c.id}
            href={c.href || href}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors text-[11.5px] font-semibold text-zinc-700"
            title={c.name}
          >
            <BrandIcon id={c.id} className="w-3.5 h-3.5" />
            <span className="max-w-[120px] truncate">{c.name}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                c.status === "connected" || c.status === "platform"
                  ? "bg-emerald-500"
                  : c.status === "action_required"
                    ? "bg-orange-500"
                    : c.status === "coming_soon"
                      ? "bg-zinc-400"
                      : "bg-amber-400"
              }`}
            />
          </Link>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-200/60">
        <Link
          href={href}
          className={`${actionClass} ${
            isLive
              ? "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50"
              : "bg-[#0A6BFF] text-white hover:bg-[#0958d4]"
          }`}
        >
          {isLive ? "Manage connection" : "Connect"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}

export function AnalyticsPromoCard() {
  return (
    <Link
      href="/dashboard?tab=analytics"
      className="flex flex-col h-full rounded-2xl border border-[#0A6BFF]/30 bg-gradient-to-br from-[#0A6BFF]/10 to-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-11 h-11 rounded-xl bg-[#0A6BFF] flex items-center justify-center mb-4">
        <BarChart2 className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-[16px] font-bold text-zinc-900">Analytics</h3>
      <p className="text-[13px] text-zinc-600 mt-2 flex-1">
        Messages sent, automations runs, and recovery stats — from your real activity.
      </p>
      <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold text-[#0A6BFF]">
        View dashboard <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
