"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Clock, Edit2, Loader2, Send } from "lucide-react";

export function ApprovalsPage() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const res = await fetch("/api/v1/pending-actions");
      const data = await res.json();
      if (data.success) {
        setActions(data.actions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, newBody?: string) => {
    setActioningId(id);
    try {
      await fetch(`/api/v1/pending-actions/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payloadOverride: newBody }),
      });
      fetchActions();
    } catch (e) {
      console.error(e);
    } finally {
      setActioningId(null);
      setEditingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActioningId(id);
    try {
      await fetch(`/api/v1/pending-actions/${id}/reject`, { method: "POST" });
      fetchActions();
    } catch (e) {
      console.error(e);
    } finally {
      setActioningId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (actions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900">All caught up!</h3>
        <p className="text-zinc-500 mt-2">No pending AI actions require your approval.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Pending Approvals</h2>
          <p className="text-zinc-500 text-sm">Review drafted messages before the AI sends them.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {actions.length} Pending
        </div>
      </div>

      <AnimatePresence>
        {actions.map((action) => {
          const payload = JSON.parse(action.payload);
          const isEditing = editingId === action.id;

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block mb-2 uppercase tracking-wider">
                    {action.actionType.replace('_', ' ')}
                  </div>
                  <div className="text-sm font-semibold text-zinc-900">
                    To: {action.contactPhone || action.channel}
                  </div>
                </div>
                <div className="text-xs text-zinc-400">
                  {new Date(action.createdAt).toLocaleString()}
                </div>
              </div>

              {isEditing ? (
                <div className="mb-4">
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition-colors"
                    >
                      Cancel Edit
                    </button>
                    <button
                      onClick={() => handleApprove(action.id, editBody)}
                      disabled={actioningId === action.id}
                      className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      {actioningId === action.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Approve & Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 mb-4 text-sm text-zinc-700 whitespace-pre-wrap font-medium">
                  {payload.body}
                </div>
              )}

              {!isEditing && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(action.id)}
                    disabled={actioningId === action.id}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-2 rounded-xl text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {actioningId === action.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(action.id);
                      setEditBody(payload.body);
                    }}
                    disabled={actioningId === action.id}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-xl text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleReject(action.id)}
                    disabled={actioningId === action.id}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
