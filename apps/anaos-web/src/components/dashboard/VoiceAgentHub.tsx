"use client";

import { useState, useEffect } from "react";
import { Mic, PhoneCall, Save, Settings, Sparkles, Volume2, Key, Globe, Shield, Play, Loader2 } from "lucide-react";

export function VoiceAgentHub() {
  const [tab, setTab] = useState<"native" | "advanced">("native");
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [prompt, setPrompt] = useState("You are an AI assistant for a real estate agency. You answer calls, ask about their budget, and schedule viewings.");
  const [firstMessage, setFirstMessage] = useState("Hello! This is AnaOS Real Estate. How can I help you today?");
  const [voiceId, setVoiceId] = useState("eleven_rachel");
  
  // Advanced State
  const [provider, setProvider] = useState("anaos");
  const [customKey, setCustomKey] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/voice-agent")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setPrompt(data.data.systemPrompt);
          setFirstMessage(data.data.firstMessage);
          setVoiceId(data.data.voiceId);
          setProvider(data.data.provider);
          setCustomKey(data.data.customApiKey || "");
          if (data.data.provider !== "anaos") {
            setTab("advanced");
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: prompt,
          firstMessage,
          voiceId,
          provider: tab === "native" ? "anaos" : provider,
          customApiKey: customKey,
        }),
      });
      if (res.ok) {
        alert("Voice Agent configuration saved successfully!");
      } else {
        alert("Failed to save configuration.");
      }
    } catch (e) {
      alert("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-purple-600" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Mic className="text-purple-600" size={32} />
            Voice AI Agent
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl text-[15px]">
            Deploy a human-like AI caller to answer inbound phone calls or make outbound sales calls. Powered by ElevenLabs and OpenAI.
          </p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setTab("native")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "native" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            AnaOS Voice
          </button>
          <button 
            onClick={() => setTab("advanced")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${tab === "advanced" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            <Settings size={16} /> Advanced (BYOK)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Configuration Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {tab === "native" ? (
            <>
              {/* Native Voice Config */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <Sparkles className="text-amber-500" size={20} />
                  <h2 className="text-lg font-bold text-gray-900">Agent Persona & Behavior</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Message (Greeting)</label>
                    <input 
                      type="text" 
                      value={firstMessage}
                      onChange={e => setFirstMessage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">What the AI says immediately when the call connects.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">System Prompt</label>
                    <textarea 
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">Instruct the AI on how to behave, what questions to ask, and its overall tone.</p>
                  </div>
                </div>
              </div>

              {/* Voice Selection */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <Volume2 className="text-blue-500" size={20} />
                  <h2 className="text-lg font-bold text-gray-900">Voice Selection (ElevenLabs)</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "eleven_rachel", name: "Rachel", desc: "Professional, Female, American" },
                    { id: "eleven_drew", name: "Drew", desc: "Energetic, Male, American" },
                    { id: "eleven_charlotte", name: "Charlotte", desc: "Friendly, Female, British" },
                    { id: "eleven_callum", name: "Callum", desc: "Deep, Male, British" },
                  ].map(voice => (
                    <div 
                      key={voice.id}
                      onClick={() => setVoiceId(voice.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${voiceId === voice.id ? "border-purple-500 bg-purple-50/50" : "border-gray-100 hover:border-gray-200 bg-white"}`}
                    >
                      <button className={`p-2 rounded-full shrink-0 ${voiceId === voice.id ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"}`}>
                        <Play size={16} fill="currentColor" />
                      </button>
                      <div>
                        <p className={`font-bold text-sm ${voiceId === voice.id ? "text-purple-900" : "text-gray-900"}`}>{voice.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{voice.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Advanced BYOK Config */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <Shield className="text-emerald-500" size={20} />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Bring Your Own Key (BYOK)</h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Connect external voice AI providers like Vapi or Retell directly.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Provider</label>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setProvider("vapi")}
                        className={`flex-1 py-3 border-2 rounded-xl text-sm font-bold transition-all ${provider === "vapi" ? "border-emerald-500 bg-emerald-50/50 text-emerald-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                      >
                        Vapi.ai
                      </button>
                      <button 
                        onClick={() => setProvider("retell")}
                        className={`flex-1 py-3 border-2 rounded-xl text-sm font-bold transition-all ${provider === "retell" ? "border-emerald-500 bg-emerald-50/50 text-emerald-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                      >
                        Retell AI
                      </button>
                      <button 
                        onClick={() => setProvider("bland")}
                        className={`flex-1 py-3 border-2 rounded-xl text-sm font-bold transition-all ${provider === "bland" ? "border-emerald-500 bg-emerald-50/50 text-emerald-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                      >
                        Bland AI
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                      <Key size={14} className="text-gray-400" />
                      API Key
                    </label>
                    <input 
                      type="password" 
                      value={customKey}
                      onChange={e => setCustomKey(e.target.value)}
                      placeholder={`Enter your ${provider === 'vapi' ? 'Vapi' : provider === 'retell' ? 'Retell' : 'Bland'} Private Key`}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      If configured, AnaOS will bypass the native engine and proxy calls directly to this provider. You will be billed by the provider for voice minutes.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Bar */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button className="px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center gap-2 text-sm shadow-md shadow-gray-900/20 disabled:opacity-70"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>

        {/* Sidebar: Telephony & Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-bl-full -z-10 opacity-50"></div>
            
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
                <PhoneCall size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Phone Number</h3>
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Inbound Line</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center mb-4">
              <p className="text-xl font-mono font-bold text-gray-900 tracking-wider">+1 (555) 019-8472</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active via Twilio
              </p>
            </div>

            <button className="w-full py-2 border border-gray-200 bg-white text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Buy New Number
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Globe size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Pricing & Billing</span>
            </div>
            {tab === "native" ? (
              <>
                <h3 className="text-2xl font-bold mb-1">$0.10 <span className="text-sm font-medium opacity-70">/ minute</span></h3>
                <p className="text-sm opacity-80 leading-relaxed mb-4">
                  Using AnaOS Native Voice guarantees you get the exact same industry rates as Vapi or Retell, but fully integrated into your CRM. Powered by ElevenLabs and GPT-4o.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-1">Provider Billed</h3>
                <p className="text-sm opacity-80 leading-relaxed mb-4">
                  You are bypassing the AnaOS Native Voice engine. You will be billed directly by {provider.toUpperCase()} at their rates (~$0.12/min).
                </p>
              </>
            )}
            <div className="bg-white/10 rounded-xl p-3 text-xs font-medium border border-white/20">
              Current Balance: $45.00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
