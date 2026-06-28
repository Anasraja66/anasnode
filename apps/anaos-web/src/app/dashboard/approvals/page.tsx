"use client";

import { useState, useEffect } from "react";
import { Check, X, Phone, MessageSquare, Mail, Activity } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface PendingAction {
  id: string;
  contactPhone: string;
  channel: string;
  actionType: string;
  payload: string;
  status: string;
  createdAt: string;
}

import { Suspense } from "react";

function ApprovalsContent() {
  const [actions, setActions] = useState<PendingAction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // For MVP, hardcode or grab accountId from query
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || "demo-account-id"; // fallback for demo

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const res = await fetch(`/api/approvals?accountId=${accountId}`);
      const data = await res.json();
      setActions(data.approvals || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    // Optimistic UI update
    setActions((prev) => prev.filter((a) => a.id !== id));
    
    try {
      await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, accountId }),
      });
    } catch (e) {
      console.error("Failed to update approval", e);
      fetchApprovals(); // Revert on failure
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp": return <MessageSquare className="w-5 h-5 text-green-500" />;
      case "sms": return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "voice": return <Phone className="w-5 h-5 text-purple-500" />;
      case "email": return <Mail className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approval Inbox</h1>
          <p className="text-gray-500 mt-2">
            Review and approve AI-generated messages and calls before they are sent to customers.
          </p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium text-sm border border-orange-200">
          Human-in-the-Loop Active
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading pending actions...</div>
      ) : actions.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">All Caught Up!</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            There are no pending actions waiting for your approval. When workflows operate in "Draft Mode", they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {actions.map((action) => {
            const payload = JSON.parse(action.payload || "{}");
            return (
              <div key={action.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md">
                <div className="p-6 flex-1 flex gap-4">
                  <div className="mt-1">
                    {getChannelIcon(action.channel)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900 capitalize">
                        {action.channel} {action.actionType.replace("send_", "")}
                      </span>
                      <span className="text-gray-400 text-sm">
                        to {action.contactPhone}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {new Date(action.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mt-3 text-gray-700 text-sm border border-gray-100">
                      {action.channel === "voice" ? (
                        <div>
                          <p><span className="font-medium">First Message:</span> {payload.firstMessage}</p>
                          <p className="mt-2"><span className="font-medium text-xs uppercase text-gray-500">AI Prompt Context:</span><br/>{payload.prompt}</p>
                        </div>
                      ) : (
                        <p>{payload.body || payload.content}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 md:w-48 border-t md:border-t-0 md:border-l border-gray-200 flex md:flex-col justify-center gap-3 p-4">
                  <button
                    onClick={() => handleAction(action.id, "approve")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(action.id, "reject")}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2.5 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ApprovalsPage() {
  return (
    <Suspense fallback={<div className="p-8 max-w-5xl mx-auto text-center py-20 text-gray-400">Loading...</div>}>
      <ApprovalsContent />
    </Suspense>
  );
}
