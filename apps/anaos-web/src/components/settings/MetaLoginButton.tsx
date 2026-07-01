"use client";

import { useState, useEffect } from "react";
import { Loader2, Link } from "lucide-react";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface MetaLoginButtonProps {
  appId: string;
  configId: string;
  accountId: string;
  onSuccess?: () => void;
}

export default function MetaLoginButton({ appId, configId, accountId, onSuccess }: MetaLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // Load the Facebook SDK asynchronously
    if (window.FB) {
      setSdkLoaded(true);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
      setSdkLoaded(true);
    };

    (function (d, s, id) {
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, [appId]);

  const launchWhatsAppSignup = () => {
    if (!sdkLoaded || !window.FB) {
      alert("Facebook SDK is still loading. Please try again in a moment.");
      return;
    }

    setLoading(true);

    // Launch Facebook login with WhatsApp config
    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          const code = response.authResponse.code;
          handleOAuthCallback(code);
        } else {
          console.log("User cancelled login or did not fully authorize.");
          setLoading(false);
        }
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "",
          sessionInfoVersion: "3",
        },
      }
    );
  };

  const handleOAuthCallback = async (code: string) => {
    try {
      const res = await fetch("/api/meta/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, accountId }),
      });

      const data = await res.json();
      if (data.success) {
        alert("WhatsApp account connected successfully!");
        onSuccess?.();
      } else {
        alert(`Failed to connect: ${data.error}`);
      }
    } catch (err) {
      alert("Network error during connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={launchWhatsAppSignup}
      disabled={loading || !sdkLoaded}
      className="px-5 py-2.5 bg-[#1877F2] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#1877F2]/90 disabled:opacity-70 transition-colors shadow-sm"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Link size={16} />}
      Connect with Facebook
    </button>
  );
}
