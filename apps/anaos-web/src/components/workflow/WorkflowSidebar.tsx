import React from 'react';
import BrandIcon from "@/components/ui/BrandIcon";
import { Zap, Mail, Bot, Clock } from "lucide-react";

export function WorkflowSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, appData: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, data: appData }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const apps = [
    { id: 'whatsapp', name: 'WhatsApp', type: 'trigger', icon: <BrandIcon id="whatsapp" className="w-5 h-5" />, desc: 'On new message' },
    { id: 'schedule', name: 'Schedule', type: 'trigger', icon: <Clock className="w-5 h-5 text-purple-500" />, desc: 'Run at a specific time' },
    { id: 'webhook', name: 'Webhook', type: 'trigger', icon: <Zap className="w-5 h-5 text-orange-500" />, desc: 'Catch HTTP hook' },
    
    { id: 'openai', name: 'OpenAI', type: 'action', icon: <BrandIcon id="openai" className="w-5 h-5" />, desc: 'Generate response' },
    { id: 'hubspot', name: 'HubSpot', type: 'action', icon: <BrandIcon id="hubspot" className="w-5 h-5" />, desc: 'Create/Update Contact' },
    { id: 'slack', name: 'Slack', type: 'action', icon: <BrandIcon id="slack" className="w-5 h-5" />, desc: 'Send channel message' },
    { id: 'email', name: 'Email', type: 'action', icon: <Mail className="w-5 h-5 text-blue-500" />, desc: 'Send email' },
  ];

  return (
    <aside className="w-[300px] border-r border-zinc-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-zinc-200">
        <h3 className="font-bold text-zinc-900">Blocks Palette</h3>
        <p className="text-[13px] text-zinc-500">Drag and drop nodes onto the canvas.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Triggers Section */}
        <div>
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Triggers</div>
          <div className="space-y-2">
            {apps.filter(a => a.type === 'trigger').map(app => (
              <div
                key={app.id}
                className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-100 rounded-xl cursor-grab hover:border-green-200 hover:bg-green-50 transition-colors"
                onDragStart={(event) => onDragStart(event, 'customNode', { label: app.name, type: 'trigger', app: app.id, description: app.desc })}
                draggable
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center">
                  {app.icon}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-zinc-900">{app.name}</div>
                  <div className="text-[11px] text-zinc-500">{app.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Section */}
        <div>
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Actions</div>
          <div className="space-y-2">
            {apps.filter(a => a.type === 'action').map(app => (
              <div
                key={app.id}
                className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-100 rounded-xl cursor-grab hover:border-blue-200 hover:bg-blue-50 transition-colors"
                onDragStart={(event) => onDragStart(event, 'customNode', { label: app.name, type: 'action', app: app.id, description: app.desc })}
                draggable
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center">
                  {app.icon}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-zinc-900">{app.name}</div>
                  <div className="text-[11px] text-zinc-500">{app.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
