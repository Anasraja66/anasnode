import { TrendingUp, Users, MessageSquare, Clock, Calendar } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const conversationData = [
  { day: "Mon", count: 245 },
  { day: "Tue", count: 312 },
  { day: "Wed", count: 289 },
  { day: "Thu", count: 402 },
  { day: "Fri", count: 378 },
  { day: "Sat", count: 156 },
  { day: "Sun", count: 189 },
];

const resolutionData = [
  { day: "Mon", rate: 82 },
  { day: "Tue", rate: 85 },
  { day: "Wed", rate: 83 },
  { day: "Thu", rate: 88 },
  { day: "Fri", rate: 84 },
  { day: "Sat", rate: 86 },
  { day: "Sun", rate: 84 },
];

export function GithubPerformanceInsights() {
  return (
    <div className="flex h-full w-full bg-white rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm flex-col overflow-y-auto">
      <div className="px-10 pt-8 pb-10">
        <div className="mb-8">
          <h1 className="text-[26px] font-black tracking-tight text-[#09090B] mb-1">
            Performance Insights
          </h1>
          <p className="text-[13px] text-[#71717A]">
            Analytics and trends for the last 7 days
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-6 mb-7">
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-[18px] h-[18px] text-[#0A6BFF]" />
              </div>
              <span className="text-[12px] font-medium text-[#71717A]">Total Messages</span>
            </div>
            <div className="text-[32px] font-black text-[#09090B]">8,471</div>
            <div className="flex items-center gap-1 text-[#059669] mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">+18.2%</span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#ECFDF5] rounded-xl flex items-center justify-center">
                <Users className="w-[18px] h-[18px] text-[#059669]" />
              </div>
              <span className="text-[12px] font-medium text-[#71717A]">Active Users</span>
            </div>
            <div className="text-[32px] font-black text-[#09090B]">1,847</div>
            <div className="flex items-center gap-1 text-[#059669] mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">+12.5%</span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#FEF3C7] rounded-xl flex items-center justify-center">
                <Clock className="w-[18px] h-[18px] text-[#D97706]" />
              </div>
              <span className="text-[12px] font-medium text-[#71717A]">Avg Response</span>
            </div>
            <div className="text-[32px] font-black text-[#09090B]">2.3s</div>
            <div className="flex items-center gap-1 text-[#059669] mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">-0.4s</span>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#F1F5F9] rounded-xl flex items-center justify-center">
                <Calendar className="w-[18px] h-[18px] text-[#71717A]" />
              </div>
              <span className="text-[12px] font-medium text-[#71717A]">Bookings</span>
            </div>
            <div className="text-[32px] font-black text-[#09090B]">156</div>
            <div className="flex items-center gap-1 text-[#059669] mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-semibold">+24.1%</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-7">
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7">
            <div className="mb-6">
              <h3 className="text-[15px] font-semibold text-[#09090B] mb-1">Conversation Volume</h3>
              <p className="text-[12px] text-[#71717A]">Daily conversation trends</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={conversationData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A6BFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0A6BFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F4" />
                <XAxis dataKey="day" stroke="#71717A" fontSize={11} />
                <YAxis stroke="#71717A" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#0A6BFF" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-7">
            <div className="mb-6">
              <h3 className="text-[15px] font-semibold text-[#09090B] mb-1">AI Resolution Rate</h3>
              <p className="text-[12px] text-[#71717A]">Percentage of AI-resolved conversations</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F4" />
                <XAxis dataKey="day" stroke="#71717A" fontSize={11} />
                <YAxis stroke="#71717A" fontSize={11} domain={[75, 90]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#059669" strokeWidth={3} dot={{ fill: '#059669', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Queries */}
        <div className="mt-7 bg-white border border-[#E5E7EB] rounded-[24px] p-7">
          <div className="mb-6">
            <h3 className="text-[15px] font-semibold text-[#09090B] mb-1">Top Customer Queries</h3>
            <p className="text-[12px] text-[#71717A]">Most common questions this week</p>
          </div>

          <div className="space-y-3">
            {[
              { query: "How do I reset my password?", count: 142, trend: "+12%" },
              { query: "What's your pricing?", count: 128, trend: "+8%" },
              { query: "Can I upgrade my plan?", count: 96, trend: "+24%" },
              { query: "How to integrate with Shopify?", count: 84, trend: "+5%" },
              { query: "Do you offer refunds?", count: 67, trend: "-3%" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#F8F9FA] transition-colors">
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#09090B]">{item.query}</div>
                  <div className="text-[11px] text-[#71717A] mt-0.5">{item.count} inquiries</div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg ${
                  item.trend.startsWith('+') ? 'bg-[#ECFDF5] text-[#047857]' : 'bg-[#FEF3C7] text-[#D97706]'
                }`}>
                  <span className="text-[11px] font-semibold">{item.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
