import { Bot, Sparkles, Settings, Zap } from "lucide-react";

export function GithubAISettings() {
  return (
    <div className="flex h-full w-full bg-white rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm flex-col overflow-y-auto">
      <div className="px-10 pt-8 pb-10">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold tracking-tight text-[#09090B] mb-1">
            Anaos AI Settings
          </h1>
          <p className="text-[13px] text-[#71717A]">
            Configure your AI operator behavior and responses
          </p>
        </div>

        <div className="grid grid-cols-3 gap-7">
          {/* Main Settings */}
          <div className="col-span-2 space-y-6">
            {/* AI Behavior */}
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                  <Bot className="w-[22px] h-[22px] text-[#0A6BFF]" />
                </div>
                <div>
                  <div className="text-[18px] font-semibold text-[#09090B]">AI Behavior</div>
                  <div className="text-[12px] text-[#71717A]">How your AI should respond to customers</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[13px] font-semibold text-[#09090B] mb-2 block">
                    Response Tone
                  </label>
                  <select className="w-full h-11 px-4 bg-white border border-[#E5E7EB] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0A6BFF] focus:border-transparent">
                    <option>Professional & Friendly</option>
                    <option>Casual & Conversational</option>
                    <option>Formal & Business-like</option>
                    <option>Technical & Detailed</option>
                  </select>
                </div>

                <div>
                  <label className="text-[13px] font-semibold text-[#09090B] mb-2 block">
                    System Prompt
                  </label>
                  <textarea
                    className="w-full h-32 px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0A6BFF] focus:border-transparent resize-none"
                    placeholder="You are a helpful customer support agent for Anaos. You help customers with their questions about our product..."
                    defaultValue="You are a helpful customer support agent for Anaos. Always be professional, empathetic, and solution-oriented. If you don't know something, offer to escalate to a human agent."
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl">
                  <div>
                    <div className="text-[13px] font-semibold text-[#09090B]">Auto-escalate complex issues</div>
                    <div className="text-[12px] text-[#71717A] mt-0.5">Hand over to human when AI confidence is low</div>
                  </div>
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-[#0A6BFF] rounded-full peer-checked:bg-[#0A6BFF]"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Knowledge Base */}
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-[#ECFDF5] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-[22px] h-[22px] text-[#059669]" />
                </div>
                <div>
                  <div className="text-[18px] font-semibold text-[#09090B]">Knowledge Base</div>
                  <div className="text-[12px] text-[#71717A]">Documents and FAQs for AI training</div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Product Documentation", items: 24, status: "synced" },
                  { name: "Common FAQs", items: 18, status: "synced" },
                  { name: "Pricing Information", items: 12, status: "synced" },
                  { name: "Support Policies", items: 8, status: "pending" },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#F8F9FA] transition-colors">
                    <div>
                      <div className="text-[13px] font-semibold text-[#09090B]">{doc.name}</div>
                      <div className="text-[11px] text-[#71717A]">{doc.items} items</div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-lg ${
                      doc.status === "synced"
                        ? "bg-[#ECFDF5] text-[#047857]"
                        : "bg-[#FEF3C7] text-[#D97706]"
                    }`}>
                      <span className="text-[11px] font-semibold capitalize">{doc.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 h-11 bg-[#09090B] hover:bg-[#18181B] text-white rounded-xl text-[13px] font-semibold transition-colors">
                Add Knowledge Source
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-[#FEF3C7] rounded-xl flex items-center justify-center">
                  <Zap className="w-[22px] h-[22px] text-[#D97706]" />
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#09090B]">AI Performance</div>
                  <div className="text-[12px] text-[#71717A]">Last 30 days</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] text-[#71717A]">Resolution Rate</span>
                    <span className="text-[14px] font-bold text-[#059669]">84%</span>
                  </div>
                  <div className="h-2 bg-[#F1F2F4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#059669] rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] text-[#71717A]">Avg Response Time</span>
                    <span className="text-[14px] font-bold text-[#0A6BFF]">2.3s</span>
                  </div>
                  <div className="h-2 bg-[#F1F2F4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0A6BFF] rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[12px] text-[#71717A]">Customer Satisfaction</span>
                    <span className="text-[14px] font-bold text-[#D97706]">4.7/5</span>
                  </div>
                  <div className="h-2 bg-[#F1F2F4] rounded-full overflow-hidden">
                    <div className="h-full bg-[#D97706] rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0A6BFF] to-[#0052CC] rounded-[24px] p-7 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[15px] font-semibold mb-2">Advanced Settings</h3>
              <p className="text-[12px] text-white/80 mb-4">
                Fine-tune AI parameters, custom integrations, and advanced workflows
              </p>
              <button className="w-full h-10 bg-white/20 hover:bg-white/30 rounded-xl text-[13px] font-semibold transition-colors">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
