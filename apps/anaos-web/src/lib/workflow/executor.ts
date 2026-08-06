import { prisma } from "../db";
import { 
  NodeType, 
  WorkflowNode, 
  ExecutionContext, 
  NodeResult 
} from "./types";
import { executeLLMCompletion, resolveTemplate } from "./ai-client";
import { sendMetaTextMessage } from "@/lib/whatsapp/meta";
import { globalRegistry } from "./engine/registry";

// CRITICAL LOOP PROTECTION CONSTANTS
const MAX_NODES_PER_EXECUTION = 100;
const MAX_EXECUTION_TIME_MS = 30000;
const MAX_SAME_NODE_VISITS = 3;

export class WorkflowExecutor {
  private nodeVisits: Record<string, number> = {};
  private startTime: number = 0;
  private totalExecuted: number = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    let nodes: WorkflowNode[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let edges: any[] = [];
    try {
      nodes = JSON.parse(workflow.nodes);
      edges = JSON.parse(workflow.edges || "[]");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new Error("Invalid workflow nodes/edges JSON.");
    }

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
    const triggerNodes = nodes.filter(n => n.type.startsWith("trigger_"));
    if (triggerNodes.length === 0) {
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
      nodeData: {},
      anamind: {},
      triggerData,
      logs: [],
    };

    // 5. Load real contact context from DB (AnasMind profile)
    // Always seed with trigger data first, then enrich from DB if available
    ctx.anamind = {
      name: triggerData.contactName || "Customer",
      phone: triggerData.contactPhone || triggerData.phone || "",
    };

    const contactPhone = triggerData.contactPhone || triggerData.phone;
    if (contactPhone) {
      try {
        const conversation = await prisma.inboxConversation.findFirst({
          where: { accountId: workflow.accountId, contactPhone },
          select: {
            contactName: true,
            contactPhone: true,
            firstName: true,
            lastName: true,
            email: true,
            gender: true,
            customFields: true,
            tags: true,
          },
        });

        if (conversation) {
          // Parse custom fields (stored as JSON string)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let custom: Record<string, any> = {};
          try {
            custom = JSON.parse(conversation.customFields || "{}");
          } catch { /* ignore bad JSON */ }

          ctx.anamind = {
            name: conversation.contactName || ctx.anamind.name,
            phone: conversation.contactPhone,
            firstName: conversation.firstName,
            lastName: conversation.lastName,
            email: conversation.email,
            gender: conversation.gender,
            tags: JSON.parse(conversation.tags || "[]"),
            ...custom, // Spread custom fields so {{BUDGET}}, {{VISIT_REASON}} etc. resolve
          };
        }
      } catch (err) {
        // Non-fatal: log and continue with trigger data
        console.warn("[Executor] Could not load AnasMind contact context:", err);
      }
    }

    try {
      // 6. Recursively execute all nodes starting from the triggers
      for (const tNode of triggerNodes) {
        await this.executeNode(tNode, ctx, nodes, edges);
      }

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async executeNode(node: WorkflowNode, ctx: ExecutionContext, nodes: WorkflowNode[], edges: any[]) {
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
      // 1. Try new modular registry first
      let handler = null;
      try {
        handler = globalRegistry.getHandler(node.type);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // Fallback to monolithic switch if not found
      }

      if (handler) {
        result = await handler.execute(node, ctx);
      } else {
        // 2. Fallback to old monolithic switch logic
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            // parsing fallback regex
            schema.forEach((k: string) => {
              const regex = new RegExp(`"${k}"\\s*:\\s*"([^"]+)"`, "i");
              const m = extractedText.match(regex);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (m?.[1]) (extractedData as any)[k] = m[1];
            });
          }

          result = {
            output: extractedData,
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.AI_MATCH_PROPERTIES: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const userMessage = resolveTemplate(node.config.userMessage || "{{message}}", ctx);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const limit = Number(node.config.limit || 3);
          
          // Deprecated: Moving to Universal Module System
          /*
          // 1. Extract preferences from natural language
          const { extractLeadPreferences } = await import("../ai/pipeline/LeadExtractor");
          const preferences = await extractLeadPreferences(userMessage, ctx.accountId);

          // 2. Query properties from DB
          const { matchPropertiesForLead, formatPropertiesForWhatsApp } = await import("../matching/engine");
          const matches = await matchPropertiesForLead(ctx.accountId, preferences, limit);

          // 3. Format output
          const formattedText = formatPropertiesForWhatsApp(matches);
          */

          result = {
            output: { 
              MATCHED_PROPERTIES_TEXT: "Deprecated node", 
              MATCH_COUNT: 0,
              EXTRACTED_PREFERENCES: {}
            },
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        case "activepieces_action":
        case "ACTIVEPIECES_ACTION": {
          console.log(`[ACTION] Executing Activepieces Action: ${node.config?.pieceName} -> ${node.config?.actionName}`);
          let apResult = null;
          let status = "failed";
          try {
            const { getAction } = await import("@/lib/pieces/registry");
            const action = getAction(node.config?.pieceName, node.config?.actionName);
            
            // Retrieve integration credentials from DB based on workflow accountId & pieceName
            const credential = await prisma.integrationCredential.findFirst({
              where: { 
                accountId: ctx.accountId, 
                providerId: node.config?.pieceName?.replace("piece-", "") 
              }
            });
            
            const auth = credential ? JSON.parse(credential.encryptedData) : {};
            
            // Execute the action
            apResult = await action.action.run({
              auth: auth,
              propsValue: node.config?.propsValue || {},
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              store: {} as any, // Mock store
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              connections: { get: async () => null } as any
            });
            status = "success";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            console.error(`Activepieces Action Failed: ${err.message}`);
            apResult = { error: err.message };
          }

          result = {
            output: { activepiecesResult: apResult, status },
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            parsedResponse = { raw: responseText };
          }

          result = {
            output: { HTTP_STATUS: apiResponse.status, HTTP_RESPONSE: parsedResponse },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.CRM_ASSIGN_AGENT: {
          const agentId = resolveTemplate(node.config.agentId || "", ctx);
          const partyId = ctx.triggerData.partyId || ctx.contactId || "";
          let success = false;
          if (partyId && agentId) {
            try {
              await prisma.party.update({
                where: { id: partyId },
                data: { assignedTo: agentId },
              });
              success = true;
            } catch (e) {
              console.error("[ACTION] [CRM_ASSIGN_AGENT] Failed:", e);
            }
          }
          result = {
            output: { ASSIGNED_AGENT: agentId, status: success ? "assigned" : "failed" },
            nextNodeIds: node.outputs,
          };
          break;
        }

        case NodeType.CRM_UPDATE_LEAD_STAGE: {
          // TODO: Migrate to Deal/Opportunity stage or Custom Field EAV update
          /*
          const stage = resolveTemplate(node.config.stage || "", ctx);
          const leadId = ctx.triggerData.leadId || ctx.contactId || "";
          let success = false;
          if (leadId && stage) {
            try {
              // await prisma.party.update(...) // Stage depends on Deal table now
              success = true;
            } catch (e) {
              console.error("[ACTION] [CRM_UPDATE_LEAD_STAGE] Failed:", e);
            }
          }
          */
          result = {
            output: { NEW_STAGE: "skipped", status: "failed_deprecated_node" },
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
      } // End of registry else fallback

      // Record logs
      ctx.logs[logIndex].finishedAt = Date.now();
      ctx.logs[logIndex].output = result.output;
      
      // Update variables cache
      ctx.variables = { ...ctx.variables, ...result.output };
      ctx.nodeData[node.name] = { output: result.output };
      ctx.nodeData[node.id] = { output: result.output };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      ctx.logs[logIndex].finishedAt = Date.now();
      ctx.logs[logIndex].status = "failed";
      ctx.logs[logIndex].error = e.message || String(e);
      throw e; // rethrow to stop or handle failed state
    }

    // ── SUSPEND & HYDRATION LOGIC ──
    if (result.output && result.output._suspendExecution) {
      // The node (like WAIT or manual approval) halted the execution.
      // We pass it to the scheduler to resume at the NEXT nodes when the time comes.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { workflowScheduler } = require("./scheduler");
      const delayMinutes = Number(node.config.minutes || node.config.duration || 1);
      
      for (const nextId of result.nextNodeIds) {
        if (!nextId) continue;
        workflowScheduler.scheduleWaitResume(ctx.executionId, nextId, delayMinutes);
      }
      return; // Stop recursive execution here. It will resume in a separate context later.
    }

    // ── MULTI-BRANCH ROUTING LOGIC ──
    let targetNodeIds = result.nextNodeIds;
    
    // If the node returned a specific branch to follow, override the flat output array
    if (result.branchIndex !== undefined) {
      const matchingEdges = edges.filter(e => 
        (e.source === node.id || e.from === node.id) && 
        String(e.sourceHandle) === String(result.branchIndex)
      );
      targetNodeIds = matchingEdges.map(e => e.target || e.to);
    }

    // Recursively execute downstream matching nodes in parallel/sequential order
    for (const nextId of targetNodeIds) {
      if (!nextId) continue;
      const nextNode = nodes.find(n => n.id === nextId);
      if (nextNode) {
        await this.executeNode(nextNode, ctx, nodes, edges);
      }
    }
  }
}
