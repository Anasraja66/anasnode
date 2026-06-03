"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Download,
  FileSpreadsheet,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";

type Contact = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  gender?: string;
  customFields?: Record<string, string>;
  lastMessage: string;
  tags: string[];
  optedOut: boolean;
  aiEnabled: boolean;
};

type PreviewRow = {
  name: string;
  phone: string;
  email: string;
  tags: string[];
  extra?: Record<string, string>;
};

export function ContactsHub() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    columns: string[];
    count: number;
    rows: PreviewRow[];
  } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newTags, setNewTags] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/contacts?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success) setContacts(data.contacts || []);
    } catch {
      /* offline */
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const buildFormData = () => {
    const fd = new FormData();
    if (uploadFile) fd.append("file", uploadFile);
    else if (csvText.trim()) fd.append("csv", csvText.trim());
    return fd;
  };

  const runPreview = async () => {
    if (!uploadFile && !csvText.trim()) return;
    setPreviewing(true);
    setImportResult(null);
    try {
      const res = await fetch("/api/contacts/import/preview", {
        method: "POST",
        body: buildFormData(),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportResult(data.error || "Could not read file");
        setPreview(null);
        return;
      }
      setPreview({
        columns: data.columns || [],
        count: data.count || 0,
        rows: data.preview || [],
      });
    } catch {
      setImportResult("Server not responding");
    } finally {
      setPreviewing(false);
    }
  };

  const runImport = async () => {
    if (!uploadFile && !csvText.trim()) return;
    setImporting(true);
    setImportResult(null);
    try {
      const res = await fetch("/api/contacts/import", {
        method: "POST",
        body: buildFormData(),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportResult(data.error || "Import failed");
        return;
      }
      setImportResult(
        `Done: ${data.created} new, ${data.updated} updated (${data.total} rows, skipped ${data.skipped || 0}). Columns: ${(data.columns || []).join(", ")}`
      );
      setCsvText("");
      setUploadFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch {
      setImportResult("Import failed — refresh and try again");
    } finally {
      setImporting(false);
    }
  };

  const addContact = async () => {
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        phone: newPhone,
        email: newEmail,
        gender: newGender,
        tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowAdd(false);
      setFirstName("");
      setLastName("");
      setNewPhone("");
      setNewEmail("");
      setNewGender("");
      setNewTags("");
      load();
    } else {
      alert(data.error || "Could not add contact");
    }
  };

  const downloadSample = () => {
    const sample = [
      "first name,last name,phone,email,gender,tags,company,budget",
      "Ahmed,Ali,+971501234567,ahmed@example.com,male,leads,Acme Properties,2M",
      "Sara,Khan,+971509876543,sara@example.com,female,vip;damac,Elite Tower,1.5M",
    ].join("\n");
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anaos-contacts-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight">CRM Contacts</h1>
          <p className="text-[14px] text-zinc-500 font-medium max-w-2xl">
            Import leads from Google Sheets or Excel. Every column becomes a 
            <span className="text-zinc-900 font-bold mx-1">Smart Template Field</span> 
            for your automated broadcasts.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadSample}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 bg-white text-[13.5px] font-bold text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            Sample CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setShowImport(true);
              setImportResult(null);
            }}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 bg-white text-[13.5px] font-bold text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm active:scale-95"
          >
            <Upload className="w-4 h-4 text-zinc-400" />
            Import Leads
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#0A6BFF] text-white text-[13.5px] font-black hover:bg-blue-600 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-[12px] text-zinc-600 space-y-1">
        <p className="font-medium text-zinc-800">Google Sheets</p>
        <p>
          File → Download → CSV, or copy cells and paste below. Excel{" "}
          <code className="bg-white px-1 rounded">.xlsx</code> upload works too. Column names
          are detected automatically (phone, email, first name, tags, etc.).
        </p>
        <p>
          Phone numbers from any country are normalized to Meta format (E.164) before saving.
          Keep country code when possible (e.g. <code className="bg-white px-1 rounded">+971...</code>).
        </p>
        <p>
          In broadcasts use{" "}
          <code className="bg-white px-1 rounded">{"{{first_name}}"}</code>,{" "}
          <code className="bg-white px-1 rounded">{"{{email}}"}</code>, or any custom column
          like <code className="bg-white px-1 rounded">{"{{company}}"}</code>.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative group max-w-md">
        <Search className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-3 transition-colors group-focus-within:text-zinc-900" />
        <input
          type="text"
          placeholder="Search leads by name, phone or email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-11 pl-10 pr-4 rounded-2xl border border-zinc-200 text-[14px] bg-white focus:outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-50 transition-all w-full shadow-sm"
        />
      </div>

      {showAdd && (
        <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-3">
          <p className="text-[13px] font-medium text-zinc-800">Create contact</p>
          <p className="text-[12px] text-zinc-500">
            Phone required for WhatsApp. Email optional — saved for templates.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="h-9 border border-zinc-200 rounded-md px-3 text-[13px]"
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="h-9 border border-zinc-200 rounded-md px-3 text-[13px]"
            />
            <input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Phone +971…"
              className="h-9 border border-zinc-200 rounded-md px-3 text-[13px] font-mono sm:col-span-2"
            />
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              className="h-9 border border-zinc-200 rounded-md px-3 text-[13px]"
            />
            <select
              value={newGender}
              onChange={(e) => setNewGender(e.target.value)}
              className="h-9 border border-zinc-200 rounded-md px-3 text-[13px] bg-white"
            >
              <option value="">Gender (optional)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Tags: leads, vip"
              className="h-9 border border-zinc-200 rounded-md px-3 text-[13px] sm:col-span-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addContact}
              className="h-9 px-4 rounded-md bg-[#0A6BFF] text-white hover:bg-blue-600 text-[13px] font-medium transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="h-9 px-3 text-[13px] text-zinc-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showImport && (
        <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[14px] font-medium text-zinc-900">Import contacts</p>
              <p className="text-[12px] text-zinc-500 mt-0.5">
                CSV, Excel (.xlsx/.xls/.xlsm), ODS, PDF, or paste from Google Sheets
              </p>
            </div>
            <button type="button" onClick={() => setShowImport(false)}>
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          <label className="flex flex-col items-center justify-center gap-2 h-28 rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100/80">
            <FileSpreadsheet className="w-8 h-8 text-zinc-400" />
            <span className="text-[13px] text-zinc-600">
              {uploadFile ? uploadFile.name : "Choose CSV/Excel/ODS/PDF file"}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls,.xlsm,.ods,.pdf,text/csv,application/pdf,application/vnd.oasis.opendocument.spreadsheet"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setUploadFile(f || null);
                setPreview(null);
              }}
            />
          </label>

          <div className="text-center text-[11px] text-zinc-400">or paste rows</div>

          <textarea
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              setPreview(null);
            }}
            rows={5}
            placeholder="Paste from Google Sheets (tab-separated) or CSV…"
            className="w-full border border-zinc-200 rounded-md px-3 py-2 text-[12px] font-mono"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={previewing || (!uploadFile && !csvText.trim())}
              onClick={runPreview}
              className="h-9 px-4 rounded-md border border-zinc-300 text-[13px] font-medium disabled:opacity-40"
            >
              {previewing ? "Reading…" : "Preview"}
            </button>
            <button
              type="button"
              disabled={importing || (!uploadFile && !csvText.trim())}
              onClick={runImport}
              className="h-9 px-4 rounded-md bg-[#0A6BFF] hover:bg-blue-600 text-white text-[13px] font-medium disabled:opacity-40 transition-colors"
            >
              {importing ? "Importing…" : "Import all"}
            </button>
          </div>

          {preview && (
            <div className="rounded-md border border-zinc-100 overflow-hidden">
              <p className="px-3 py-2 text-[12px] bg-zinc-50 border-b border-zinc-100">
                <span className="font-medium">{preview.count}</span> contacts · columns:{" "}
                {preview.columns.join(", ")}
              </p>
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-100">
                    <th className="text-left px-3 py-1.5">Name</th>
                    <th className="text-left px-3 py-1.5">Phone</th>
                    <th className="text-left px-3 py-1.5">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((r, i) => (
                    <tr key={i} className="border-b border-zinc-50">
                      <td className="px-3 py-1.5">{r.name}</td>
                      <td className="px-3 py-1.5 font-mono">{r.phone}</td>
                      <td className="px-3 py-1.5">{r.email || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {importResult && (
            <p className="text-[13px] text-zinc-700 bg-zinc-100 rounded-md px-3 py-2">
              {importResult}
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                {["Contact", "Communication", "Tags", "AI Status", ""].map((h) => (
                  <th key={h} className="px-6 py-4 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mx-auto" />
                    <p className="text-[13px] text-zinc-400 mt-2 font-bold uppercase tracking-widest">Loading leads...</p>
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-zinc-400">
                    <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                       <Search className="w-6 h-6 opacity-20" />
                    </div>
                    <p className="text-[15px] font-bold text-zinc-900">No leads found</p>
                    <p className="text-[13px] mt-1">Try importing a CSV or adding a contact manually.</p>
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[12px] font-black text-zinc-900">
                          {c.name ? c.name[0].toUpperCase() : "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-black text-zinc-900 truncate tracking-tight">{c.name || "Unknown"}</p>
                          <p className="text-[12px] text-zinc-500 font-mono tracking-tighter">{c.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-0.5">
                        <p className="text-[13px] font-medium text-zinc-600 truncate max-w-[200px]">{c.lastMessage || "No messages yet"}</p>
                        {c.email && <p className="text-[11px] text-zinc-400">{c.email}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {c.tags.length > 0 ? (
                          c.tags.map((t) => (
                            <span key={t} className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-zinc-300">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${c.aiEnabled ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-zinc-100 text-zinc-500 border border-zinc-200"}`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${c.aiEnabled ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
                         {c.aiEnabled ? "AI ACTIVE" : "MANUAL"}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Link href={`/dashboard/inbox?id=${c.id}`} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200 text-zinc-400 hover:text-zinc-900 transition-all">
                           <MessageCircle className="w-4.5 h-4.5" />
                         </Link>
                         <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200 text-zinc-400 hover:text-red-600 transition-all cursor-pointer">
                           <X className="w-4.5 h-4.5" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
