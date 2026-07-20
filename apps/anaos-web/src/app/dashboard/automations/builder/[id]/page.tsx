"use client";

import React, { useState, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ArrowLeft, Save, Sparkles, Zap, Trash2, Settings } from "lucide-react";

export default function WorkflowBuilder({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [workflowName, setWorkflowName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // AI Generator state
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/workflows/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.workflow) {
          setWorkflowName(data.workflow.name);
          setNodes(JSON.parse(data.workflow.nodes || "[]"));
          setEdges(JSON.parse(data.workflow.edges || "[]"));
        }
        setLoading(false);
      });
  }, [id, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/workflows/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: workflowName, nodes, edges })
    });
    setSaving(false);
  };

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || generating) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/workflows/generate", {
        method: "POST",
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      if (data.workflow) {
        setNodes(data.workflow.nodes);
        setEdges(data.workflow.edges);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
      setAiPrompt("");
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Loading workspace canvas...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard?tab=automations")} className="text-gray-500 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-sm font-medium">
            <Zap size={16} /> Automation
          </div>
          <input 
            type="text" 
            value={workflowName} 
            onChange={(e) => setWorkflowName(e.target.value)}
            className="font-semibold text-lg text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-100 rounded px-2"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <form onSubmit={handleAiGenerate} className="flex items-center relative mr-4">
            <div className="absolute left-3 text-purple-500"><Sparkles size={16} /></div>
            <input
              type="text"
              placeholder="E.g. Send WhatsApp when new lead arrives..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="pl-9 pr-24 py-2 border border-gray-200 rounded-full w-96 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all"
              disabled={generating}
            />
            <button 
              type="submit" 
              disabled={generating || !aiPrompt.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-purple-600 text-white text-xs font-medium rounded-full hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {generating ? "Building..." : "Generate"}
            </button>
          </form>

          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-70"
          >
            <Save size={18} /> {saving ? "Saving..." : "Save Canvas"}
          </button>
        </div>
      </header>

      {/* Canvas Area */}
      <main className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-gray-50"
        >
          <Controls className="bg-white border-gray-200 shadow-sm rounded-lg overflow-hidden" />
          <MiniMap 
            className="bg-white border-gray-200 shadow-sm rounded-lg" 
            nodeColor={(n) => n.type === 'trigger' ? '#3b82f6' : '#8b5cf6'} 
          />
          <Background gap={20} color="#e5e7eb" size={2} />
        </ReactFlow>
      </main>
    </div>
  );
}
