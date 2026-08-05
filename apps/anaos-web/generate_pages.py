import os

pages = [
    ("approvals", "ApprovalsPage"),
    ("contacts", "ContactsHub"),
    ("bookings", "BookingsHub"),
    ("templates", "TemplatesHub"),
    ("automations", "GithubAutomationHistory"),
    ("broadcasts", "BroadcastsHub"),
    ("calls", "CallsPage"),
    ("voice_agent", "VoiceAgentHub"),
    ("ai_agent", "AnaosAIHub"),
    ("analytics", "GithubPerformanceInsights"),
    ("team", "TeamSettingsPage"),
    ("integrations", "IntegrationsPage"), # Special case for integrations
]

for folder, component in pages:
    dir_path = f"src/app/dashboard/{folder}"
    os.makedirs(dir_path, exist_ok=True)
    
    # We will assume that the component takes { ws } for now, except if we need more props later.
    content = f""""use client";

import React from "react";
import Component from "@/components/dashboard/{component}";
import {{ useDashboard }} from "@/lib/context/DashboardContext";

export default function {folder.capitalize()}Route() {{
  const {{ ws, user, industryPreset }} = useDashboard();
  
  if (!ws) return null;
  
  return <Component ws={{ws}} user={{user}} preset={{industryPreset}} />;
}}
"""
    # Special fix for Integrations since it might not have a page yet
    if component == "IntegrationsPage":
         content = f""""use client";

import React from "react";
import {{ useDashboard }} from "@/lib/context/DashboardContext";

export default function IntegrationsRoute() {{
  const {{ ws, user }} = useDashboard();
  
  if (!ws) return null;
  
  return <div className="p-6">Integrations Hub</div>;
}}
"""

    with open(f"{dir_path}/page.tsx", "w", encoding="utf-8") as f:
        f.write(content)
        
print("Pages generated.")
