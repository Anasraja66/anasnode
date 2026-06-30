"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Calendar, Loader2, Info } from "lucide-react";

export default function GoogleCalendarSetupPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  
  const [calendarName, setCalendarName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Check if already connected
    fetch("/api/integrations/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const cal = data.integrations.find((i: any) => i.id === "google_calendar");
          if (cal && cal.status === "connected") {
            setConnected(true);
            setCalendarName(cal.credentialName || "Primary Calendar");
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;

    setConnecting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/integrations/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "google_calendar",
          name: calendarName || "Primary Calendar",
          credentials: {
            email: googleEmail.trim(),
            calendarName: calendarName || "Primary Calendar",
            isMock: true
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to connect Google Calendar");
      }

      setMessage("Google Calendar connected successfully! AI booking is now active.");
      setConnected(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans">
      <div className="max-w-xl mx-auto px-6 py-10">
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-zinc-500 hover:text-zinc-800 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All connections
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-[22px] font-semibold text-zinc-900">Google Calendar</h1>
            <p className="text-[14px] text-zinc-500 font-medium">
              Schedule meetings, viewings, and appointments from conversations automatically.
            </p>
          </div>
        </div>

        {message && (
          <p className="mb-4 text-[13px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 text-[13px] font-medium text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-6">
          {!connected ? (
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <h2 className="text-[18px] font-bold text-zinc-900">
                  Connect Your Google Calendar
                </h2>
                <p className="text-[13.5px] text-zinc-650 mt-1">
                  Once connected, the AI will offer available slots from your calendar and book appointments instantly.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-550 mb-1 ml-0.5">
                    Google Account Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="w-full h-11 px-4 border border-zinc-200 focus:border-zinc-800 bg-zinc-50 rounded-xl text-[14px] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-550 mb-1 ml-0.5">
                    Calendar Name / Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="Primary Calendar, Bookings, viewings"
                    value={calendarName}
                    onChange={(e) => setCalendarName(e.target.value)}
                    className="w-full h-11 px-4 border border-zinc-200 focus:border-zinc-800 bg-zinc-50 rounded-xl text-[14px] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 flex gap-3 text-[13px] leading-relaxed text-blue-900">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Instant Sandbox Booking Activated</p>
                  <p className="mt-0.5 opacity-90">
                    Running in development sandbox mode. Bookings will simulate realistic time slots and save directly to your database without needing Google OAuth setup.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={connecting || !googleEmail}
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-850 disabled:bg-zinc-350 text-white rounded-xl text-[13.5px] font-bold shadow-md transition-all flex items-center justify-center cursor-pointer mt-6"
              >
                {connecting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                Connect Google Account
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-[17px] font-bold text-zinc-900">Google Calendar Connected</p>
                <p className="text-[13px] text-zinc-400 mt-0.5">Active on: {calendarName || "Primary Calendar"}</p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setConnected(false)}
                  className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-[13px] font-bold text-zinc-650 transition-all cursor-pointer"
                >
                  Change Account
                </button>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] transition-all shadow-sm"
                >
                  Open dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
