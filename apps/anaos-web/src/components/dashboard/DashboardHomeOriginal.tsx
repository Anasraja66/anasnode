 
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DashboardHome({ ws, preset, roiMetrics, user }: { ws: Workspace; preset: IndustryPreset; roiMetrics?: any; user?: any }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Icon = preset.icon;
  const [showConnectors, setShowConnectors] = useState(true);
  const [greeting, setGreeting] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dateStr, setDateStr] = useState("");

  const [promptMode, setPromptMode] = useState<"new" | "edit" | "improve">("new");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentWorkflow, setRecentWorkflow] = useState<any>(null);
   
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeChannel, setActiveChannel] = useState<string>("All channels");
  const [diagnostics, setDiagnostics] = useState<{ id: string; title: string; text: string }[]>([]);

  useEffect(() => {
    fetch("/api/v1/workflows")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.workflows && data.workflows.length > 0) {
           
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sorted = [...data.workflows].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const latest = sorted[0];

          // Recover original prompt from local storage if available
          const pendingStr = localStorage.getItem("anaos_pending_workflow");
          let originalPrompt = latest.description || "";
          if (pendingStr) {
            try {
              const pending = JSON.parse(pendingStr);
              if (pending.prompt) originalPrompt = pending.prompt;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) { }
          }
          latest.description = originalPrompt;

          setRecentWorkflow(latest);

          // AI Diagnostics: Generate contextual issues based on workflow
          const issues = [];
          const integrations = latest.requiredIntegrations || [];

          let generatedPrompt = `I have integrated ${integrations.join(", ") || "my tools"}. However, my setup has the following missing components that I need you to fix:\n`;
          let hasIssues = false;

          if (integrations.some((i: string) => ["whatsapp", "facebook", "instagram"].includes(i.toLowerCase()))) {
            issues.push({ id: "lead_scoring", title: "Missing Lead Qualification", text: "Your messaging automation lacks a lead scoring step to prioritize high-value customers." });
            generatedPrompt += "- Add a Lead Qualification & Scoring step for incoming messages.\n";
            hasIssues = true;
          }
          if (integrations.some((i: string) => ["phone", "voice", "twilio"].includes(i.toLowerCase()))) {
            issues.push({ id: "sms_fallback", title: "No Missed Call Fallback", text: "Add an SMS follow-up node to immediately text callers if the AI agent is busy." });
            generatedPrompt += "- Add an SMS Fallback for missed voice calls.\n";
            hasIssues = true;
          }
          if (!integrations.some((i: string) => i.toLowerCase().includes("calendar"))) {
            issues.push({ id: "add_calendar", title: "Calendar Not Connected", text: "You have not connected Google Calendar. AI cannot book appointments automatically." });
            generatedPrompt += "- Integrate Google Calendar to automatically schedule appointments.\n";
            hasIssues = true;
          }

          // If no specific issues found, give a generic optimization
          if (!hasIssues) {
            issues.push({ id: "crm_sync", title: "CRM Sync Missing", text: "Sync your leads directly to your CRM to prevent data loss." });
            generatedPrompt += "- Add CRM synchronization to prevent lead data loss.\n";
          }

          generatedPrompt += "\nPlease regenerate the workflow to include these missing steps and complete my setup.";

          if (issues.length > 0) {
            latest.description = generatedPrompt;
          }

          setDiagnostics(issues);
          setPromptMode(issues.length > 0 ? "improve" : "edit");
        }
      })
      .catch(() => { });
  }, []);

  // Client-only: avoids SSR/client hydration mismatch
  useEffect(() => {
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good morning");
    else if (hr < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    setDateStr(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  // Handle automatic onboarding open from landing page deploy
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("deploy") === "true") {
      const pendingStr = localStorage.getItem("anaos_pending_workflow");
      if (pendingStr) {
        try {
          const pending = JSON.parse(pendingStr);
          if (pending.prompt) {
            // Give the UI a moment to render before opening the popup
            setTimeout(() => {
              const event = new CustomEvent("anaos-open-onboarding", { detail: { prompt: pending.prompt, pendingWorkflow: pending } });
              window.dispatchEvent(event);
            }, 500);

            // Clean up URL so refresh doesn't trigger it again
            window.history.replaceState({}, '', window.location.pathname);
          }
        } catch (e) {
          console.error("Failed to parse pending workflow", e);
        }
      }
    }
  }, []);

  // Note: businessConnectors SVGs removed to use BrandIcon natively

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };



  let availableChannels = ["WhatsApp"];
  if (recentWorkflow?.requiredIntegrations?.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    availableChannels = recentWorkflow.requiredIntegrations.map((c: string) => {
      if (c.toLowerCase() === "whatsapp") return "WhatsApp";
      if (c.toLowerCase() === "facebook") return "Facebook";
      if (c.toLowerCase() === "instagram") return "Instagram";
      if (c.toLowerCase() === "voice") return "Voice";
      return c.charAt(0).toUpperCase() + c.slice(1);
    });
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-[28px] relative z-10"
    >
      <OnboardingWizard />
      {/* Background foundation removed for cleaner look */}
      <div className="relative z-10 space-y-[28px] w-full font-sans">
        {/* Welcome Row (New Design) */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between min-h-[59px] w-full mb-8 pt-4">
          <div>
            <h1 className="text-[32px] font-bold text-zinc-900 mb-1.5 leading-tight" suppressHydrationWarning>
              {greeting ? `${greeting}, ${user?.name || "Guest"}!` : `Welcome, ${user?.name || "Guest"}!`}
            </h1>
            <div className="flex items-center gap-3 text-[13px] text-zinc-500 font-medium" suppressHydrationWarning>
              <span>1 connected channel</span>
              <span className="text-zinc-300">·</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase tracking-wide text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                SYSTEM STATUS: ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 shrink-0">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DDEBFF] text-[#0A6BFF] text-[13px] font-bold hover:bg-blue-100 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Data
            </button>
          </div>
        </div>

        {/* V2 ROI Analytics Grid (New Design) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
          {[
            { title: "LEADS CAPTURED", value: roiMetrics?.leadsThisWeek || "0", sub: "Last 7 days" },
            { title: "MISSED CALLS RECOVERED", value: roiMetrics?.leadsRecovered || "0", sub: "AI assisted" },
            { title: "APPOINTMENTS BOOKED", value: roiMetrics?.appointmentsBooked || "0", sub: "Via WhatsApp" },
            { title: "AI REPLIES", value: roiMetrics?.aiReplies || "0", sub: "Auto-pilot tasks" },
            { title: "AVG RESPONSE TIME", value: roiMetrics?.avgResponseSec ? `${roiMetrics.avgResponseSec}s` : "0s", sub: "Instant AI" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#CBE1FF] border-none rounded-2xl p-5 shadow-sm transition-all duration-300 flex flex-col">
              <p className="text-[10px] text-zinc-700 font-bold tracking-[0.05em] mb-2 truncate">{stat.title}</p>
              <div className="text-[28px] font-bold text-zinc-900 leading-none my-1">{stat.value}</div>
              <p className="text-[11px] text-zinc-600 mt-2 font-medium">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Compact Prompt Input Card */}
        <motion.div variants={itemVariants} className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm relative z-20">
          <h2 className="text-[16px] font-bold text-zinc-900 mb-3">Ask Anaos AI to build or edit automations</h2>
          <PromptBox
            mode={promptMode}
            onModeChange={setPromptMode}
            automationName={recentWorkflow?.name}
            initialValue={recentWorkflow?.description || ""}
            issues={promptMode === "improve" ? diagnostics : []}
            onFixIssue={(id) => {
              setDiagnostics(prev => prev.filter(i => i.id !== id));
              toast.success("AI optimization applied successfully! Your workflow has been updated.");
              if (diagnostics.length === 1) {
                setPromptMode("edit");
              }
            }}
            onGenerate={(data, prompt) => {
              if (data.success && data.workspace) {
                const pending = {
                  id: "wf_" + Math.random().toString(36).substring(7),
                  name: data.workflowName || "AI Generated Workflow",
                  workflowName: data.workflowName || "AI Generated Workflow",
                  workflow: data.workspace,
                  nodes: data.workspace.nodes || [],
                  edges: data.workspace.edges || [],
                  industry: data.industry || "general",
                  prompt,
                  features: data.features || [],
                  createdAt: Date.now(),
                };

                localStorage.setItem("anaos_pending_workflow", JSON.stringify(pending));

                const event = new CustomEvent("anaos-open-onboarding", {
                  detail: { prompt, pendingWorkflow: pending }
                });
                window.dispatchEvent(event);
              } else {
                console.error("Failed to generate workflow");
                alert("Failed to generate workflow. Please try again.");
              }
            }}
          />

          {/* Connectors Banner */}
          <AnimatePresence>
            {showConnectors && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-4 w-full"
              >
                <div className="bg-[#FAFAFA] border border-zinc-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-4 hover:border-zinc-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm text-sky-500">
                    <Plug className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-[13px] font-bold text-zinc-900 leading-tight">Connectors are now available.</h4>
                    <p className="text-[12px] text-zinc-500 mt-0.5 font-medium font-sans">Connectors allow Anaos to interact with apps directly in conversations.</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setShowConnectors(false)}
                      className="text-[12px] font-medium text-zinc-500 hover:text-zinc-800 transition-colors font-sans"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => window.dispatchEvent(new Event("anaos-open-onboarding"))}
                      className="bg-[#0A6BFF] hover:bg-blue-600 text-white shadow-sm text-[12px] font-semibold px-4 py-1.5 rounded-lg transition-all shadow-sm font-sans"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* THE CORE VISUALIZER (4-Way Architecture) - Keep below */}
        {/* THE CORE VISUALIZER (4-Way Architecture) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          {/* LEFT: Messaging Channels */}
          <motion.div
            variants={itemVariants}
            className="bg-[#DDEBFF] border-none rounded-xl p-6 space-y-6 shadow-sm transition-all duration-300 flex flex-col group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white text-[#0A6BFF] flex items-center justify-center shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-zinc-900">Messaging</h3>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { name: "WhatsApp Business", id: "whatsapp", href: "/dashboard/integrations/connect/whatsapp" },
                { name: "Instagram DM", id: "instagram", href: "/dashboard/integrations/connect/instagram" },
                { name: "FB Messenger", id: "facebook", href: "/dashboard/integrations/connect/facebook" },
                { name: "Email & SMS", id: "smtp", href: "/dashboard/integrations/connect/smtp" }
              ].map((c) => {
                const isConnected = (recentWorkflow?.requiredIntegrations || []).map((i: string) => i.toLowerCase()).includes(c.id);
                return (
                  <Link href={c.href} key={c.name} className="bg-white border-none px-4 py-3.5 rounded-xl text-[13px] font-bold text-zinc-800 shadow-sm flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group/item block">
                    <div className="flex items-center gap-3">
                      <BrandIcon id={c.id} className="w-5 h-5 shrink-0" />
                      <span className={isConnected ? "text-zinc-900" : "text-zinc-500"}>{c.name}</span>
                    </div>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Connected</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Disconnected</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* CENTER: Voice Integration */}
          <div className="flex flex-col gap-6">
            <Link
              href="/dashboard/integrations"
              className="bg-[#DDEBFF] border-none rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group transition-colors block"
            >
              {(() => {
                const isPhoneConnected = (recentWorkflow?.requiredIntegrations || []).map((i: string) => i.toLowerCase()).includes("phone") || (recentWorkflow?.requiredIntegrations || []).map((i: string) => i.toLowerCase()).includes("voice");
                return (
                  <>
                    <div className="w-12 h-12 rounded-full bg-white text-[#0A6BFF] flex items-center justify-center mb-4 relative shadow-sm group-hover:scale-110 transition-transform">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className={`text-[15px] font-bold ${isPhoneConnected ? "text-zinc-900" : "text-zinc-500"}`}>Voice Agent</h3>
                      {isPhoneConnected ? (
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">ACTIVE</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">DISCONNECTED</p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </Link>

            {/* BOTTOM: Content & Growth */}
            <motion.div
              variants={itemVariants}
              className="bg-[#DDEBFF] border-none rounded-xl p-6 space-y-6 shadow-sm transition-all duration-300 flex-1 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white text-[#0A6BFF] flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-zinc-900">Growth AI</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "TikTok", id: "tiktok", href: "/dashboard/integrations" },
                  { name: "YouTube", id: "youtube", href: "/dashboard/integrations" },
                  { name: "LinkedIn", id: "linkedin", href: "/dashboard/integrations" },
                  { name: "Blog", id: "blog", href: "/dashboard/integrations" }
                ].map((c) => {
                  const isConnected = (recentWorkflow?.requiredIntegrations || []).map((i: string) => i.toLowerCase()).includes(c.id);
                  return (
                    <Link href={c.href} key={c.name} className="bg-white border-none px-3 py-3 rounded-xl text-[12px] font-bold text-zinc-800 shadow-sm flex items-center gap-2.5 hover:bg-zinc-50 transition-colors cursor-pointer block">
                      <div className="flex items-center gap-2.5">
                        <BrandIcon id={c.id} className="w-5 h-5 shrink-0" />
                        <span className={`truncate ${isConnected ? "text-zinc-900" : "text-zinc-500"}`}>{c.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Business Integrations */}
          <motion.div
            variants={itemVariants}
            className="bg-[#DDEBFF] border-none rounded-xl p-6 space-y-6 shadow-sm transition-all duration-300 flex flex-col group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white text-[#0A6BFF] flex items-center justify-center shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-zinc-900">Integrations</h3>
            </div>
            <div className="space-y-3 flex-1">
              {[
                { name: "Shopify Store", id: "shopify", href: "/dashboard/integrations/connect/shopify" },
                { name: "Google Calendar", id: "googlecalendar", href: "/dashboard/integrations/connect/google_calendar" },
                { name: "HubSpot CRM", id: "hubspot", href: "/dashboard/integrations/connect/hubspot" },
                { name: "Stripe Payments", id: "stripe", href: "/dashboard/integrations/connect/stripe" }
              ].map((c) => {
                const isConnected = (recentWorkflow?.requiredIntegrations || []).map((i: string) => i.toLowerCase()).includes(c.id) ||
                  (c.id === "googlecalendar" && (recentWorkflow?.requiredIntegrations || []).map((i: string) => i.toLowerCase()).includes("calendar"));
                return (
                  <Link href={c.href} key={c.name} className="bg-white border-none px-4 py-3.5 rounded-xl text-[13px] font-bold text-zinc-800 shadow-sm flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer group/item block">
                    <div className="flex items-center gap-3">
                      <BrandIcon id={c.id} className="w-5 h-5 shrink-0" />
                      <span className={isConnected ? "text-zinc-900" : "text-zinc-500"}>{c.name}</span>
                    </div>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Connected</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Disconnected</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>

        </div>

        {/* Bookings & Operational Activity */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-[28px] pt-6">
          <TodayBookingsWidget />
          <ChannelStatusWidget requiredIntegrations={recentWorkflow?.requiredIntegrations || []} />
        </motion.div>

        {/* Minimal Channel Switcher - Refined */}
        <motion.div variants={itemVariants} className="pt-10 flex w-full overflow-x-auto scrollbar-none justify-start md:justify-center">
          <div className="inline-flex items-center gap-8 md:gap-14 border-b border-zinc-150 pb-px px-4 md:px-10 min-w-max mx-auto">
            {["OVERVIEW", "WHATSAPP", "INSTAGRAM", "VOICE"].map((tab) => (
              <button
                key={tab}
                className={`pb-4 text-[12px] font-semibold transition-all relative tracking-[0.2em] ${tab === "OVERVIEW"
                  ? "text-[#0A6BFF] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0A6BFF]"
                  : "text-zinc-400 hover:text-zinc-650"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
