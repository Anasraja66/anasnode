import { Copy, UserPlus, Crown, Shield, User } from "lucide-react";
import { useState } from "react";

const teamMembers = [
  { id: 1, name: "Alex Johnson", email: "alex@anaos.ai", role: "owner", avatar: "AJ" },
  { id: 2, name: "Sarah Mitchell", email: "sarah@anaos.ai", role: "admin", avatar: "SM" },
  { id: 3, name: "James Chen", email: "james@anaos.ai", role: "agent", avatar: "JC" },
  { id: 4, name: "Emily Parker", email: "emily@anaos.ai", role: "agent", avatar: "EP" },
];

export function GithubTeamSettings() {
  const [selectedRole, setSelectedRole] = useState<"admin" | "agent">("admin");
  const [inviteLink] = useState("https://app.anaos.ai/join/abc123xyz");
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner": return <Crown className="w-4 h-4" />;
      case "admin": return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-[#FEF3C7] text-[#D97706]";
      case "admin": return "bg-[#E6F0FF] text-[#0A6BFF]";
      default: return "bg-[#F1F5F9] text-[#71717A]";
    }
  };

  return (
    <div className="flex h-full w-full bg-white rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm flex-col overflow-y-auto">
      <div className="px-10 pt-8 pb-10">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold tracking-tight text-[#09090B] mb-1">
            Team Members
          </h1>
          <p className="text-[13px] text-[#71717A]">
            Manage your team and their permissions
          </p>
        </div>

        <div className="grid grid-cols-3 gap-7">
          {/* Team List */}
          <div className="col-span-2 bg-white border border-[#E5E7EB] rounded-[24px] p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[18px] font-semibold text-[#09090B]">Active Members</h2>
                <p className="text-[12px] text-[#71717A] mt-1">{teamMembers.length} total members</p>
              </div>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#F8F9FA] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-[#0A6BFF] to-[#0052CC] rounded-full flex items-center justify-center">
                      <span className="text-white text-[13px] font-semibold">{member.avatar}</span>
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#09090B]">{member.name}</div>
                      <div className="text-[12px] text-[#71717A]">{member.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getRoleColor(member.role)}`}>
                      {getRoleIcon(member.role)}
                      <span className="text-[11px] font-semibold capitalize">{member.role}</span>
                    </div>
                    {member.role !== "owner" && (
                      <button className="w-8 h-8 hover:bg-[#F1F5F9] rounded-lg flex items-center justify-center transition-colors">
                        <span className="text-[#71717A]">⋮</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Role Descriptions */}
            <div className="mt-8 pt-6 border-t border-[#F1F2F4]">
              <h3 className="text-[13px] font-semibold text-[#09090B] mb-4">Role Permissions</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[#F8F9FA] rounded-xl">
                  <div className="w-8 h-8 bg-[#FEF3C7] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Crown className="w-4 h-4 text-[#D97706]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#09090B] mb-1">Owner</div>
                    <div className="text-[12px] text-[#71717A]">Full access to all features. Cannot be deleted.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#F8F9FA] rounded-xl">
                  <div className="w-8 h-8 bg-[#E6F0FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-[#0A6BFF]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#09090B] mb-1">Admin</div>
                    <div className="text-[12px] text-[#71717A]">Manage channels, team invites, and system settings.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#F8F9FA] rounded-xl">
                  <div className="w-8 h-8 bg-[#F1F5F9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-[#71717A]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#09090B] mb-1">Agent</div>
                    <div className="text-[12px] text-[#71717A]">Access to Inbox & Contacts only. Limited analytics.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invite Card */}
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                <UserPlus className="w-[22px] h-[22px] text-[#0A6BFF]" />
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#09090B]">Invite Team</div>
                <div className="text-[12px] text-[#71717A]">Add new members</div>
              </div>
            </div>

            {/* Role Selector */}
            <div className="mb-6">
              <label className="text-[12px] font-semibold text-[#09090B] mb-2 block">Default Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedRole("admin")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedRole === "admin"
                      ? "border-[#0A6BFF] bg-[#E6F0FF]"
                      : "border-[#E5E7EB] bg-white hover:bg-[#F8F9FA]"
                  }`}
                >
                  <Shield className={`w-5 h-5 mx-auto mb-1 ${selectedRole === "admin" ? "text-[#0A6BFF]" : "text-[#71717A]"}`} />
                  <div className={`text-[11px] font-semibold ${selectedRole === "admin" ? "text-[#0A6BFF]" : "text-[#71717A]"}`}>
                    Admin
                  </div>
                </button>
                <button
                  onClick={() => setSelectedRole("agent")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedRole === "agent"
                      ? "border-[#0A6BFF] bg-[#E6F0FF]"
                      : "border-[#E5E7EB] bg-white hover:bg-[#F8F9FA]"
                  }`}
                >
                  <User className={`w-5 h-5 mx-auto mb-1 ${selectedRole === "agent" ? "text-[#0A6BFF]" : "text-[#71717A]"}`} />
                  <div className={`text-[11px] font-semibold ${selectedRole === "agent" ? "text-[#0A6BFF]" : "text-[#71717A]"}`}>
                    Agent
                  </div>
                </button>
              </div>
            </div>

            {/* Invite Link */}
            <div className="mb-4">
              <label className="text-[12px] font-semibold text-[#09090B] mb-2 block">Invite Link</label>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2.5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl">
                  <div className="text-[11px] text-[#71717A] truncate">{inviteLink}</div>
                </div>
                <button
                  onClick={copyLink}
                  className="w-10 h-10 bg-[#0A6BFF] hover:bg-[#0052CC] rounded-xl flex items-center justify-center transition-colors"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
              </div>
              {copied && (
                <div className="mt-2 text-[11px] text-[#059669] font-semibold">✓ Link copied to clipboard</div>
              )}
            </div>

            {/* Expiry Info */}
            <div className="p-3 bg-[#FEF3C7] border border-[#FDE68A] rounded-xl">
              <div className="flex items-start gap-2">
                <span className="text-[16px]">⏱️</span>
                <div>
                  <div className="text-[11px] font-semibold text-[#D97706] mb-0.5">Link expires in 7 days</div>
                  <div className="text-[11px] text-[#92400E]">Generate a new link after expiry</div>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 h-11 bg-[#09090B] hover:bg-[#18181B] text-white rounded-xl text-[13px] font-semibold transition-colors">
              Generate New Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
