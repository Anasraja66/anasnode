"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getIndustryPreset, type IndustryPreset } from "@/lib/industry/presets";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Tab = "voice_agent" | "ai_agent" | "calls" | "overview" | "inbox" | "approvals" | "contacts" | "bookings" | "automations" | "broadcasts" | "analytics" | "team" | "properties" | "leads" | "cleaning_bookings" | "construction_projects" | "maintenance_orders" | "it_tickets" | "fencing_estimates" | "integrations";

type Workspace = {
  id: string;
  name: string;
  industry: string;
  slug: string;
  status: "live" | "draft" | "paused";
  version: number;
  automations: Automation[];
};

type Automation = {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  status?: "active" | "draft" | "needs_connection";
  requiredProvider?: "meta" | "google" | "commerce" | "others" | null;
  requiredIntegrations?: string[];
  missingIntegrations?: string[];
  runs: number;
  lastRun: string;
};

type Contact = {
  id: string;
  name: string;
  phone: string;
  industry: string;
  stage: string;
  lastMessage: string;
  time: string;
  checked?: boolean;
};

interface DashboardContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  workspaces: Workspace[];
  ws: Workspace | null;
  setWs: (w: Workspace) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roiMetrics: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  integrations: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waStatus: any;
  contacts: Contact[];
  industryPreset: IndustryPreset | null;
  loadingData: boolean;
  loadError: string | null;
  isDeployingAgent: boolean;
  webhookActive: boolean;
  fastApiOnline: boolean;
  toggleAutomation: (automationId: string) => Promise<void>;
  toggleLoading: string | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [ws, setWs] = useState<Workspace | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roiMetrics, setRoiMetrics] = useState<any>(null);
  const [integrations, setIntegrations] = useState({
    whatsapp: false, instagram: false, facebook: false, shopify: false, smtp: false, fastapi: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [waStatus, setWaStatus] = useState<any>({});
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDeployingAgent, setIsDeployingAgent] = useState(false);
  const [webhookActive, setWebhookActive] = useState(false);
  const [fastApiOnline, setFastApiOnline] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoadError(null);
        
        // --- INTERCEPTOR LOGIC FOR LANDING PAGE DEPLOYMENTS ---
        const savedWorkspaces = localStorage.getItem("anaos_custom_workspaces");
        if (savedWorkspaces) {
          try {
            setIsDeployingAgent(true);
            const workspacesToImport = JSON.parse(savedWorkspaces);
            const importRes = await fetch("/api/workspace/import", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ workspaces: workspacesToImport }),
            });
            if (importRes.ok) {
              localStorage.removeItem("anaos_custom_workspaces");
            }
          } catch (e) {
            console.error("Failed to import workspaces", e);
          } finally {
            setIsDeployingAgent(false);
          }
        }
        // --------------------------------------------------------

        const res = await fetch("/api/dashboard/data");
        if (!res.ok) {
          setLoadError("Could not load dashboard. Try refreshing the page.");
          return;
        }
        const data = await res.json();

        if (data.user) setUser(data.user);
        if (data.roiMetrics) setRoiMetrics(data.roiMetrics);

        if (data.integrations) {
          setIntegrations(data.integrations);
          setWebhookActive(!!data.integrations.whatsapp);
          setFastApiOnline(!!data.integrations.fastapi);
        }

        fetch("/api/integrations/whatsapp/status")
          .then((r) => r.json())
          .then((st) => {
            if (st.success) {
              setWaStatus(st);
            }
          }).catch(() => { });

        if (data.success && data.workspaces?.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: Workspace[] = data.workspaces.map((w: any) => ({
            id: w.id,
            name: w.name,
            industry: getIndustryPreset(w.industry).label,
            slug: w.slug,
            status: w.status || "live",
            version: 1,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            automations: (w.automations || []).map((a: any) => ({
              id: a.id,
              name: a.name,
              type: a.type || "whatsapp_flow",
              enabled: a.enabled ?? a.status === "active",
              status: a.status || undefined,
              requiredProvider: a.requiredProvider ?? null,
              requiredIntegrations: Array.isArray(a.requiredIntegrations) ? a.requiredIntegrations : undefined,
              missingIntegrations: Array.isArray(a.missingIntegrations) ? a.missingIntegrations : undefined,
              runs: a.runs ?? 0,
              lastRun: a.lastRun || "Never",
            })),
          }));

          setWorkspaces(mapped);

          const wsParam = new URLSearchParams(window.location.search).get("ws");
          const pick = wsParam ? mapped.find((w) => w.id === wsParam) : null;
          setWs(pick || mapped[0]);
          setContacts(data.contacts || []);
        } else {
          setWorkspaces([]);
          setWs(null);
          setContacts([]);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setLoadError("Server not responding. Please refresh.");
      } finally {
        setLoadingData(false);
      }
    }

    loadDashboardData();
  }, []);

  const toggleAutomation = async (automationId: string) => {
    if (!ws) return;
    const automation = ws.automations.find((a) => a.id === automationId);
    if (!automation) return;

    setToggleLoading(automationId);
    const endpoint = automation.enabled
      ? `/api/v1/workflows/${automationId}/deactivate`
      : `/api/v1/workflows/${automationId}/activate`;

    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.success === false) return;

      setWorkspaces((prev) =>
        prev.map((w) => {
          if (w.id !== ws.id) return w;
          const updated = {
            ...w,
            automations: w.automations.map((a) =>
              a.id === automationId ? { ...a, enabled: !a.enabled } : a
            ),
          };
          setWs(updated);
          return updated;
        })
      );
    } catch (e) {
      console.error("Toggle automation error:", e);
    } finally {
      setToggleLoading(null);
    }
  };

  const industryPreset = ws ? getIndustryPreset(ws.industry) : null;

  return (
    <DashboardContext.Provider value={{
      user, workspaces, ws, setWs, roiMetrics, integrations, waStatus, contacts, industryPreset,
      loadingData, loadError, isDeployingAgent, webhookActive, fastApiOnline, toggleAutomation, toggleLoading
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
