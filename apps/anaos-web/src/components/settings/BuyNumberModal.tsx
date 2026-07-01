"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Phone, X, ShoppingCart } from "lucide-react";

interface BuyNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

export default function BuyNumberModal({ isOpen, onClose, accountId }: BuyNumberModalProps) {
  const [country, setCountry] = useState("US");
  const [areaCode, setAreaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);
  const [numbers, setNumbers] = useState<any[]>([]);
  const [error, setError] = useState("");

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
        alert("Number purchased successfully!");
        onClose();
      } else {
        setError(data.error || "Failed to purchase number");
      }
    } catch (err) {
      setError("Purchase failed due to network error");
    } finally {
      setBuying(null);
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
          className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Phone className="text-purple-600" size={18} />
              Buy Virtual Number
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex gap-3 mb-6">
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-1/3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
              </select>
              <input
                type="text"
                value={areaCode}
                onChange={e => setAreaCode(e.target.value)}
                placeholder="Area Code (e.g. 415)"
                className="w-1/3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-1/3 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-70 transition-colors"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Search
              </button>
            </div>

            {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}

            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
              {numbers.map((num, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-500 transition-colors group">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg tracking-tight">{num.friendlyName}</h3>
                    <div className="flex gap-2 mt-1">
                      {num.capabilities?.SMS && <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full uppercase">SMS</span>}
                      {num.capabilities?.Voice && <span className="text-[10px] font-bold px-2 py-0.5 bg-green-50 text-green-600 rounded-full uppercase">Voice</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(num.phoneNumber)}
                    disabled={buying === num.phoneNumber}
                    className="px-4 py-2 bg-purple-50 text-purple-700 font-bold text-sm rounded-lg flex items-center gap-2 hover:bg-purple-100 disabled:opacity-50 transition-colors"
                  >
                    {buying === num.phoneNumber ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
                    Buy $2/mo
                  </button>
                </div>
              ))}
              
              {numbers.length === 0 && !loading && (
                <div className="text-center py-10 text-gray-400 text-sm">
                  Search for a country and area code to see available numbers.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
