"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Shield, Users, Key, CheckCircle2, AlertCircle } from "lucide-react";

export default function JoinTeamPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const router = useRouter();
  const [invite, setInvite] = useState<{
    email: string;
    role: string;
    accountName: string;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchInvite() {
      try {
        const res = await fetch(`/api/team/invite/${token}`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || "Failed to load invitation.");
        } else {
          setInvite(data.invite);
        }
      } catch (err) {
        setError("Something went wrong. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchInvite();
  }, [params.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/team/invite/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to accept invite.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
        <div className="z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center shadow-sm justify-center animate-pulse">
            <Zap className="w-6 h-6 text-blue-400 fill-current" />
          </div>
          <p className="text-[14px] font-medium text-zinc-400">Verifying invitation link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients & Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_60%)]" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-[460px] z-10">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200 flex items-center shadow-sm justify-center shadow-lg ring-1 ring-white/10 mb-3">
            <Zap className="w-5.5 h-5.5 text-blue-400 fill-current" />
          </div>
          <span className="text-[17px] font-bold text-white tracking-tighter">ANASNODE</span>
          <span className="text-[9px] font-bold text-zinc-500 tracking-[0.25em] uppercase mt-1">Invitation Portal</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          {error && !success && (
            <div className="mb-6 p-4 bg-red-950/30 border border-red-900/50 rounded-2xl flex gap-3 text-red-300 text-[13px] leading-relaxed">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Verification Error</p>
                <p className="text-red-400/90 mt-0.5">{error}</p>
                {!invite && (
                  <button 
                    onClick={() => router.push("/login")}
                    className="mt-3 text-[12px] font-bold text-white underline cursor-pointer"
                  >
                    Go to Login
                  </button>
                )}
              </div>
            </div>
          )}

          {success ? (
            <div className="py-8 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
              >
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </motion.div>
              <h2 className="text-[20px] font-semibold tracking-tight mb-2 text-white">Invitation Accepted!</h2>
              <p className="text-[14px] text-zinc-400 leading-relaxed max-w-[280px]">
                Your account has been created. Redirecting you to login portal in a moment...
              </p>
            </div>
          ) : invite ? (
            <div>
              <div className="mb-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  {invite.role === "admin" ? <Shield className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400">Team Invitation</p>
                  <p className="text-[14px] font-bold text-zinc-200 truncate mt-0.5">
                    {invite.accountName || "AnasNode Team"}
                  </p>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
                  {invite.role}
                </div>
              </div>

              <div className="mb-6 text-center sm:text-left">
                <h2 className="text-[18px] font-bold tracking-tight mb-1">Setup Your Account</h2>
                <p className="text-[13px] text-zinc-400">
                  Create your password for <span className="text-zinc-200 font-medium">{invite.email}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 ml-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-zinc-200 focus:border-blue-500 focus:bg-zinc-950/90 text-[14px] text-white placeholder-zinc-650 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 ml-1">
                    Choose Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-white border border-zinc-200 focus:border-blue-500 focus:bg-zinc-950/90 text-[14px] text-white placeholder-zinc-650 transition-all outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 text-[14px] font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center cursor-pointer mt-6"
                >
                  {submitting ? "Processing..." : "Accept & Create Account"}
                </button>
              </form>
            </div>
          ) : null}
        </motion.div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-zinc-600 mt-6 leading-relaxed">
          Secure invitation powered by AnasNode Security Gateway. <br />
          If you didn't expect this invitation, please contact system admin.
        </p>
      </div>
    </div>
  );
}
