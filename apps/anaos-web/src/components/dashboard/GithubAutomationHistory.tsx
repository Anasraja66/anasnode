import { Clock, CheckCircle, XCircle, AlertCircle, Filter } from "lucide-react";

const historyData = [
  {
    id: 1,
    workflow: "WhatsApp Leads Qualifier",
    trigger: "New message from Sarah Mitchell",
    status: "success",
    duration: "2.4s",
    time: "2 minutes ago",
    steps: 5
  },
  {
    id: 2,
    workflow: "Instagram Auto-Reply",
    trigger: "DM from @james_chen",
    status: "success",
    duration: "1.8s",
    time: "8 minutes ago",
    steps: 3
  },
  {
    id: 3,
    workflow: "Booking Confirmation Flow",
    trigger: "Calendar event created",
    status: "failed",
    duration: "5.2s",
    time: "15 minutes ago",
    steps: 4
  },
  {
    id: 4,
    workflow: "WhatsApp Leads Qualifier",
    trigger: "New message from Emily Parker",
    status: "success",
    duration: "2.1s",
    time: "32 minutes ago",
    steps: 5
  },
  {
    id: 5,
    workflow: "Instagram Auto-Reply",
    trigger: "DM from @lisa_anderson",
    status: "partial",
    duration: "3.7s",
    time: "1 hour ago",
    steps: 3
  },
  {
    id: 6,
    workflow: "WhatsApp Leads Qualifier",
    trigger: "New message from Michael Brown",
    status: "success",
    duration: "2.3s",
    time: "2 hours ago",
    steps: 5
  },
];

export function GithubAutomationHistory() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-5 h-5 text-[#059669]" />;
      case "failed": return <XCircle className="w-5 h-5 text-[#DC2626]" />;
      case "partial": return <AlertCircle className="w-5 h-5 text-[#D97706]" />;
      default: return <Clock className="w-5 h-5 text-[#71717A]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <span className="px-3 py-1.5 bg-[#ECFDF5] text-[#047857] text-[11px] font-semibold rounded-lg">Success</span>;
      case "failed":
        return <span className="px-3 py-1.5 bg-[#FEE2E2] text-[#DC2626] text-[11px] font-semibold rounded-lg">Failed</span>;
      case "partial":
        return <span className="px-3 py-1.5 bg-[#FEF3C7] text-[#D97706] text-[11px] font-semibold rounded-lg">Partial</span>;
      default:
        return <span className="px-3 py-1.5 bg-[#F1F5F9] text-[#71717A] text-[11px] font-semibold rounded-lg">Running</span>;
    }
  };

  return (
    <div className="flex h-full w-full bg-white rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm flex-col overflow-y-auto">
      <div className="px-10 pt-8 pb-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[#09090B] mb-1">
              Automation History
            </h1>
            <p className="text-[13px] text-[#71717A]">
              Track all workflow executions and their outcomes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-9 px-4 bg-white border border-[#E5E7EB] rounded-xl flex items-center gap-2 hover:bg-[#F8F9FA] transition-colors">
              <Filter className="w-4 h-4 text-[#71717A]" />
              <span className="text-[13px] font-medium text-[#09090B]">Filter</span>
            </button>
            <select className="h-9 px-4 bg-white border border-[#E5E7EB] rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0A6BFF]">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>All time</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-7">
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#E6F0FF] rounded-xl flex items-center justify-center">
                <Clock className="w-[18px] h-[18px] text-[#0A6BFF]" />
              </div>
              <span className="text-[12px] font-medium text-[#71717A]">Total Runs</span>
            </div>
            <div className="text-[24px] font-bold text-[#09090B]">1,247</div>
            <div className="text-[11px] text-[#71717A] mt-1">Today: 86 runs</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#ECFDF5] rounded-xl flex items-center justify-center">
                <CheckCircle className="w-[18px] h-[18px] text-[#059669]" />
              </div>
              <span className="text-[12px] font-medium text-[#71717A]">Success Rate</span>
            </div>
            <div className="text-[24px] font-bold text-[#09090B]">94%</div>
            <div className="text-[11px] text-[#71717A] mt-1">1,173 successful</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#FEE2E2] rounded-xl flex items-center justify-center">
                <XCircle className="w-[18px] h-[18px] text-[#DC2626]" />
              </div>
              <span className="text-[12px] font-medium text-[#71717A]">Failed Runs</span>
            </div>
            <div className="text-[24px] font-bold text-[#09090B]">38</div>
            <div className="text-[11px] text-[#71717A] mt-1">3.0% failure rate</div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-[#F1F5F9] rounded-xl flex items-center justify-center">
                <Clock className="w-[18px] h-[18px] text-[#71717A]" />
              </div>
              <span className="text-[12px] font-medium text-[#71717A]">Avg Duration</span>
            </div>
            <div className="text-[24px] font-bold text-[#09090B]">2.4s</div>
            <div className="text-[11px] text-[#71717A] mt-1">-0.3s improvement</div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Status</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Workflow</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Trigger</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Steps</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Duration</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Time</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-[#F1F2F4] hover:bg-[#F8F9FA] transition-colors cursor-pointer ${
                      index === historyData.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-semibold text-[#09090B]">{item.workflow}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-[#71717A]">{item.trigger}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-medium text-[#09090B]">{item.steps} steps</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-mono text-[#09090B]">{item.duration}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[12px] text-[#71717A]">{item.time}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-[#F1F2F4] flex items-center justify-between bg-[#F8F9FA]">
            <div className="text-[12px] text-[#71717A]">
              Showing <span className="font-semibold text-[#09090B]">1-6</span> of <span className="font-semibold text-[#09090B]">1,247</span> executions
            </div>
            <div className="flex gap-2">
              <button className="h-9 px-4 bg-white border border-[#E5E7EB] rounded-xl text-[13px] font-medium hover:bg-[#F8F9FA] transition-colors">
                Previous
              </button>
              <button className="h-9 px-4 bg-[#0A6BFF] hover:bg-[#0052CC] rounded-xl text-white text-[13px] font-semibold transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GithubAutomationHistory;
