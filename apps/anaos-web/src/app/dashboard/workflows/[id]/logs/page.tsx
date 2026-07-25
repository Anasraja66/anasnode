"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Activity, CheckCircle2, XCircle, PlayCircle, Clock, 
  ChevronDown, ChevronRight, Terminal, RefreshCw, AlertCircle, Database
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function WorkflowLogsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/workflows/${id}/logs`);
      const json = await res.json();
      if (json.success) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [id]);

  const toggleExpand = (execId: string) => {
    setExpandedId(prev => prev === execId ? null : execId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="text-emerald-500" size={18} />;
      case "failed": return <XCircle className="text-rose-500" size={18} />;
      case "running": return <PlayCircle className="text-blue-500 animate-pulse" size={18} />;
      default: return <Activity className="text-gray-400" size={18} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success": return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Success</span>;
      case "failed": return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Failed</span>;
      case "running": return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Running</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/automations`} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="text-purple-600" /> 
              Execution Logs
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {data?.workflow ? `Viewing history for: ${data.workflow.name}` : "Loading workflow..."}
            </p>
          </div>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-purple-600" : ""} />
          Refresh
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 max-w-6xl mx-auto w-full">
        {loading && !data ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw size={32} className="animate-spin mb-4 text-purple-500" />
            <p>Loading execution history...</p>
          </div>
        ) : !data?.executions?.length ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <Activity size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Executions Yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              This workflow hasn't run yet. Once it is triggered, you will see the detailed execution logs here.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-3">Execution ID</div>
              <div className="col-span-3">Started At</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-2">Trigger Payload</div>
              <div className="col-span-1 text-right">Details</div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {data.executions.map((exec: any) => {
                const isExpanded = expandedId === exec.id;
                
                // Safe parsing for display
                let payloadPreview = "{}";
                try {
                  const inputObj = JSON.parse(exec.input);
                  payloadPreview = Object.keys(inputObj).slice(0, 2).join(", ");
                  if (Object.keys(inputObj).length > 2) payloadPreview += "...";
                  if (!payloadPreview) payloadPreview = "Empty";
                } catch { payloadPreview = "Invalid JSON"; }

                return (
                  <div key={exec.id} className="transition-colors hover:bg-gray-50/50">
                    <div 
                      className="grid grid-cols-12 gap-4 p-4 items-center cursor-pointer"
                      onClick={() => toggleExpand(exec.id)}
                    >
                      <div className="col-span-1 flex justify-center">
                        {getStatusIcon(exec.status)}
                      </div>
                      <div className="col-span-3">
                        <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                          {exec.id.split('-')[0]}...
                        </span>
                      </div>
                      <div className="col-span-3 text-sm text-gray-700 flex flex-col">
                        <span>{format(new Date(exec.startedAt), "MMM d, yyyy HH:mm:ss")}</span>
                        <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(exec.startedAt), { addSuffix: true })}</span>
                      </div>
                      <div className="col-span-2 text-sm text-gray-600 flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" />
                        {exec.duration ? `${exec.duration}ms` : "---"}
                      </div>
                      <div className="col-span-2 text-sm text-gray-500 truncate pr-4">
                        <Database size={12} className="inline mr-1 opacity-70" />
                        {payloadPreview}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button className="p-1 hover:bg-gray-200 rounded-md text-gray-400 transition-colors">
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded Detail View */}
                    {isExpanded && (
                      <div className="p-6 bg-[#FAFAFA] border-t border-gray-100 text-sm grid grid-cols-2 gap-8 shadow-inner">
                        {/* Input & Output */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                              <Database size={14} className="text-purple-500" />
                              Trigger Input Payload
                            </h4>
                            <div className="bg-[#1E1E1E] text-[#D4D4D4] p-4 rounded-xl font-mono text-xs overflow-x-auto border border-gray-800 shadow-sm">
                              <pre>{JSON.stringify(JSON.parse(exec.input || "{}"), null, 2)}</pre>
                            </div>
                          </div>
                          {exec.status !== "running" && (
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                Final Output Result
                              </h4>
                              <div className="bg-[#1E1E1E] text-[#D4D4D4] p-4 rounded-xl font-mono text-xs overflow-x-auto border border-gray-800 shadow-sm">
                                <pre>{JSON.stringify(JSON.parse(exec.output || "{}"), null, 2)}</pre>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Execution Timeline (Logs) */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Terminal size={14} className="text-gray-500" />
                            Execution Timeline
                          </h4>
                          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm h-[400px] overflow-y-auto">
                            {(() => {
                              try {
                                const stepLogs = JSON.parse(exec.logs || "[]");
                                if (!stepLogs.length) {
                                  return <p className="text-gray-400 italic text-center py-10">No detailed logs available.</p>;
                                }
                                return (
                                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                    {stepLogs.map((log: any, i: number) => (
                                      <div key={i} className="relative flex items-start gap-4">
                                        <div className="flex-none w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center z-10 shadow-sm">
                                          {log.status === "error" ? (
                                            <AlertCircle size={16} className="text-rose-500" />
                                          ) : log.status === "running" ? (
                                            <Activity size={16} className="text-blue-500" />
                                          ) : (
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                          )}
                                        </div>
                                        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-lg p-3">
                                          <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-gray-800">{log.nodeType || "Step"}</span>
                                            <span className="text-[10px] text-gray-400 font-mono">{log.timestamp ? format(new Date(log.timestamp), "HH:mm:ss.SSS") : ""}</span>
                                          </div>
                                          <p className="text-xs text-gray-600">{log.message}</p>
                                          {log.data && (
                                            <div className="mt-2 bg-white border border-gray-200 p-2 rounded text-[10px] font-mono overflow-x-auto text-gray-500">
                                              {JSON.stringify(log.data)}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                );
                              } catch (e) {
                                return <p className="text-rose-500">Failed to parse logs JSON.</p>;
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
