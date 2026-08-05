function Topbar({ title, ws, preset, waStatus, integrations, onMenuClick }: {
  title: string;
  ws: Workspace;
  preset: IndustryPreset;
  waStatus: WAStatus;
  integrations: { whatsapp: boolean; shopify: boolean; fastapi: boolean };
  onMenuClick: () => void;
}) {
  const [isAutoReply, setIsAutoReply] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Determine if we show the alert banner
  const hasIssue = waStatus.tokenExpired || waStatus.phoneNumberIdInvalid || waStatus.needsPublicWebhook || !integrations.fastapi;

  let alertMessage = "";
  if (waStatus.tokenExpired) alertMessage = "Meta token expired — reconnect WhatsApp in Integrations.";
  else if (waStatus.phoneNumberIdInvalid) alertMessage = `Phone ID Error: ${waStatus.phoneNumberIdError || "Check settings"}`;
  else if (waStatus.needsPublicWebhook) alertMessage = "Public webhook missing — use tunnel for local testing.";
  else if (!integrations.fastapi) alertMessage = "AI Engine (FastAPI) is offline — run 'fastapi dev main.py' in backend.";

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setSearchResults(data.results);
        })
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="flex flex-col shrink-0">
      <header className="h-16 border-b border-zinc-200 bg-white px-4 md:px-6 flex items-center justify-between shrink-0 relative z-[60]">
        <div className="flex items-center gap-3 text-[13.5px]">
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden p-1 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
              <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
              <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
              <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-zinc-400 font-medium hidden sm:inline">{ws.name}</span>
          <ChevronRight className="w-4 h-4 text-zinc-200 hidden sm:inline" />
          <span className="font-bold text-zinc-700 tracking-tight">{title}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block z-50">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 transition-colors group-focus-within:text-sky-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NLP indexed data..."
              className="h-9 pl-9 pr-4 rounded-lg border border-zinc-200 text-[13px] bg-zinc-50/50 focus:outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all w-64 md:w-80"
            />

            {/* Search Results Dropdown â€” TF-IDF Powered */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden max-h-[420px] overflow-y-auto">
                {/* Header */}
                <div className="px-3 py-2 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-zinc-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center">
                      <Search className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">TF-IDF Search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {searchResults.length > 0 && (
                      <span className="text-[9px] font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">
                        {searchResults.length} results
                      </span>
                    )}
                    {isSearching && <Loader2 className="w-3 h-3 animate-spin text-sky-500" />}
                  </div>
                </div>

                {searchResults.length === 0 && !isSearching ? (
                  <div className="p-6 text-center">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-2">
                      <Search className="w-4 h-4 text-zinc-400" />
                    </div>
                    <p className="text-zinc-500 text-[12px] font-medium">No indexed chats match this query.</p>
                    <p className="text-zinc-400 text-[10px] mt-1">Try sending a message via the webhook first.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-50">
                    {searchResults.map((res: any, idx: number) => {
                      // Handle both old format (IndexedDocument) and new TF-IDF (SearchResult)
                      const doc = res.document ?? res;
                      const score = res.score ?? null;
                      const terms = res.matchedTerms ?? [];
                      const data = doc.data;

                      const sentimentColor = {
                        positive: "bg-emerald-100 text-emerald-700",
                        neutral: "bg-zinc-100 text-zinc-600",
                        negative: "bg-rose-100 text-rose-700",
                      }[data.sentiment as string] ?? "bg-zinc-100 text-zinc-600";

                      const nerCategoryColor: Record<string, string> = {
                        ENAMEX: "bg-violet-100 text-violet-700",
                        NUMEX: "bg-amber-100 text-amber-700",
                        TIMEX: "bg-sky-100 text-sky-700",
                        MISC: "bg-zinc-100 text-zinc-600",
                      };

                      return (
                        <div
                          key={doc._id}
                          className="p-3 hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                        >
                          {/* Top Row: text + score */}
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[12px] text-zinc-800 font-semibold leading-snug flex-1 truncate">
                              {data.originalText}
                            </p>
                            {score !== null && (
                              <div className="shrink-0 flex flex-col items-end gap-0.5">
                                <span className="text-[9px] font-bold text-sky-600 uppercase tracking-widest">Score</span>
                                <span className="text-[11px] font-bold text-sky-700 tabular-nums">
                                  {score.toFixed(3)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Tags Row */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {/* Intent */}
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wider">
                              âš¡ {data.intent}
                            </span>

                            {/* Sentiment */}
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${sentimentColor}`}>
                              {data.sentiment === "positive" ? "ðŸ˜Š" : data.sentiment === "negative" ? "ðŸ˜ " : "ðŸ˜"} {data.sentiment}
                              {data.sentimentScore !== undefined && ` (${data.sentimentScore > 0 ? "+" : ""}${data.sentimentScore})`}
                            </span>

                            {/* NER Entities */}
                            {data.annotations?.slice(0, 4).map((anno: any) => (
                              <span
                                key={anno.id}
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${nerCategoryColor[anno.nerCategory] ?? "bg-zinc-100 text-zinc-600"}`}
                              >
                                {anno.type}: {anno.value}
                              </span>
                            ))}
                          </div>

                          {/* Matched TF-IDF Terms */}
                          {terms.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="text-[9px] text-zinc-400 font-bold">MATCHED:</span>
                              {terms.map((t: string) => (
                                <span key={t} className="text-[9px] font-bold text-sky-600 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-md">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* POS Tag String (if available) */}
                          {data.posTagString && (
                            <p className="text-[9px] text-zinc-400 font-mono mt-1.5 truncate">
                              {data.posTagString}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="h-6 w-px bg-zinc-200" />
          <div className="relative group z-50">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-9 h-9 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 transition-all cursor-pointer bg-white shadow-sm"
            >
              <Bell className="w-4.5 h-4.5 transition-transform group-hover:rotate-12" />
              {hasIssue && <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />}
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <h3 className="text-[13px] font-bold text-zinc-900">Notifications</h3>
                  {hasIssue && <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm">1 New</span>}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {hasIssue ? (
                    <div className="p-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-zinc-900 leading-tight mb-1">CRM System Alert</p>
                          <p className="text-[12px] text-zinc-500 leading-snug">{alertMessage}</p>
                          <button onClick={() => window.location.href = '/dashboard/integrations/connect/whatsapp'} className="mt-2 text-[11px] font-bold text-sky-600 hover:underline">Fix Issue &rarr;</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-3 border border-zinc-100">
                        <CheckCircle2 className="w-5 h-5 text-zinc-300" />
                      </div>
                      <p className="text-[13px] font-bold text-zinc-900">All caught up!</p>
                      <p className="text-[12px] text-zinc-500 mt-1">No new issues in your CRM.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global OS Alert Banner (Only shows when there's an error/issue) */}
      {hasIssue && (
        <div className="bg-rose-500 text-white shadow-md px-6 py-3 flex flex-col md:flex-row md:items-center justify-between z-50 animate-in slide-in-from-top duration-300 border-b border-rose-600">
          <div className="flex items-center gap-3 mb-3 md:mb-0">
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shrink-0 shadow-sm" />
            <p className="text-[14px] font-bold tracking-wide">
              System Error: {alertMessage}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = '/dashboard/integrations/connect/whatsapp'} className="bg-white text-rose-600 hover:bg-rose-50 text-[13px] font-bold px-5 py-2 rounded-lg transition-colors shadow-sm">
              Fix Issue Now
            </button>
            <button className="text-white hover:text-rose-100 text-[13px] font-bold px-2 py-2 flex items-center gap-1.5 transition-colors">
              Support <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
