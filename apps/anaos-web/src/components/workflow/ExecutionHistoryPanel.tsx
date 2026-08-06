"use client";

import { useState, useEffect } from "react";
import { X, Clock, Play, CheckCircle2, XCircle, AlertCircle, Calendar, ChevronRight } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface ExecutionHistoryPanelProps {
  workflowId: string;
  onClose: () => void;
}

export default function ExecutionHistoryPanel({ workflowId, onClose }: ExecutionHistoryPanelProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedExec, setSelectedExec] = useState<any | null>(null);

  const fetchExecutions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/workflows/${workflowId}/executions`);
      const data = await res.json();
      if (data.success) {
        setExecutions(data.executions);
      }
    } catch (error) {
      console.error("Failed to load executions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExecutions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowId]);

  const parseLogs = (logsString: string) => {
    try {
      return JSON.parse(logsString || "[]");
    } catch {
      return [];
    }
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[400px] bg-white border-l border-gray-200 shadow-2xl flex flex-col z-40 transform transition-transform duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <Clock className="text-blue-600" size={18} />
          Execution History
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Execution List */}
        <div className={`w-full flex flex-col overflow-y-auto ${selectedExec ? 'hidden' : 'block'}`}>
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Loading executions...
            </div>
          ) : executions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <Play className="text-gray-300" size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">No Executions Yet</h3>
              <p className="text-xs text-gray-500">Run your workflow to see history here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {executions.map((exec) => (
                <div 
                  key={exec.id} 
                  onClick={() => setSelectedExec(exec)}
                  className="p-4 hover:bg-blue-50/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {exec.status === "success" && <CheckCircle2 size={16} className="text-green-500" />}
                      {exec.status === "failed" && <XCircle size={16} className="text-red-500" />}
                      {exec.status === "running" && <Play size={16} className="text-blue-500 animate-pulse" />}
                      <span className="text-sm font-bold text-gray-900 capitalize">{exec.status}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {formatDistanceToNow(new Date(exec.startedAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {format(new Date(exec.startedAt), "MMM d, h:mm a")}
                    </span>
                    <span className="flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      View Logs <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details View */}
        {selectedExec && (
          <div className="w-full flex flex-col h-full bg-gray-50">
            <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3">
              <button 
                onClick={() => setSelectedExec(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <ChevronRight size={18} className="rotate-180" />
              </button>
              <div>
                <h3 className="font-bold text-sm text-gray-900">Execution Details</h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">{selectedExec.id.slice(0, 8)}...</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Timeline */}
              <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[23px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {parseLogs(selectedExec.logs).map((log: any, idx: number) => {
                  const isError = log.status === "failed";
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div className={`absolute left-[-21px] mt-1.5 w-3 h-3 rounded-full border-2 border-white ${isError ? "bg-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.2)]" : "bg-green-500 shadow-[0_0_0_2px_rgba(34,197,94,0.2)]"}`} />
                      <div className="flex-1 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-gray-800 uppercase">{log.nodeId.replace("node-", "")}</span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {log.duration ? `${log.duration}ms` : '0ms'}
                          </span>
                        </div>
                        {isError ? (
                          <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs text-red-700 font-mono break-all flex items-start gap-2">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" />
                            {log.error || "Unknown error"}
                          </div>
                        ) : (
                          <div className="mt-2 text-[10px] text-gray-500 bg-gray-50 p-2 rounded-lg font-mono truncate">
                            {log.data ? JSON.stringify(log.data).slice(0, 80) + "..." : "Success"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {parseLogs(selectedExec.logs).length === 0 && (
                  <div className="text-xs text-gray-400 text-center py-4">No detailed logs found.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
