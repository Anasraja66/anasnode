"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Play, Pause, Trash2, Edit2, Zap } from "lucide-react";

export default function AutomationsPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workflows")
      .then(res => res.json())
      .then(data => {
        setWorkflows(data.workflows || []);
        setLoading(false);
      });
  }, []);

  const createNew = async () => {
    const res = await fetch("/api/workflows", { method: "POST", body: JSON.stringify({}) });
    const data = await res.json();
    if (data.workflow) {
      router.push(`/dashboard/automations/builder/${data.workflow.id}`);
    }
  };

  const deleteWorkflow = async (id: string) => {
    if (!confirm("Delete this automation?")) return;
    await fetch(`/api/workflows/${id}`, { method: "DELETE" });
    setWorkflows(ws => ws.filter(w => w.id !== id));
  };

  const toggleStatus = async (id: string, current: boolean) => {
    await fetch(`/api/workflows/${id}`, { 
      method: "PATCH", 
      body: JSON.stringify({ isActive: !current }) 
    });
    setWorkflows(ws => ws.map(w => w.id === id ? { ...w, isActive: !current } : w));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-blue-600" />
            Automations
          </h1>
          <p className="text-gray-500">Native workflows to completely automate your Real Estate operations</p>
        </div>
        <button 
          onClick={createNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
        >
          <Plus size={18} />
          Create Automation
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading automations...</div>
      ) : workflows.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-xl">
          <Zap size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Automations yet</h3>
          <p className="text-gray-500 mb-6">Create your first workflow to automate lead follow-ups, property matches, and more.</p>
          <button onClick={createNew} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">Get Started</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {workflows.map(w => (
            <div key={w.id} className="bg-white border rounded-xl p-5 flex items-center justify-between hover:shadow-md transition">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{w.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${w.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {w.isActive ? 'Active' : 'Draft'}
                  </span>
                  <span>Updated {new Date(w.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleStatus(w.id, w.isActive)}
                  className={`p-2 rounded-lg border ${w.isActive ? 'text-amber-600 border-amber-200 bg-amber-50' : 'text-green-600 border-green-200 bg-green-50'}`}
                  title={w.isActive ? "Pause Automation" : "Start Automation"}
                >
                  {w.isActive ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button 
                  onClick={() => router.push(`/dashboard/automations/builder/${w.id}`)}
                  className="p-2 rounded-lg border text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
                  title="Edit Workflow"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => deleteWorkflow(w.id)}
                  className="p-2 rounded-lg border text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
