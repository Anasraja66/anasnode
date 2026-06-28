"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, UserPlus, Shield, User, Trash2, Mail, Copy, 
  Check, ArrowRight, X, Clock, AlertCircle, RefreshCw 
} from "lucide-react";

type Member = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

type Invite = {
  id: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
};

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("agent");
  const [inviting, setInviting] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch Team Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/team/members");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch team members");
      }
      
      setMembers(data.members || []);
      setInvites(data.invites || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Member Role
  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/team/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      
      setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Remove Member
  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    
    try {
      const res = await fetch(`/api/team/members/${memberId}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove member");
      
      setMembers(members.filter(m => m.id !== memberId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Send Invite
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    setInviting(true);
    setGeneratedUrl(null);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invite");
      
      setGeneratedUrl(data.inviteUrl);
      setInvites([data.invite, ...invites]);
      setInviteEmail("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setInviting(false);
    }
  };

  // Copy Link
  const handleCopyLink = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <h1 className="text-[24px] font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6.5 h-6.5 text-zinc-800" />
            Team Settings
          </h1>
          <p className="text-[13px] text-zinc-400 mt-1">
            Manage your workspace members, invite teammates, and assign operational roles.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchData}
            className="p-2.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-xl transition-all border border-zinc-200 bg-white cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setShowInviteModal(true);
              setGeneratedUrl(null);
            }}
            className="px-4 py-2.5 bg-[#0A6BFF] hover:bg-blue-600 text-white rounded-xl text-[13px] font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Invite Teammate
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex gap-3 text-[13px]">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Members Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-50 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-zinc-800 uppercase tracking-wider">Active Members</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-650 text-[11px] font-bold">
                {members.length} {members.length === 1 ? 'member' : 'members'}
              </span>
            </div>

            {loading && members.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 text-[13px]">
                Loading members...
              </div>
            ) : members.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 text-[13px] space-y-2">
                <Users className="w-8 h-8 mx-auto text-zinc-300" />
                <p>No active team members found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13.5px]">
                  <thead>
                    <tr className="bg-zinc-50 text-zinc-400 font-bold text-[11px] uppercase tracking-wider text-left">
                      <th className="px-6 py-3.5">Name / Email</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Joined At</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-55">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8.5 h-8.5 rounded-lg bg-zinc-800 text-white flex items-center justify-center font-bold text-[12px] uppercase">
                              {member.name ? member.name.slice(0, 2) : member.email.slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-zinc-800 truncate">{member.name || "Pending Signup"}</p>
                              <p className="text-[11px] text-zinc-400 truncate">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            member.role === "owner" 
                              ? "bg-zinc-900 text-white" 
                              : member.role === "admin" 
                              ? "bg-blue-50 text-blue-700" 
                              : "bg-zinc-100 text-zinc-700"
                          }`}>
                            {member.role === "owner" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-[12px]">
                          {new Date(member.createdAt).toLocaleDateString(undefined, { 
                            year: 'numeric', month: 'short', day: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {member.role !== "owner" && (
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={member.role}
                                onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                                className="px-2 py-1 text-[12px] bg-white border border-zinc-200 rounded-lg outline-none text-zinc-700 cursor-pointer focus:border-zinc-500"
                              >
                                <option value="agent">Agent</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Remove Teammate"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Invites / Pending Invites List */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-50 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-zinc-800 uppercase tracking-wider">Pending Invites</h2>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                {invites.filter(i => !i.acceptedAt).length} Pending
              </span>
            </div>

            {loading && invites.length === 0 ? (
              <div className="p-6 text-center text-zinc-400 text-[12px]">
                Loading invitations...
              </div>
            ) : invites.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-[12px] space-y-1">
                <Mail className="w-6 h-6 mx-auto text-zinc-300" />
                <p>No pending invitations.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-50 max-h-[400px] overflow-y-auto">
                {invites.map((invite) => {
                  const isExpired = new Date(invite.expiresAt) < new Date();
                  return (
                    <div key={invite.id} className="p-4 hover:bg-zinc-50/40 transition-colors">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-[13px] text-zinc-850 truncate">{invite.email}</p>
                          <p className="text-[11px] text-zinc-450 mt-0.5 flex items-center gap-1">
                            Role: <span className="font-bold text-zinc-600 uppercase">{invite.role}</span>
                          </p>
                        </div>
                        {invite.acceptedAt ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded uppercase">
                            Accepted
                          </span>
                        ) : isExpired ? (
                          <span className="text-[10px] bg-red-50 text-red-650 font-bold px-1.5 py-0.5 rounded uppercase">
                            Expired
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            Active
                          </span>
                        )}
                      </div>
                      
                      {!invite.acceptedAt && !isExpired && (
                        <div className="mt-3 flex items-center gap-2 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                          <input 
                            type="text" 
                            readOnly 
                            value={`${window.location.origin}/join/${invite.token}`}
                            className="bg-transparent border-none text-[11px] text-zinc-500 font-mono flex-1 outline-none min-w-0"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/join/${invite.token}`);
                              alert("Invite link copied!");
                            }}
                            className="p-1 hover:bg-zinc-200 text-zinc-650 rounded transition-colors cursor-pointer"
                            title="Copy link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-[480px] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[17px] text-zinc-900 tracking-tight">Invite Teammate</h3>
                <p className="text-[12px] text-zinc-450 mt-0.5">Send a secure registration invite link.</p>
              </div>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {!generatedUrl ? (
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 ml-1">
                      Teammate Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="email"
                        required
                        placeholder="teammate@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none text-[13.5px] transition-all bg-zinc-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 ml-1">
                      Workspace Role
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-zinc-200 focus:border-zinc-900 outline-none text-[13.5px] transition-all bg-zinc-50 focus:bg-white cursor-pointer"
                    >
                      <option value="agent">Agent (Access to Inbox & Contacts only)</option>
                      <option value="admin">Admin (Operational management - no billing)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={inviting || !inviteEmail.trim()}
                    className="w-full h-11 bg-[#0A6BFF] hover:bg-blue-600 text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6"
                  >
                    {inviting ? "Creating Invitation..." : "Generate Invitation Link"}
                  </button>
                </form>
              ) : (
                <div className="space-y-5 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  
                  <div>
                    <h4 className="font-extrabold text-[15px] text-zinc-900">Invite Link Created!</h4>
                    <p className="text-[12px] text-zinc-450 mt-1 max-w-[300px] mx-auto">
                      Share this private registration URL with your teammate. It will expire in 7 days.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-150 p-2.5 rounded-xl">
                    <input
                      type="text"
                      readOnly
                      value={generatedUrl}
                      className="bg-transparent border-none text-[11.5px] text-zinc-650 font-mono flex-1 outline-none min-w-0 px-2"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        copied 
                          ? "bg-emerald-600 text-white" 
                          : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
                      }`}
                    >
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setGeneratedUrl(null);
                      setShowInviteModal(false);
                      fetchData();
                    }}
                    className="w-full h-11 border border-zinc-200 hover:bg-zinc-50 text-zinc-850 rounded-xl text-[13.5px] font-bold transition-all flex items-center justify-center cursor-pointer mt-4"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
