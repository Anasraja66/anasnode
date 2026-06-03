# Anaos Product Roadmap

> **Vision:** Koi bhi business owner — bina developer, bina n8n/ManyChat — sirf prompt de, aur poora automation OS (WhatsApp, Meta, voice, CRM) khud ban jaye aur chale.

**Last updated:** June 2026  
**Current stage:** MVP foundation (auth, DB, workflow engine, landing generate, WhatsApp text webhook)

---

## North star (ek line)

**Prompt → Compiled automation graph → Live channels → Measurable runs** — sab Anaos ke andar, owner ko sirf prompt + approve + connect accounts.

---

## WhatsApp calling agent — rai (kya karna chahiye)

| Option | Kya hai | Pros | Cons | Anaos mein kab |
|--------|---------|------|------|----------------|
| **A. WhatsApp Business Calling (Meta)** | User WhatsApp se voice call kare, business answer kare | Same app, same number, owner ko “sab WhatsApp mein” feel | Meta approval, country limits, Business API tier, latency/quality setup | **Phase 3** — text agent stable ke baad |
| **B. Voice AI via phone (Twilio / Retell / Vapi)** | PSTN ya SIP call, Anaos brain same | Mature APIs, Retell-level quality abhi | Alag number, WhatsApp “andar” nahi — integration story chahiye | **Phase 2** — “Anaos Voice” branded |
| **C. Click-to-call + text agent** | Chat mein “Call karein” button → human ya callback queue | Fast ship, low risk | Poora “AI calling agent” nahi | **Phase 1.5** optional |

**Recommendation:**  
- **MVP:** Text WhatsApp agent pe focus (jo abhi 80% businesses use karti hain).  
- **Phase 2:** Anaos Voice layer — ek hi “business brain”, channels: WhatsApp text + phone voice (Twilio/Retell). Owner dashboard mein “Voice agent on/off” toggle.  
- **Phase 3:** Meta WhatsApp Calling jab account eligible ho — same Anaos persona, call transcript → CRM / Anamind variables.

**Calling agent ko headline mat banao jab tak text loop “prompt → live → reply” 24h reliable na ho** — warna do cheezen half-done lagengi.

---

## Architecture target (3 layers)

```
┌─────────────────────────────────────────────────────────┐
│  L1 — PROMPT STUDIO (owner-facing)                       │
│  Natural language + industry templates + “Approve plan”  │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│  L2 — COMPILER (Anaos brain)                             │
│  Prompt → Workflow graph + AI persona + variables        │
│        + channel bindings + credential requirements      │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│  L3 — RUNTIME (always-on)                                │
│  Webhooks → WorkflowExecutor → integrations → logs/CRM   │
└─────────────────────────────────────────────────────────┘
```

**Abhi gap:** L1→L2 strong (generate API), L2→L3 weak (webhook bypasses executor; dashboard mock-heavy).

---

## Phase 0 — Foundation hardening (2–3 weeks)

**Goal:** Ek account, ek workspace, text WhatsApp — production-trustworthy.

| # | Deliverable | Why |
|---|-------------|-----|
| 0.1 | **Tenant isolation** — har API `session.accountId`, mock `acc-default-user` hatao | Multi-business safe |
| 0.2 | **Prompt → DB workflow** — `/api/generate` output se `Workflow` create (nodes from templates) | “Automation ban gayi” real ho |
| 0.3 | **Webhook → WorkflowExecutor** — incoming WhatsApp `trigger_whatsapp` se graph chale | n8n-style engine actually use ho |
| 0.4 | **Activate from dashboard** — toggle → `POST .../activate` wired | Owner ko editor nahi, switch chahiye |
| 0.5 | **Dashboard = API only** — mock `WORKSPACES`/`CONTACTS` hatao, empty states | Trust |
| 0.6 | **Onboarding → first automation live** — onboarding ke baad 1 workflow auto-active + WhatsApp connect wizard | “Day 1 value” |
| 0.7 | Env + deploy doc — `GROQ`, Meta tokens, `ENCRYPTION_KEY`, `NEXTAUTH_SECRET` | Shippable |

**Success metric:** Naya signup → prompt → 15 min mein WhatsApp pe AI jawab (uske business context ke sath).

---

## Phase 1 — “No n8n” owner experience (4–6 weeks)

**Goal:** Owner ko nodes/edges kabhi na dikhein (optional “Advanced” mode baad mein).

| # | Deliverable | Details |
|---|-------------|---------|
| 1.1 | **Automation Plan UI** — generate ke baad: “Yeh 4 cheezen chalengi” list + Approve | Compiler output human-readable |
| 1.2 | **Channel connect hub** — WhatsApp, Instagram DM, Email (SMTP) step-by-step | Connection hub start |
| 1.3 | **Integration credentials UI** — dashboard se OpenAI/Groq/Meta save (encrypted) | Dev env keys nahi |
| 1.4 | **Anamind variables** — chat se extract → `anamind_set` → dashboard “Customer memory” | CRM-lite differentiator |
| 1.5 | **Templates by industry** — real estate, restaurant, clinic, ecommerce one-click | Faster than free prompt |
| 1.6 | **Runs & logs** — execution history, failed step reason | Owner debug bina dev |
| 1.7 | **Broadcasts v1** — segment + template message (WhatsApp policy safe) | ManyChat replacement slice |

**Success metric:** 10 non-technical owners onboard; 0 ne n8n khola; ≥3 automations/account active.

---

## Phase 2 — Multi-channel + Voice (6–8 weeks)

**Goal:** “Sab Anaos mein” — text channels + voice agent.

| # | Deliverable | Details |
|---|-------------|---------|
| 2.1 | **Instagram DM webhook** | `trigger_instagram` live |
| 2.2 | **Facebook Messenger** | Meta unified webhook pattern |
| 2.3 | **Google Calendar + booking nodes** | Scheduler automations real |
| 2.4 | **Shopify / HubSpot connectors** | E-commerce + CRM nodes wired |
| 2.5 | **Anaos Voice (V1)** — Twilio or Retell: inbound/outbound, same system prompt as WhatsApp | “Calling agent” productized |
| 2.6 | **Unified inbox** — WhatsApp + IG + voice transcripts ek timeline | Owner ek screen |
| 2.7 | **Human handoff** — AI → notify owner → takeover | Quality safety net |

**Voice stack suggestion:** Retell or Vapi (speed) + Twilio number; Anaos stores persona + tools; calls logged as `WorkflowExecution`.

**Success metric:** Voice + text same business; call → variable update → WhatsApp follow-up automatic.

---

## Phase 3 — WhatsApp Calling + scale (8+ weeks)

| # | Deliverable | Details |
|---|-------------|---------|
| 3.1 | **Meta WhatsApp Calling API** (where available) | Native in-app voice |
| 3.2 | **Multi-workspace / multi-location** | Franchises |
| 3.3 | **Team roles** — owner, agent, viewer | Agency model |
| 3.4 | **Billing** — usage (messages, AI tokens, voice minutes) | SaaS revenue |
| 3.5 | **Workflow version + rollback** | Safe changes after prompt edit |
| 3.6 | **Public API** — power users only | Enterprise |

---

## Phase 4 — “Anaos = tum jaisa” (long-term)

| Capability | Description |
|------------|-------------|
| **Prompt edit = recompile** | “Ab sirf AED 3M+ leads” → graph diff + confirm |
| **Self-healing** | Failed runs → suggest fix in plain Urdu/English |
| **Industry marketplace** | Pre-built automation packs |
| **White-label** | Agencies resell Anaos |
| **Compliance** | GDPR, opt-out, WhatsApp template approval assistant |

---

## Technical priorities (codebase — ordered)

1. `POST /api/generate` → `POST /api/v1/workflows/from-prompt` (create + optional activate)  
2. `webhooks/whatsapp` → enqueue → `WorkflowExecutor` (not raw Groq-only)  
3. Remove `acc-default-user` from all `v1` routes  
4. Dashboard: real data only + connect WhatsApp CTA  
5. Node implementations: `ai_respond`, `send_whatsapp`, `anamind_set`, `crm_update_contact` — 80% flows  
6. Scheduler for `wait` + `trigger_schedule`  
7. Voice adapter interface: `VoiceProvider` (Retell/Twilio/Meta) behind one executor hook  

---

## What NOT to build early (focus killers)

- Visual node editor (Phase 1 ke baad, “Advanced” only)  
- 50 integrations — pick 5 that 80% SMBs use  
- WhatsApp Calling before text reliability  
- Custom mobile app — PWA + Meta channels enough  

---

## KPIs by phase

| Phase | KPI |
|-------|-----|
| 0 | Time-to-first-reply < 30 min after signup |
| 1 | ≥60% weekly active workspaces with ≥1 run |
| 2 | Voice calls + WhatsApp unified; NPS from owners |
| 3 | Paid conversion; churn < 5% monthly |

---

## Suggested next sprint (agar abhi code shuru karna ho)

**Sprint 1 (10 days):**  
- [ ] `from-prompt` API + template compiler  
- [ ] WhatsApp webhook → executor  
- [ ] Tenant fix on v1 APIs  
- [ ] Dashboard mock removal + activate toggle  

**Sprint 2 (10 days):**  
- [ ] Connect WhatsApp wizard (Meta embed docs)  
- [ ] Credentials UI  
- [ ] Execution logs in dashboard  

---

## One-liner for investors / users

**Anaos:** Business owner ek prompt likhta hai — Anaos uske liye WhatsApp agent, automations, aur (jad) voice agent banata aur chalata hai. Automation engine ki jagah, developer ki jagah.
