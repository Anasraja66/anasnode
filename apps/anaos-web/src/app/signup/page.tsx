"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { PasswordStrength } from "@/components/auth/PasswordStrength";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const prompt = searchParams?.get("prompt");
  const workspace = searchParams?.get("workspace");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setError("");
    setLoading(true);

    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update display name in Firebase
      await updateProfile(userCredential.user, { displayName: name });
      
      // 3. Get ID token
      const idToken = await userCredential.user.getIdToken();

      // 4. Send to backend to set session cookie and create Postgres Workspace
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        setError("Failed to initialize workspace. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Redirect
      const callbackUrl = searchParams?.get("callbackUrl");
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        const queryParams = new URLSearchParams();
        if (prompt) queryParams.set("prompt", prompt);
        if (workspace) queryParams.set("workspace", workspace);
        const queryString = queryParams.toString();
        router.push(queryString ? `/onboarding?${queryString}` : "/dashboard");
      }
      router.refresh();
      
    } catch (err: any) {
      console.error("Signup Error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Start automating your business in seconds"
      footerText="Already have an account?"
      footerLinkText="Log in instead"
      footerLinkHref="/login"
      cardMaxWidth="475px"
      cardRadius="32px"
      cardBorderColor="#C2C6D8"
    >
      {error && (
        <div className="p-4 rounded-2xl bg-red-50/80 border border-red-100 text-red-700 text-[14px] flex items-center gap-3 font-medium shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-700 text-[14px] flex items-center gap-3 font-medium shadow-sm">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
          <span>Account created successfully!</span>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-[13px] font-bold text-zinc-900 mb-1.5">Full name</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#0A6BFF] transition-colors">
              <User className="w-[18px] h-[18px]" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              disabled={loading}
              className="w-full h-11 bg-[#F8FAFC] border-none rounded-xl pl-11 pr-4 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0A6BFF]/20 transition-all disabled:opacity-50"
            />
          </div>
        </div>

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
          <label className="block text-[13px] font-bold text-zinc-900 mb-1.5">Password</label>
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
          <PasswordStrength password={password} />
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
              <span>Create your Workspace</span>
              <ArrowRight className="w-[18px] h-[18px]" />
            </>
          )}
        </button>
      </form>

      <AuthSocialButtons />
    </AuthLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0A6BFF]/20 border-t-[#0A6BFF] rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
