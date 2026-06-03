"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import WorkflowCanvas, { WorkflowNodeData, WorkflowEdge } from "@/components/workflow/WorkflowCanvas";
import { Loader2, AlertCircle } from "lucide-react";

export default function WorkflowEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [workflow, setWorkflow] = useState<{
    id: string;
    name: string;
    nodes: WorkflowNodeData[];
    edges: WorkflowEdge[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkflow() {
      try {
        const res = await fetch(`/api/v1/workflows/${id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to load workflow");
        }
        
        setWorkflow(data.workflow);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      loadWorkflow();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen bg-[#050508] text-white flex items-center justify-center relative overflow-hidden">
        <div className="z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-[13px] font-medium text-zinc-400">Loading visual workflow canvas...</p>
        </div>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="h-screen bg-[#050508] text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="z-10 max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Failed to Load Canvas</h2>
          <p className="text-[13.5px] text-zinc-400">{error || "Workflow not found"}</p>
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

  return (
    <WorkflowCanvas
      workflowId={workflow.id}
      workflowName={workflow.name}
      initialData={{
        nodes: workflow.nodes,
        edges: workflow.edges,
      }}
      onBack={() => router.push("/dashboard?tab=automations")}
    />
  );
}
