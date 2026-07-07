export type GeneratedAutomation = {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  runs: number;
  lastRun: string;
  description?: string;
};

export type GeneratedVariable = {
  key: string;
  value: string;
  confidence: number;
  ttl: string;
};

import { normalizeIndustryLabel } from "@/lib/industry/presets";
import { AnaosNLP } from "@/lib/ai/pipeline/AnaosNLP";
import { DecisionEngine } from "@/lib/ai/pipeline/DecisionEngine";
import { NeuralClassifier } from "@/lib/ai/pipeline/NeuralEmbedding";
import { FeedbackLearner } from "@/lib/ai/pipeline/FeedbackLearner";
import { Autoencoder } from "@/lib/ai/pipeline/Autoencoder";
import { ChannelIntentDetector, ChannelIntentResult } from "@/lib/ai/pipeline/ChannelIntentDetector";

export type GeneratedWorkspace = {
  id: string;
  name: string;
  industry: string;
  slug: string;
  status: "draft" | "live";
  version: number;
  automations: GeneratedAutomation[];
  variables: GeneratedVariable[];
  // ── Channel Intent (what user wants to DO) ──
  intentType: ChannelIntentResult["intent"];
  primaryChannel: ChannelIntentResult["primaryChannel"];
  automationType: ChannelIntentResult["automationType"];
  dashboardRoute: ChannelIntentResult["dashboardRoute"];
  channelConfidence: number;
  channelExplanation: string;
};

// ── Helper: Extract business name from prompt ─────────────────────────────────
function extractName(prompt: string): string | null {
  const match = prompt.match(
    /(?:named|called|name is|brand is)\s+([A-Za-z0-9\s'&]+?)(?:\s*\.|$)/i
  );
  if (match?.[1]) return match[1].trim();

  const altMatch = prompt.match(
    /(?:run|own|manage)\s+(?:a|an)\s+([A-Za-z0-9\s'&]+?)(?:\s+(?:brokerage|restaurant|clinic|gym|salon|shop|store|business|brand))/i
  );
  if (altMatch?.[1]) {
    const word = altMatch[1].trim();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  return null;
}

// ── Helper: Extract money amount from prompt ──────────────────────────────────
function extractAmount(prompt: string): string | null {
  const match = prompt.match(
    /(\$|£|€|aed|rs)?\s*([0-9]+(?:\.[0-9]+)?\s*(k|m|million|billion)?)/i
  );
  return match ? match[0].trim().toUpperCase() : null;
}

// ── Helper: Infer automation channel type from name ───────────────────────────
function inferAutomationType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("whatsapp")) return "whatsapp_flow";
  if (lower.includes("instagram")) return "instagram_flow";
  if (lower.includes("facebook")) return "facebook_flow";
  if (
    lower.includes("schedule") ||
    lower.includes("reminder") ||
    lower.includes("appointment")
  )
    return "calendar";
  if (
    lower.includes("broadcast") ||
    lower.includes("campaign") ||
    lower.includes("alert")
  )
    return "campaign";
  return "whatsapp_flow";
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * generateWorkspaceFromPrompt — Deep Learning Powered Fallback
 *
 * 5-Stage Deep Learning Pipeline (no API key required):
 *   Stage 0 — Autoencoder       : Spam / anomaly detection (BLOCK bad prompts)
 *   Stage 1 — Traditional NLP   : POS tagging, NER, Intent extraction
 *   Stage 2 — Neural Embeddings : Cosine similarity + Softmax classification
 *   Stage 3 — Feedback Learning : Reinforcement boost from past user signals
 *   Stage 4 — Workspace Build   : Assemble automations + variables from results
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function generateWorkspaceFromPrompt(prompt: string): GeneratedWorkspace {
  // ── Stage 0: Autoencoder — Anomaly / Spam Detection ──────────────────────
  // Encode → Decode → Measure reconstruction error
  // High error = prompt is gibberish / spam / injection attack
  const aeResult = Autoencoder.analyze(prompt);

  // If spam detected, return a safe minimal workspace
  if (aeResult.isAnomaly) {
    return {
      id: `ws-blocked-${Date.now()}`,
      name: "Invalid Prompt Detected",
      industry: "Unknown",
      slug: "invalid-prompt",
      status: "draft",
      version: 1,
      automations: [],
      variables: [
        {
          key: "ANOMALY_DETECTED",
          value: "true",
          confidence: 100,
          ttl: "session",
        },
        {
          key: "REJECTION_REASON",
          value: aeResult.reason,
          confidence: 100,
          ttl: "session",
        },
        {
          key: "RECONSTRUCTION_ERROR",
          value: `${aeResult.reconstructionError}`,
          confidence: 100,
          ttl: "session",
        },
      ],
    };
  }

  // ── Stage 1: Traditional NLP ──────────────────────────────────────────────
  const nlpResult = AnaosNLP.processText(prompt, "general" as any);
  const action = DecisionEngine.determineAction(nlpResult);

  // ── Stage 2: Neural Embedding Classification ──────────────────────────────
  const neuralResult = NeuralClassifier.classify(prompt);

  // ── Stage 3: Feedback Learning Boost ─────────────────────────────────────
  const promptWords = prompt
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const learningBoost = FeedbackLearner.getLearningBoost(
    promptWords,
    neuralResult.industry
  );

  // Combined confidence: neural score + reinforcement learning signal
  const finalConfidence = Math.min(
    1,
    neuralResult.confidence + learningBoost * 0.1
  );

  // ── Stage 4: Build Workspace ──────────────────────────────────────────────
  const businessName =
    extractName(prompt) ||
    `${neuralResult.emoji} ${neuralResult.label} Workspace`;

  const automations: GeneratedAutomation[] = neuralResult.automations.map(
    (name, i) => ({
      id: `a-neural-${i + 1}`,
      name,
      description: prompt,
      type: inferAutomationType(name),
      enabled: i < 3, // top 3 auto-enabled
      runs: 0,
      lastRun: "Never",
    })
  );

  const variables: GeneratedVariable[] = [
    {
      key: "INDUSTRY_CONFIDENCE",
      value: `${Math.round(finalConfidence * 100)}%`,
      confidence: Math.round(finalConfidence * 100),
      ttl: "session",
    },
    {
      key: "DETECTED_INDUSTRY",
      value: neuralResult.label,
      confidence: neuralResult.confidencePct,
      ttl: "30 days",
    },
    {
      key: "CUSTOMER_ACTION",
      value: action,
      confidence: 88,
      ttl: "30 days",
    },
  ];

  // Add budget if detected by NER
  const amount = extractAmount(prompt);
  if (amount) {
    variables.push({
      key: "BUDGET_DETECTED",
      value: amount,
      confidence: 95,
      ttl: "30 days",
    });
  }

  // Add location if NER found one
  if (nlpResult.summary.locations.length > 0) {
    variables.push({
      key: "LOCATION",
      value: nlpResult.summary.locations[0],
      confidence: 90,
      ttl: "30 days",
    });
  }

  // Add Autoencoder confidence variable (shows prompt quality score)
  variables.push({
    key: "PROMPT_QUALITY",
    value: `${aeResult.confidence}% — ${aeResult.reason}`,
    confidence: aeResult.confidence,
    ttl: "session",
  });

  // Always ensure Meta channels exist
  const hasIg = automations.some((a) => a.type === "instagram_flow");
  const hasFb = automations.some((a) => a.type === "facebook_flow");
  if (!hasIg)
    automations.push({
      id: "a-meta-ig",
      name: "Instagram DM Assistant",
      type: "instagram_flow",
      enabled: true,
      runs: 0,
      lastRun: "Never",
    });
  if (!hasFb)
    automations.push({
      id: "a-meta-fb",
      name: "Facebook Messenger Bot",
      type: "facebook_flow",
      enabled: true,
      runs: 0,
      lastRun: "Never",
    });

  // ── Stage 5: Remember this valid prompt in Autoencoder memory ─────────────
  Autoencoder.remember(prompt, neuralResult.industry);

  // ── Stage 6: Channel Intent Detection ────────────────────────────────────
  const channelIntent = ChannelIntentDetector.detect(prompt);

  // Merge channel-specific automations with industry automations
  const mergedAutomations = [
    ...automations,
    ...channelIntent.suggestedAutomations
      .filter(name => !automations.some(a => a.name === name))
      .map((name, i) => ({
        id: `a-ch-${i + 1}`,
        name,
        description: `Auto-generated from intent: ${channelIntent.intent}`,
        type: channelIntent.primaryChannel === "voice" ? "voice_flow" : "whatsapp_flow",
        enabled: i < 2,
        runs: 0,
        lastRun: "Never",
      })),
  ];

  return {
    id: `ws-custom-${Date.now()}`,
    name: businessName,
    industry: neuralResult.label,
    slug: (businessName || "workspace")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    status: "draft",
    version: 1,
    automations: mergedAutomations,
    variables,
    intentType: channelIntent.intent,
    primaryChannel: channelIntent.primaryChannel,
    automationType: channelIntent.automationType,
    dashboardRoute: channelIntent.dashboardRoute,
    channelConfidence: channelIntent.confidence,
    channelExplanation: channelIntent.explanation,
  };
}


/**
 * ─────────────────────────────────────────────────────────────────────────────
 * generateWorkspaceWithAI — Grok LLM + Deep Learning Context Injection
 *
 * We run our NLP pipeline FIRST, then inject the results into the LLM prompt.
 * This is "Chain-of-Thought" prompting — giving the model pre-computed context.
 * Temperature 0.3 = focused output (like a fine-tuned model).
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function generateWorkspaceWithAI(
  prompt: string
): Promise<GeneratedWorkspace | null> {
  if (!process.env.GROQ_API_KEY) return null;

  // Run neural classification first to give Grok context
  const neuralResult = NeuralClassifier.classify(prompt);
  const nlpResult = AnaosNLP.processText(prompt, "general" as any);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are Anaos AI — an expert business automation architect.

Your task: Analyze a business description and design the PERFECT automation workspace.

## Pre-Analysis (from our Neural NLP engine):
- Detected Industry: ${neuralResult.label} (${neuralResult.confidencePct}% confidence)
- User Intent: ${nlpResult.intent}
- Sentiment: ${nlpResult.sentiment}
- Key Entities: ${JSON.stringify(nlpResult.summary)}

## Think Step by Step (Chain-of-Thought):
1. IDENTIFY the exact business type and its core daily operations
2. FIND the 3 biggest pain points for this business
3. DESIGN automations that directly solve those pain points
4. PRIORITIZE by ROI (highest impact automations first)
5. NAME variables this business actually tracks day-to-day

## Output (ONLY valid JSON, zero markdown):
{
  "name": "Business Name",
  "industry": "Industry Label",
  "automations": [
    {"id":"a1","name":"Specific Name","type":"whatsapp_flow|instagram_flow|facebook_flow|calendar|campaign","enabled":true,"runs":0,"lastRun":"Never"}
  ],
  "variables": [
    {"key":"UPPER_SNAKE_CASE","value":"value","confidence":90,"ttl":"30 days"}
  ]
}

Rules:
- 5-7 automations ordered by business impact
- 3-5 variables specific to THIS business type
- Automation names must be specific (e.g. "Pizza Order Tracker" not "Order Bot")
- No markdown, no text outside JSON`,
            },
            {
              role: "user",
              content: `Business Description: "${prompt}"`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const name = parsed.name || "Custom Workspace";

    const automations: GeneratedAutomation[] = parsed.automations || [];
    const hasIg = automations.some(
      (a: GeneratedAutomation) => a.type === "instagram_flow"
    );
    const hasFb = automations.some(
      (a: GeneratedAutomation) => a.type === "facebook_flow"
    );
    if (!hasIg)
      automations.push({
        id: "a-meta-ig",
        name: "Instagram DM Assistant",
        type: "instagram_flow",
        enabled: true,
        runs: 0,
        lastRun: "Never",
      });
    if (!hasFb)
      automations.push({
        id: "a-meta-fb",
        name: "Facebook Messenger Bot",
        type: "facebook_flow",
        enabled: true,
        runs: 0,
        lastRun: "Never",
      });

    const variables: GeneratedVariable[] = parsed.variables || [];
    // Prepend neural confidence score for transparency
    variables.unshift({
      key: "AI_CONFIDENCE",
      value: `${neuralResult.confidencePct}% (${neuralResult.label})`,
      confidence: neuralResult.confidencePct,
      ttl: "session",
    });

    // Channel intent detection for AI path
    const channelIntent = ChannelIntentDetector.detect(prompt);

    return {
      id: `ws-custom-${Date.now()}`,
      name,
      industry: parsed.industry || neuralResult.label,
      slug: (name || "workspace")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      status: "draft",
      version: 1,
      automations,
      variables,
      intentType: channelIntent.intent,
      primaryChannel: channelIntent.primaryChannel,
      automationType: channelIntent.automationType,
      dashboardRoute: channelIntent.dashboardRoute,
      channelConfidence: channelIntent.confidence,
      channelExplanation: channelIntent.explanation,
    };
  } catch {
    return null;
  }
}

/**
 * Main resolver — tries AI first, falls back to deep learning pipeline
 */
export async function resolveWorkspaceFromPrompt(
  prompt: string
): Promise<GeneratedWorkspace> {
  const ai = await generateWorkspaceWithAI(prompt);
  const ws = ai ?? generateWorkspaceFromPrompt(prompt);

  // Force Meta channels
  const hasIg = ws.automations.some((a) => a.type === "instagram_flow");
  const hasFb = ws.automations.some((a) => a.type === "facebook_flow");
  if (!hasIg)
    ws.automations.push({
      id: "a-meta-ig",
      name: "Instagram DM Assistant",
      type: "instagram_flow",
      enabled: true,
      runs: 0,
      lastRun: "Never",
    });
  if (!hasFb)
    ws.automations.push({
      id: "a-meta-fb",
      name: "Facebook Messenger Bot",
      type: "facebook_flow",
      enabled: true,
      runs: 0,
      lastRun: "Never",
    });

  return { ...ws, industry: normalizeIndustryLabel(ws.industry) };
}
