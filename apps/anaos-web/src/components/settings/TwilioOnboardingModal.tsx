"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Phone, X, ShoppingCart, Link, ChevronLeft, Building2 } from "lucide-react";

interface TwilioOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

type Step = "choice" | "buy" | "connect";

export default function TwilioOnboardingModal({ isOpen, onClose, accountId }: TwilioOnboardingModalProps) {
  const [step, setStep] = useState<Step>("choice");
  
  // Buy State
  const [country, setCountry] = useState("US");
  const [areaCode, setAreaCode] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [numbers, setNumbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);
  
  // Connect State
  const [connectPhone, setConnectPhone] = useState("");
  const [connectSid, setConnectSid] = useState("");
  const [connectToken, setConnectToken] = useState("");
  const [connecting, setConnecting] = useState(false);

  const [error, setError] = useState("");

  const resetState = () => {
    setStep("choice");
    setNumbers([]);
    setError("");
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/twilio/numbers/search?country=${country}&areaCode=${areaCode}`);
      const data = await res.json();
      if (data.success) {
        setNumbers(data.numbers || []);
      } else {
        setError(data.error || "Failed to search numbers");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (phoneNumber: string) => {
    setBuying(phoneNumber);
    setError("");
    try {
      const res = await fetch(`/api/twilio/numbers/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, accountId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Number purchased & configured successfully!");
        onClose();
        resetState();
      } else {
        setError(data.error || "Failed to purchase number");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Purchase failed due to network error");
    } finally {
      setBuying(null);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    setError("");
    try {
      const res = await fetch(`/api/twilio/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: connectPhone, accountSid: connectSid, authToken: connectToken, accountId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Your number is now connected to AnaOS!");
        onClose();
        resetState();
      } else {
        setError(data.error || "Failed to connect number");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Connection failed due to network error");
    } finally {
      setConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 20, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 20, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {step !== "choice" && (
                <button onClick={() => setStep("choice")} className="p-1 hover:bg-gray-200 rounded-full mr-2">
                  <ChevronLeft size={20} />
                </button>
              )}
              <Phone className="text-purple-600" size={18} />
              {step === "choice" ? "Setup Phone Number" : step === "buy" ? "Get a New Number" : "Connect Existing Number"}
            </h2>
            <button onClick={() => { onClose(); resetState(); }} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8">
            {error && <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>}

            {step === "choice" && (
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => setStep("buy")}
                  className="flex flex-col items-center p-8 text-center border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 rounded-2xl transition-all group"
                >
                  <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShoppingCart size={32} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Buy a New Number</h3>
                  <p className="text-sm text-gray-500">We will instantly provision a new number for your workspace ($2/mo).</p>
                </button>

                <button
                  onClick={() => setStep("connect")}
                  className="flex flex-col items-center p-8 text-center border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 rounded-2xl transition-all group"
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Link size={32} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Connect Your Own</h3>
                  <p className="text-sm text-gray-500">Bring your existing Twilio number. We will configure the webhooks automatically.</p>
                </button>
              </div>
            )}

            {step === "connect" && (
              <form onSubmit={handleConnect} className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 mb-6">
                  <Building2 className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-blue-900 font-semibold">How this works</p>
                    <p className="text-xs text-blue-700 mt-1">We will securely connect to your Twilio account and update the webhooks for the provided number so AnaOS can receive messages and calls.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input required type="text" value={connectPhone} onChange={e => setConnectPhone(e.target.value)} placeholder="+1234567890" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Account SID</label>
                  <input required type="text" value={connectSid} onChange={e => setConnectSid(e.target.value)} placeholder="ACxxxxxxxxxxxxxx" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Auth Token</label>
                  <input required type="password" value={connectToken} onChange={e => setConnectToken(e.target.value)} placeholder="••••••••••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" disabled={connecting} className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center gap-2">
                  {connecting ? <Loader2 size={18} className="animate-spin" /> : <Link size={18} />}
                  Connect Number
                </button>
              </form>
            )}

            {step === "buy" && (
              <div>
                <div className="flex gap-3 mb-6">
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500">
                    <option value="US">United States (US)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="CA">Canada (CA)</option>
                  </select>
                  <input type="text" value={areaCode} onChange={e => setAreaCode(e.target.value)} placeholder="Area Code (e.g. 415)" className="w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-purple-500" />
                  <button onClick={handleSearch} disabled={loading} className="w-1/3 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-70">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Search
                  </button>
                </div>
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {numbers.map((num, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-purple-500 transition-colors">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg tracking-tight">{num.friendlyName}</h3>
                        <div className="flex gap-2 mt-1">
                          {num.capabilities?.SMS && <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase">SMS</span>}
                          {num.capabilities?.Voice && <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-full uppercase">Voice</span>}
                        </div>
                      </div>
                      <button onClick={() => handleBuy(num.phoneNumber)} disabled={buying === num.phoneNumber} className="px-5 py-2.5 bg-purple-50 text-purple-700 font-bold rounded-lg flex items-center gap-2 hover:bg-purple-100 disabled:opacity-50">
                        {buying === num.phoneNumber ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />} Buy $2/mo
                      </button>
                    </div>
                  ))}
                  {numbers.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-400">Search to find available numbers.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
