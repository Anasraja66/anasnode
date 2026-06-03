import { useState } from "react";
import { Plus, Play, Settings } from "lucide-react";

const nodeTypes = [
  { id: "trigger", name: "Trigger", icon: "🌐", color: "#0A6BFF" },
  { id: "condition", name: "Condition", icon: "🔄", color: "#D97706" },
  { id: "ai", name: "AI Response", icon: "🤖", color: "#059669" },
  { id: "message", name: "Send Message", icon: "💬", color: "#0A6BFF" },
  { id: "wait", name: "Wait", icon: "🕒", color: "#71717A" },
  { id: "http", name: "HTTP Call", icon: "📡", color: "#D97706" },
];

const mockWorkflows = [
  { id: 1, name: "WhatsApp Leads Qualifier", status: "active", triggers: 1247 },
  { id: 2, name: "Instagram Auto-Reply", status: "active", triggers: 892 },
  { id: 3, name: "Booking Confirmation Flow", status: "paused", triggers: 456 },
];

export function GithubWorkflows() {
  const [selectedWorkflow, setSelectedWorkflow] = useState(mockWorkflows[0]);

  return (
    <div className="flex h-full w-full rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm flex-col bg-[#0F172A]">
      {/* Top Bar */}
      <div className="h-16 bg-[#1E293B] border-b border-[#334155] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            className="h-9 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-white text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0A6BFF]"
            value={selectedWorkflow.id}
            onChange={(e) => {
              const workflow = mockWorkflows.find(w => w.id === Number(e.target.value));
              if (workflow) setSelectedWorkflow(workflow);
            }}
          >
            {mockWorkflows.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${selectedWorkflow.status === 'active' ? 'bg-[#059669] animate-pulse' : 'bg-[#71717A]'}`} />
            <span className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">
              {selectedWorkflow.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-9 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-white text-[13px] font-medium hover:bg-[#1E293B] transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="h-9 px-4 bg-[#0A6BFF] hover:bg-[#0052CC] rounded-xl text-white text-[13px] font-semibold transition-colors flex items-center gap-2">
            <Play className="w-4 h-4" />
            Deploy Changes
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Node Palette */}
        <div className="w-[260px] bg-[#1E293B] border-r border-[#334155] p-4 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
              Workflow Nodes
            </h3>
            <p className="text-[12px] text-[#64748B] mb-4">
              Drag nodes to the canvas to build your automation
            </p>
          </div>

          <div className="space-y-2">
            {nodeTypes.map((node) => (
              <div
                key={node.id}
                className="p-3 bg-[#0F172A] border border-[#334155] rounded-xl hover:border-[#0A6BFF] transition-colors cursor-move"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${node.color}20` }}
                  >
                    {node.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">{node.name}</div>
                    <div className="text-[11px] text-[#64748B]">
                      {node.id === 'trigger' && 'Starts the flow'}
                      {node.id === 'condition' && 'Branch logic'}
                      {node.id === 'ai' && 'LLM response'}
                      {node.id === 'message' && 'Send to channel'}
                      {node.id === 'wait' && 'Delay execution'}
                      {node.id === 'http' && 'API integration'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 h-10 bg-[#0A6BFF] hover:bg-[#0052CC] rounded-xl text-white text-[13px] font-semibold transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Custom Node
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-auto bg-[#0F172A]" style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#1E293B] border-2 border-dashed border-[#334155] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Plus className="w-8 h-8 text-[#64748B]" />
              </div>
              <h3 className="text-[15px] font-semibold text-white mb-2">Build Your Workflow</h3>
              <p className="text-[13px] text-[#64748B] max-w-sm">
                Drag nodes from the left panel to start creating your automation flow
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Inspector */}
        <div className="w-[300px] bg-[#1E293B] border-l border-[#334155] p-4">
          <div className="mb-4">
            <h3 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
              Node Inspector
            </h3>
            <p className="text-[12px] text-[#64748B]">
              Select a node to edit its properties
            </p>
          </div>

          <div className="p-4 bg-[#0F172A] border border-[#334155] rounded-xl text-center">
            <div className="w-12 h-12 bg-[#1E293B] rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Settings className="w-6 h-6 text-[#64748B]" />
            </div>
            <p className="text-[12px] text-[#64748B]">No node selected</p>
          </div>

          {/* Workflow Stats */}
          <div className="mt-6 p-4 bg-[#0F172A] border border-[#334155] rounded-xl">
            <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">
              Performance
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] text-[#94A3B8]">Total Triggers</span>
                  <span className="text-[13px] font-semibold text-white">{selectedWorkflow.triggers}</span>
                </div>
                <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0A6BFF] rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] text-[#94A3B8]">Success Rate</span>
                  <span className="text-[13px] font-semibold text-[#059669]">94%</span>
                </div>
                <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                  <div className="h-full bg-[#059669] rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
