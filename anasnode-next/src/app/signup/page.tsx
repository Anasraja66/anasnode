"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to register. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Auto login after successful signup
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic glow grids */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[22px] font-semibold tracking-tight hover:opacity-90 transition-opacity">
            <span>Anaos</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
          </Link>
          <p className="text-[13.5px] text-zinc-400 mt-2">Get started free with your custom operational AI workspace</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl p-7 shadow-2xl relative"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[12.5px] flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12.5px] flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Account created! Logging you in...</span>
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4.5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={loading || success}
                  className="w-full h-11 bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10.5 pr-4 text-[13.5px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-800/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Email address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={loading || success}
                  className="w-full h-11 bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10.5 pr-4 text-[13.5px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-800/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  disabled={loading || success}
                  className="w-full h-11 bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10.5 pr-4 text-[13.5px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-800/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full h-11 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 rounded-xl font-medium text-[13.5px] flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex gap-1 justify-center items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-800/60 text-center">
            <p className="text-[12.5px] text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-zinc-100 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
