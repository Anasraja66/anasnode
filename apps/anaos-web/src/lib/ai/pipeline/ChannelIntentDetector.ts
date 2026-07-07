/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ChannelIntentDetector.ts — Anaos Channel & Mode Intent Classifier
 *
 * Industry detect hone ke BAAD ye decide karta hai:
 *   "User KAISE kaam karna chahta hai?"
 *
 * Possible Intents:
 *   - "calling"    → Cold calling, follow-up calls, AI voice agent
 *   - "messaging"  → WhatsApp chat, Instagram DM, inbox management
 *   - "broadcast"  → Bulk messages, campaigns, announcements
 *   - "booking"    → Appointment, meeting, schedule
 *   - "both"       → Messaging + Calling dono
 *
 * Supports: English + Roman Urdu + mixed prompts
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ChannelIntent =
  | "calling"
  | "messaging"
  | "broadcast"
  | "booking"
  | "both"
  | "general";

export interface ChannelIntentResult {
  intent: ChannelIntent;
  confidence: number; // 0–100
  primaryChannel: "voice" | "whatsapp" | "mixed" | "calendar";
  automationType: "cold_call" | "inbound_chat" | "bulk_broadcast" | "appointment" | "full_os";
  suggestedAutomations: string[];
  dashboardRoute: "/dashboard/calls" | "/dashboard/inbox" | "/dashboard/broadcasts" | "/dashboard/calendar" | "/dashboard";
  explanation: string; // Human-readable reason
}

// ── Keyword Signal Tables ─────────────────────────────────────────────────────
// Each entry: [keyword, weight]
// Higher weight = stronger signal for that intent

const CALLING_SIGNALS: [string, number][] = [
  // English
  ["cold call", 4.0], ["cold calling", 4.0], ["outbound call", 3.5],
  ["phone call", 3.0], ["calling", 2.5], ["call karna", 3.0],
  ["voice agent", 3.5], ["voice bot", 3.5], ["ai call", 3.5],
  ["dial", 2.0], ["ring", 1.5], ["vapi", 3.0], ["twilio", 2.5],
  ["elevenlabs", 3.0], ["eleven labs", 3.0], ["voice", 2.0],
  ["missed call", 3.0], ["callback", 2.5], ["follow up call", 3.0],
  ["outreach", 2.0], ["prospect call", 3.0],
  // Roman Urdu
  ["calling krni", 4.0], ["call krna", 3.5], ["call kro", 3.0],
  ["call lagao", 3.0], ["phone krna", 3.0], ["cold call krna", 4.0],
  ["calling chahiye", 3.5], ["call chahiye", 3.0], ["voice call", 3.5],
  ["owners ko call", 4.0], ["call wala", 3.0], ["calling wala", 3.0],
  ["number chahiye", 2.5], ["number lena", 2.5],
];

const MESSAGING_SIGNALS: [string, number][] = [
  // English
  ["whatsapp", 3.0], ["whatsapp bot", 3.5], ["whatsapp agent", 3.5],
  ["instagram", 2.5], ["instagram dm", 3.0], ["facebook", 2.5],
  ["messenger", 2.5], ["chat", 2.0], ["message", 2.0], ["inbox", 2.5],
  ["reply", 2.0], ["auto reply", 3.0], ["chatbot", 3.0], ["dm", 2.5],
  ["text", 1.5], ["sms", 2.0], ["conversation", 2.0],
  // Roman Urdu
  ["whatsapp pe", 3.5], ["message karna", 3.0], ["message krna", 3.0],
  ["whatsapp se", 3.5], ["chat bot", 3.0], ["message agent", 3.0],
  ["whatsapp agent", 3.5], ["inbox manage", 3.0], ["reply karna", 2.5],
  ["message answer", 2.5], ["auto message", 3.0],
];

const BROADCAST_SIGNALS: [string, number][] = [
  // English
  ["broadcast", 4.0], ["bulk message", 4.0], ["bulk send", 3.5],
  ["campaign", 3.5], ["mass message", 4.0], ["bulk whatsapp", 4.0],
  ["send to all", 3.0], ["announce", 2.5], ["newsletter", 2.5],
  ["blast", 3.0], ["marketing message", 3.0], ["promotional", 2.5],
  ["segment", 2.0], ["all contacts", 3.0],
  // Roman Urdu
  ["bulk ma message", 4.0], ["bulk message krna", 4.0], ["sab ko message", 4.0],
  ["broadcasting", 4.0], ["broadcast karna", 4.0], ["sab ko bhejno", 3.5],
  ["mass mssg", 3.5], ["bulk mssg", 3.5], ["tamam contacts", 3.0],
  ["campaign chalana", 3.5], ["owners ko message", 3.0],
];

const BOOKING_SIGNALS: [string, number][] = [
  // English
  ["appointment", 3.5], ["booking", 3.5], ["schedule", 3.0],
  ["meeting", 3.5], ["calendar", 3.0], ["slot", 2.5],
  ["book a call", 3.5], ["book meeting", 4.0], ["demo", 2.5],
  ["google calendar", 3.5], ["calendly", 3.0], ["reservation", 3.0],
  // Roman Urdu
  ["meeting book", 4.0], ["appointment lena", 3.5], ["meeting chahiye", 3.5],
  ["schedule karna", 3.0], ["booking karna", 3.5], ["time dena", 2.5],
  ["slot lena", 3.0], ["milna", 2.0], ["demo lena", 3.0],
];

// ── Scoring Engine ────────────────────────────────────────────────────────────

function scoreSignals(text: string, signals: [string, number][]): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const [keyword, weight] of signals) {
    if (lower.includes(keyword.toLowerCase())) {
      score += weight;
    }
  }
  return score;
}

// ── Automation Suggestions per Intent ────────────────────────────────────────

const INTENT_AUTOMATIONS: Record<ChannelIntent, string[]> = {
  calling: [
    "AI Cold Calling Agent",
    "Missed Call Auto Callback",
    "Call Transcript → CRM Update",
    "Post-Call WhatsApp Follow-up",
    "Meeting Booker After Call",
  ],
  messaging: [
    "WhatsApp AI Chat Agent",
    "Instagram DM Bot",
    "Inbound Lead Qualifier",
    "Auto-Reply 24/7",
    "Human Handoff Trigger",
  ],
  broadcast: [
    "Bulk WhatsApp Broadcaster",
    "Audience Segmentation Engine",
    "Campaign Scheduler",
    "Opt-Out Manager",
    "Campaign Analytics Tracker",
  ],
  booking: [
    "Meeting Booking Bot",
    "Google Calendar Sync",
    "Appointment Reminder",
    "Viewing Slot Manager",
    "No-Show Follow-Up",
  ],
  both: [
    "AI Cold Calling Agent",
    "WhatsApp AI Chat Agent",
    "Call → WhatsApp Follow-up",
    "Unified Inbox Monitor",
    "Lead Qualification Pipeline",
  ],
  general: [
    "WhatsApp AI Agent",
    "Lead Qualifier",
    "Auto-Reply Bot",
    "CRM Contact Manager",
    "Broadcast Messenger",
  ],
};

// ── Main Detector ─────────────────────────────────────────────────────────────

export class ChannelIntentDetector {
  /**
   * Detect what channel/mode the user wants from their prompt.
   *
   * Steps:
   * 1. Score prompt against each intent's keyword signals
   * 2. Pick winner (highest score)
   * 3. If calling + messaging both high → "both"
   * 4. Return structured result with routing info
   */
  static detect(prompt: string): ChannelIntentResult {
    const callingScore  = scoreSignals(prompt, CALLING_SIGNALS);
    const messagingScore = scoreSignals(prompt, MESSAGING_SIGNALS);
    const broadcastScore = scoreSignals(prompt, BROADCAST_SIGNALS);
    const bookingScore  = scoreSignals(prompt, BOOKING_SIGNALS);

    const total = callingScore + messagingScore + broadcastScore + bookingScore || 1;

    // "both" condition: calling AND messaging both have strong signals
    const isBoth = callingScore >= 2.5 && messagingScore >= 2.5;

    let intent: ChannelIntent;
    let confidence: number;

    if (isBoth) {
      intent = "both";
      confidence = Math.round(((callingScore + messagingScore) / (total * 2)) * 100);
    } else {
      const scores: [ChannelIntent, number][] = [
        ["calling",   callingScore],
        ["messaging", messagingScore],
        ["broadcast", broadcastScore],
        ["booking",   bookingScore],
      ];
      scores.sort((a, b) => b[1] - a[1]);
      const [topIntent, topScore] = scores[0];

      if (topScore < 1.5) {
        // No strong signal — default to messaging (most common)
        intent = "general";
        confidence = 50;
      } else {
        intent = topIntent;
        confidence = Math.min(99, Math.round((topScore / total) * 100) + 40);
      }
    }

    return buildResult(intent, confidence);
  }
}

function buildResult(intent: ChannelIntent, confidence: number): ChannelIntentResult {
  const map: Record<ChannelIntent, Omit<ChannelIntentResult, "intent" | "confidence" | "suggestedAutomations">> = {
    calling: {
      primaryChannel:   "voice",
      automationType:   "cold_call",
      dashboardRoute:   "/dashboard/calls",
      explanation:      "User wants AI-powered outbound phone calls (cold calling / follow-ups)",
    },
    messaging: {
      primaryChannel:   "whatsapp",
      automationType:   "inbound_chat",
      dashboardRoute:   "/dashboard/inbox",
      explanation:      "User wants WhatsApp/Instagram AI chat agent for inbound messages",
    },
    broadcast: {
      primaryChannel:   "whatsapp",
      automationType:   "bulk_broadcast",
      dashboardRoute:   "/dashboard/broadcasts",
      explanation:      "User wants to send bulk WhatsApp messages to contacts (campaign)",
    },
    booking: {
      primaryChannel:   "calendar",
      automationType:   "appointment",
      dashboardRoute:   "/dashboard/calendar",
      explanation:      "User wants to automate meeting/appointment booking",
    },
    both: {
      primaryChannel:   "mixed",
      automationType:   "full_os",
      dashboardRoute:   "/dashboard",
      explanation:      "User wants both AI calling + WhatsApp messaging (full pipeline)",
    },
    general: {
      primaryChannel:   "whatsapp",
      automationType:   "inbound_chat",
      dashboardRoute:   "/dashboard/inbox",
      explanation:      "General automation request — defaulting to WhatsApp AI agent",
    },
  };

  return {
    intent,
    confidence,
    suggestedAutomations: INTENT_AUTOMATIONS[intent],
    ...map[intent],
  };
}
