"use client";

import { ArrowUpRight, ArrowDownRight, Database, Mail, Terminal, Calendar, Code, Shield } from "lucide-react";

type Template = {
  name: string;
  tag: string;
  renderGraphic: () => React.ReactNode;
};

const TEMPLATES: Template[] = [
  {
    name: "CRM & Lead Router",
    tag: "Qualify leads, segment users & sync to HubSpot/Salesforce",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#1C1F1A]">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
          alt="CRM Router"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale contrast-125 transition-transform duration-500 group-hover:scale-105"
        />
        {/* CRM Message Bubble Overlay */}
        <div className="absolute inset-0 bg-black/45 flex flex-col justify-between p-4">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-[8px] font-mono tracking-widest uppercase">DATABASES</span>
            <span className="bg-emerald-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5"><Database className="w-1.5 h-1.5" /> CRM SYNC</span>
          </div>
          <div className="my-auto flex items-center justify-center">
            <span className="text-white text-[13px] sm:text-[14px] tracking-[0.15em] font-serif uppercase text-center font-medium drop-shadow-md">
              LEAD SEGMENTER
            </span>
          </div>
          <div className="bg-white/95 backdrop-blur-[2px] p-2 rounded-lg shadow-sm border border-white/20 flex items-center justify-between">
            <span className="text-[8px] font-bold text-zinc-800">Lead: Enterprise · $50k ARR</span>
            <span className="text-[7px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Routed ➔ CRM</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Multi-Channel Dispatcher",
    tag: "Seamless broadcasts over WhatsApp, Email & SMS",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-gradient-to-tr from-[#0A6BFF] via-[#5200FF] to-[#FF007F] flex flex-col justify-between p-4 transition-transform duration-500 group-hover:scale-105">
        <div className="flex justify-between items-center relative z-10">
          <span className="text-white/70 text-[8px] font-mono tracking-widest uppercase">Omnichannel</span>
          <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
        </div>
        <div className="flex flex-col items-center justify-center text-center relative z-10 my-auto">
          <span className="text-white font-extrabold text-[16px] sm:text-[18px] tracking-tight">Broadcaster</span>
          <span className="text-[9px] text-blue-100/70 font-mono mt-1 font-semibold">anaos.ai/dispatch-core</span>
        </div>
        <div className="flex gap-1.5 justify-center relative z-10">
          <span className="bg-white/10 text-white text-[7px] px-1.5 py-0.5 rounded font-mono">WhatsApp</span>
          <span className="bg-white/10 text-white text-[7px] px-1.5 py-0.5 rounded font-mono">Email</span>
          <span className="bg-white/10 text-white text-[7px] px-1.5 py-0.5 rounded font-mono">SMS</span>
        </div>
      </div>
    ),
  },
  {
    name: "AI Knowledge Brain",
    tag: "Train custom neural agents on PDFs, docs & URLs",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#1A1A1A]">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80"
          alt="AI Brain"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/35 flex flex-col justify-between p-4">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-[8px] font-mono tracking-widest uppercase">NEURAL NET</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          </div>
          <div className="my-auto text-center">
            <span className="text-white text-[12px] sm:text-[13px] font-bold tracking-[0.1em] font-sans uppercase border-y border-white/20 py-1.5 px-3 bg-black/10 backdrop-blur-[2px]">
              KNOWLEDGE BASE
            </span>
          </div>
          <div className="bg-blue-600/90 text-white text-[8px] font-semibold py-1 px-2 rounded-md flex items-center justify-between">
            <span>Trained: Q1_Report.pdf</span>
            <span className="text-[7.5px] bg-blue-500 px-1 py-0.2 rounded font-bold font-mono">100% READY</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Abandoned Cart Recovery",
    tag: "Auto-trigger lost cart emails, messages & track revenue",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#FAF7F2] p-4 flex flex-col justify-between overflow-hidden transition-transform duration-500 group-hover:scale-105 select-none">
        <div className="flex justify-between items-center text-[7px] tracking-widest text-zinc-500 font-semibold">
          <span>ABANDONED RECOVERY</span>
          <span className="text-blue-600 font-bold">MONITORED</span>
        </div>
        <div className="my-auto text-left flex flex-col justify-center">
          <span className="text-[13px] sm:text-[14px] font-black text-zinc-800 uppercase leading-none mb-1">
            CART CONVERSION
          </span>
          <p className="text-[5.8px] leading-[1.3] text-zinc-500 max-w-[95%] font-medium my-1 font-mono">
            if (cart.status == "abandoned") {
              dispatch.personalDiscount(10);
            }
          </p>
          <span className="text-[5px] text-[#0A6BFF] font-mono tracking-widest uppercase font-bold mt-1">
            ➔ RECOVERED $12,480 THIS MONTH
          </span>
        </div>
        <div className="h-1 bg-zinc-200/60 rounded-full w-full overflow-hidden">
          <div className="bg-[#0A6BFF] h-full w-[75%]" />
        </div>
      </div>
    ),
  },
  {
    name: "Guest & RSVP Registrar",
    tag: "Manage registers, send dynamic invites & check-ins",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#FCF9F5] p-4 flex flex-col justify-between overflow-hidden transition-transform duration-500 group-hover:scale-105 select-none">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
          </div>
          <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-sm">
            <Calendar className="w-2.5 h-2.5 text-blue-600" />
          </div>
        </div>
        
        <div className="my-auto text-center flex flex-col items-center justify-center gap-1.5">
          <div className="text-[12px] font-extrabold text-zinc-800 tracking-tight leading-tight flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <span>Automated</span>
              <span className="bg-[#0A6BFF] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">RSVPs</span>
            </div>
            <div className="flex items-center gap-1">
              <span>over</span>
              <span className="border border-zinc-950 text-zinc-950 text-[9px] px-2 py-0.5 rounded-full font-bold">Any API</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-[6px] text-zinc-400 font-mono font-semibold">
          <span>Dispatched Invitation [Pass #28]</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </span>
        </div>
      </div>
    ),
  },
  {
    name: "Task Scheduler & Cron OS",
    tag: "Schedule triggers, recurrent healthchecks & database syncs",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#F4EFEB] p-3.5 flex flex-col justify-between overflow-hidden transition-transform duration-500 group-hover:scale-105 select-none">
        <div className="flex items-center justify-between border-b border-zinc-200/40 pb-1.5">
          <span className="text-[6.5px] font-bold text-zinc-400 font-mono tracking-wider">CRON SCHEDULER</span>
          <span className="text-[6.5px] font-bold text-emerald-600">ONLINE</span>
        </div>
        <div className="my-auto flex flex-col items-center text-center">
          <div className="w-[80px] h-[50px] rounded overflow-hidden shadow-[0_2px_5px_rgba(0,0,0,0.04)] border border-zinc-200/40 mb-1.5 relative">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80"
              className="w-full h-full object-cover"
              alt="Cron Charts"
            />
          </div>
          <p className="text-[9px] font-mono font-bold text-zinc-800 leading-tight">
            cron_job: active 🟢
          </p>
          <p className="text-[5.5px] text-zinc-500 max-w-[90%] mt-0.5 leading-[1.3] font-semibold">
            "Trigger database healthcheck every day at 00:00 UTC."
          </p>
        </div>
        <div className="h-1 bg-emerald-500/30 rounded-full w-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-[95%]" />
        </div>
      </div>
    ),
  },
  {
    name: "API & Webhook Gateway",
    tag: "Dispatch custom webhooks & integrate REST APIs instantly",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#ECE9E4]">
        <img
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
          alt="API Webhooks"
          className="absolute inset-0 w-full h-full object-cover opacity-75 grayscale contrast-110 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 flex items-end justify-center p-2.5">
          <div className="w-full bg-white/95 backdrop-blur-[2px] p-2 rounded shadow-sm border border-black/5 flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="text-[7.5px] font-bold text-zinc-800 tracking-tight leading-snug line-clamp-1">
                Webhook trigger: Stripe ➔ Slack
              </span>
              <span className="text-[6px] text-blue-600 font-semibold mt-0.5 uppercase tracking-wide">
                API Handshake 200 OK
              </span>
            </div>
            <ArrowUpRight className="w-2.5 h-2.5 text-zinc-700 shrink-0" />
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Automated Helpdesk Core",
    tag: "Resolve 90% of business FAQs with proprietary AI models",
    renderGraphic: () => (
      <div className="relative w-full h-full bg-[#EAE6DF] flex overflow-hidden transition-transform duration-500 group-hover:scale-105 select-none">
        <div className="w-1/2 h-full relative overflow-hidden border-r border-white/20">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
            className="w-full h-full object-cover contrast-105"
            alt="Customer Support Workspace"
          />
        </div>
        <div className="w-1/2 h-full relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80"
            className="w-full h-full object-cover contrast-105"
            alt="AI Helpdesk"
          />
        </div>
        <div className="absolute inset-0 bg-black/5 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-[3px] border border-black/5 px-2.5 py-1.5 rounded-md shadow-md flex flex-col items-center justify-center">
            <span className="text-[8px] font-mono font-extrabold tracking-[0.2em] text-zinc-950 uppercase leading-none">
              HELPDESK ACTIVE
            </span>
            <span className="text-[5.5px] text-[#0A6BFF] font-bold mt-1">✔ Auto-resolved 88% tickets</span>
          </div>
        </div>
      </div>
    ),
  },
];

export function Industries() {
  return (
    <section id="industries" className="py-20 sm:py-24 px-6 bg-white border-t border-zinc-100 z-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Header (Lovable Style) */}
        <div className="flex flex-row items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-[34px] sm:text-[42px] font-black text-[#111827] tracking-[-0.03em] leading-tight font-sans">
              Discover templates
            </h2>
            <p className="text-[15px] sm:text-[16px] text-zinc-500 mt-1 font-medium">
              Start your next workflow with a pre-built Automation OS template
            </p>
          </div>
          <button
            type="button"
            className="h-10 px-5.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-[13.5px] font-bold text-zinc-700 shadow-sm transition-all sm:self-center cursor-pointer shrink-0 active:scale-95"
          >
            View all
          </button>
        </div>

        {/* Templates 4-Column Grid (Lovable Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {TEMPLATES.map((tpl, i) => (
            <div key={i} className="group relative flex flex-col">
              
              {/* Media Card (aspect ratio 1.6/1) */}
              <div className="aspect-[1.6/1] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative transition-all duration-300 group-hover:shadow-md group-hover:border-zinc-300 flex items-center justify-center select-none">
                {tpl.renderGraphic()}
              </div>

              {/* Template Meta Information */}
              <div className="mt-3.5 flex flex-col">
                <h3 className="text-[14.5px] font-bold text-zinc-900 leading-snug group-hover:text-[#0A6BFF] transition-colors cursor-pointer">
                  {tpl.name}
                </h3>
                <p className="text-[12.5px] text-zinc-500 leading-relaxed font-semibold mt-0.5">
                  {tpl.tag}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
