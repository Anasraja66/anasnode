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
      {/* Background Grid & Slow Floating Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, -25, 0],
          y: [0, 25, 0]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-sky-400/10 blur-[120px] pointer-events-none" 
      />
      
      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo and title */}
        <motion.div 
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2.5 text-[24px] font-extrabold tracking-tight hover:opacity-90 transition-opacity">
            <span className="w-7 h-7 rounded-lg bg-[#0A6BFF] flex items-center justify-center text-white text-[14px] font-black shadow-sm">A</span>
            <span className="text-zinc-950">Anaos</span>
          </Link>
          <p className="text-[14px] text-zinc-500 mt-2 font-medium">Get started free with your custom operational AI workspace</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-zinc-200 bg-white/95 backdrop-blur-md p-8 shadow-xl relative"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2 font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] flex items-center gap-2 font-medium"
            >
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Account created! Logging you in...</span>
            </motion.div>
          )}

          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSignup} 
            className="space-y-4.5"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={loading || success}
                  className="w-full h-11 bg-white border border-zinc-200 rounded-xl pl-10.5 pr-4 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Email address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  disabled={loading || success}
                  className="w-full h-11 bg-white border border-zinc-200 rounded-xl pl-10.5 pr-4 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
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
                  className="w-full h-11 bg-white border border-zinc-200 rounded-xl pl-10.5 pr-4 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-4 focus:ring-blue-500/10 transition-all disabled:opacity-50"
                />
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading || success}
              className="w-full h-11 bg-[#0A6BFF] text-white hover:bg-blue-600 disabled:opacity-50 rounded-xl font-bold text-[14px] flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg shadow-blue-500/15 cursor-pointer mt-4"
            >
              {loading ? (
                <span className="flex gap-1.5 justify-center items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <p className="text-[13px] text-zinc-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-[#0A6BFF] hover:underline font-bold transition-all">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
