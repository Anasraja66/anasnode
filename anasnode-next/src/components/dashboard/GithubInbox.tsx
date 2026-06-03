import { Search, Send, MoreVertical } from "lucide-react";
import { useState } from "react";

const mockChats = [
  { id: 1, name: "Sarah Mitchell", preview: "Yes, I'd like to schedule a demo...", channel: "whatsapp", unread: 2, time: "2m ago", initials: "SM" },
  { id: 2, name: "James Chen", preview: "Thank you for the quick response!", channel: "instagram", unread: 0, time: "15m ago", initials: "JC" },
  { id: 3, name: "Emily Parker", preview: "Can you help me with pricing?", channel: "messenger", unread: 1, time: "1h ago", initials: "EP" },
  { id: 4, name: "Michael Brown", preview: "The product looks amazing!", channel: "whatsapp", unread: 0, time: "3h ago", initials: "MB" },
  { id: 5, name: "Lisa Anderson", preview: "I have a question about...", channel: "instagram", unread: 3, time: "5h ago", initials: "LA" },
];

const mockMessages = [
  { id: 1, type: "client", text: "Hi! I'm interested in learning more about your services.", time: "10:24 AM" },
  { id: 2, type: "operator", text: "Hello! I'd be happy to help you. What specific area are you interested in?", time: "10:25 AM" },
  { id: 3, type: "client", text: "Yes, I'd like to schedule a demo for next week if possible.", time: "10:26 AM" },
  { id: 4, type: "ai", text: "I can help you schedule that! What day works best for you?", time: "10:26 AM" },
];

export function GithubInbox() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [message, setMessage] = useState("");
  const [aiEnabled, setAiEnabled] = useState(true);

  return (
    <div className="flex h-full w-full bg-white rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm">
      {/* Left Panel - Chat List */}
      <div className="w-[360px] border-r border-[#E5E7EB] bg-white flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-[#F1F2F4]">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full h-10 pl-10 pr-4 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0A6BFF] focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-3">
            <button className="px-3 py-1.5 bg-[#E6F0FF] text-[#0A6BFF] text-[11px] font-semibold rounded-lg">
              All Chats
            </button>
            <button className="px-3 py-1.5 bg-[#F8F9FA] text-[#71717A] text-[11px] font-medium rounded-lg hover:bg-[#F1F2F4]">
              Unread Only
            </button>
          </div>

          {/* Channel Pills */}
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#09090B] text-white text-[11px] font-medium rounded-lg">All</button>
            <button className="px-3 py-1.5 bg-[#ECFDF5] text-[#059669] text-[11px] font-medium rounded-lg">WhatsApp</button>
            <button className="px-3 py-1.5 bg-[#FEF3C7] text-[#D97706] text-[11px] font-medium rounded-lg">Instagram</button>
            <button className="px-3 py-1.5 bg-[#E6F0FF] text-[#0A6BFF] text-[11px] font-medium rounded-lg">Messenger</button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {mockChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 border-b border-[#F1F2F4] hover:bg-[#F8F9FA] transition-colors ${
                selectedChat.id === chat.id ? 'bg-[#F8F9FA]' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#0A6BFF] to-[#0052CC] rounded-full flex items-center justify-center">
                    <span className="text-white text-[12px] font-semibold">{chat.initials}</span>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                    chat.channel === 'whatsapp' ? 'bg-[#059669]' : chat.channel === 'instagram' ? 'bg-[#D97706]' : 'bg-[#0A6BFF]'
                  }`}>
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-bold text-[#09090B] truncate">{chat.name}</span>
                    <span className="text-[11px] text-[#71717A]">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-[#71717A] truncate">{chat.preview}</p>
                    {chat.unread > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-[#0A6BFF] text-white text-[10px] font-semibold rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Workspace */}
      <div className="flex-1 flex flex-col bg-[#F8F9FA]">
        {/* Chat Header */}
        <div className="h-16 px-6 bg-white border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0A6BFF] to-[#0052CC] rounded-full flex items-center justify-center">
              <span className="text-white text-[12px] font-semibold">{selectedChat.initials}</span>
            </div>
            <div>
              <div className="text-[14px] font-semibold text-[#09090B]">{selectedChat.name}</div>
              <div className="text-[11px] text-[#71717A]">WhatsApp · +92 300 1234567</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-[12px] font-medium text-[#71717A]">AI Operator</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={(e) => setAiEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E5E7EB] rounded-full peer-checked:bg-[#0A6BFF] transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-[#F8F9FA] rounded-lg">
              <MoreVertical className="w-4 h-4 text-[#71717A]" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'client' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-md ${msg.type === 'client' ? '' : 'text-right'}`}>
                <div
                  className={`inline-block px-4 py-3 rounded-2xl ${
                    msg.type === 'client'
                      ? 'bg-[#F1F5F9] text-[#09090B] rounded-tl-none'
                      : msg.type === 'ai'
                      ? 'bg-[#E6F0FF] text-[#0A6BFF] rounded-tr-none'
                      : 'bg-[#0A6BFF] text-white rounded-tr-none'
                  }`}
                >
                  <p className="text-[13px] leading-relaxed">{msg.text}</p>
                </div>
                <div className="mt-1 px-1">
                  <span className="text-[11px] text-[#71717A]">{msg.time}</span>
                  {msg.type === 'ai' && (
                    <span className="ml-2 text-[10px] text-[#0A6BFF] font-semibold">AI</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-4 bg-white border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 h-11 px-4 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0A6BFF] focus:border-transparent"
            />
            <button className="h-11 w-11 bg-[#0A6BFF] hover:bg-[#0052CC] rounded-xl flex items-center justify-center transition-colors">
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
