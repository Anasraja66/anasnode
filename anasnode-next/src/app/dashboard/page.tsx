"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Zap,
  Radio,
  BarChart2,
  Settings,
  MessageSquare,
  Plus,
  ChevronDown,
  ArrowUpRight,
  MoreHorizontal,
  Search,
  Bell,
  Check,
  X,
  Circle,
  Dot,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  Activity,
  GitBranch,
  Clock,
  Hash,
  Send,
  Bot,
  UploadCloud,
  Trash2,
  FileText,
  CheckCircle2,
  LogOut,
  Home,
  Sparkles,
  AlertCircle,
  CheckSquare,
  Building2,
  Utensils,
  Stethoscope,
  Sliders
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "ai_agent" | "overview" | "contacts" | "automations" | "broadcasts" | "analytics";

type Workspace = {
  id: string;
  name: string;
  industry: string;
  slug: string;
  status: "live" | "draft" | "paused";
  version: number;
  automations: Automation[];
};

type Automation = {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  runs: number;
  lastRun: string;
};

type Contact = {
  id: string;
  name: string;
  phone: string;
  industry: string;
  stage: string;
  lastMessage: string;
  time: string;
  checked?: boolean;
};

type FAQ = {
  q: string;
  a: string;
};

type TrainedFile = {
  name: string;
  size: string;
  status: "Trained" | "Training";
  progress: number;
};

// ─── Initial Mock Data ───────────────────────────────────────────────────────

const WORKSPACES: Workspace[] = [
  {
    id: "ws-1",
    name: "Marina Realty",
    industry: "Real Estate",
    slug: "marina-realty",
    status: "live",
    version: 3,
    automations: [
      { id: "a-1", name: "Lead Qualification Bot", type: "whatsapp_flow", enabled: true, runs: 284, lastRun: "2 min ago" },
      { id: "a-2", name: "Viewing Scheduler", type: "calendar", enabled: true, runs: 97, lastRun: "14 min ago" },
      { id: "a-3", name: "Cold Lead Drip", type: "campaign", enabled: false, runs: 41, lastRun: "3 days ago" },
    ]
  },
  {
    id: "ws-2",
    name: "Olive & Oak",
    industry: "Restaurant",
    slug: "olive-oak",
    status: "live",
    version: 1,
    automations: [
      { id: "a-4", name: "WhatsApp Ordering", type: "whatsapp_flow", enabled: true, runs: 512, lastRun: "Just now" },
      { id: "a-5", name: "Table Reservations", type: "calendar", enabled: true, runs: 203, lastRun: "8 min ago" },
      { id: "a-6", name: "Review Requests", type: "campaign", enabled: true, runs: 88, lastRun: "1 hr ago" },
    ]
  },
];

const CONTACTS: Contact[] = [
  { id: "c-1", name: "Ahmed Hassan", phone: "+971 50 123 4567", industry: "Real Estate", stage: "Qualified", lastMessage: "Yes, AED 2.2M is my budget limit.", time: "2m ago", checked: false },
  { id: "c-2", name: "Sara Khan", phone: "+92 300 987 6543", industry: "Restaurant", stage: "Booked", lastMessage: "Can I pre-order drinks?", time: "4h ago", checked: false },
  { id: "c-3", name: "Dr. Imran Qureshi", phone: "+92 321 456 7890", industry: "Clinic", stage: "Reminded", lastMessage: "Confirmed for tomorrow 11am.", time: "1d ago", checked: false },
  { id: "c-4", name: "Layla Al-Rashid", phone: "+971 55 234 5678", industry: "Real Estate", stage: "Viewing Set", lastMessage: "Saturday works for the viewing.", time: "2d ago", checked: false },
];

const INITIAL_FAQS: FAQ[] = [
  { q: "What is your starting price?", a: "Our premium 3BHK waterfront apartments start from AED 2.2M with customized payment plans." },
  { q: "Where is the property located?", a: "The premier Marina Realty towers are located at Dubai Marina, right beside the Yacht Club." },
  { q: "Are viewing slots available?", a: "Yes! Viewings are scheduled daily from 9:00 AM to 6:00 PM. I can schedule a view for you right now." }
];

const INITIAL_FILES: TrainedFile[] = [
  { name: "marina_realty_brochure.pdf", size: "5.2 MB", status: "Trained", progress: 100 },
  { name: "pricing_sheet.xlsx", size: "1.8 MB", status: "Trained", progress: 100 }
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { dot: string; text: string; bg: string }> = {
    live:    { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
    draft:   { dot: "bg-zinc-400",    text: "text-zinc-500",    bg: "bg-zinc-100" },
    paused:  { dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50" },
    Qualified:   { dot: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50" },
    Booked:      { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
    Reminded:    { dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50" },
    "Viewing Set": { dot: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50" },
  };
  const s = map[status] ?? { dot: "bg-zinc-400", text: "text-zinc-500", bg: "bg-zinc-100" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${s.text} ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ─── Left Sidebar Component ──────────────────────────────────────────────────

function Sidebar({ active, onChange, ws, onWsChange, workspaces }: {
  active: Tab;
  onChange: (t: Tab) => void;
  ws: Workspace;
  onWsChange: (w: Workspace) => void;
  workspaces: Workspace[];
}) {
  const [wsOpen, setWsOpen] = useState(false);

  const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "ai_agent",    label: "Anaos AI",       icon: Bot },
    { id: "overview",    label: "Home",           icon: Home },
    { id: "contacts",    label: "Contacts",       icon: Users },
    { id: "automations", label: "Automation",     icon: Zap },
    { id: "broadcasts",  label: "Broadcasts",     icon: Radio },
  ];

  return (
    <aside className="w-[235px] shrink-0 border-r border-[#E5E7EB] bg-[#F7F7F8] flex flex-col h-full z-10">
      {/* Logo */}
      <div className="h-14 px-5 flex items-center gap-2.5 border-b border-[#E5E7EB]">
        <div className="w-6 h-6 rounded-[6px] bg-[#0A6BFF] flex items-center justify-center shadow-sm">
          <Zap className="w-3.5 h-3.5 text-white fill-current" />
        </div>
        <span className="text-[15px] font-bold text-zinc-900 tracking-tight">Anaos</span>
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 pt-3 relative">
        <button
          onClick={() => setWsOpen(!wsOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-zinc-50 shadow-sm transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded bg-[#0A6BFF] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
              {ws.name[0]}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[12.5px] font-semibold text-zinc-900 truncate leading-tight">{ws.name}</p>
              <p className="text-[10px] text-zinc-400 font-medium -mt-0.5">Pro</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform shrink-0 ${wsOpen ? "rotate-180" : ""}`} />
        </button>

        {wsOpen && (
          <div className="absolute left-3 right-3 mt-1 rounded-lg border border-[#E5E7EB] bg-white shadow-lg overflow-hidden z-20">
            {workspaces.map((w) => (
              <button
                key={w.id}
                onClick={() => { onWsChange(w); setWsOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-zinc-50 transition-colors cursor-pointer ${ws.id === w.id ? "bg-zinc-50" : ""}`}
              >
                <div className="w-5 h-5 rounded bg-zinc-200 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-zinc-700">{w.name[0]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-zinc-800 truncate">{w.name}</p>
                  <p className="text-[10px] text-zinc-400">{w.industry}</p>
                </div>
                {ws.id === w.id && <Check className="w-3.5 h-3.5 text-[#0A6BFF] shrink-0" />}
              </button>
            ))}
            <div className="border-t border-zinc-100 px-3 py-2">
              <button className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> New workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all cursor-pointer ${
              active === id
                ? "bg-[#E6F0FF] text-[#0A6BFF]"
                : "text-[#4B5563] hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${active === id ? "text-[#0A6BFF]" : "text-zinc-400"}`} />
            {label}
          </button>
        ))}
      </nav>

      {/* INSIGHTS Navigation */}
      <div className="px-5 pt-3">
        <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">Insights</span>
      </div>
      <nav className="px-3 pt-1 space-y-1">
        <button
          onClick={() => onChange("analytics")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all cursor-pointer ${
            active === "analytics"
              ? "bg-[#E6F0FF] text-[#0A6BFF]"
              : "text-[#4B5563] hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          <BarChart2 className={`w-5 h-5 shrink-0 ${active === "analytics" ? "text-[#0A6BFF]" : "text-zinc-400"}`} />
          Analytics
        </button>
      </nav>

      {/* Sidebar Footer */}
      <div className="px-3 py-4 border-t border-[#E5E7EB] space-y-1 mt-auto">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold text-[#4B5563] hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer">
          <Settings className="w-5 h-5 text-zinc-400" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold text-[#4B5563] hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer">
          <LogOut className="w-5 h-5 text-zinc-400" />
          Log out
        </button>
        <div className="flex items-center gap-2.5 px-3 pt-3 border-t border-[#E5E7EB] mt-2">
          <div className="w-8 h-8 rounded-full bg-[#1A1F2C] flex items-center justify-center shrink-0 border border-zinc-200">
            <span className="text-[12px] font-bold text-white">N</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-bold text-zinc-800 truncate leading-none">Anasraka</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Operator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Topbar Component ─────────────────────────────────────────────────────────

function Topbar({ title, ws }: { title: string; ws: Workspace }) {
  return (
    <header className="h-14 border-b border-[#E5E7EB] bg-white px-6 flex items-center justify-between shrink-0 z-0">
      <div className="flex items-center gap-2 text-[13.5px] font-medium">
        <span className="text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer">{ws.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
        <span className="font-semibold text-zinc-900">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 pl-9 pr-4 rounded-lg border border-[#D9D9D9] text-[13.5px] bg-white focus:outline-none focus:border-[#0A6BFF] w-48 transition-all"
          />
        </div>
        <button className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer relative">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0A6BFF]" />
        </button>
      </div>
    </header>
  );
}

// ─── Page: AI Agent (The Functional Playground Core) ───────────────────────────

// ─── Industry Preset Definitions ──────────────────────────────────────────────

const PRESETS = {
  real_estate: {
    name: "Real Estate",
    label: "Real Estate Operator",
    model: "Anaos AI Enterprise v3.0 (Recommended)",
    prompt: "You are a professional real estate assistant for Marina Realty. Your goal is to welcome new leads on WhatsApp, qualify their preferences, and guide them to schedule a viewing. Follow these rules:\n- Be friendly, professional, and concise (max 2 sentences per reply).\n- Politely qualify them by asking about their target budget limit, desired location in Dubai, and preferred layout (e.g. 3BHK).\n- Once all details are collected, offer viewing slots and guide them to secure a viewing appointment.",
    faqs: [
      { q: "What is your starting price?", a: "Our premium 3BHK waterfront apartments start from AED 2.2M with customized payment plans." },
      { q: "Where is the property located?", a: "The premier Marina Realty towers are located at Dubai Marina, right beside the Yacht Club." },
      { q: "Are viewing slots available?", a: "Yes! Viewings are scheduled daily from 9:00 AM to 6:00 PM. I can schedule a view for you right now." }
    ],
    files: [
      { name: "marina_realty_brochure.pdf", size: "5.2 MB", status: "Trained" as const, progress: 100 },
      { name: "pricing_sheet.xlsx", size: "1.8 MB", status: "Trained" as const, progress: 100 }
    ],
    welcome: "Hi there! I am your AI assistant for Marina Realty. How can I help you find your dream home in Dubai today?",
    placeholder: "Ask about price, location, viewing, or layouts..."
  },
  restaurant: {
    name: "Restaurant",
    label: "Olive & Oak Dining",
    model: "Anaos AI Core v2.5 (Standard)",
    prompt: "You are a warm, efficient reservation bot for Olive & Oak premium bistro. Your goal is to help guests book a table and answer menu details. Follow these rules:\n- Be welcoming, polite, and brief (max 2 sentences per reply).\n- Qualify their booking by asking for the party size, preferred time/date, and any dietary allergies.\n- Once collected, confirm that their table is reserved and send them details.",
    faqs: [
      { q: "What are your timings?", a: "Olive & Oak is open daily for dinner from 6:00 PM to 11:30 PM." },
      { q: "Do you have parking?", a: "Yes, we offer complimentary valet parking for all our dining guests right at the entrance." },
      { q: "Is there a kids menu?", a: "Yes, we have a specialized organic kids menu with delicious, healthy options." }
    ],
    files: [
      { name: "dinner_menu.pdf", size: "3.4 MB", status: "Trained" as const, progress: 100 },
      { name: "wine_list.pdf", size: "1.2 MB", status: "Trained" as const, progress: 100 }
    ],
    welcome: "Welcome to Olive & Oak! 🍽️ I can help you secure a premium table booking. How many guests will be joining us tonight?",
    placeholder: "Ask about timings, parking, kids menu, or book a table..."
  },
  clinic: {
    name: "Clinic",
    label: "Apex Dental Clinic",
    model: "Anaos AI Lite v1.0 (Fast)",
    prompt: "You are a professional medical assistant for Apex Dental Clinic. Your goal is to qualify dental patients, answer consultation queries, and book appointments. Follow these rules:\n- Be professional, caring, and concise (max 2 sentences per reply).\n- Qualify patients by asking about their treatment type (e.g. check-up, whitening), insurance provider, and preferred slot.\n- Once detailed, confirm their booking slot.",
    faqs: [
      { q: "Which insurance do you accept?", a: "We accept all major providers including NextCare, MetLife, AXA, and Cigna." },
      { q: "What are your consultation fees?", a: "General dentist check-ups start from AED 250, fully covered by most premium networks." },
      { q: "Where is the clinic located?", a: "Apex Dental is located in Downtown Dubai, Boulevard Tower 2, Suite 402." }
    ],
    files: [
      { name: "apex_dental_pricing.pdf", size: "4.8 MB", status: "Trained" as const, progress: 100 },
      { name: "insurance_partners.xlsx", size: "1.9 MB", status: "Trained" as const, progress: 100 }
    ],
    welcome: "Hello and welcome to Apex Dental Clinic! 🦷 How can I assist you with your dental healthcare appointment today?",
    placeholder: "Ask about insurance, fees, clinic location, or book a slot..."
  }
};

function AIAgentPage({ ws }: { ws: Workspace }) {
  // Preset selector state
  const [activePreset, setActivePreset] = useState<keyof typeof PRESETS>("real_estate");

  const [model, setModel] = useState(PRESETS.real_estate.model);
  const [systemPrompt, setSystemPrompt] = useState(PRESETS.real_estate.prompt);
  const [faqs, setFaqs] = useState<FAQ[]>(PRESETS.real_estate.faqs);
  const [files, setFiles] = useState<TrainedFile[]>(PRESETS.real_estate.files);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");

  // Chat sandbox state
  const [chatMessages, setChatMessages] = useState([
    { sender: "agent", text: PRESETS.real_estate.welcome, time: "12:00 PM" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Switch presets dynamically
  const handleSelectPreset = (key: keyof typeof PRESETS) => {
    setActivePreset(key);
    const p = PRESETS[key];
    setModel(p.model);
    setSystemPrompt(p.prompt);
    setFaqs(p.faqs);
    setFiles(p.files);
    
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages([
      { sender: "agent", text: p.welcome, time: timeString }
    ]);
    setChatInput("");
    setIsTyping(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setFaqs([...faqs, { q: newQuestion, a: newAnswer }]);
    setNewQuestion("");
    setNewAnswer("");
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const simulateFileUpload = () => {
    if (isSimulatingUpload) return;
    const fileNames = ["dubai_marina_guide.pdf", "amenities_catalog.pdf", "booking_terms.docx", "dinner_specials.xlsx", "apex_schedule.csv"];
    const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];
    
    setIsSimulatingUpload(true);
    setUploadFileName(randomName);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFiles((prev) => [
              ...prev,
              { name: randomName, size: "3.4 MB", status: "Trained", progress: 100 }
            ]);
            setIsSimulatingUpload(false);
          }, 400);
          return 100;
        }
        return p + 20;
      });
    }, 200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append user message
    setChatMessages((prev) => [...prev, { sender: "user", text: userText, time: timeString }]);
    setChatInput("");
    setIsTyping(true);

    // Simulate smart dynamic agent response based on prompt and faqs
    setTimeout(() => {
      const msg = userText.toLowerCase();
      let matchedReply = "";

      // 1. Check FAQs keyword match
      for (const faq of faqs) {
        const keywords = faq.q.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        if (keywords.some(kw => msg.includes(kw))) {
          matchedReply = faq.a;
          break;
        }
      }

      // 2. Custom logical rules based on selected Preset
      if (!matchedReply) {
        if (activePreset === "real_estate") {
          if (msg.includes("price") || msg.includes("budget") || msg.includes("cost") || msg.includes("how much") || msg.includes("aed")) {
            matchedReply = "Our premium waterfront apartments start from AED 2.2M. May I ask what your planned budget limit is for this purchase?";
          } else if (msg.includes("location") || msg.includes("where") || msg.includes("address") || msg.includes("situated")) {
            matchedReply = "Marina Realty apartments are situated in the premium harbor sector of Dubai Marina, directly overlooking the main yacht club boardwalk.";
          } else if (msg.includes("layout") || msg.includes("bhk") || msg.includes("bedroom") || msg.includes("size")) {
            matchedReply = "We feature luxury 2, 3, and 4 BHK layouts complete with sprawling balconies. Which size is best suited for your family?";
          } else if (msg.includes("viewing") || msg.includes("visit") || msg.includes("book") || msg.includes("schedule")) {
            matchedReply = "I can definitely book a viewing for you! We have slots available tomorrow morning at 10:00 AM or afternoon at 3:00 PM. Which suits you better?";
          }
        } else if (activePreset === "restaurant") {
          if (msg.includes("timing") || msg.includes("open") || msg.includes("hour") || msg.includes("time")) {
            matchedReply = "Olive & Oak is open daily for dinner from 6:00 PM to 11:30 PM. Would you like to reserve a table for tonight?";
          } else if (msg.includes("parking") || msg.includes("car") || msg.includes("valet")) {
            matchedReply = "Yes, we offer complimentary valet parking directly at the bistro entrance for all our dining guests.";
          } else if (msg.includes("menu") || msg.includes("eat") || msg.includes("food") || msg.includes("dish")) {
            matchedReply = "We feature an Italian & Continental fusion menu. Our specials tonight include wood-fired truffle pizza and fresh lobster pasta!";
          } else if (msg.includes("book") || msg.includes("table") || msg.includes("reserve") || msg.includes("seat")) {
            matchedReply = "I can secure a reservation for you instantly. How many guests will be dining, and at what time tonight?";
          }
        } else if (activePreset === "clinic") {
          if (msg.includes("insurance") || msg.includes("cover") || msg.includes("axa") || msg.includes("metlife")) {
            matchedReply = "We accept all major direct-billing insurances including AXA, MetLife, Cigna, and NextCare. What is your provider?";
          } else if (msg.includes("fee") || msg.includes("cost") || msg.includes("price") || msg.includes("charge")) {
            matchedReply = "Our general specialist consultations start from AED 250. Most treatments are fully covered under premium networks.";
          } else if (msg.includes("where") || msg.includes("location") || msg.includes("address") || msg.includes("located")) {
            matchedReply = "Apex Dental is located in Downtown Dubai, Boulevard Tower 2, Suite 402. Valet parking is available at the tower lobby.";
          } else if (msg.includes("book") || msg.includes("appointment") || msg.includes("schedule") || msg.includes("slot")) {
            matchedReply = "I can book an appointment with our specialist dentist. Would you prefer tomorrow morning at 10:30 AM or afternoon at 4:00 PM?";
          }
        }

        // Generic greeting fallbacks if still empty
        if (!matchedReply) {
          if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
            matchedReply = activePreset === "real_estate" 
              ? "Hello! Welcome to Marina Realty. I'm here to help you secure a premium waterfront residence. Are you looking to buy or invest?"
              : activePreset === "restaurant"
              ? "Hello and welcome to Olive & Oak! 🍽️ I can help you reserve a premium dining table. For what time and how many guests?"
              : "Hello and welcome to Apex Dental! 🦷 How can I assist you with your dental health or scheduling an appointment today?";
          } else {
            matchedReply = activePreset === "real_estate"
              ? "I have noted that preference! Let me search our premium inventory for matching options. What is your target budget range?"
              : activePreset === "restaurant"
              ? "That sounds wonderful! I will secure the table. Could you please share a contact number to confirm the reservation?"
              : "Understood! I will record that for the specialist. What is the patient's full name to create a dental check-up record?";
          }
        }
      }

      setChatMessages((prev) => [...prev, { sender: "agent", text: matchedReply, time: timeString }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Configurations (60% width) */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        
        {/* Visual Preset Selector Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5 space-y-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0A6BFF]" />
            <h3 className="text-[14.5px] font-extrabold text-blue-900">Choose an Industry Workspace Template</h3>
          </div>
          <p className="text-[13px] text-blue-800/80 leading-relaxed font-medium">
            Click any button below to instantly load a pre-configured AI Agent setting and test it live in the WhatsApp Sandbox playground on the right side!
          </p>
          
          <div className="flex flex-wrap gap-2.5 pt-1">
            {Object.entries(PRESETS).map(([key, p]) => {
              const presetIcons: Record<string, React.ElementType> = {
                real_estate: Building2,
                restaurant: Utensils,
                clinic: Stethoscope,
              };
              const Icon = presetIcons[key];
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key as keyof typeof PRESETS)}
                  className={`px-4.5 py-2.5 rounded-full border text-[13.5px] font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2 ${
                    activePreset === key
                      ? "bg-[#0A6BFF] border-[#0A6BFF] text-white hover:bg-[#0052CC]"
                      : "bg-white border-[#E5E7EB] text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activePreset === key ? "text-white" : "text-zinc-400"}`} />
                  {p.name} Operator
                </button>
              );
            })}
          </div>
        </div>

        {/* LLM & Behavior Settings */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5.5 h-5.5 text-[#0A6BFF]" />
              <h2 className="text-[16px] font-extrabold text-zinc-900 tracking-tight">AI Agent Configuration</h2>
            </div>
            <StatusBadge status="live" />
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10.5px] font-extrabold text-zinc-400 uppercase tracking-wider mb-2">Primary Neural Language Engine</label>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full h-11 px-3.5 pr-10 border border-[#D9D9D9] rounded-xl text-[14px] font-bold bg-white focus:outline-none focus:border-[#0A6BFF] focus:ring-1 focus:ring-[#0A6BFF] appearance-none cursor-pointer"
                >
                  <option>Anaos AI Enterprise v3.0 (Recommended)</option>
                  <option>Anaos AI Core v2.5 (Standard)</option>
                  <option>Anaos AI Lite v1.0 (Fast)</option>
                </select>
                <ChevronDown className="w-4.5 h-4.5 text-zinc-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
              <p className="text-[11.5px] text-zinc-400 mt-1.5 font-medium">Proprietary Anaos neural models are pre-trained for natural human qualifiers.</p>
            </div>

            <div>
              <label className="block text-[10.5px] font-extrabold text-zinc-400 uppercase tracking-wider mb-2">System Instructions & Behavior Prompt</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={6}
                className="w-full px-4 py-3.5 border border-[#D9D9D9] rounded-xl text-[14.5px] leading-relaxed text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-[#0A6BFF] focus:ring-1 focus:ring-[#0A6BFF] resize-none transition-all font-normal"
                placeholder="Give instructions to define your chatbot behavior..."
              />
              <p className="text-[11.5px] text-zinc-400 mt-1.5 font-medium">Control response lengths, qualification limits, key questions, and scheduled calls to action.</p>
            </div>
          </div>
        </div>

        {/* Knowledge Base FAQs */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3.5">
            <CheckSquare className="w-5.5 h-5.5 text-[#0A6BFF]" />
            <h2 className="text-[16px] font-extrabold text-zinc-900 tracking-tight">Structured Q&A Knowledge Rules</h2>
          </div>

          {/* FAQ list */}
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 bg-zinc-50 hover:bg-zinc-100/50 rounded-xl border border-zinc-100 relative group transition-colors">
                <button
                  onClick={() => handleRemoveFaq(i)}
                  className="absolute top-3.5 right-3.5 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="text-[13.5px] font-extrabold text-zinc-800">Q: {faq.q}</p>
                <p className="text-[13px] text-zinc-600 mt-1.5 leading-relaxed font-medium">A: {faq.a}</p>
              </div>
            ))}
          </div>

          {/* FAQ Add Form */}
          <form onSubmit={handleAddFaq} className="border-t border-zinc-100 pt-4.5 space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">Inbound User Question</label>
                <input
                  type="text"
                  placeholder="e.g. What is the price limit?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full h-11 px-3.5 border border-[#D9D9D9] rounded-xl text-[13.5px] font-semibold bg-white focus:outline-none focus:border-[#0A6BFF] focus:ring-1 focus:ring-[#0A6BFF]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">Target AI Response</label>
                <input
                  type="text"
                  placeholder="e.g. Apartments start from AED 2.2M."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full h-11 px-3.5 border border-[#D9D9D9] rounded-xl text-[13.5px] font-medium bg-white focus:outline-none focus:border-[#0A6BFF] focus:ring-1 focus:ring-[#0A6BFF]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!newQuestion.trim() || !newAnswer.trim()}
              className="flex items-center gap-2 h-10 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-bold transition-colors disabled:opacity-40 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Structured Rule
            </button>
          </form>
        </div>

        {/* Document upload simulation */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3.5">
            <FileText className="w-5.5 h-5.5 text-[#0A6BFF]" />
            <h2 className="text-[16px] font-extrabold text-zinc-900 tracking-tight">Trained Files & Catalogs</h2>
          </div>

          {/* Active files */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 border border-[#E5E7EB] rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:border-zinc-300 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-zinc-800 truncate">{file.name}</p>
                    <p className="text-[10.5px] text-zinc-400 font-semibold mt-0.5">{file.size} · Trained</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              </div>
            ))}

            {isSimulatingUpload && (
              <div className="p-4 border border-dashed border-[#0A6BFF] rounded-xl bg-blue-50/20 space-y-2 col-span-1 md:col-span-2 shadow-sm animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <RefreshCw className="w-4 h-4 text-[#0A6BFF] animate-spin shrink-0" />
                    <span className="text-[12.5px] font-bold text-[#0A6BFF] truncate">{uploadFileName}</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#0A6BFF]">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0A6BFF] transition-all duration-200 rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Drag & drop box */}
          <button
            onClick={simulateFileUpload}
            disabled={isSimulatingUpload}
            className="w-full border-2 border-dashed border-[#D9D9D9] hover:border-[#0A6BFF] rounded-xl p-7 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-[#0A6BFF] transition-all bg-zinc-50 hover:bg-blue-50/10 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <UploadCloud className="w-8.5 h-8.5 text-zinc-400" />
            <div className="text-center">
              <p className="text-[13.5px] font-bold">Train Custom Documents</p>
              <p className="text-[11.5px] text-zinc-400 mt-1 font-medium">Click to simulate training a new PDF catalog or Excel pricing sheet</p>
            </div>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Sandbox Simulator (40% width) */}
      <div className="col-span-12 lg:col-span-5 flex justify-center">
        {/* iPhone Wrapper Mock */}
        <div className="w-[335px] h-[620px] rounded-[48px] border-[10px] border-zinc-950 bg-white shadow-2xl overflow-hidden flex flex-col relative shrink-0">
          
          {/* Top Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-34 h-6 bg-zinc-950 rounded-b-2xl z-20 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 mr-2" />
            <span className="w-14 h-1.5 bg-zinc-900 rounded-full" />
          </div>

          {/* WhatsApp Header Mock */}
          <div className="bg-[#075E54] text-white pt-9 pb-3.5 px-4 flex items-center gap-3 shrink-0 z-10">
            <div className="w-9 h-9 rounded-full bg-zinc-100 border border-teal-700 flex items-center justify-center overflow-hidden shrink-0 mt-1 shadow-sm">
              <Bot className="w-5.5 h-5.5 text-teal-800" />
            </div>
            <div className="mt-1">
              <h3 className="text-[13.5px] font-extrabold leading-tight">Anaos AI Agent</h3>
              <p className="text-[10px] text-teal-100 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                online
              </p>
            </div>
          </div>

          {/* Chat message view */}
          <div className="flex-1 bg-[#ECE5DD] p-3.5 overflow-y-auto space-y-4 flex flex-col">
            <div className="mx-auto my-0.5 px-3 py-1 bg-[#d0e9ff] text-zinc-800 text-[10px] font-bold rounded-md shadow-sm select-none border border-[#b2d5f5]">
              🤖 LIVE WHATSAPP SANDBOX
            </div>

            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl p-3 text-[13.5px] shadow-sm relative leading-relaxed transition-all ${
                  msg.sender === "agent"
                    ? "bg-white text-zinc-800 self-start"
                    : "bg-[#DCF8C6] text-zinc-800 self-end"
                }`}
              >
                <p className="font-normal">{msg.text}</p>
                <span className="block text-[9px] text-zinc-400 text-right mt-1 font-mono font-medium">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="bg-white max-w-[80%] rounded-xl px-3 py-2.5 self-start shadow-sm flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="bg-zinc-50 border-t border-zinc-200 p-2.5 flex items-center gap-2 shrink-0 z-10">
            <input
              type="text"
              placeholder={PRESETS[activePreset].placeholder}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 h-10 px-4 bg-white border border-[#D9D9D9] rounded-full text-[13.5px] focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-medium"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-[#075E54] hover:bg-[#064e46] text-white flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer shrink-0 shadow-sm"
            >
              <Send className="w-4.5 h-4.5 pl-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Overview (Home) ───────────────────────────────────────────────────

function OverviewPage({ ws, onToggle }: { ws: Workspace; onToggle: (id: string) => void }) {
  const stats = [
    { label: "Active Automations", value: ws.automations.filter(a => a.enabled).length.toString(), change: null },
    { label: "Total Runs", value: ws.automations.reduce((s, a) => s + a.runs, 0).toLocaleString(), change: "+18%" },
    { label: "Contacts Syncing", value: "432", change: "+12%" },
    { label: "Messages Enriched", value: "8,412", change: "+24%" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Workspace Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-bold text-zinc-900">{ws.name}</h1>
            <StatusBadge status={ws.status} />
            <span className="text-[11px] font-mono text-zinc-400 font-bold bg-white px-2 py-0.5 rounded border border-zinc-200">v{ws.version}.0</span>
          </div>
          <p className="mt-1 text-[13px] text-zinc-500 font-medium">/{ws.slug} · {ws.industry} Campaign Grid</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-[#D9D9D9] bg-white text-[13.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer shadow-sm">
            <RefreshCw className="w-4 h-4" /> Sync Database
          </button>
          <button className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#0A6BFF] text-white text-[13.5px] font-bold hover:bg-[#0052CC] transition-colors cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" /> Create Automation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-wider">{s.label}</p>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-[26px] font-bold text-zinc-900 tabular-nums leading-none">{s.value}</span>
              {s.change && (
                <span className="text-[11.5px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{s.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Automations Table */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-zinc-900">Registered Automations</h2>
          <span className="text-[12px] text-zinc-400 font-mono font-bold bg-zinc-50 px-2 py-0.5 rounded">{ws.automations.length} active</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                {["Name", "Type", "Runs", "Last run", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {ws.automations.map((a) => (
                <tr key={a.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-5 py-4 text-[13.5px] font-semibold text-zinc-800">{a.name}</td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">
                      {a.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13.5px] text-zinc-600 font-mono">{a.runs.toLocaleString()}</td>
                  <td className="px-5 py-4 text-[13px] text-zinc-400 font-medium">{a.lastRun}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onToggle(a.id)}
                      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${a.enabled ? "bg-[#0A6BFF]" : "bg-zinc-200"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${a.enabled ? "left-[17px]" : "left-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button className="text-zinc-300 hover:text-zinc-600 transition-colors cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Contacts ───────────────────────────────────────────────────────────

function ContactsPage({ contacts, onToggleCheck, onToggleAllCheck }: {
  contacts: Contact[];
  onToggleCheck: (id: string) => void;
  onToggleAllCheck: (checked: boolean) => void;
}) {
  const allChecked = contacts.length > 0 && contacts.every(c => c.checked);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-zinc-900">Contacts Catalog</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Real-time synchronized contacts from WhatsApp chats</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-1.5 h-10 px-3.5 rounded-lg border border-[#D9D9D9] bg-white text-[13.5px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer shadow-sm">
            <Search className="w-4 h-4" /> Filter Listings
          </button>
          <button className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#0A6BFF] text-white text-[13.5px] font-bold hover:bg-[#0052CC] transition-colors cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" /> Add Lead Contact
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="px-5 py-3.5 w-12">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) => onToggleAllCheck(e.target.value === "on" ? !allChecked : false)}
                    className="w-4 h-4 rounded border-[#D9D9D9] text-[#0A6BFF] focus:ring-[#0A6BFF] cursor-pointer"
                  />
                </th>
                {["Name", "Phone", "Target Sector", "Engagement Stage", "Recent Message", "Time"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {contacts.map((c) => (
                <tr key={c.id} className={`hover:bg-zinc-50/40 transition-colors ${c.checked ? "bg-blue-50/10" : ""}`}>
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={c.checked || false}
                      onChange={() => onToggleCheck(c.id)}
                      className="w-4 h-4 rounded border-[#D9D9D9] text-[#0A6BFF] focus:ring-[#0A6BFF] cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-4 text-[13.5px] font-bold text-zinc-800">{c.name}</td>
                  <td className="px-5 py-4 text-[13px] font-mono text-zinc-500">{c.phone}</td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200 font-mono">{c.industry}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={c.stage} /></td>
                  <td className="px-5 py-4 text-[13px] text-zinc-500 italic max-w-[200px] truncate">
                    "{c.lastMessage}"
                  </td>
                  <td className="px-5 py-4 text-[12px] font-mono text-zinc-400 font-semibold">{c.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Broadcasts ─────────────────────────────────────────────────────────

function BroadcastsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-zinc-900">WhatsApp Broadcasts</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Send bulk WhatsApp template promotions via Meta Cloud API</p>
        </div>
        <button className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#0A6BFF] text-white text-[13.5px] font-bold hover:bg-[#0052CC] transition-colors cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" /> New Broadcast Campaign
        </button>
      </div>

      {/* Recent Campaign */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h2 className="text-[14px] font-bold text-zinc-900">Campaign History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                {["Campaign", "Audience", "Sent", "Read", "Replied", "Status", ""].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {[
                { name: "Marina Premium 3BHK Launch", audience: "142 leads", sent: 142, read: 124, replied: 58, status: "live" },
                { name: "Weekend Special Reservation", audience: "89 regulars", sent: 89, read: 76, replied: 12, status: "live" },
                { name: "Post-Visit Experience Review", audience: "34 clients", sent: 34, read: 29, replied: 21, status: "live" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="px-5 py-4 text-[13.5px] font-semibold text-zinc-800">{row.name}</td>
                  <td className="px-5 py-4 text-[13px] text-zinc-500 font-medium">{row.audience}</td>
                  <td className="px-5 py-4 text-[13.5px] tabular-nums font-mono text-zinc-700">{row.sent}</td>
                  <td className="px-5 py-4 text-[13.5px] tabular-nums font-mono text-zinc-700">
                    {row.read} <span className="text-zinc-400 text-[11px]">({Math.round(row.read/row.sent*100)}%)</span>
                  </td>
                  <td className="px-5 py-4 text-[13.5px] tabular-nums font-mono text-zinc-700">
                    {row.replied} <span className="text-zinc-400 text-[11px]">({Math.round(row.replied/row.sent*100)}%)</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={row.status} /></td>
                  <td className="px-5 py-4">
                    <button className="text-zinc-300 hover:text-zinc-600 transition-colors cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Analytics ──────────────────────────────────────────────────────────

function AnalyticsPage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const inbound =  [62, 45, 78, 38, 55, 88, 100];
  const outbound = [88, 68, 92, 55, 76, 100, 100];
  const max = 100;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-[20px] font-bold text-zinc-900">Analytics Insights</h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">Aggregate AI conversation volumes for the past 7 days</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Leads Captured",       value: "432", delta: "+12.5%" },
          { label: "AI Conversations",    value: "386", delta: "+8.1%" },
          { label: "Outbound Sent",        value: "8,412", delta: "+24.0%" },
          { label: "Successful Bookings",  value: "124", delta: "+15.2%" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-wider">{s.label}</p>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-[26px] font-bold text-zinc-900 tabular-nums leading-none">{s.value}</span>
              <span className="text-[11.5px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{s.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-zinc-900">Conversation Traffic</h2>
            <p className="text-[12px] text-zinc-400 mt-0.5">Inbound user messages vs Automated AI replies</p>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-zinc-500 font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-200" />Inbound</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-zinc-800" />AI Automated</span>
          </div>
        </div>
        <div className="px-6 pt-8 pb-4">
          <div className="flex items-end gap-6 h-40">
            {days.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-3.5 h-full justify-end">
                <div className="w-full flex gap-1.5 items-end justify-center h-full">
                  <div className="w-3 rounded-t-[3px] bg-zinc-200" style={{ height: `${(inbound[i]/max)*100}%` }} />
                  <div className="w-3 rounded-t-[3px] bg-zinc-800" style={{ height: `${(outbound[i]/max)*100}%` }} />
                </div>
                <span className="text-[11px] font-bold font-mono text-zinc-400">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Automations (Prompt Flow Creator) ──────────────────────────────────

function AutomationsPage({ ws }: { ws: Workspace }) {
  const [prompt, setPrompt] = useState("");
  const [building, setBuilding] = useState(false);
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);

  const stages = ["Extracting client criteria constraints", "Structuring WhatsApp sequential flow nodes", "Configuring backend DB hooks", "Packaging visual campaign flow"];

  const handleBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || building) return;
    setBuilding(true);
    setDone(false);
    setStage(0);
    const iv = setInterval(() => {
      setStage(p => {
        if (p >= stages.length - 1) {
          clearInterval(iv);
          setTimeout(() => { setBuilding(false); setDone(true); }, 600);
          return p;
        }
        return p + 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-[20px] font-bold text-zinc-900">Visual Flow Generator</h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">Prompt your workflow ideas — Anaos compiles them into visual canvas nodes</p>
      </div>

      <form onSubmit={handleBuild} className="space-y-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden focus-within:border-zinc-400 transition-colors shadow-sm">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. When a user asks about apartment rates, check their budget threshold. If over AED 2M, offer an exclusive viewing scheduler node, otherwise place them on the general newsletter queue."
            rows={4}
            className="w-full bg-transparent px-4 py-3.5 text-[14px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none resize-none leading-relaxed"
          />
          <div className="px-4 py-3 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <span className="text-[12px] text-zinc-400 font-semibold">Workspace: {ws.name}</span>
            <button
              type="submit"
              disabled={building || !prompt.trim()}
              className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-zinc-900 text-white text-[12.5px] font-bold hover:bg-zinc-800 transition-colors disabled:opacity-40 cursor-pointer"
            >
              {building ? (
                <>
                  <span className="flex gap-0.5">
                    {[0,1,2].map(i => <span key={i} className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: `${i*120}ms` }} />)}
                  </span>
                  Compiling...
                </>
              ) : (
                <><Zap className="w-3.5 h-3.5" /> Generate Flow</>
              )}
            </button>
          </div>
        </div>

        {building && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold font-mono text-zinc-400">
              <span>Anaos-Neural-Compiler</span>
              <span>Step {stage + 1}/{stages.length}</span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-800 rounded-full transition-all duration-1000"
                style={{ width: `${((stage + 1) / stages.length) * 100}%` }}
              />
            </div>
            <p className="text-[13px] font-medium text-zinc-600 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-[#0A6BFF] animate-spin" />
              {stages[stage]}…
            </p>
          </div>
        )}

        {done && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 flex items-start gap-3 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[13.5px] font-bold text-zinc-800">Visual Flow Compiled Successfully!</p>
              <p className="text-[12.5px] text-zinc-500 mt-0.5">4 new execution nodes generated and integrated into {ws.name} active sandbox.</p>
            </div>
          </div>
        )}
      </form>

      {/* Existing automations list */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h2 className="text-[14px] font-bold text-zinc-900">Current Live Workflows</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {ws.automations.map(a => (
            <div key={a.id} className="px-5 py-4 flex items-center justify-between hover:bg-zinc-50/40 transition-colors">
              <div className="flex items-center gap-3">
                <Zap className={`w-4 h-4 ${a.enabled ? "text-[#0A6BFF]" : "text-zinc-300"}`} />
                <div>
                  <p className="text-[13.5px] font-bold text-zinc-800">{a.name}</p>
                  <p className="text-[12px] text-zinc-400 mt-0.5 font-medium">{a.runs} executions · {a.lastRun}</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">{a.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Root Dashboard ──────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("ai_agent");
  const [workspaces, setWorkspaces] = useState(WORKSPACES);
  const [ws, setWs] = useState(WORKSPACES[0]);
  const [contacts, setContacts] = useState(CONTACTS);
  const [mounted, setMounted] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Webhook Sandbox State
  const [webhookActive, setWebhookActive] = useState(true);

  useEffect(() => {
    setMounted(true);

    async function loadDashboardData() {
      try {
        const res = await fetch("/api/dashboard/data");
        const data = await res.json();
        
        if (data.success && data.workspaces && data.workspaces.length > 0) {
          // If the workspace name is still default, redirect to onboarding
          const hasDefaultWorkspace = data.workspaces.some(
            (w: any) => w.name === "My First Workspace"
          );
          
          if (hasDefaultWorkspace) {
            router.push("/onboarding");
            return;
          }

          // Map API workspaces to match local state types
          const mapped = data.workspaces.map((w: any) => ({
            id: w.id,
            name: w.name,
            industry: w.industry || "General Business",
            slug: w.slug,
            status: "live",
            version: w.version || 1,
            automations: w.automations || []
          }));

          setWorkspaces(mapped);
          setWs(mapped[0]);
          
          if (data.contacts && data.contacts.length > 0) {
            setContacts(data.contacts);
          }
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoadingData(false);
      }
    }

    loadDashboardData();
  }, [router]);

  const toggleAutomation = (automationId: string) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id !== ws.id) return w;
      const updated = {
        ...w,
        automations: w.automations.map(a => a.id === automationId ? { ...a, enabled: !a.enabled } : a)
      };
      setWs(updated);
      return updated;
    }));
  };

  const handleToggleCheckContact = (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const handleToggleAllContactsCheck = (checked: boolean) => {
    setContacts(prev => prev.map(c => ({ ...c, checked })));
  };

  const tabLabel: Record<Tab, string> = {
    ai_agent:    "Anaos AI",
    overview:    "Home",
    contacts:    "Contacts",
    automations: "Automation",
    broadcasts:  "Broadcasts",
    analytics:   "Analytics",
  };

  if (!mounted || loadingData) {
    return (
      <div className="flex h-screen bg-[#F5F5F5] items-center justify-center">
        <div className="flex gap-1.5 animate-pulse">
          {[0,1,2].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#0A6BFF] animate-bounce" style={{ animationDelay: `${i*150}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden font-sans">
      <Sidebar
        active={tab}
        onChange={setTab}
        ws={ws}
        onWsChange={(w) => { setWs(w); setTab("ai_agent"); }}
        workspaces={workspaces}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#F5F5F5]">
        
        {/* 55px Top Webhook Sandbox Alert Bar */}
        <div className="bg-[#1F1F1F] text-white text-[13px] px-6 h-[55px] flex items-center justify-between shrink-0 font-medium z-10">
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${webhookActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"}`} />
            <span className="font-semibold text-zinc-200">
              {webhookActive 
                ? "WhatsApp Business API Connected: Your visual webhook flows are now live on our sandbox grid." 
                : "WhatsApp Business Sandbox Paused: Activate connections to test inbound flow nodes."}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Active Sandbox</span>
              <button
                onClick={() => setWebhookActive(!webhookActive)}
                className={`relative w-8 h-4.5 rounded-full transition-colors cursor-pointer ${webhookActive ? "bg-[#0A6BFF]" : "bg-zinc-600"}`}
              >
                <span className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${webhookActive ? "left-[15px]" : "left-0.5"}`} />
              </button>
            </div>
            <button className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-[12.5px] transition-all cursor-pointer font-bold">
              Deploy Sandbox Webhook
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <Topbar title={tabLabel[tab]} ws={ws} />
          
          <main className="flex-1 overflow-y-auto px-[40px] pt-[30px] pb-8 bg-[#F5F5F5]">
            {tab === "ai_agent"    && <AIAgentPage     ws={ws} />}
            {tab === "overview"    && <OverviewPage    ws={ws} onToggle={toggleAutomation} />}
            {tab === "contacts"    && <ContactsPage    contacts={contacts} onToggleCheck={handleToggleCheckContact} onToggleAllCheck={handleToggleAllContactsCheck} />}
            {tab === "automations" && <AutomationsPage ws={ws} />}
            {tab === "broadcasts"  && <BroadcastsPage />}
            {tab === "analytics"   && <AnalyticsPage />}
          </main>
      </div>
    </div>
  );
}
