"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getPlugin, AnaosPlugin } from "@/lib/integrations/plugins";
import { MetaEmbeddedSignup } from "@/components/integrations/MetaEmbeddedSignup";

function fieldValueDefault(field: { key: string }) {
    return "";
}

export default function IntegrationConnectPage() {
    const params = useParams();
    const router = useRouter();
    const integrationId = params?.integrationId as string | undefined;
    const plugin = useMemo(() => (integrationId ? getPlugin(integrationId) : undefined), [integrationId]);

    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!plugin) return;

        const initial: Record<string, string> = {};
        plugin.formFields?.forEach((field) => {
            initial[field.key] = fieldValueDefault(field);
        });
        setFieldValues(initial);
    }, [plugin]);

    useEffect(() => {
        if (!plugin) return;
        fetch("/api/integrations/status")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const connectedItem = data.integrations.find((item: any) => item.id === plugin.id);
                    if (connectedItem && connectedItem.status === "connected") {
                        setConnected(true);
                    }
                }
            })
            .catch(() => undefined);
    }, [plugin]);

    if (!plugin) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] px-6 py-10">
                <div className="max-w-lg mx-auto bg-white rounded-3xl border border-zinc-200 p-8 text-center shadow-sm">
                    <AlertTriangle className="mx-auto mb-4 w-12 h-12 text-rose-500" />
                    <h1 className="text-2xl font-semibold text-zinc-900">Integration not found</h1>
                    <p className="mt-3 text-sm text-zinc-500">This integration is not available or the URL is invalid.</p>
                    <Link href="/dashboard/integrations" className="inline-flex mt-6 px-5 py-3 rounded-xl bg-[#0A6BFF] text-white font-semibold">
                        Back to integrations
                    </Link>
                </div>
            </div>
        );
    }

    const requiredFieldsMissing = plugin.formFields?.some((field) => field.required && !fieldValues[field.key]?.trim());
    const hubspotNeedsOne =
        plugin.id === "hubspot" &&
        (!fieldValues["apiKey"]?.trim() && !fieldValues["accessToken"]?.trim());

    const handleChange = (key: string, value: string) => {
        setFieldValues((current) => ({ ...current, [key]: value }));
    };

    const handleConnect = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (requiredFieldsMissing) {
            setError("Please fill all required fields.");
            return;
        }

        if (hubspotNeedsOne) {
            setError("Enter either a HubSpot API key or an access token.");
            return;
        }

        setSaving(true);

        try {
            const res = await fetch("/api/integrations/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: plugin.id,
                    name: plugin.name,
                    credentials: fieldValues,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to connect integration.");
            }
            setMessage(data.message || `${plugin.name} connected successfully.`);
            setConnected(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unexpected error.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] px-6 py-10">
            <div className="max-w-2xl mx-auto">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0A6BFF] flex items-center justify-center">
                        <span className="text-white text-lg font-bold">{plugin.name.charAt(0)}</span>
                    </div>
                    <div>
                        <h1 className="text-[24px] font-semibold">{plugin.name}</h1>
                        <p className="text-[14px] text-zinc-600">{plugin.description}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4 shadow-sm">
                    {connected ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <CheckCircle2 className="w-4 h-4" />
                                {plugin.name} is already connected.
                            </div>
                            <p className="text-[13px] text-emerald-700 mt-1">
                                You can update credentials below or continue using existing integration settings.
                            </p>
                        </div>
                    ) : null}

                    {error ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-900 text-sm">
                            {error}
                        </div>
                    ) : null}

                    {message ? (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 text-sm">
                            {message}
                        </div>
                    ) : null}

                    {plugin.notes ? (
                        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                            {plugin.notes}
                        </div>
                    ) : null}

                    {plugin.providerId === "meta" ? (
                        <div className="space-y-4">
                            {plugin.id === "whatsapp" ? (
                                <MetaEmbeddedSignup
                                    onSuccess={(msg) => {
                                        setMessage(msg);
                                        setConnected(true);
                                    }}
                                    onError={(msg) => setError(msg)}
                                />
                            ) : (
                                <a
                                    href={`/api/auth/meta/login?state=${plugin.id}`}
                                    className="inline-flex w-full items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0A6BFF] text-white font-semibold hover:bg-[#0954d4] transition-colors"
                                >
                                    {plugin.buttonLabel || `Connect ${plugin.name}`}
                                </a>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleConnect} className="space-y-4">
                            {plugin.formFields?.map((field) => (
                                <div key={field.key}>
                                    <label className="block text-[12px] font-semibold text-zinc-700 mb-2">
                                        {field.label}
                                        {field.required ? <span className="text-rose-600">*</span> : null}
                                    </label>
                                    {field.type === "textarea" ? (
                                        <textarea
                                            value={fieldValues[field.key] ?? ""}
                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full min-h-[110px] rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-900 transition"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            value={fieldValues[field.key] ?? ""}
                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full h-12 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none focus:border-zinc-900 transition"
                                        />
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={saving || requiredFieldsMissing || hubspotNeedsOne}
                                className="w-full h-12 rounded-2xl bg-[#0A6BFF] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : plugin.buttonLabel || `Connect ${plugin.name}`}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
