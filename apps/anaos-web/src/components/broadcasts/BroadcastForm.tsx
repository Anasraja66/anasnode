"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, Check, ChevronRight, MessageSquare, Plus, Loader2, Sparkles, Image as ImageIcon, Video, FileText, Send, Zap
} from "lucide-react";

interface BroadcastFormProps {
  onBack: () => void;
  onSaved: () => void;
  initialPrompt?: string;
}

export default function BroadcastForm({ onBack, onSaved, initialPrompt }: BroadcastFormProps) {
  const [name, setName] = useState("Dubai Emaar VIP Promo");
  const [audience, setAudience] = useState("dubai-investors");
  
  // Editor State
  const [templateType, setTemplateType] = useState<"existing" | "custom">("custom");
  const [selectedTemplate, setSelectedTemplate] = useState("15 Northside");
  
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [headerText, setHeaderText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [footerText, setFooterText] = useState("");

  // Automatically load the prompt from the Hub into the message box!
  useEffect(() => {
    if (initialPrompt) {
      setMessageText(initialPrompt);
      setTemplateType("custom");
    }
  }, [initialPrompt]);

  const handleGenerateAI = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate AI
    setMessageText(`*🚀 Exclusive Pre-Launch: Emaar Oceanfront!*\n\nHi {{name}},\n\nBased on your previous interest, we are offering VIP access to Emaar's newest beachfront property before it goes public.\n\n✅ 20% Downpayment\n✅ High ROI\n\nReply "YES" to book a private viewing.`);
    setFooterText("Reply STOP to unsubscribe");
    setIsGenerating(false);
  };

  const handleSend = async () => {
    // API logic goes here
    onSaved();
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* ─── TOP NAVBAR (ManyChat Style) ────────────────────────────────────────────── */}
      <div className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
            <span className="hover:text-blue-600 cursor-pointer">Broadcasts</span>
            <ChevronRight size={14} />
            <span className="hover:text-blue-600 cursor-pointer">Drafts</span>
            <ChevronRight size={14} />
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="text-gray-900 font-bold bg-transparent border-none outline-none focus:ring-0 p-0 w-48 text-[15px]" 
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-500 flex items-center gap-1 font-medium">
            <Check size={14} className="text-green-500" /> Saved
          </span>
          <button 
            onClick={handleSend}
            disabled={!messageText}
            className="bg-[#0A6BFF] hover:bg-blue-600 text-white px-5 py-1.5 rounded-lg text-[13px] font-bold shadow-sm transition-all disabled:opacity-50"
          >
            Send After Approval
          </button>
        </div>
      </div>

      {/* ─── MAIN WORKSPACE ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR: TEMPLATE EDITOR */}
        <div className="w-[360px] bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-4 bg-[#F1Fdf7] border-b border-[#e1f5ec] sticky top-0 z-10">
            <h2 className="text-[15px] font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare size={16} className="text-green-600" />
              Send Message
            </h2>
            <div className="text-[12px] text-green-700 font-medium mt-1">Send outside 24 hour window</div>
          </div>

          <div className="p-4 space-y-6">
            {/* AI Generator */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-xl">
              <div className="text-[12px] font-bold text-purple-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles size={14} /> AI Generator
              </div>
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="E.g., Write a VIP promo for Emaar beachfront..."
                className="w-full h-16 text-[13px] p-2 rounded-lg border border-purple-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 bg-white resize-none"
              />
              <button 
                onClick={handleGenerateAI}
                disabled={isGenerating || !prompt}
                className="w-full mt-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-[12px] font-bold py-2 rounded-lg flex justify-center items-center gap-2 transition-colors"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : "Generate Copy"}
              </button>
            </div>

            {/* Template Selection */}
            <div>
              <label className="text-[12px] font-bold text-gray-700 block mb-1">Select Existing Template</label>
              <select 
                value={templateType === "existing" ? selectedTemplate : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    setTemplateType("existing");
                    setSelectedTemplate(e.target.value);
                  }
                }}
                className="w-full text-[13px] p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0A6BFF]"
              >
                <option value="">-- Or compose a new template --</option>
                <option value="15 Northside">15 Northside (Approved)</option>
                <option value="Al Fattan Marine">Al Fattan Marine Tower (Approved)</option>
                <option value="Emaar VIP">Emaar VIP Presale (Pending)</option>
              </select>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                New templates require Meta approval. It usually takes a few minutes, but can take up to 24 hours.
              </p>
            </div>

            {/* Custom Template Editor */}
            <div className={`space-y-4 transition-opacity ${templateType === "existing" ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <div>
                <label className="text-[12px] font-bold text-gray-700 flex justify-between mb-1.5">
                  Header <span className="text-gray-400 font-normal">Optional</span>
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <button className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-blue-600">
                    <FileText size={18} className="mb-1" />
                    <span className="text-[10px] font-medium">Text</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-blue-600">
                    <ImageIcon size={18} className="mb-1" />
                    <span className="text-[10px] font-medium">Image</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-blue-600">
                    <Video size={18} className="mb-1" />
                    <span className="text-[10px] font-medium">Video</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-blue-600">
                    <FileText size={18} className="mb-1" />
                    <span className="text-[10px] font-medium">Doc</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  value={headerText}
                  onChange={e => { setHeaderText(e.target.value); setTemplateType("custom"); }}
                  placeholder="Enter header text..." 
                  className="w-full text-[13px] p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0A6BFF]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-700 flex justify-between mb-1.5">
                  Message
                </label>
                <textarea 
                  value={messageText}
                  onChange={e => { setMessageText(e.target.value); setTemplateType("custom"); }}
                  placeholder="Enter message..." 
                  className="w-full h-32 text-[13px] p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0A6BFF] resize-none"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-700 flex justify-between mb-1.5">
                  Footer <span className="text-gray-400 font-normal">Optional</span>
                </label>
                <input 
                  type="text" 
                  value={footerText}
                  onChange={e => { setFooterText(e.target.value); setTemplateType("custom"); }}
                  placeholder="Footer text" 
                  maxLength={60}
                  className="w-full text-[13px] p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0A6BFF]"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-gray-700 flex justify-between mb-1.5">
                  Button <span className="text-gray-400 font-normal">Optional</span>
                </label>
                <button className="w-full py-2.5 rounded-lg border border-dashed border-gray-300 text-[13px] font-medium text-blue-600 hover:bg-blue-50 transition-colors flex justify-center items-center gap-1.5">
                  <Plus size={16} /> Add Button
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* CENTER: MINI FLOW CANVAS */}
        <div className="flex-1 bg-[#F8F9FA] relative flex items-center justify-center overflow-hidden" style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900"><Plus size={20}/></button>
          </div>

          {/* Hardcoded Nodes for Visual Appeal */}
          <div className="relative flex items-center gap-16 scale-90 md:scale-100">
            {/* Trigger Node */}
            <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-10">
              <div className="p-3 border-b border-gray-100 flex items-center gap-2">
                <Zap size={16} className="text-yellow-500" />
                <span className="text-[13px] font-bold text-gray-700">When...</span>
              </div>
              <div className="p-4 bg-gray-50 flex items-center gap-3">
                <Megaphone size={16} className="text-gray-400" />
                <span className="text-[13px] font-medium text-gray-600">You send a Broadcast</span>
              </div>
              {/* Output Dot */}
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
            </div>

            {/* SVG Edge connecting them */}
            <svg className="absolute top-1/2 left-64 w-16 h-8 -translate-y-1/2 z-0" overflow="visible">
              <path d="M 0 0 C 30 0, 30 0, 64 0" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
              <polygon points="64,0 58,-3 58,3" fill="#CBD5E1" />
            </svg>

            {/* Action Node */}
            <div className="w-72 bg-white rounded-xl shadow-md border-2 border-green-500 overflow-hidden relative z-10 ring-4 ring-green-500/10">
              {/* Input Dot */}
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#25D366] rounded-md flex items-center justify-center">
                    <MessageSquare size={14} className="text-white" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-700">WhatsApp</span>
                </div>
                <div className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Send Message</div>
              </div>
              <div className="p-5 flex flex-col items-center justify-center bg-green-50/30 border-b border-gray-100 border-dashed">
                <span className="text-[13px] font-medium text-gray-500">{templateType === "existing" ? selectedTemplate : "Custom Message Template"}</span>
              </div>
              <div className="p-2 bg-white text-right">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider pr-2">Next Step</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: PHONE PREVIEW */}
        <div className="w-[340px] bg-white border-l border-gray-200 flex flex-col shrink-0 items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100 z-10">
          <div className="w-[280px] h-[580px] bg-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-[6px] border-gray-900 overflow-hidden relative flex flex-col">
            {/* Notch */}
            <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
              <div className="w-24 h-5 bg-gray-900 rounded-b-xl"></div>
            </div>
            
            {/* WhatsApp Header */}
            <div className="bg-[#075e54] text-white pt-9 pb-2 px-3 flex items-center gap-2 relative z-10 shadow-sm">
              <ArrowLeft size={16} />
              <div className="w-7 h-7 rounded-full bg-white/20 overflow-hidden">
                <img src="https://i.pravatar.cc/100" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-[13px] leading-tight">Customer Name</div>
                <div className="text-[9px] text-white/80">online</div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto" style={{ backgroundColor: "#E5DDD5", backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: "cover" }}>
              
              {messageText && (
                <div className="bg-white p-2.5 rounded-xl rounded-tl-none shadow-sm max-w-[90%] text-[13px] text-gray-800 relative self-start leading-relaxed whitespace-pre-wrap">
                  {headerText && <div className="font-bold text-[14px] mb-1">{headerText}</div>}
                  {messageText}
                  {footerText && <div className="text-[11px] text-gray-400 mt-2 italic">{footerText}</div>}
                  <div className="text-[9px] text-gray-400 text-right mt-1">10:42 AM</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM NAVBAR (Target Audience) ───────────────────────────────────────── */}
      <div className="h-14 bg-white border-t border-gray-200 px-6 flex items-center justify-between shrink-0 z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <label className="text-[13px] font-bold text-gray-700">Target Audience</label>
          <select 
            value={audience}
            onChange={e => setAudience(e.target.value)}
            className="text-[13px] font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Contacts</option>
            <option value="dubai-investors">Tag: Dubai Investors</option>
            <option value="hot-leads">Tag: Hot Leads</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
            <Send size={12} className="text-[#0A6BFF]" />
          </div>
          <span className="text-[13px] font-bold text-gray-800">
            {audience === "all" ? "1,204" : audience === "dubai-investors" ? "815" : "342"} subscribers
          </span>
          <span className="text-[13px] text-gray-500">will receive this broadcast</span>
        </div>
      </div>
    </div>
  );
}
