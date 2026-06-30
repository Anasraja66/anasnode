"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";

type Workspace = { name: string; industry?: string };

type WorkflowNode = { id: string; type: string; data?: { label?: string } };
type CompileResult = {
  workflow?: {
    name: string;
    description?: string;
    nodes: WorkflowNode[];
    edges: { source: string; target: string }[];
    isActive?: boolean;
  };
  message?: string;
};

const QUICK_PROMPTS = [
  "Reply on WhatsApp in the customer's language. Ask budget and area, then suggest next step.",
  "Book appointments: ask name, preferred day/time, confirm on WhatsApp.",
  "Restaurant: take table bookings and answer menu questions politely.",
  "Clinic: qualify visit type, insurance, and offer appointment slots.",
];

function plainSummary(nodes: WorkflowNode[]): string[] {
  const labels = nodes
    .map((n) => n.data?.label || n.type)
    .filter(Boolean)
    .slice(0, 6);
  if (!labels.length) {
    return [
      "Greet customers on WhatsApp",
      "Understand what they need",
      "Reply with short, clear messages",
    ];
  }
  return labels.map((l) => l);
}

export function AnaosAIHub({ ws }: { ws: Workspace }) {
  const [mode, setMode] = useState<"simple" | "developer">("simple");
  const [prompt, setPrompt] = useState(
    `I run ${ws.name}. On WhatsApp, help customers automatically — friendly, short replies.`
  );
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompileResult | null>(null);
  const [devJson, setDevJson] = useState("");

  const [previewInput, setPreviewInput] = useState("");
  const [previewMessages, setPreviewMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([
    {
      role: "bot",
      text: `Hi — ${ws.name} here. How can we help you today?`,
    },
  ]);
  const previewEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    previewEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [previewMessages]);

  const runBuild = async (activate = true) => {
    setBuilding(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/workflows/from-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, activate, save: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not build automation");
        return;
      }
      setResult(data);
      setDevJson(
        JSON.stringify(
          { nodes: data.workflow?.nodes, edges: data.workflow?.edges },
          null,
          2
        )
      );
      setPreviewMessages([
        {
          role: "bot",
          text: `"${data.workflow?.name || "Automation"}" is saved and ready for WhatsApp.`,
        },
        {
          role: "bot",
          text: plainSummary(data.workflow?.nodes || []).join(" · "),
        },
      ]);
    } catch {
      setError("Network error — try again");
    } finally {
      setBuilding(false);
    }
  };

  const handlePreviewSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewInput.trim()) return;
    const userText = previewInput.trim();
    setPreviewMessages((m) => [...m, { role: "user", text: userText }]);
    setPreviewInput("");
    setTimeout(() => {
      setPreviewMessages((m) => [
        ...m,
        {
          role: "bot",
          text: result
            ? "Preview only. Connect WhatsApp to send real replies from your prompt."
            : "Save your automation first, then test here.",
        },
      ]);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative z-10 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-zinc-950 tracking-tight">
            Automate with one prompt
          </h1>
          <p className="text-[15px] text-zinc-500 font-medium max-w-xl leading-relaxed">
            Describe what should happen on WhatsApp. Anaos turns it into a live
            workflow — no complex setup screens.
          </p>
        </div>
        <div
          className="flex rounded-2xl border border-zinc-200/50 bg-white/50 backdrop-blur-md p-1.5 shrink-0 shadow-sm"
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "simple"}
            onClick={() => setMode("simple")}
            className={`px-5 py-2 rounded-xl text-[13px] transition-all cursor-pointer font-bold uppercase tracking-wider ${
              mode === "simple"
                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Simple
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "developer"}
            onClick={() => setMode("developer")}
            className={`px-5 py-2 rounded-xl text-[13px] transition-all cursor-pointer font-bold uppercase tracking-wider ${
              mode === "developer"
                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Developer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-[28px] border border-zinc-200/50 bg-white/50 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/30">
              <p className="text-[14px] font-bold text-zinc-900 tracking-tight">
                What should happen on WhatsApp?
              </p>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="w-full px-6 py-5 text-[15px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none resize-none leading-relaxed bg-transparent"
              placeholder="Example: When someone asks about rent in Dubai, ask their budget, share 2–3 areas, and offer a viewing time."
            />
            <div className="px-6 py-4 border-t border-zinc-100 space-y-3 bg-zinc-50/30">
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                Quick Examples
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((ex) => (
                  <button
                    key={ex.slice(0, 24)}
                    type="button"
                    onClick={() => setPrompt(ex)}
                    className="text-left text-[12px] text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg bg-white border border-zinc-200/50 hover:border-zinc-300 transition-all font-bold"
                  >
                    {ex.slice(0, 40)}...
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 py-5 border-t border-zinc-100 flex items-center justify-between gap-4 bg-white/80">
              <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">{ws.name}</span>
              <button
                type="button"
                disabled={building || !prompt.trim()}
                onClick={() => runBuild(true)}
                className="h-11 px-6 rounded-xl bg-[#0A6BFF] hover:bg-blue-600 text-white text-[14px] font-bold transition-all shadow-sm active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                {building ? "Saving…" : "Deploy AI Agent"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[14px] font-bold text-red-800 bg-red-50 border border-red-100 rounded-2xl px-6 py-4 animate-in fade-in slide-in-from-top-2">
              {error}
            </p>
          )}

          {result?.workflow && mode === "simple" && (
            <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/50 backdrop-blur-md p-6 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[16px] font-bold text-emerald-950 tracking-tight">
                  {result.workflow.name} is live
                </p>
              </div>
              <p className="text-[14px] text-emerald-800 font-medium">{result.message}</p>
              <ul className="mt-3 space-y-2">
                {plainSummary(result.workflow.nodes || []).map((line, i) => (
                  <li key={i} className="flex items-center gap-2 text-[13.5px] text-emerald-900 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mode === "developer" && (
            <div className="rounded-[28px] border border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                <span className="text-[12px] font-mono font-bold text-zinc-500 uppercase tracking-widest">workflow.json</span>
                <button
                  type="button"
                  onClick={() => runBuild(true)}
                  disabled={building}
                  className="text-[12px] font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40 uppercase tracking-widest"
                >
                  Re-Compile
                </button>
              </div>
              <textarea
                value={devJson}
                onChange={(e) => setDevJson(e.target.value)}
                rows={14}
                className="w-full bg-transparent px-6 py-4 text-[13px] font-mono text-zinc-300 focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
                placeholder="Save an automation to load workflow JSON here…"
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-[340px] rounded-[3rem] border-[12px] border-zinc-950 bg-white shadow-2xl overflow-hidden flex flex-col h-[560px] relative ring-1 ring-zinc-200">
            <div className="bg-zinc-950 text-white px-6 py-5">
              <p className="text-[15px] font-bold tracking-tight leading-tight">{ws.name}</p>
              <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Live Preview</p>
            </div>
            <div className="flex-1 bg-zinc-50/50 p-4 overflow-y-auto space-y-3 flex flex-col">
              {previewMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-[20px] px-4 py-3 text-[14px] font-medium leading-relaxed shadow-sm ${
                    msg.role === "bot"
                      ? "bg-white text-zinc-800 self-start border border-zinc-100 rounded-tl-none"
                      : "bg-zinc-900 text-white self-end rounded-tr-none"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={previewEnd} />
            </div>
            <form
              onSubmit={handlePreviewSend}
              className="p-3 border-t border-zinc-100 bg-white flex gap-2"
            >
              <input
                value={previewInput}
                onChange={(e) => setPreviewInput(e.target.value)}
                placeholder="Type test message..."
                className="flex-1 h-11 px-5 rounded-2xl border border-zinc-200 text-[14px] font-medium focus:outline-none focus:border-zinc-900 transition-all bg-zinc-50/50 focus:bg-white"
              />
              <button
                type="submit"
                aria-label="Send"
                className="w-11 h-11 rounded-2xl bg-[#0A6BFF] text-white flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
