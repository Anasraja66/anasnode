"use client";

import { useState } from "react";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Search,
  RefreshCw,
  Play,
  Pause,
  Clock,
  Calendar,
  FileText,
  User,
  MoreVertical,
  Bot
} from "lucide-react";

type CallLog = {
  id: string;
  contactName: string;
  contactPhone: string;
  type: "inbound" | "outbound" | "missed";
  duration: string;
  time: string;
  date: string;
  transcript: string;
  status: "completed" | "voicemail" | "failed";
  agent: string;
};

// Mock data for UI presentation
const MOCK_CALLS: CallLog[] = [
  {
    id: "call_1",
    contactName: "Sarah Jenkins",
    contactPhone: "+1 (555) 123-4567",
    type: "inbound",
    duration: "02:14",
    time: "10:45 AM",
    date: "Today",
    transcript: "Agent: Hello, this is AnaOS. How can I help you today?\nCustomer: Hi, I'm calling about my recent booking.\nAgent: I can help with that. Could you provide your booking reference?\nCustomer: Yes, it's 84920.",
    status: "completed",
    agent: "Vapi AI"
  },
  {
    id: "call_2",
    contactName: "Michael Chang",
    contactPhone: "+1 (555) 987-6543",
    type: "outbound",
    duration: "05:30",
    time: "09:15 AM",
    date: "Today",
    transcript: "Agent: Hi Michael, this is Alex from the sales team. I'm following up on your inquiry.\nCustomer: Oh hi Alex, yes I was looking into the enterprise plan.\nAgent: Great! I'd be happy to walk you through the features...",
    status: "completed",
    agent: "Twilio Voice"
  },
  {
    id: "call_3",
    contactName: "Unknown",
    contactPhone: "+1 (555) 333-2222",
    type: "missed",
    duration: "00:00",
    time: "Yesterday",
    date: "Yesterday",
    transcript: "Voicemail left: Hey, please call me back regarding a property viewing.",
    status: "voicemail",
    agent: "System"
  }
];

function initials(name: string) {
  if (name === "Unknown") return "?";
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
  return (name.slice(0, 2) || "?").toUpperCase();
}

function avatarHue(seed: string) {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n += seed.charCodeAt(i);
  return [215, 168, 142, 198, 120][n % 5];
}

export function CallsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_CALLS[0].id);
  const [search, setSearch] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileShowDetails, setMobileShowDetails] = useState(false);

  const selected = MOCK_CALLS.find((c) => c.id === selectedId) || MOCK_CALLS[0];

  return (
    <div className="flex h-full min-h-[500px] md:min-h-[550px] bg-white relative">
      {/* 1. Calls List */}
      <div className={`w-full md:w-[340px] border-r border-zinc-100 flex-col shrink-0 bg-white ${selectedId && mobileShowDetails ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-zinc-100 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold tracking-tight text-zinc-900">Call Logs</h1>
            <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search caller or number..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 text-[13px] bg-zinc-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
          {MOCK_CALLS.map((call) => {
            const isSelected = selectedId === call.id;
            return (
              <button
                key={call.id}
                onClick={() => { setSelectedId(call.id); setMobileShowDetails(true); }}
                className={`w-full text-left p-4 flex gap-3 transition-colors border-l-2 shrink-0 ${
                  isSelected ? "bg-zinc-50/80 border-zinc-950" : "border-transparent hover:bg-zinc-50/40"
                }`}
              >
                <div className="relative shrink-0 pt-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: `hsl(${avatarHue(call.contactPhone)} 45% 42%)` }}
                  >
                    {initials(call.contactName)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                    call.type === 'inbound' ? 'bg-emerald-500' : call.type === 'outbound' ? 'bg-sky-500' : 'bg-red-500'
                  }`}>
                    {call.type === 'inbound' && <PhoneIncoming className="w-2.5 h-2.5 text-white" />}
                    {call.type === 'outbound' && <PhoneOutgoing className="w-2.5 h-2.5 text-white" />}
                    {call.type === 'missed' && <PhoneMissed className="w-2.5 h-2.5 text-white" />}
                  </div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className={`text-[13.5px] truncate ${isSelected ? "font-bold text-zinc-950" : "font-semibold text-zinc-800"}`}>
                      {call.contactName}
                    </p>
                    <span className="text-[11px] text-zinc-400 shrink-0 font-medium">
                      {call.time}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-zinc-500 font-mono truncate mb-1.5">
                    {call.contactPhone}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {call.duration}</span>
                    <span className="flex items-center gap-1"><Bot className="w-3 h-3" /> {call.agent}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Call Details & Transcript */}
      <div className={`flex-1 flex-col min-w-0 bg-white border-l border-zinc-100 ${!selectedId || !mobileShowDetails ? "hidden md:flex" : "flex"}`}>
        {selected ? (
          <>
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: `hsl(${avatarHue(selected.contactPhone)} 45% 42%)` }}
                >
                  {initials(selected.contactName)}
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-zinc-900">{selected.contactName}</h2>
                  <p className="text-[13px] text-zinc-500 font-mono mt-0.5">{selected.contactPhone}</p>
                </div>
              </div>
              <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-zinc-50/30">
              {/* Call Metadata Strip */}
              <div className="bg-white border-b border-zinc-100 px-6 py-4 flex gap-8">
                <div>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Date & Time</p>
                  <p className="text-[13px] font-medium text-zinc-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-zinc-400" /> {selected.date}, {selected.time}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Duration</p>
                  <p className="text-[13px] font-medium text-zinc-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-400" /> {selected.duration}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                    selected.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                    selected.status === 'voicemail' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {selected.status}
                  </span>
                </div>
              </div>

              {/* Audio Player (Mock) */}
              <div className="p-6">
                <div className="bg-zinc-900 rounded-2xl p-4 flex items-center gap-4 shadow-lg shadow-zinc-200/50">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 text-zinc-900 fill-current" /> : <Play className="w-5 h-5 text-zinc-900 fill-current ml-1" />}
                  </button>
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] text-zinc-400 font-medium mb-2">
                      <span>{isPlaying ? "00:14" : "00:00"}</span>
                      <span>{selected.duration}</span>
                    </div>
                    {/* Visualizer bars mock */}
                    <div className="flex gap-[2px] items-end h-8 w-full overflow-hidden">
                      {Array.from({ length: 60 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-zinc-700 rounded-full"
                          style={{ height: `${Math.max(10, Math.random() * 100)}%`, opacity: i < 15 && isPlaying ? 1 : 0.4 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <div className="px-6 pb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-[14px] font-bold text-zinc-900">AI Call Transcript</h3>
                </div>
                
                <div className="space-y-4">
                  {selected.transcript.split('\n').map((line, i) => {
                    const isAgent = line.startsWith('Agent:');
                    const text = line.replace(/^(Agent|Customer):\s*/, '');
                    if (!text) return null;
                    
                    return (
                      <div key={i} className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
                          isAgent ? 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-sm' : 'bg-sky-50 text-sky-900 border border-sky-100 rounded-tr-sm'
                        }`}>
                          <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${isAgent ? 'text-zinc-400' : 'text-sky-600'}`}>
                            {isAgent ? selected.agent : selected.contactName}
                          </span>
                          {text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-white">
            <Phone className="w-12 h-12 stroke-[1] mb-2" />
            <p className="text-[14px] font-bold text-zinc-900">Select a call</p>
            <p className="text-[12px]">View call recordings and transcripts</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CallsPage;
