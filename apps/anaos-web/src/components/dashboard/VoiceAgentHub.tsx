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
  const [showAdvancedPrompt, setShowAdvancedPrompt] = useState(false);
  
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Mic size={20} />
            </div>
            Voice AI Agent
          </h1>
          <p className="text-zinc-500 mt-2 text-[14px]">
            Deploy a human-like AI caller for inbound & outbound. Powered by ChatGPT & ElevenLabs.
          </p>
        </div>
        
        <div className="flex bg-zinc-100/80 p-1 rounded-xl shrink-0 border border-zinc-200/50">
          <button 
            onClick={() => setTab("native")}
            className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all ${tab === "native" ? "bg-white text-purple-600 shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
          >
            AnaOS Voice
          </button>
          <button 
            onClick={() => setTab("advanced")}
            className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-2 ${tab === "advanced" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
          >
            <Settings size={14} /> Advanced (BYOK)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Configuration Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {tab === "native" ? (
            <>
              {/* Native Voice Config */}
              <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 pb-4">
                  <Sparkles className="text-amber-500" size={18} />
                  <h2 className="text-[15px] font-bold text-zinc-900">Agent Persona & Behavior</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-bold text-zinc-700 mb-2">First Message (Greeting)</label>
                    <input 
                      type="text" 
                      value={firstMessage}
                      onChange={e => setFirstMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-zinc-800"
                    />
                    <p className="text-[11px] text-zinc-400 mt-2 font-medium">What the AI says immediately when the call connects.</p>
                  </div>
                  
                  <div>
                    <button 
                      onClick={() => setShowAdvancedPrompt(!showAdvancedPrompt)}
                      className="text-[12px] font-bold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1.5"
                    >
                      {showAdvancedPrompt ? "Hide Advanced Prompting" : "Show Advanced Prompting"}
                    </button>
                    
                    {showAdvancedPrompt && (
                      <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-[13px] font-bold text-zinc-700 mb-2">System Prompt</label>
                        <textarea 
                          value={prompt}
                          onChange={e => setPrompt(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none font-medium text-zinc-800"
                        />
                        <p className="text-[11px] text-zinc-400 mt-2 font-medium">Instruct the AI on how to behave, what questions to ask, and its overall tone.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Voice Selection */}
              <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 pb-4">
                  <Volume2 className="text-sky-500" size={18} />
                  <h2 className="text-[15px] font-bold text-zinc-900">Voice Selection</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "eleven_rachel", name: "Rachel", desc: "Professional, Female, American" },
                    { id: "eleven_drew", name: "Drew", desc: "Energetic, Male, American" },
                    { id: "eleven_charlotte", name: "Charlotte", desc: "Friendly, Female, British" },
                    { id: "eleven_callum", name: "Callum", desc: "Deep, Male, British" },
                  ].map(voice => (
                    <div 
                      key={voice.id}
                      onClick={() => setVoiceId(voice.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${voiceId === voice.id ? "border-purple-500 bg-purple-50/30 shadow-sm" : "border-zinc-200/80 hover:border-zinc-300 bg-white"}`}
                    >
                      <button className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 transition-colors ${voiceId === voice.id ? "bg-purple-100 text-purple-600" : "bg-zinc-100 text-zinc-400"}`}>
                        <Play size={12} fill="currentColor" />
                      </button>
                      <div>
                        <p className={`font-bold text-[13px] ${voiceId === voice.id ? "text-purple-900" : "text-zinc-900"}`}>{voice.name}</p>
                        <p className="text-[11px] text-zinc-500 font-medium">{voice.desc}</p>
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

                  <div className="pt-2">
                    {customKey ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <Shield size={20} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-emerald-800">Connected via AnaOS Secure Auth</h4>
                            <p className="text-xs text-emerald-600/80 font-medium mt-0.5">Your {provider === 'vapi' ? 'Vapi.ai' : provider === 'retell' ? 'Retell' : 'Bland AI'} account is securely linked.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setCustomKey("")}
                          className="px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                          <Globe size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">1-Click Secure Connect</h4>
                        <p className="text-xs text-gray-500 font-medium mb-4 max-w-sm mx-auto">
                          No need to deal with complex API keys. Securely link your {provider === 'vapi' ? 'Vapi.ai' : provider === 'retell' ? 'Retell' : 'Bland AI'} account directly through AnaOS.
                        </p>
                        <button 
                          onClick={() => {
                            setSaving(true);
                            setTimeout(() => {
                              setCustomKey("oauth_token_placeholder");
                              setSaving(false);
                            }, 1500);
                          }}
                          disabled={saving}
                          className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                        >
                          {saving ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
                          Connect {provider === 'vapi' ? 'Vapi.ai' : provider === 'retell' ? 'Retell' : 'Bland AI'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Bar */}
          <div className="flex justify-end gap-3 pt-2">
            <button className="px-5 py-2.5 border border-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-50 transition-colors text-[13px]">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#0A6BFF] hover:bg-blue-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-[13px] shadow-sm disabled:opacity-70"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>

        {/* Sidebar: Telephony & Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-bl-[100px] -z-10 opacity-70"></div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-zinc-900">Phone Number</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">Inbound Line</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50/80 border border-zinc-200/80 rounded-xl p-4 text-center mb-4 relative">
              <p className="text-[18px] font-mono font-bold text-zinc-900 tracking-wider">+1 (555) 019-8472</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                <span className="text-[11px] font-bold text-zinc-500">Active via Twilio</span>
              </div>
            </div>

            <button className="w-full py-2.5 border border-zinc-200/80 bg-white text-zinc-800 text-[12px] font-bold rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-colors shadow-sm">
              Buy New Number
            </button>
          </div>

          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-3 opacity-90 relative z-10">
              <Sparkles size={14} className="text-emerald-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">1 Month Free Trial</span>
            </div>
            
            <div className="relative z-10">
              {tab === "native" ? (
                <>
                  <h3 className="text-3xl font-bold mb-2">100% <span className="text-[13px] font-medium opacity-80">At Cost</span></h3>
                  <p className="text-[12px] opacity-90 leading-relaxed mb-5 font-medium">
                    Enjoy AnaOS platform free for 30 days. You only pay exact API costs (Vapi, Retell, Twilio, OpenAI) with 0 markup. We earn from our subscription, not by overcharging you.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2">Provider Billed</h3>
                  <p className="text-[12px] opacity-90 leading-relaxed mb-5 font-medium">
                    You are bypassing the AnaOS Native Voice engine. You will be billed directly by {provider.toUpperCase()} at their exact rates (0 markup from us).
                  </p>
                </>
              )}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-[12px] font-bold border border-white/20 flex items-center justify-between">
                <span>Account Status:</span>
                <span className="text-emerald-400">30 Days Left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceAgentHub;
