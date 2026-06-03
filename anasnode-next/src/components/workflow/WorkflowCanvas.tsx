"use client";
/**
 * Workflow Canvas — Visual drag-and-drop workflow editor
 * Premium design: dark canvas, glowing nodes, animated edges
 */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, GitBranch, Bot, MessageSquare, Clock, Globe, Tag, Square,
  Save, Play, ZoomIn, ZoomOut, Trash2, Plus, ChevronRight, X,
  CheckCircle, ArrowLeft, Loader2, Sliders, ChevronDown
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NodeType =
  | "trigger" | "condition" | "ai_reply" | "send_message"
  | "wait" | "http_request" | "add_tag" | "end";

export interface WorkflowNodeData {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  config: Record<string, string>;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface WorkflowData {
  nodes: WorkflowNodeData[];
  edges: WorkflowEdge[];
}

// ─── Node Config ──────────────────────────────────────────────────────────────

const NODE_TYPES: Record<NodeType, {
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  bg: string;
  border: string;
  fields: Array<{ key: string; label: string; type: "text" | "select" | "textarea"; options?: string[] }>;
}> = {
  trigger: {
    label: "Trigger",
    desc: "Starts the flow",
    icon: Zap,
    color: "#0A6BFF",
    glow: "rgba(10,107,255,0.4)",
    bg: "rgba(10,107,255,0.15)",
    border: "#0A6BFF",
    fields: [
      { key: "event", label: "Trigger Event", type: "select", options: ["WhatsApp Message", "Instagram DM", "Facebook Message", "Schedule", "Shopify Order"] },
    ],
  },
  condition: {
    label: "Condition",
    desc: "Branch logic",
    icon: GitBranch,
    color: "#D97706",
    glow: "rgba(217,119,6,0.4)",
    bg: "rgba(217,119,6,0.15)",
    border: "#D97706",
    fields: [
      { key: "field", label: "Check Field", type: "select", options: ["message_text", "budget", "tag", "opt_out"] },
      { key: "operator", label: "Operator", type: "select", options: ["contains", "equals", "greater_than", "less_than", "not_contains"] },
      { key: "value", label: "Value", type: "text" },
    ],
  },
  ai_reply: {
    label: "AI Response",
    desc: "LLM response",
    icon: Bot,
    color: "#10B981",
    glow: "rgba(16,185,129,0.4)",
    bg: "rgba(16,185,129,0.15)",
    border: "#10B981",
    fields: [
      { key: "system_prompt", label: "Custom Prompt (optional)", type: "textarea" },
      { key: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Casual"] },
    ],
  },
  send_message: {
    label: "Send Message",
    desc: "Send to channel",
    icon: MessageSquare,
    color: "#06B6D4",
    glow: "rgba(6,182,212,0.4)",
    bg: "rgba(6,182,212,0.15)",
    border: "#06B6D4",
    fields: [
      { key: "message", label: "Message Text", type: "textarea" },
      { key: "channel", label: "Channel", type: "select", options: ["Same as trigger", "WhatsApp", "Instagram", "Facebook"] },
    ],
  },
  wait: {
    label: "Wait",
    desc: "Delay execution",
    icon: Clock,
    color: "#71717A",
    glow: "rgba(113,113,122,0.4)",
    bg: "rgba(113,113,122,0.15)",
    border: "#71717A",
    fields: [
      { key: "duration", label: "Duration", type: "text" },
      { key: "unit", label: "Unit", type: "select", options: ["minutes", "hours", "days"] },
    ],
  },
  http_request: {
    label: "HTTP Call",
    desc: "API integration",
    icon: Globe,
    color: "#F97316",
    glow: "rgba(249,115,22,0.4)",
    bg: "rgba(249,115,22,0.15)",
    border: "#F97316",
    fields: [
      { key: "url", label: "URL", type: "text" },
      { key: "method", label: "Method", type: "select", options: ["GET", "POST", "PUT", "DELETE"] },
      { key: "body", label: "Body (JSON)", type: "textarea" },
    ],
  },
  add_tag: {
    label: "Add Tag",
    desc: "Label contact",
    icon: Tag,
    color: "#EC4899",
    glow: "rgba(236,72,153,0.4)",
    bg: "rgba(236,72,153,0.15)",
    border: "#EC4899",
    fields: [
      { key: "tag", label: "Tag Name", type: "text" },
    ],
  },
  end: {
    label: "End",
    desc: "Terminate flow",
    icon: Square,
    color: "#EF4444",
    glow: "rgba(239,68,68,0.4)",
    bg: "rgba(239,68,68,0.15)",
    border: "#EF4444",
    fields: [],
  },
};

// ─── Node Palette ─────────────────────────────────────────────────────────────

function NodePalette({ onDragStart }: { onDragStart: (type: NodeType) => void }) {
  return (
    <div className="flex flex-col gap-2.5 w-full shrink-0">
      <div className="mb-4 px-1">
        <h3 className="text-[14px] font-black text-white tracking-tight">Workflow Nodes</h3>
        <p className="text-[10.5px] text-white/40 font-medium mt-0.5 leading-normal">
          Drag nodes to the canvas to build your automation
        </p>
      </div>
      {(Object.entries(NODE_TYPES) as [NodeType, typeof NODE_TYPES[NodeType]][])
        .filter(([type]) => type !== "add_tag" && type !== "end")
        .map(([type, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div
              key={type}
              draggable
              onDragStart={() => onDragStart(type)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-grab active:cursor-grabbing select-none transition-all hover:scale-[1.02] border"
              style={{
                background: "rgba(30,41,59,0.4)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `${cfg.color}15`,
                  border: `1px solid ${cfg.color}30`
                }}
              >
                <Icon size={14} style={{ color: cfg.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-bold text-white/90 leading-tight">{cfg.label}</p>
                <p className="text-[10px] text-white/40 font-medium mt-0.5">{cfg.desc}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
}

// ─── Single Node ──────────────────────────────────────────────────────────────

function CanvasNode({
  node,
  selected,
  onClick,
  onDragStart,
  onDragEnd,
}: {
  node: WorkflowNodeData;
  selected: boolean;
  onClick: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDragEnd: () => void;
}) {
  const cfg = NODE_TYPES[node.type];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        position: "absolute",
        left: node.x,
        top: node.y,
        cursor: "grab",
        userSelect: "none",
        zIndex: selected ? 20 : 10,
      }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseDown={onDragStart}
      onMouseUp={onDragEnd}
    >
      <div
        className="rounded-2xl transition-all"
        style={{
          background: "rgba(15,23,42,0.85)",
          border: `1.5px solid ${selected ? cfg.color : "rgba(255,255,255,0.08)"}`,
          boxShadow: selected
            ? `0 0 0 2px ${cfg.color}60, 0 0 32px ${cfg.glow}, 0 4px 20px rgba(0,0,0,0.5)`
            : `0 0 16px ${cfg.glow}, 0 4px 12px rgba(0,0,0,0.4)`,
          width: 140,
          minHeight: 80,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 h-12 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 animate-pulse-subtle"
            style={{ background: cfg.color + "20", border: `1px solid ${cfg.color}30` }}
          >
            <Icon size={13} style={{ color: cfg.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-wider leading-none mb-1">{cfg.label}</p>
            <p className="text-[12px] font-black text-white leading-tight truncate max-w-[85px]">{node.label}</p>
          </div>
        </div>

        {/* Config preview */}
        {node.config && Object.keys(node.config).length > 0 && (
          <div className="px-3 py-2 border-t border-white/5 bg-white/[0.01]">
            {Object.entries(node.config).slice(0, 2).map(([k, v]) => (
              <p key={k} className="text-[10px] text-white/40 truncate max-w-[120px] font-medium leading-normal">
                <span className="text-white/20">{k}: </span>{v}
              </p>
            ))}
          </div>
        )}

        {/* Output port dot */}
        <div
          className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 bg-zinc-950 shadow-sm"
          style={{ borderColor: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }}
        />
        {/* Input port dot */}
        <div
          className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 bg-zinc-950 shadow-sm"
          style={{ borderColor: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }}
        />
      </div>
    </motion.div>
  );
}

// ─── Edge Layer ───────────────────────────────────────────────────────────────

function EdgeLayer({ nodes, edges }: { nodes: WorkflowNodeData[]; edges: WorkflowEdge[] }) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
      width="100%" height="100%"
    >
      <defs>
        {(Object.entries(NODE_TYPES) as [NodeType, typeof NODE_TYPES[NodeType]][]).map(([type, cfg]) => (
          <marker
            key={type}
            id={`arrow-${type}`}
            markerWidth="8" markerHeight="8"
            refX="6" refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill={cfg.color} />
          </marker>
        ))}
      </defs>
      {edges.map((edge) => {
        const from = nodeMap[edge.from];
        const to = nodeMap[edge.to];
        if (!from || !to) return null;

        const x1 = from.x + 146; // right port (width 140 + 6)
        const y1 = from.y + 40;  // vertically centered (height 80 / 2)
        const x2 = to.x - 6;     // left port
        const y2 = to.y + 40;    // vertically centered (height 80 / 2)

        const cx = (x1 + x2) / 2;
        const fromType = from.type;
        const cfg = NODE_TYPES[fromType];

        return (
          <g key={edge.id}>
            <path
              d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`}
              fill="none"
              stroke={cfg.color}
              strokeWidth={2.5}
              strokeDasharray="none"
              opacity={0.7}
              markerEnd={`url(#arrow-${fromType})`}
            />
            {/* Glow effect */}
            <path
              d={`M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`}
              fill="none"
              stroke={cfg.color}
              strokeWidth={6}
              opacity={0.15}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Properties Panel ────────────────────────────────────────────────────────

function PropertiesPanel({
  node,
  onChange,
  onDelete,
  onClose,
}: {
  node: WorkflowNodeData;
  onChange: (id: string, config: Record<string, string>, label: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const cfg = NODE_TYPES[node.type];
  const [label, setLabel] = useState(node.label);
  const [config, setConfig] = useState<Record<string, string>>(node.config);

  const update = (key: string, value: string) => {
    const next = { ...config, [key]: value };
    setConfig(next);
    onChange(node.id, next, label);
  };

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      className="w-72 shrink-0 rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(10,10,15,0.95)",
        border: `1px solid ${cfg.border}40`,
        boxShadow: `0 0 40px ${cfg.glow}`,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: cfg.border + "30" }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: cfg.color + "20" }}>
            <cfg.icon size={12} style={{ color: cfg.color }} />
          </div>
          <span className="text-[13px] font-black text-white">Configure Node</span>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white/70 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Node label */}
        <div>
          <label className="text-[11px] font-black text-white/40 uppercase tracking-wider block mb-1.5">Label</label>
          <input
            value={label}
            onChange={(e) => { setLabel(e.target.value); onChange(node.id, config, e.target.value); }}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Dynamic fields */}
        {cfg.fields.map((field) => (
          <div key={field.key}>
            <label className="text-[11px] font-black text-white/40 uppercase tracking-wider block mb-1.5">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                value={config[field.key] || ""}
                onChange={(e) => update(field.key, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white focus:outline-none focus:border-white/30 appearance-none"
              >
                <option value="">Select…</option>
                {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                value={config[field.key] || ""}
                onChange={(e) => update(field.key, e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white focus:outline-none focus:border-white/30 resize-none"
                placeholder={`Enter ${field.label.toLowerCase()}…`}
              />
            ) : (
              <input
                value={config[field.key] || ""}
                onChange={(e) => update(field.key, e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white focus:outline-none focus:border-white/30"
                placeholder={`Enter ${field.label.toLowerCase()}…`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Delete button */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => onDelete(node.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-900/30 border border-red-800/40 text-red-400 text-[12.5px] font-bold hover:bg-red-900/50 transition-colors"
        >
          <Trash2 size={12} /> Delete Node
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main WorkflowCanvas ──────────────────────────────────────────────────────

interface WorkflowCanvasProps {
  workflowId: string;
  initialData?: WorkflowData;
  workflowName?: string;
  onBack?: () => void;
}

export default function WorkflowCanvas({ workflowId, initialData, workflowName = "Untitled Workflow", onBack }: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<WorkflowNodeData[]>(initialData?.nodes || []);
  const [edges, setEdges] = useState<WorkflowEdge[]>(initialData?.edges || []);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggingNodeType, setDraggingNodeType] = useState<NodeType | null>(null);
  const [dragState, setDragState] = useState<{ nodeId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [name, setName] = useState(workflowName);
  const [connecting, setConnecting] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedNodeData = nodes.find((n) => n.id === selectedNode) || null;

  // ── Drag node from palette onto canvas ────────────────────────────────────
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingNodeType) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - pan.x) / zoom - 90;
    const y = (e.clientY - rect.top - pan.y) / zoom - 30;

    const cfg = NODE_TYPES[draggingNodeType];
    const newNode: WorkflowNodeData = {
      id: `node-${Date.now()}`,
      type: draggingNodeType,
      label: cfg.label,
      x: Math.max(20, x),
      y: Math.max(20, y),
      config: {},
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(newNode.id);
    setDraggingNodeType(null);
  }, [draggingNodeType, pan, zoom]);

  // ── Mouse drag existing node on canvas ────────────────────────────────────
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    setDragState({ nodeId, startX: e.clientX, startY: e.clientY, origX: node.x, origY: node.y });
  }, [nodes]);

  useEffect(() => {
    if (!dragState) return;

    const handleMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragState.startX) / zoom;
      const dy = (e.clientY - dragState.startY) / zoom;
      setNodes((prev) => prev.map((n) =>
        n.id === dragState.nodeId
          ? { ...n, x: Math.max(0, dragState.origX + dx), y: Math.max(0, dragState.origY + dy) }
          : n
      ));
    };

    const handleUp = () => setDragState(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragState, zoom]);

  // ── Connect two nodes ─────────────────────────────────────────────────────
  const handleNodeClick = useCallback((nodeId: string) => {
    if (connecting && connecting !== nodeId) {
      const edgeId = `edge-${connecting}-${nodeId}`;
      const exists = edges.some((e) => e.from === connecting && e.to === nodeId);
      if (!exists) {
        setEdges((prev) => [...prev, { id: edgeId, from: connecting, to: nodeId }]);
      }
      setConnecting(null);
      return;
    }
    setSelectedNode(nodeId);
    setConnecting(null);
  }, [connecting, edges]);

  // ── Update node config ────────────────────────────────────────────────────
  const handleNodeChange = useCallback((id: string, config: Record<string, string>, label: string) => {
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, config, label } : n));
  }, []);

  const handleDeleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
    setSelectedNode(null);
  }, []);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/v1/workflows/${workflowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          nodes: nodes,
          edges: edges,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save workflow failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Quick start: add trigger if empty ────────────────────────────────────
  const addStarterNode = () => {
    const starter: WorkflowNodeData = {
      id: `node-trigger-${Date.now()}`,
      type: "trigger",
      label: "Trigger",
      x: 80,
      y: 150,
      config: { event: "WhatsApp Message" },
    };
    setNodes([starter]);
    setSelectedNode(starter.id);
  };

  return (
    <div
      className="flex h-screen bg-[#0F172A] overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.04) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.04) 0%, transparent 60%),
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 32px 32px, 32px 32px",
        }}
      />

      {/* Top toolbar */}
      <div
        className="absolute top-0 left-0 right-0 h-14 z-30 flex items-center justify-between px-6 border-b"
        style={{ background: "#0F172A", borderColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-1 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer border border-transparent">
              <ArrowLeft size={16} />
            </button>
          )}
          
          {/* Dropdown name button */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[13.5px] font-bold text-white transition-colors cursor-pointer border border-transparent">
              <span>{name}</span>
              <ChevronDown size={14} className="text-white/40" />
            </button>
            
            {/* Active dot */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest text-[#10B981] bg-[#10B981]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5">
            <button onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))} className="text-white/50 hover:text-white transition-colors cursor-pointer border border-transparent bg-transparent">
              <ZoomOut size={13} />
            </button>
            <span className="text-[11px] font-bold text-white/40 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="text-white/50 hover:text-white transition-colors cursor-pointer border border-transparent bg-transparent">
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Connect mode toggle */}
          <button
            onClick={() => setConnecting(connecting ? null : (selectedNode || null))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-bold transition-all cursor-pointer ${
              connecting
                ? "bg-purple-600 text-white"
                : "bg-white/5 border border-white/10 text-white/60 hover:text-white/80"
            }`}
          >
            <ChevronRight size={12} />
            {connecting ? "Click target node…" : "Connect nodes"}
          </button>

          {/* Settings Button */}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[12.5px] font-bold text-white/80 hover:bg-white/10 transition-colors cursor-pointer">
            <Sliders size={13} className="text-white/40" />
            <span>Settings</span>
          </button>

          {/* Deploy Changes Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0A6BFF] hover:bg-blue-600 text-white text-[12.5px] font-black transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer border border-transparent"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Play size={13} className="fill-current text-white" />
            )}
            <span>{saving ? "Deploying…" : "Deploy Changes"}</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 pt-14">
        {/* Left: Node Palette */}
        <div
          className="w-[260px] shrink-0 overflow-y-auto p-4 border-r animate-in slide-in-from-left duration-300"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(15,23,42,0.8)", backdropFilter: "blur(20px)" }}
        >
          <NodePalette onDragStart={(type) => setDraggingNodeType(type)} />
        </div>

        {/* Center: Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleCanvasDrop}
          onClick={() => { setSelectedNode(null); setConnecting(null); }}
        >
          <div
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: "0 0",
              position: "relative",
              width: 2400,
              height: 1600,
            }}
          >
            <EdgeLayer nodes={nodes} edges={edges} />
            {nodes.map((node) => (
              <CanvasNode
                key={node.id}
                node={node}
                selected={selectedNode === node.id || connecting === node.id}
                onClick={() => handleNodeClick(node.id)}
                onDragStart={(e) => { e.stopPropagation(); handleNodeMouseDown(e, node.id); }}
                onDragEnd={() => {}}
              />
            ))}
          </div>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
                {/* Dashed Box with Plus icon */}
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center mb-6">
                  <Plus size={24} className="text-white/20" />
                </div>
                <h3 className="text-[16px] font-black text-white tracking-tight">Build Your Workflow</h3>
                <p className="text-[12.5px] text-white/40 mt-1 max-w-[280px] leading-relaxed font-medium">
                  Drag nodes from the left panel to start creating your automation flow
                </p>
                <button
                  onClick={addStarterNode}
                  className="pointer-events-auto mt-6 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-[#0A6BFF] hover:bg-[#005AE0] text-white text-[13px] font-bold transition-all shadow-lg shadow-[#0A6BFF]/20 hover:shadow-[#0A6BFF]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
                >
                  <Plus size={14} /> Add Trigger Node
                </button>
              </div>
            </div>
          )}

          {/* Connection mode indicator */}
          {connecting && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-[12px] font-bold text-white flex items-center gap-2"
              style={{ background: "rgba(139,92,246,0.9)", backdropFilter: "blur(10px)" }}
            >
              <span>Click another node to connect →</span>
              <button onClick={() => setConnecting(null)} className="ml-2 opacity-60 hover:opacity-100 p-0.5 bg-white/10 rounded-full">
                <X size={10} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Properties Panel (Inspector) */}
        <div
          className="w-[300px] shrink-0 border-l flex flex-col p-5 space-y-5 overflow-y-auto animate-in slide-in-from-right duration-300"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(15,23,42,0.85)", backdropFilter: "blur(20px)" }}
        >
          {/* Node Inspector Heading */}
          <div>
            <h3 className="text-[14px] font-black text-white tracking-tight">NODE INSPECTOR</h3>
            <p className="text-[10.5px] text-white/40 font-medium mt-0.5">
              Select a node to edit its properties
            </p>
          </div>

          {/* Node Inspector Content Card */}
          <div className="flex flex-col min-h-[200px]">
            {selectedNodeData ? (
              <PropertiesPanel
                node={selectedNodeData}
                onChange={handleNodeChange}
                onDelete={handleDeleteNode}
                onClose={() => setSelectedNode(null)}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white/30 border border-white/5 rounded-2xl bg-white/[0.02] space-y-3.5 select-none min-h-[160px]">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
                  <Sliders size={18} />
                </div>
                <span className="text-[12px] font-semibold text-white/50">No node selected</span>
              </div>
            )}
          </div>

          {/* Performance Card */}
          <div className="border border-white/5 rounded-2xl bg-white/[0.02] p-5 space-y-4">
            <h4 className="text-[12px] font-black text-white/80 tracking-wider uppercase">Performance</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[12px] font-bold text-white/60 mb-1.5">
                  <span>Total Triggers</span>
                  <span className="text-white font-mono">1247</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[12px] font-bold text-white/60 mb-1.5">
                  <span>Success Rate</span>
                  <span className="text-emerald-400 font-mono">94%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "94%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
