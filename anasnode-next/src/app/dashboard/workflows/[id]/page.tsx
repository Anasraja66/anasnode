"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import WorkflowCanvas, { WorkflowData } from "@/components/workflow/WorkflowCanvas";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";

export default function WorkflowEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [workflowData, setWorkflowData] = useState<{
    id: string;
    name: string;
    workflow: WorkflowData;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadSource, setLoadSource] = useState<"ai" | "api" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkflow() {
      // ── Step 1: Check localStorage for AI-generated workflow ────────────────
      // This is set by ResultCard after prompt → workflow generation
      const pending = localStorage.getItem("anaos_pending_workflow");
      if (pending) {
        try {
          const parsed = JSON.parse(pending);
          if (parsed.id === id && parsed.workflow) {
            // Clear it so it doesn't re-load on refresh
            localStorage.removeItem("anaos_pending_workflow");
            setWorkflowData({
              id: parsed.id,
              name: parsed.name || "AI Generated Workflow",
              workflow: parsed.workflow,
            });
            setLoadSource("ai");
            setLoading(false);
            return;
          }
        } catch {
          localStorage.removeItem("anaos_pending_workflow");
        }
      }

      // ── Step 2: Fallback — load from API (for saved workflows) ──────────────
      try {
        const res = await fetch(`/api/v1/workflows/${id}`);
        const data = await res.json();

        if (res.ok && data.workflow) {
          setWorkflowData({
            id: data.workflow.id,
            name: data.workflow.name,
            workflow: {
              nodes: data.workflow.nodes || [],
              edges: data.workflow.edges || [],
            },
          });
          setLoadSource("api");
        } else {
          // ── Step 3: If API also fails, start with empty canvas ──────────────
          setWorkflowData({
            id,
            name: "New Workflow",
            workflow: { nodes: [], edges: [] },
          });
          setLoadSource("api");
        }
      } catch {
        // Start fresh with empty canvas
        setWorkflowData({
          id,
          name: "New Workflow",
          workflow: { nodes: [], edges: [] },
        });
        setLoadSource("api");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadWorkflow();
  }, [id]);

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen bg-[#0F172A] text-white flex items-center justify-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
        </div>
        <div className="z-10 flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-blue-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0F172A] rounded-full flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[15px] font-bold text-white">Building your workflow...</p>
            <p className="text-[12px] font-medium text-zinc-500 mt-1">AI is placing nodes and connections</p>
          </div>
          {/* Animated dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-500"
                style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error screen (should rarely show now since we fallback to empty) ────────
  if (error) {
    return (
      <div className="h-screen bg-[#0F172A] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Failed to Load Canvas</h2>
          <p className="text-[13.5px] text-zinc-400">{error}</p>
          <button
            onClick={() => router.push("/dashboard?tab=automations")}
            className="px-5 py-2.5 bg-white text-zinc-950 font-bold rounded-xl text-[13px] hover:bg-zinc-100 transition-all cursor-pointer"
          >
            Back to Workflows
          </button>
        </div>
      </div>
    );
  }

  if (!workflowData) return null;

  return (
    <div className="relative">
      {/* AI Generated badge */}
      {loadSource === "ai" && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/90 text-white rounded-full text-[12px] font-bold shadow-lg backdrop-blur-sm border border-blue-500/30 animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Generated Workflow — Edit nodes as needed!</span>
          </div>
        </div>
      )}

      <WorkflowCanvas
        workflowId={workflowData.id}
        workflowName={workflowData.name}
        initialData={workflowData.workflow}
        onBack={() => router.push("/dashboard?tab=automations")}
      />
    </div>
  );
}
