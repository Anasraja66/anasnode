"use client";

import React, { useState } from "react";
import { DashboardProvider, useDashboard } from "@/lib/context/DashboardContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { IndustryShell } from "@/components/dashboard/IndustryShell";
import { Loader2, Activity } from "lucide-react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { ws, workspaces, loadingData, loadError, isDeployingAgent, industryPreset } = useDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loadingData || isDeployingAgent) {
    return (
      <div className="flex h-screen w-full bg-[#F5F5F5] items-center justify-center flex-col gap-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[100px] animate-pulse" />
        </div>
        <div className="z-10 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-zinc-100 flex flex-col items-center max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-blue-50 text-[#0A6BFF] rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-100/50">
            {isDeployingAgent ? <Activity className="w-8 h-8 animate-bounce" /> : <Loader2 className="w-8 h-8 animate-spin" />}
          </div>
          {isDeployingAgent && (
            <>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">Deploying Your AI Agent...</h2>
              <p className="text-[13px] text-zinc-500 font-medium mb-8">
                We are building your workspace and wiring up your automations to the AI engine.
              </p>
            </>
          )}
          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#0A6BFF] w-2/3 rounded-full animate-pulse transition-all duration-1000 ease-in-out" />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-screen bg-[#F5F5F5] items-center justify-center p-6">
        <div className="max-w-md text-center space-y-3">
          <p className="text-[15px] font-medium text-zinc-900">{loadError}</p>
          <button type="button" onClick={() => window.location.reload()} className="h-9 px-4 rounded-md bg-[#0A6BFF] hover:bg-blue-600 text-white shadow-sm text-[13px] font-medium">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!ws || workspaces.length === 0) {
    return (
      <div className="flex h-screen bg-[#F5F5F5] items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-zinc-900">No automation yet</h1>
          <p className="text-zinc-500 mt-2 text-[15px]">
            Describe your business on the home page or finish onboarding — Anaos will compile your first workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <a href="/" className="px-5 py-2.5 rounded-xl bg-[#0A6BFF] text-white font-semibold text-[14px]">Create with prompt</a>
            <a href="/onboarding" className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white font-semibold text-[14px]">Finish setup</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <IndustryShell preset={industryPreset!}>
      <div className="flex h-screen bg-white overflow-hidden font-sans relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#00B0FF] opacity-[0.05] blur-[120px]" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#3B82F6] opacity-[0.05] blur-[120px]" />
        </div>

        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-200" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="dashboard-shell flex-1 flex flex-col overflow-hidden min-w-0 bg-transparent relative z-10">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F8F9FA]">
            {children}
          </main>
        </div>
      </div>
    </IndustryShell>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
