"use client";

import { useState, useEffect } from "react";
import { Users, Search, Filter, Download, MoreHorizontal, User, Mail, Phone, Calendar, ArrowUpRight, MessageSquare, Tag } from "lucide-react";
import { InnerPageHeader } from "@/components/ui/InnerPageHeader";
import { format } from "date-fns";

export function ContactsHub() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("all");

  useEffect(() => {
    fetchContacts();
  }, [filterSource]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/contacts?source=${filterSource}`);
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <InnerPageHeader
        title="Contacts & CRM"
        subtitle="Manage your leads, customers, and active conversations in one place."
        icon={Users}
      >
        <button className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-xl text-[13px] font-bold hover:bg-zinc-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </InnerPageHeader>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by name, phone or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-xl px-3 py-2 shadow-sm">
              <Filter className="w-4 h-4 text-zinc-500" />
              <select 
                value={filterSource}
                onChange={e => setFilterSource(e.target.value)}
                className="text-[13px] font-bold text-zinc-700 bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Sources</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="manual">Manual Entry</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50">
                  <th className="px-6 py-4 text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium">Loading contacts...</td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-medium">
                      No contacts found.
                      {search && " Try adjusting your search."}
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map(contact => (
                    <tr key={contact.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[14px] text-zinc-900">{contact.name}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                               {JSON.parse(contact.tags || "[]").map((tag: string, i: number) => (
                                 <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-100 text-[10px] font-bold text-zinc-600 flex items-center gap-1">
                                   <Tag className="w-3 h-3" /> {tag}
                                 </span>
                               ))}
                               {JSON.parse(contact.tags || "[]").length === 0 && (
                                 <span className="text-[11px] text-zinc-400 font-medium">New Lead</span>
                               )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium">
                              <Phone className="w-3.5 h-3.5" /> {contact.phone}
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium">
                              <Mail className="w-3.5 h-3.5" /> {contact.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide
                          ${contact.source === 'whatsapp' ? 'bg-emerald-50 text-emerald-700' : 
                            contact.source === 'instagram' ? 'bg-fuchsia-50 text-fuchsia-700' :
                            contact.source === 'facebook' ? 'bg-blue-50 text-blue-700' : 
                            'bg-zinc-100 text-zinc-700'}
                        `}>
                          {contact.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          {format(new Date(contact.updatedAt), "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg text-zinc-400 hover:text-[#0A6BFF] hover:bg-blue-50 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors ml-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-[12px] font-medium text-zinc-500">
            <div>Showing {filteredContacts.length} contacts</div>
            <div className="flex items-center gap-2">
              <button disabled className="px-3 py-1 rounded-md border border-zinc-200 bg-white opacity-50 cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1 rounded-md border border-zinc-200 bg-white opacity-50 cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactsHub;
