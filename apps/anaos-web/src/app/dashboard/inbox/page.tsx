"use client";

import React from "react";
import InboxPageContent from "@/components/dashboard/InboxPage";
import { useDashboard } from "@/lib/context/DashboardContext";

export default function InboxPage() {
  const { ws } = useDashboard();
  
  if (!ws) return null;
  
  return <InboxPageContent ws={ws} />;
}
