"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { WorkflowBackground } from "@/components/ui/WorkflowBackground";

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
        router.push("/onboarding");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Premium minimal background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#0A6BFF] opacity-[0.04] blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[440px] relative z-10 flex flex-col items-center">
        {/* Logo and title */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 w-full"
        >
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-zinc-200/80 mb-5 group hover:shadow-md transition-all">
            <span className="text-[#0A6BFF] text-[20px] font-black italic transform group-hover:scale-110 transition-transform">A</span>
          </Link>
          <h1 className="text-[26px] font-extrabold tracking-tight text-zinc-900 mb-2">Create your workspace</h1>
          <p className="text-[15px] text-zinc-500 font-medium">Start automating your business in seconds</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-[28px] border border-zinc-200/80 bg-white/70 backdrop-blur-xl p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] relative"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-50/80 border border-red-100 text-red-700 text-[14px] flex items-center gap-3 font-medium shadow-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-700 text-[14px] flex items-center gap-3 font-medium shadow-sm"
            >
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
              <span>Account created successfully!</span>
            </motion.div>
          )}

          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSignup} 
            className="space-y-5"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-[13px] font-bold text-zinc-700 mb-2">Full Name</label>
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
                  className="w-full h-12 bg-white/80 border border-zinc-200/80 rounded-2xl pl-11 pr-4 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-4 focus:ring-[#0A6BFF]/10 transition-all disabled:opacity-50 shadow-sm"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-[13px] font-bold text-zinc-700 mb-2">Email Address</label>
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
                  className="w-full h-12 bg-white/80 border border-zinc-200/80 rounded-2xl pl-11 pr-4 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-4 focus:ring-[#0A6BFF]/10 transition-all disabled:opacity-50 shadow-sm"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-[13px] font-bold text-zinc-700 mb-2">Password</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#0A6BFF] transition-colors">
                  <Lock className="w-[18px] h-[18px]" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full h-12 bg-white/80 border border-zinc-200/80 rounded-2xl pl-11 pr-4 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-4 focus:ring-[#0A6BFF]/10 transition-all disabled:opacity-50 shadow-sm"
                />
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0A6BFF] text-white hover:bg-blue-600 disabled:opacity-50 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(10,107,255,0.25)] hover:shadow-[0_6px_20px_rgba(10,107,255,0.23)] active:scale-[0.98] cursor-pointer mt-6"
            >
              {loading ? (
                <span className="flex gap-1.5 justify-center items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              ) : (
                <>
                  <span>Create workspace</span>
                  <ArrowRight className="w-[18px] h-[18px]" />
                </>
              )}
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Footer Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-[14px] text-zinc-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0A6BFF] hover:text-blue-600 font-bold transition-colors">
              Log in instead
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
