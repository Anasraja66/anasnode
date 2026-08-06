"use client";

import { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Briefcase, Search, Plus } from "lucide-react";

export function ITTicketsPage() {
   
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="px-8 py-6 border-b border-zinc-200 bg-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-600" /> Support Tickets
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Manage IT helpdesk tickets and tech queries</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Create Ticket
          </button>
        </div>
      </div>
      
      <div className="px-8 py-6">
        <div className="text-center py-20 bg-white border border-zinc-200 rounded-2xl">
          <Briefcase className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">No open tickets</p>
          <p className="text-zinc-400 text-sm mt-1">Users can open tickets via WhatsApp or Email</p>
        </div>
      </div>
    </div>
  );
}
