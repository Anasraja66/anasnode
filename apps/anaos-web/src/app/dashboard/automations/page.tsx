"use client";

import React from "react";
import Component from "@/components/dashboard/GithubAutomationHistory";
import { useDashboard } from "@/lib/context/DashboardContext";

export default function AutomationsRoute() {
  const { ws, user, industryPreset } = useDashboard();
  
  if (!ws) return null;
  
  return <Component ws={ws} user={user} preset={industryPreset} />;
}
