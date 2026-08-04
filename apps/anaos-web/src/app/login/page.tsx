"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams?.get("prompt");
  const workspace = searchParams?.get("workspace");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Send to backend to set session cookie
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        const callbackUrl = searchParams?.get("callbackUrl");
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (prompt) {
          const queryParams = new URLSearchParams();
          queryParams.set("prompt", prompt);
          if (workspace) queryParams.set("workspace", workspace);
          router.push(`/onboarding?${queryParams.toString()}`);
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your AI workflows"
      footerText="Don't have an account?"
      footerLinkText="Create one free"
      footerLinkHref="/signup"
      cardMaxWidth="500px"
      cardRadius="24px"
      cardBorderColor="#F3F4F6"
    >
      {error && (
        <div className="p-4 rounded-2xl bg-red-50/80 border border-red-100 text-red-700 text-[14px] flex items-center gap-3 font-medium shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-[13px] font-bold text-zinc-900 mb-1.5">Email Address</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#0A6BFF] transition-colors">
              <Mail className="w-[18px] h-[18px]" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              disabled={loading}
              className="w-full h-11 bg-[#F8FAFC] border-none rounded-xl pl-11 pr-4 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0A6BFF]/20 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-[13px] font-bold text-zinc-900">Password</label>
            <a href="#" className="text-[12px] text-[#0A6BFF] hover:text-blue-600 font-bold transition-colors">Forgot?</a>
          </div>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#0A6BFF] transition-colors">
              <Lock className="w-[18px] h-[18px]" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full h-11 bg-[#F8FAFC] border-none rounded-xl pl-11 pr-11 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0A6BFF]/20 transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#0A6BFF] text-white hover:bg-blue-600 disabled:opacity-50 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 transition-all mt-6 cursor-pointer"
        >
          {loading ? (
            <span className="flex gap-1.5 justify-center items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          ) : (
            <>
              <span>Log in securely</span>
              <ArrowRight className="w-[18px] h-[18px]" />
            </>
          )}
        </button>
      </form>

      <AuthSocialButtons />
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0A6BFF]/20 border-t-[#0A6BFF] rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
