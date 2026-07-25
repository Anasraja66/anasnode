"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Phone, User, Send, Loader2, Bot, Clock, Tag, MessageSquare, Mail, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const InstagramIcon = ({ size = 8 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 8 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hardcode accountId for now, in a real app this comes from Context/Session
  const accountId = "default_account";

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
    }
  }, [activeConv]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inbox/list?accountId=${accountId}`);
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/inbox/messages?conversationId=${convId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSend = async () => {
    if (!replyText.trim() || !activeConv) return;
    
    const textToSend = replyText;
    setReplyText("");
    setSending(true);

    // Optimistic update
    const optimisticMsg = {
      id: "temp_" + Date.now(),
      direction: "outbound",
      body: textToSend,
      createdAt: new Date().toISOString(),
      source: "agent"
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await fetch("/api/inbox/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          body: textToSend,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert("Failed to send message: " + data.error);
        // Rollback optimistic update on failure would go here
      } else {
        // Replace temp msg with real msg from DB
        setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? data.message : m));
      }
    } catch (error) {
      alert("Network error occurred.");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* LEFT SIDEBAR: Conversations List */}
      <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col z-10">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-purple-600" />
            Live Inbox
          </h1>
          <div className="relative mt-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin text-gray-300" size={24} />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">
              No conversations found.
            </div>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.id} 
                onClick={() => setActiveConv(conv)}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${activeConv?.id === conv.id ? "bg-purple-50" : "hover:bg-gray-50"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{conv.contactName || conv.contactPhone}</h3>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {conv.lastMessageAt ? formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true }) : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{conv.lastMessage || "No messages yet"}</p>
                <div className="flex items-center gap-2 mt-2">
                  {(() => {
                    const chan = String(conv.channel || "").toLowerCase();
                    if (chan === "whatsapp") {
                      return (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[9px] font-bold uppercase flex items-center gap-1">
                          <MessageSquare size={8} /> WhatsApp
                        </span>
                      );
                    }
                    if (chan === "instagram") {
                      return (
                        <span className="px-2 py-0.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-md text-[9px] font-bold uppercase flex items-center gap-1">
                          <InstagramIcon size={8} /> Instagram
                        </span>
                      );
                    }
                    if (chan === "facebook" || chan === "messenger") {
                      return (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[9px] font-bold uppercase flex items-center gap-1">
                          <FacebookIcon size={8} /> Messenger
                        </span>
                      );
                    }
                    if (chan === "email" || chan === "mail") {
                      return (
                        <span className="px-2 py-0.5 bg-cyan-50 text-cyan-600 border border-cyan-100 rounded-md text-[9px] font-bold uppercase flex items-center gap-1">
                          <Mail size={8} /> Email
                        </span>
                      );
                    }
                    if (chan === "sms") {
                      return (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-md text-[9px] font-bold uppercase flex items-center gap-1">
                          <Phone size={8} /> SMS
                        </span>
                      );
                    }
                    return (
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-md text-[9px] font-bold uppercase flex items-center gap-1">
                        <Zap size={8} /> {conv.channel || "webhook"}
                      </span>
                    );
                  })()}
                  {conv.aiEnabled && (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[9px] font-bold uppercase flex items-center gap-1">
                      <Bot size={8} /> AI Active
                    </span>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="ml-auto w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT MAIN: Chat Pane */}
      <div className="flex-1 flex flex-col bg-[#F9FAFB] relative">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                  {(activeConv.contactName || activeConv.contactPhone)[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{activeConv.contactName || "Unknown Customer"}</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone size={10} /> {activeConv.contactPhone}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                  <Bot size={14} className={activeConv.aiEnabled ? "text-green-500" : "text-gray-400"} />
                  {activeConv.aiEnabled ? "Disable AI Bot" : "Enable AI Bot"}
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              <div className="text-center text-xs text-gray-400 my-4 border-b border-gray-200 pb-4">
                Conversation started on {new Date(activeConv.createdAt).toLocaleDateString()}
              </div>

              {messages.map((msg, idx) => {
                const isOutbound = msg.direction === "outbound";
                return (
                  <div key={msg.id || idx} className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}>
                    <div 
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                        isOutbound 
                          ? "bg-purple-600 text-white rounded-br-sm" 
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.body}</p>
                      <div className={`text-[9px] mt-1 flex justify-end gap-1 items-center ${isOutbound ? "text-purple-200" : "text-gray-400"}`}>
                        <Clock size={8} />
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {msg.source === "bot" && <Bot size={8} className="ml-1" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
              <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
                <textarea 
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message... (Press Enter to send)"
                  className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none px-3 py-2 text-sm text-gray-700 focus:outline-none"
                  rows={1}
                />
                <button 
                  onClick={handleSend}
                  disabled={!replyText.trim() || sending}
                  className="w-11 h-11 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm shrink-0"
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <MessageSquare size={32} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Live Inbox</h2>
            <p className="text-sm">Select a conversation from the left to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
