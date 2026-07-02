"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";

type MetaConfig = {
  configured: boolean;
  appId: string;
  configId: string;
  graphVersion: string;
  setupHint: string | null;
};

type EmbeddedSession = {
  wabaId?: string;
  phoneNumberId?: string;
  businessId?: string;
  event?: string;
  pageIds?: string[];
  instagramAccountIds?: string[];
};

type FbLoginResponse = {
  authResponse?: { code?: string };
  status?: string;
};



type Props = {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  activateWorkflow?: boolean;
};

export function MetaEmbeddedSignup({
  onSuccess,
  onError,
  activateWorkflow = true,
}: Props) {
  const [config, setConfig] = useState<MetaConfig | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const sessionRef = useRef<EmbeddedSession>({});
  const pendingCodeRef = useRef<string | null>(null);
  const completingRef = useRef(false);

  useEffect(() => {
    fetch("/api/integrations/meta/config")
      .then((r) => r.json())
      .then((data) => setConfig(data))
      .catch(() => setConfig(null));
  }, []);

  const completeConnection = useCallback(
    async (code: string, session: EmbeddedSession) => {
      if (completingRef.current) return;
      completingRef.current = true;
      setLoading(true);

      try {
        const res = await fetch("/api/integrations/meta/whatsapp/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            wabaId: session.wabaId,
            phoneNumberId: session.phoneNumberId,
            businessId: session.businessId,
            event: session.event,
            pageIds: session.pageIds,
            instagramAccountIds: session.instagramAccountIds,
            activateDefaultWorkflow: activateWorkflow,
            aiAutoReply: true,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          onError?.(data.error || "Connection failed");
          return;
        }
        onSuccess?.(data.message || "WhatsApp connected");
      } catch {
        onError?.("Network error while saving WhatsApp connection");
      } finally {
        completingRef.current = false;
        setLoading(false);
        pendingCodeRef.current = null;
      }
    },
    [activateWorkflow, onError, onSuccess]
  );

  const tryFinish = useCallback(() => {
    const code = pendingCodeRef.current;
    const { wabaId, phoneNumberId } = sessionRef.current;
    if (code && wabaId && phoneNumberId) {
      void completeConnection(code, sessionRef.current);
    }
  }, [completeConnection]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!event.origin.endsWith("facebook.com")) return;

      let payload: {
        type?: string;
        event?: string;
        data?: Record<string, unknown>;
      };

      try {
        payload =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      if (payload?.type !== "WA_EMBEDDED_SIGNUP") return;

      const eventName = payload.event;
      const data = payload.data || {};

      if (eventName === "CANCEL") {
        const step = data.current_step as string | undefined;
        if (step) {
          onError?.(`Setup cancelled at: ${step}`);
        }
        return;
      }

      if (eventName === "ERROR") {
        onError?.(
          (data.error_message as string) || "Meta reported an error during setup"
        );
        return;
      }

      const phoneNumberId = data.phone_number_id as string | undefined;
      const wabaId = data.waba_id as string | undefined;

      if (phoneNumberId) sessionRef.current.phoneNumberId = phoneNumberId;
      if (wabaId) sessionRef.current.wabaId = wabaId;
      if (data.business_id) sessionRef.current.businessId = data.business_id as string;
      if (eventName) sessionRef.current.event = eventName;
      if (Array.isArray(data.page_ids)) {
        sessionRef.current.pageIds = data.page_ids as string[];
      }
      if (Array.isArray(data.instagram_account_ids)) {
        sessionRef.current.instagramAccountIds = data.instagram_account_ids as string[];
      }

      tryFinish();
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onError, tryFinish]);

  const initSdk = useCallback(() => {
    if (!config?.configured || !(window as any).FB) return;
    (window as any).FB.init({
      appId: config.appId,
      autoLogAppEvents: true,
      xfbml: true,
      version: config.graphVersion,
    });
    setSdkReady(true);
  }, [config]);

  useEffect(() => {
    if (config?.configured) {
      (window as any).fbAsyncInit = initSdk;
      if ((window as any).FB) initSdk();
    }
  }, [config, initSdk]);

  const launchSignup = () => {
    if (!config?.configured || !(window as any).FB || !sdkReady) {
      onError?.("Meta is not configured yet. Add app ID and config ID to .env.");
      return;
    }

    sessionRef.current = {};
    pendingCodeRef.current = null;

    (window as any).FB.login(
      (response) => {
        if (response.authResponse?.code) {
          pendingCodeRef.current = response.authResponse.code;
          tryFinish();
        } else if (response.status === "not_authorized") {
          onError?.("Meta permission was not granted.");
        }
      },
      {
        config_id: config.configId,
        response_type: "code",
        override_default_response_type: true,
        extras: { setup: {} },
      }
    );
  };

  if (!config) {
    return (
      <div className="h-12 rounded-xl bg-zinc-100 animate-pulse" aria-hidden />
    );
  }

  if (!config.configured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-[13px] text-amber-900 font-sans">
        <p className="font-bold">Please configure Meta settings first (one-time setup)</p>
        <p className="mt-1 text-amber-800">
          {config.setupHint || "Dashboard → Setup Help — paste the 3 required Meta parameters."}
        </p>
        <a
          href="/dashboard/setup"
          className="inline-block mt-3 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-[13px] font-bold transition-colors"
        >
          Open Setup Help
        </a>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() => {
          if ((window as any).fbAsyncInit) (window as any).fbAsyncInit();
        }}
      />
      <button
        type="button"
        disabled={loading || !sdkReady}
        onClick={launchSignup}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#1877F2] text-white font-bold text-[15px] hover:bg-[#166FE5] disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )}
        Connect with Meta
      </button>
      <p className="text-[12px] text-zinc-500 text-center mt-2">
        Official Meta popup — business name, WhatsApp number, permissions. No API keys.
      </p>
    </>
  );
}
