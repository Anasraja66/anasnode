import { prisma } from "../db";
import { 
  NodeType, 
  WorkflowNode, 
  ExecutionContext, 
  NodeResult 
} from "./types";
import { executeLLMCompletion, resolveTemplate } from "./ai-client";
import { sendMetaTextMessage } from "@/lib/whatsapp/meta";

// CRITICAL LOOP PROTECTION CONSTANTS
const MAX_NODES_PER_EXECUTION = 100;
const MAX_EXECUTION_TIME_MS = 30000;
const MAX_SAME_NODE_VISITS = 3;

export class WorkflowExecutor {
  private nodeVisits: Record<string, number> = {};
  private startTime: number = 0;
  private totalExecuted: number = 0;

  async execute(workflowId: string, triggerData: any) {
    this.nodeVisits = {};
    this.startTime = Date.now();
    this.totalExecuted = 0;

    // 1. Load workflow
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }
    
    // Check for credits (workflows cost minimum 1 credit to run)
    const { hasEnoughCredits } = await import("@/lib/billing/credits");
    const hasCredits = await hasEnoughCredits(workflow.accountId, 1);

    if (!hasCredits) {
      // Create a failed execution record due to billing
      await prisma.workflowExecution.create({
        data: {
          workflowId,
          contactId: triggerData.contactId || null,
          status: "failed_insufficient_credits",
          input: JSON.stringify(triggerData),
          output: JSON.stringify({ error: "Insufficient AnaOS credits. Please upgrade your plan." })
        },
      });
      console.error(`Workflow ${workflowId} blocked: Insufficient credits for account ${workflow.accountId}`);
      return;
    }

    const nodes: WorkflowNode[] = JSON.parse(workflow.nodes);

    // 2. Create execution record
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        contactId: triggerData.contactId || null,
        status: "running",
        input: JSON.stringify(triggerData),
      },
    });

    // 3. Find trigger node
    const triggerNode = nodes.find(n => n.type.startsWith("trigger_"));
    if (!triggerNode) {
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "failed",
          logs: JSON.stringify([{
            type: "error",
            message: "No trigger node found in this workflow.",
            timestamp: Date.now()
          }]),
          finishedAt: new Date(),
          duration: 0,
        }
      });
      return;
    }

    // 4. Build execution context
    const ctx: ExecutionContext = {
      executionId: execution.id,
      workflowId,
      accountId: workflow.accountId,
      mode: workflow.mode,
      contactId: triggerData.contactId || null,
      variables: {},
      anamind: {},
      triggerData,
      logs: [],
    };

    // 5. Load AnasMind context for contact if available
    if (ctx.contactId) {
      // Simulate loading contact profile / context variables
      ctx.anamind = {
        name: triggerData.contactName || "Customer",
        phone: triggerData.contactPhone || "+1234567890",
      };
    }

    try {
      // 6. Execute nodes recursively starting from the trigger
      await this.executeNode(triggerNode, ctx, nodes);

      // 7. Save execution success state
      const duration = Date.now() - this.startTime;
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "success",
          output: JSON.stringify(ctx.variables),
          logs: JSON.stringify(ctx.logs),
          finishedAt: new Date(),
          duration,
        }
      });

      // Update workspace stats increment
      const currentStats = JSON.parse(workflow.stats || "{}");
      currentStats.runs = (currentStats.runs || 0) + 1;
      currentStats.success = (currentStats.success || 0) + 1;

      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          stats: JSON.stringify(currentStats),
          lastRunAt: new Date()
        }
      });

    } catch (error: any) {
      console.error("Workflow Execution failed:", error);
      const duration = Date.now() - this.startTime;
      
      const status = error.message.includes("LOOP_PROTECTION") ? "timeout" : "failed";

      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status,
          output: JSON.stringify(ctx.variables),
          logs: JSON.stringify([
            ...ctx.logs,
            {
              nodeId: "system",
              type: NodeType.TRIGGER_WEBHOOK,
              startedAt: Date.now(),
              status: "failed" as const,
              error: error.message
            }
          ]),
          finishedAt: new Date(),
          duration,
        }
      });

      // Update failed stats
      const currentStats = JSON.parse(workflow.stats || "{}");
      currentStats.runs = (currentStats.runs || 0) + 1;
      currentStats.failed = (currentStats.failed || 0) + 1;

      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          stats: JSON.stringify(currentStats),
          lastRunAt: new Date()
        }
      });
    }
  }

  async executeNode(node: WorkflowNode, ctx: ExecutionContext, nodes: WorkflowNode[]) {
    // ── LOOP PROTECTION CHECKS ──
    this.totalExecuted++;
    if (this.totalExecuted > MAX_NODES_PER_EXECUTION) {
      throw new Error("LOOP_PROTECTION: Capped at 100 executed nodes per run.");
    }

    const elapsed = Date.now() - this.startTime;
    if (elapsed > MAX_EXECUTION_TIME_MS) {
      throw new Error("LOOP_PROTECTION: Execution time exceeded 30 seconds limit.");
    }

    this.nodeVisits[node.id] = (this.nodeVisits[node.id] || 0) + 1;
    if (this.nodeVisits[node.id] > MAX_SAME_NODE_VISITS) {
      throw new Error(`LOOP_PROTECTION: Infinite cycle detected at node: ${node.name} (id: ${node.id})`);
    }

    const logIndex = ctx.logs.push({
      nodeId: node.id,
      type: node.type,
      startedAt: Date.now(),
      status: "success" as const,
    }) - 1;

    let result: NodeResult = { output: {}, nextNodeIds: node.outputs };

    try {
      switch (node.type) {
        case NodeType.TRIGGER_WHATSAPP:
        case NodeType.TRIGGER_INSTAGRAM:
        case NodeType.TRIGGER_WEBHOOK:
        case NodeType.TRIGGER_FORM:
        case NodeType.TRIGGER_SHOPIFY:
          result = { output: ctx.triggerData, nextNodeIds: node.outputs };
          break;

        case NodeType.TRIGGER_SCHEDULE:
          result = { output: { trigger: "cron_schedule", time: new Date().toISOString() }, nextNodeIds: node.outputs };
          break;

        case NodeType.AI_RESPOND: {
          const systemPrompt = resolveTemplate(node.config.systemPrompt, ctx);
          const userMessage = resolveTemplate(node.config.userMessage, ctx);
          
          const completion = await executeLLMCompletion({
            provider: node.config.provider || "claude",
            model: node.config.model,
            systemPrompt,
            userMessage,
            maxTokens: node.config.maxTokens,
            temperature: node.config.temperature,
            credentialId: node.config.credentialId,
            accountId: ctx.accountId,
          });

          result = {
            output: { AI_RESPONSE: completion },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.AI_CLASSIFY: {
          const userMessage = resolveTemplate(node.config.userMessage, ctx);
          const categories = node.config.categories || ["inquiry", "support", "billing"];
          
          const systemPrompt = `Classify the user message into exactly one of these categories: ${categories.join(", ")}. Return only the category name in lowercase.`;
          
          const classification = await executeLLMCompletion({
            provider: node.config.provider || "claude",
            model: node.config.model,
            systemPrompt,
            userMessage,
            maxTokens: 50,
            temperature: 0.1, // low temp for classification
            credentialId: node.config.credentialId,
            accountId: ctx.accountId,
          });

          const matched = categories.find((c: string) => classification.toLowerCase().includes(c.toLowerCase())) || categories[0];

          result = {
            output: { CLASSIFICATION: matched.trim().toLowerCase() },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.AI_GENERATE_CONTENT: {
          const systemPrompt = resolveTemplate(node.config.systemPrompt, ctx);
          const userMessage = resolveTemplate(
            node.config.userMessage || "{{message}}",
            ctx
          );

          const completion = await executeLLMCompletion({
            provider: node.config.provider || "openai",
            model: node.config.model,
            systemPrompt,
            userMessage,
            maxTokens: node.config.maxTokens,
            temperature: node.config.temperature,
            credentialId: node.config.credentialId,
            accountId: ctx.accountId,
          });

          result = {
            output: { AI_RESPONSE: completion },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.AI_EXTRACT: {
          const userMessage = resolveTemplate(node.config.userMessage, ctx);
          const schema = node.config.schema || ["name", "email"];
          
          const systemPrompt = `Extract key values from the message. Output as a clean JSON object containing: ${schema.join(", ")}. Only return the JSON. If nothing is found, return empty properties.`;
          
          const extractedText = await executeLLMCompletion({
            provider: node.config.provider || "claude",
            model: node.config.model,
            systemPrompt,
            userMessage,
            maxTokens: 200,
            temperature: 0.1,
            credentialId: node.config.credentialId,
            accountId: ctx.accountId,
          });

          let extractedData = {};
          try {
            extractedData = JSON.parse(extractedText.replace(/```json/g, "").replace(/```/g, "").trim());
          } catch (e) {
            // parsing fallback regex
            schema.forEach((k: string) => {
              const regex = new RegExp(`"${k}"\\s*:\\s*"([^"]+)"`, "i");
              const m = extractedText.match(regex);
              if (m?.[1]) (extractedData as any)[k] = m[1];
            });
          }

          result = {
            output: extractedData,
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.SEND_WHATSAPP: {
          const template = resolveTemplate(
            node.config.template || "{{AI_RESPONSE}}",
            ctx
          );
          const to =
            ctx.triggerData.phone ||
            ctx.triggerData.contactPhone ||
            ctx.contactId ||
            "";

          let status: "sent" | "skipped" | "failed" | "drafted" = "skipped";
          if (to && template) {
            if (ctx.mode === "draft") {
              await prisma.pendingAction.create({
                data: {
                  accountId: ctx.accountId,
                  workflowId: ctx.workflowId,
                  contactPhone: String(to),
                  channel: "whatsapp",
                  actionType: "send_message",
                  payload: JSON.stringify({ body: template }),
                  status: "pending",
                }
              });
              status = "drafted";
            } else {
              const ok = await sendMetaTextMessage(String(to), template, ctx.accountId);
              status = ok ? "sent" : "failed";
            }
          }

          result = {
            output: { MESSAGE_SENT: template, status },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.SEND_INSTAGRAM_DM:
        case NodeType.SEND_EMAIL: {
          const template = resolveTemplate(node.config.template || "Hello!", ctx);
          const channel = node.type === NodeType.SEND_INSTAGRAM_DM ? "instagram" : "email";
          const to = ctx.triggerData.phone || ctx.triggerData.contactPhone || ctx.contactId || "";
          
          let status = "sent";
          if (ctx.mode === "draft" && to) {
            await prisma.pendingAction.create({
              data: {
                accountId: ctx.accountId,
                workflowId: ctx.workflowId,
                contactPhone: String(to),
                channel,
                actionType: "send_message",
                payload: JSON.stringify({ body: template }),
                status: "pending",
              }
            });
            status = "drafted";
          } else {
            console.log(`[ACTION] [${node.type}] Sent message: "${template}"`);
          }

          result = {
            output: { MESSAGE_SENT: template, status },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.SEND_SMS: {
          const template = resolveTemplate(node.config.template || "Hello!", ctx);
          const to = ctx.triggerData.phone || ctx.triggerData.contactPhone || ctx.contactId || "";
          
          let status = "skipped";
          if (to && ctx.mode !== "draft") {
            const { sendTwilioMessage } = await import("@/lib/messaging/twilio");
            const ok = await sendTwilioMessage(String(to), template, ctx.accountId);
            status = ok ? "sent" : "failed";
          } else if (ctx.mode === "draft" && to) {
            await prisma.pendingAction.create({
              data: {
                accountId: ctx.accountId,
                workflowId: ctx.workflowId,
                contactPhone: String(to),
                channel: "sms",
                actionType: "send_sms",
                payload: JSON.stringify({ body: template }),
                status: "pending",
              }
            });
            status = "drafted";
          }

          result = {
            output: { MESSAGE_SENT: template, status },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.SEND_WHATSAPP_BUTTONS: {
          const content = resolveTemplate(node.config.content || "Select an option:", ctx);
          const buttons = node.config.buttons || ["Yes", "No"];
          const to =
            ctx.triggerData.phone ||
            ctx.triggerData.contactPhone ||
            ctx.contactId ||
            "";
          const body = `${content}\n\n${buttons.map((b: string, i: number) => `${i + 1}. ${b}`).join("\n")}`;

          let status: "sent" | "skipped" | "failed" | "drafted" = "skipped";
          if (to && body) {
            if (ctx.mode === "draft") {
              await prisma.pendingAction.create({
                data: {
                  accountId: ctx.accountId,
                  workflowId: ctx.workflowId,
                  contactPhone: String(to),
                  channel: "whatsapp",
                  actionType: "send_buttons",
                  payload: JSON.stringify({ body, content, options: buttons }),
                  status: "pending",
                }
              });
              status = "drafted";
            } else {
              const ok = await sendMetaTextMessage(String(to), body, ctx.accountId);
              status = ok ? "sent" : "failed";
            }
          }
          console.log(`[ACTION] [SEND BUTTONS] ${status}: "${content}"`);

          result = {
            output: { MESSAGE_SENT: body, BUTTONS_SENT: content, options: buttons, status },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.SEND_VOICE_CALL: {
          const prompt = resolveTemplate(node.config.prompt || "You are a helpful assistant.", ctx);
          const firstMessage = resolveTemplate(node.config.firstMessage || "Hello, how can I help you?", ctx);
          const to = ctx.triggerData.phone || ctx.triggerData.contactPhone || ctx.contactId || "";
          
          let callId = null;
          let callStatus = "skipped";
          
          if (to && ctx.mode !== "draft") {
            try {
              // Deduct credits for Voice Call (e.g., 15 credits)
              const { deductCredits } = await import("@/lib/billing/credits");
              await deductCredits(ctx.accountId, 15, "voice_call_minute", "Vapi.ai outbound call");

              const { dispatchVapiCall } = await import("@/lib/voice/vapi");
              const vapiResult = await dispatchVapiCall({
                phoneNumberId: process.env.VAPI_PHONE_ID || "",
                customerNumber: String(to),
                assistantPrompt: prompt,
                firstMessage: firstMessage,
                provider: node.config.voiceProvider || "eleven_labs",
              });
              
              callId = vapiResult.callId;
              callStatus = vapiResult.status;
              console.log(`[ACTION] [SEND_VOICE_CALL] Dispatched Vapi call to ${to}, ID: ${callId}`);
            } catch (err: any) {
              console.error(`[ACTION] [SEND_VOICE_CALL] Failed:`, err);
              callStatus = "failed: " + err.message;
            }
          } else if (ctx.mode === "draft" && to) {
            await prisma.pendingAction.create({
              data: {
                accountId: ctx.accountId,
                workflowId: ctx.workflowId,
                contactPhone: String(to),
                channel: "voice",
                actionType: "send_voice_call",
                payload: JSON.stringify({ prompt, firstMessage }),
                status: "pending",
              }
            });
            callStatus = "drafted";
          }

          result = {
            output: { CALL_ID: callId, CALL_STATUS: callStatus, PROMPT: prompt },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.ANAMIND_SET: {
          const key = node.config.variableKey;
          const val = resolveTemplate(node.config.variableValue, ctx);
          if (key) {
            ctx.anamind[key] = val;
            console.log(`[DATA] [ANAMIND_SET] Pinned variable: ${key} = "${val}"`);
          }
          result = {
            output: { [key]: val },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.ANAMIND_GET: {
          const key = node.config.variableKey;
          const val = ctx.anamind[key] || "";
          result = {
            output: { [key]: val },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.CONDITION: {
          const variable = resolveTemplate(node.config.variable || "", ctx);
          const operator = node.config.operator || "equals"; // equals|contains|empty
          const compareValue = resolveTemplate(node.config.value || "", ctx);
          
          let matches = false;
          if (operator === "equals") {
            matches = variable.toLowerCase() === compareValue.toLowerCase();
          } else if (operator === "contains") {
            matches = variable.toLowerCase().includes(compareValue.toLowerCase());
          } else if (operator === "empty") {
            matches = !variable || variable.trim() === "";
          }

          // If condition is a node branching, config.trueNodeId or config.falseNodeId defines the paths.
          // Or we filter out standard outputs
          const target = matches ? node.config.trueNodeId : node.config.falseNodeId;
          result = {
            output: { condition_result: matches },
            nextNodeIds: target ? [target] : node.outputs,
          };
          break;
        }

        case NodeType.WAIT: {
          const minutes = Number(node.config.minutes || 1);
          console.log(`[ACTION] [WAIT] Scheduled delay of ${minutes} minutes.`);
          result = {
            output: { waited: true, durationMinutes: minutes },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.GOOGLE_CALENDAR: {
          const summary = resolveTemplate(node.config.summary || "Booking Slot", ctx);
          const start = resolveTemplate(node.config.startTime || new Date().toISOString(), ctx);
          console.log(`[INTEGRATION] Scheduled Google Calendar event: "${summary}" starting: ${start}`);
          
          result = {
            output: { CALENDAR_EVENT: summary, status: "scheduled", time: start },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.HTTP_REQUEST: {
          const url = resolveTemplate(node.config.url || "https://httpbin.org/post", ctx);
          const method = node.config.method || "POST";
          const headers = node.config.headers || { "Content-Type": "application/json" };
          const bodyTemplate = node.config.body || "{}";
          
          const bodyResolved = resolveTemplate(bodyTemplate, ctx);

          console.log(`[INTEGRATION] [HTTP] Triggering ${method} to ${url}`);
          
          const fetchOptions: RequestInit = {
            method,
            headers: typeof headers === "string" ? JSON.parse(headers) : headers,
          };
          if (method !== "GET" && method !== "HEAD") {
            fetchOptions.body = bodyResolved;
          }

          const apiResponse = await fetch(url, fetchOptions);
          const responseText = await apiResponse.text();
          let parsedResponse = {};
          try {
            parsedResponse = JSON.parse(responseText);
          } catch (e) {
            parsedResponse = { raw: responseText };
          }

          result = {
            output: { HTTP_STATUS: apiResponse.status, HTTP_RESPONSE: parsedResponse },
            nextNodeIds: node.outputs,
          };
          break;
        }

        default: {
          // Standard placeholder fallback
          console.log(`[ACTION] Executed placeholder node type: ${node.type}`);
          result = {
            output: { status: "processed" },
            nextNodeIds: node.outputs,
          };
          break;
        }
      }

      // Record logs
      ctx.logs[logIndex].finishedAt = Date.now();
      ctx.logs[logIndex].output = result.output;
      
      // Update variables cache
      ctx.variables = { ...ctx.variables, ...result.output };

    } catch (e: any) {
      ctx.logs[logIndex].finishedAt = Date.now();
      ctx.logs[logIndex].status = "failed";
      ctx.logs[logIndex].error = e.message || String(e);
      throw e; // rethrow to stop or handle failed state
    }

    // Recursively execute downstream matching nodes in parallel/sequential order
    for (const nextId of result.nextNodeIds) {
      const nextNode = nodes.find(n => n.id === nextId);
      if (nextNode) {
        if (node.type === NodeType.WAIT) {
          const delayMinutes = Number(node.config.minutes || 1);
          // Dynamically require the scheduler service to avoid circular dependency cycles in ES Modules
          const { workflowScheduler } = require("./scheduler");
          workflowScheduler.scheduleWaitResume(ctx.executionId, nextNode.id, delayMinutes);
        } else {
          await this.executeNode(nextNode, ctx, nodes);
        }
      }
    }
  }
}
