"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Search,
  Send,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  User,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Sparkles,
  Tag,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Shield,
  Bot
} from "lucide-react";
import BrandIcon from "../ui/BrandIcon";
import type { IndustryPreset } from "@/lib/industry/presets";

type Conversation = {
  id: string;
  contactName: string;
  contactPhone: string;
  channel: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  tags: string[];
  optedOut: boolean;
  aiEnabled: boolean;
  timeLabel?: string;
  lastInboundAt: string | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  customFields?: Record<string, string>;
};

type Message = {
  id: string;
  direction: string;
  body: string;
  source: string;
  createdAt: string;
};

function initials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
  return (name.slice(0, 2) || "?").toUpperCase();
}

function avatarHue(seed: string) {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n += seed.charCodeAt(i);
  return [215, 168, 142, 198, 120][n % 5];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sourceLabel(source: string, direction: string) {
  if (source === "ai") return "Anaos AI";
  if (source === "agent") return "Agent";
  if (source === "voice") return "Voice Link";
  if (source === "customer") return "";
  return source;
}

export function InboxPage({ 
  initialConversationId,
  preset 
}: { 
  initialConversationId?: string | null;
  preset?: IndustryPreset;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialConversationId ?? null);
  const [detail, setDetail] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [channelFilter, setChannelFilter] = useState<"all" | "whatsapp" | "instagram" | "facebook">("all");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [tagEdit, setTagEdit] = useState("");
  const [waConnected, setWaConnected] = useState(false);
  const [waHints, setWaHints] = useState<string[]>([]);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const loadList = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("q", search.trim());
      if (unreadOnly) params.set("unread", "1");
      const res = await fetch(`/api/inbox?${params}`);
      const data = await res.json();
      if (data.success) {
        const dbConvs = data.conversations || [];
        setConversations(dbConvs);
        setSelectedId((prev) => {
          const want = prev || initialConversationId;
          if (want && dbConvs.some((c: Conversation) => c.id === want)) {
            return want;
          }
          return dbConvs[0]?.id ?? null;
        });
      }
    } catch {
      // API error / offline
    } finally {
      setLoading(false);
    }
  }, [search, unreadOnly, initialConversationId]);

  const loadThread = useCallback(async (id: string) => {
    setLoadingThread(true);
    try {
      const res = await fetch(`/api/inbox?conversationId=${id}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        setDetail(data.conversation);
        setTagEdit((data.conversation.tags || []).join(", "));
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
        );
      }
    } catch {
      /* network */
    } finally {
      setLoadingThread(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/integrations/whatsapp/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setWaConnected(!!data.connected);
          setWaHints((data.hints as string[]) || []);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialConversationId) setSelectedId(initialConversationId);
  }, [initialConversationId]);

  useEffect(() => {
    loadList();
    const iv = setInterval(loadList, 6000);
    return () => clearInterval(iv);
  }, [loadList]);

  useEffect(() => {
    if (selectedId) loadThread(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selected = conversations.find((c) => c.id === selectedId) || detail;

  const patchConversation = async (patch: Record<string, unknown>) => {
    if (!selectedId) return;

    const res = await fetch("/api/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selectedId, ...patch }),
    });
    const data = await res.json();
    if (data.success) {
      setDetail(data.conversation);
      loadList();
    }
  };

  const sendReply = async () => {
    if (!selectedId || !replyText.trim()) return;

    setSending(true);
    const res = await fetch("/api/inbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selectedId, text: replyText.trim() }),
    });
    setSending(false);
    if (res.ok) {
      setReplyText("");
      loadThread(selectedId);
      loadList();
    }
  };

  const saveTags = () => {
    patchConversation({ tags: tagEdit });
  };

  const unreadTotal = conversations.reduce((n, c) => n + (c.unreadCount || 0), 0);

  return (
    <div className="flex h-full min-h-[500px] md:min-h-[550px] bg-white relative">
      {/* 1. Conversation list */}
      <div className={`w-full md:w-[320px] border-r border-zinc-100 flex-col shrink-0 bg-white ${selectedId && mobileShowThread ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-zinc-100 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-zinc-900">Inbox</h1>
              {unreadTotal > 0 && (
                <span className="text-[11px] font-semibold bg-sky-500 text-white px-2 py-0.5 rounded-full">
                  {unreadTotal} new
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => loadList()}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 text-[13px] bg-zinc-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
            />
          </div>

          <div className="flex p-0.5 bg-zinc-100 rounded-lg">
            <button
              type="button"
              onClick={() => setUnreadOnly(false)}
              className={`flex-1 text-center py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                !unreadOnly
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-550 hover:text-zinc-800"
              }`}
            >
              All Chats
            </button>
            <button
              type="button"
              onClick={() => setUnreadOnly(true)}
              className={`flex-1 text-center py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                unreadOnly
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-550 hover:text-zinc-800"
              }`}
            >
              Unread
            </button>
          </div>

          <div className="flex gap-1 border-t border-zinc-100 pt-3 text-[10px] font-semibold text-zinc-500 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => setChannelFilter("all")}
              className={`px-2 py-1 rounded-md border transition-all shrink-0 ${
                channelFilter === "all"
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-sm"
                  : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setChannelFilter("whatsapp")}
              className={`px-2 py-1 rounded-md border transition-all flex items-center gap-1 shrink-0 ${
                channelFilter === "whatsapp"
                  ? "bg-[#0A6BFF] border-[#0A6BFF] text-white shadow-sm"
                  : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setChannelFilter("instagram")}
              className={`px-2 py-1 rounded-md border transition-all flex items-center gap-1 shrink-0 ${
                channelFilter === "instagram"
                  ? "bg-[#0A6BFF] border-[#0A6BFF] text-white shadow-sm"
                  : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              <BrandIcon id="instagram" className="w-3.5 h-3.5" />
              Instagram
            </button>
            <button
              type="button"
              onClick={() => setChannelFilter("facebook")}
              className={`px-2 py-1 rounded-md border transition-all flex items-center gap-1 shrink-0 ${
                channelFilter === "facebook"
                  ? "bg-[#0A6BFF] border-[#0A6BFF] text-white shadow-sm"
                  : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50"
              }`}
            >
              <BrandIcon id="facebook" className="w-3.5 h-3.5" />
              Messenger
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-50">
          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center space-y-4">
              <div className="w-10 h-10 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-zinc-800 text-[13px]">No conversations found</p>
                <p className="text-[12px] text-zinc-500">
                  {waConnected
                    ? "Send a message to your WhatsApp number to start chatting!"
                    : "Please connect WhatsApp in Integrations first."}
                </p>
              </div>
              {!waConnected && (
                <Link
                  href="/dashboard/integrations"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-zinc-950 bg-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Connect WhatsApp
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
              {waHints.map((h) => (
                <p key={h} className="text-[11px] text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-2 text-left">
                  {h}
                </p>
              ))}
            </div>
          ) : (
            conversations.filter(c => channelFilter === "all" || c.channel === channelFilter).map((c) => {
              const hue = avatarHue(c.contactPhone);
              const isSelected = selectedId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setSelectedId(c.id); setMobileShowThread(true); }}
                  className={`w-full text-left h-[72px] px-4 flex items-center gap-3 transition-colors border-l-2 shrink-0 ${
                    isSelected
                      ? "bg-zinc-50/80 border-zinc-950"
                      : "border-transparent hover:bg-zinc-50/40"
                  }`}
                >
                  <div className="relative shrink-0 flex items-center">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: `hsl(${hue} 45% 42%)` }}
                    >
                      {initials(c.contactName)}
                    </div>
                    {/* Channel Indicator Badge */}
                    <div className="absolute bottom-[-4px] right-[-4px] w-5 h-5 rounded-full border border-white bg-white flex items-center justify-center shadow-sm">
                      <BrandIcon id={c.channel} className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex justify-between items-baseline gap-1">
                      <p className={`text-[13px] truncate ${isSelected ? "font-semibold text-zinc-950" : "font-medium text-zinc-800"}`}>
                        {c.contactName}
                      </p>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        {c.timeLabel || ""}
                      </span>
                    </div>
                    <p className="text-[12px] text-zinc-500 truncate leading-relaxed">
                      {c.lastMessage || "—"}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="shrink-0 self-center w-5 h-5 flex items-center justify-center rounded-full bg-sky-500 text-white text-[10px] font-bold shadow-sm">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Chat thread */}
      <div className={`flex-1 flex-col min-w-0 bg-white ${!selectedId || !mobileShowThread ? "hidden md:flex" : "flex"}`}>
        {selected ? (
          <>
            {/* Chat header */}
            <div className="px-4 md:px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileShowThread(false)}
                  className="md:hidden p-1.5 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 mr-1"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold text-white"
                  style={{
                    backgroundColor: `hsl(${avatarHue(selected.contactPhone)} 45% 42%)`,
                  }}
                >
                  {initials(selected.contactName)}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-zinc-900 truncate">
                    {selected.contactName}
                  </p>
                  <p className="text-[11px] text-zinc-500 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-sky-50 text-sky-700 border-sky-100">
                      <BrandIcon id={selected.channel} className="w-3 h-3" />
                      {selected.channel === "whatsapp" ? "WhatsApp" : selected.channel === "instagram" ? "Instagram" : "Messenger"}
                    </span>
                    <span className="font-mono">{selected.contactPhone}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {/* AI Toggle Indicator */}
                <button
                  type="button"
                  title={detail?.aiEnabled !== false ? "Pause AI Assistant" : "Enable AI Assistant"}
                  onClick={() =>
                    patchConversation({ aiEnabled: detail?.aiEnabled === false })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all ${
                    detail?.aiEnabled !== false
                      ? "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100"
                      : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {detail?.aiEnabled !== false ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>AI Active</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Enable AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Alert system state banners */}
            {detail?.aiEnabled === false && (
              <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-100/60 text-[12px] text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Automated replies are paused for this contact. You are in manual reply mode.</span>
              </div>
            )}

            {detail?.optedOut && (
              <div className="px-6 py-2.5 bg-red-50 border-b border-red-100/60 text-[12px] text-red-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600 shrink-0" />
                <span>This contact has opted out (STOP). Do not send marketing or unsolicited broadcasts.</span>
              </div>
            )}

            {/* Chat message bubbles */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-white relative">
              {loadingThread ? (
                <div className="flex justify-center py-20 relative z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 text-zinc-400 relative z-10 space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto stroke-[1.5]" />
                  <p className="text-[13px]">No messages in this thread yet.</p>
                </div>
              ) : (
                messages.map((m) => {
                  const out = m.direction === "outbound";
                  const label = sourceLabel(m.source, m.direction);
                  const isAi = m.source === "ai";
                  
                  // Clean up error templates in text
                  const hasError = m.body.includes("Could not deliver");
                  let cleanBody = m.body;
                  if (hasError) {
                    cleanBody = m.body.replace("[Could not deliver to WhatsApp] ", "");
                  }

                  return (
                    <div
                      key={m.id}
                      className={`flex relative z-10 ${out ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[85%] space-y-1">
                        <div
                          className={`px-4 py-2.5 transition-all shadow-sm ${
                            out
                              ? isAi
                                ? "bg-sky-50 text-sky-800 font-medium rounded-2xl rounded-br-sm border border-sky-100"
                                : "bg-[#0A6BFF] text-white font-medium rounded-2xl rounded-br-sm"
                              : "bg-white text-zinc-900 font-medium rounded-2xl rounded-bl-sm border border-zinc-200"
                          }`}
                        >
                          <p className="text-[13.5px] whitespace-pre-wrap leading-relaxed">
                            {cleanBody}
                          </p>
                        </div>
                        
                        <div className={`flex items-center gap-1.5 text-[10.5px] px-1 ${out ? "justify-end text-zinc-400" : "text-zinc-400"}`}>
                          {label && (
                            <span className={`inline-flex items-center gap-0.5 font-bold ${isAi ? "text-blue-600" : "text-zinc-600"}`}>
                              {isAi && <Bot className="w-3 h-3" />}
                              {label.toUpperCase()}
                            </span>
                          )}
                          {label && <span>·</span>}
                          <span>
                            {new Date(m.createdAt).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {hasError && (
                            <span className="text-red-500 font-bold flex items-center gap-0.5 ml-1">
                              Delivery failed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={threadEndRef} />
            </div>

            {/* Input Composer area */}
            <div className="p-4 border-t border-zinc-100 bg-white z-10">
              <div className="flex gap-2 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200/60 focus-within:border-zinc-400 transition-colors">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply()}
                  placeholder={
                    waConnected ? "Type a message..." : "Connect WhatsApp to reply"
                  }
                  disabled={!waConnected}
                  className="flex-1 bg-transparent px-3 py-2 text-[13px] focus:outline-none disabled:cursor-not-allowed text-zinc-950 placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={sendReply}
                  disabled={sending || !replyText.trim() || !waConnected}
                  className="h-9 px-4 flex items-center justify-center gap-1.5 rounded-lg bg-[#0A6BFF] text-white font-bold text-[13px] disabled:opacity-40 hover:bg-blue-600 transition-colors"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 bg-white">
            <MessageSquare className="w-12 h-12 stroke-[1] mb-2" />
            <p className="text-[14px] font-bold text-zinc-900">Select a conversation</p>
            <p className="text-[12px]">Chat with your {preset?.id === 'real-estate' ? 'buyers' : 'customers'} here</p>
          </div>
        )}
      </div>

      {/* 3. Profile sidebar */}
      {selected && detail && (
        <div className="w-[300px] border-l border-zinc-100 bg-white flex-col shrink-0 p-6 space-y-8 overflow-y-auto hidden lg:flex">
          {/* User profile identifier card */}
          <div className="text-center pb-6 border-b border-zinc-100">
            <div
              className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-[24px] font-bold text-white shadow-md"
              style={{
                backgroundColor: `hsl(${avatarHue(selected.contactPhone)} 45% 42%)`,
              }}
            >
              {initials(selected.contactName)}
            </div>
            <p className="mt-4 text-[16px] font-bold text-zinc-950">{selected.contactName}</p>
            <p className="text-[13px] font-mono text-zinc-500 mt-1">{selected.contactPhone}</p>
          </div>

          {/* User Details Details info list */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Contact Info</h3>
            <div className="space-y-2.5">
              {detail.email && (
                <div className="flex items-center gap-2 text-[12.5px] text-zinc-700">
                  <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="truncate">{detail.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[12.5px] text-zinc-700">
                <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                <span className="font-mono">{selected.contactPhone}</span>
              </div>
              {detail.lastInboundAt && (
                <div className="flex items-start gap-2 text-[12.5px] text-zinc-700">
                  <Calendar className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Last Inbound</p>
                    <p>{new Date(detail.lastInboundAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CRM Tags section */}
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>CRM Tags</span>
            </h3>
            <div className="flex gap-1.5 bg-zinc-50 p-1 rounded-lg border border-zinc-200">
              <input
                value={tagEdit}
                onChange={(e) => setTagEdit(e.target.value)}
                placeholder="leads, vip"
                className="flex-1 bg-transparent px-2 py-1 text-[12px] focus:outline-none text-zinc-950 placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={saveTags}
                className="text-[11.5px] font-semibold text-zinc-900 hover:text-zinc-700 px-2 transition-colors shrink-0"
              >
                Save
              </button>
            </div>
            <p className="text-[10px] text-zinc-400 leading-normal">
              Tags separate audiences and trigger bulk broadcasting.
            </p>
          </div>

          {/* Quick Metrics detail table */}
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Automation Status</h3>
            <div className="rounded-xl border border-zinc-150 bg-zinc-50/50 p-3.5 space-y-2.5 text-[12.5px]">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">AI Assistant</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  detail.aiEnabled 
                    ? "bg-sky-50 text-sky-700 border border-sky-100" 
                    : "bg-zinc-100 text-zinc-600"
                }`}>
                  {detail.aiEnabled ? "Active" : "Paused"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Opt-Out (STOP)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  detail.optedOut 
                    ? "bg-red-50 text-red-700 border border-red-100" 
                    : "bg-sky-50 text-sky-700 border border-sky-100"
                }`}>
                  {detail.optedOut ? "Stopped" : "Subscribed"}
                </span>
              </div>
              {detail.gender && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Gender</span>
                  <span className="font-semibold text-zinc-800">{detail.gender}</span>
                </div>
              )}
            </div>
          </div>

          {/* Custom Sheet Fields */}
          {detail.customFields && Object.keys(detail.customFields).length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">System Fields</h3>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                {Object.entries(detail.customFields).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-baseline gap-2 text-[12px] py-1 border-b border-zinc-50">
                    <span className="text-zinc-400 truncate max-w-[120px] font-medium">{k}</span>
                    <span className="text-zinc-800 truncate font-semibold text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2">
            <Link
              href={`/dashboard?tab=broadcasts`}
              className="block text-center text-[12px] font-semibold text-zinc-950 py-2.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors shadow-sm"
            >
              New Broadcast to Tags
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default InboxPage;
