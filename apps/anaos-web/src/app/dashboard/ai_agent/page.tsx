"use client";

import React from "react";
import Component from "@/components/dashboard/AnaosAIHub";
import { useDashboard } from "@/lib/context/DashboardContext";

export default function Ai_agentRoute() {
  const { ws, user, industryPreset } = useDashboard();
  
  if (!ws) return null;
  
  return <Component ws={ws} user={user} preset={industryPreset} />;
}
