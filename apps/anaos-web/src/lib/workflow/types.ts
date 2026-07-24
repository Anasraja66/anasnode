export enum NodeType {
  // ── TRIGGERS ──
  TRIGGER_WHATSAPP      = 'trigger_whatsapp',
  TRIGGER_INSTAGRAM     = 'trigger_instagram', 
  TRIGGER_WEBHOOK       = 'trigger_webhook',
  TRIGGER_SCHEDULE      = 'trigger_schedule',
  TRIGGER_FORM          = 'trigger_form',
  TRIGGER_SHOPIFY       = 'trigger_shopify',
  TRIGGER_EMAIL         = 'trigger_email',
  TRIGGER_LEAD_CREATED  = 'trigger_lead_created',
  TRIGGER_STAGE_CHANGED = 'trigger_stage_changed',
  TRIGGER_PROPERTY_LISTED = 'trigger_property_listed',

  // ── AI NODES ──
  AI_RESPOND            = 'ai_respond',
  AI_CLASSIFY           = 'ai_classify',
  AI_EXTRACT            = 'ai_extract',
  AI_GENERATE_CONTENT   = 'ai_generate_content',
  AI_SENTIMENT          = 'ai_sentiment',
  AI_TRANSLATE          = 'ai_translate',
  AI_MATCH_PROPERTIES   = 'ai_match_properties',

  // ── MESSAGING ──
  SEND_WHATSAPP         = 'send_whatsapp',
  SEND_WHATSAPP_BUTTONS = 'send_whatsapp_buttons',
  SEND_WHATSAPP_LIST    = 'send_whatsapp_list',
  SEND_EMAIL            = 'send_email',
  SEND_INSTAGRAM_DM     = 'send_instagram_dm',
  SEND_VOICE_CALL       = 'send_voice_call',
  SEND_SMS              = 'send_sms',
  NOTIFY_TEAM           = 'notify_team',

  // ── LOGIC ──
  CONDITION             = 'condition',
  WAIT                  = 'wait',
  LOOP                  = 'loop',
  SPLIT                 = 'split',
  MERGE                 = 'merge',

  // ── DATA ──
  ANAMIND_GET           = 'anamind_get',
  ANAMIND_SET           = 'anamind_set',
  CRM_CREATE_CONTACT    = 'crm_create_contact',
  CRM_UPDATE_CONTACT    = 'crm_update_contact',
  CRM_CREATE_DEAL       = 'crm_create_deal',
  CRM_UPDATE_LEAD_STAGE = 'crm_update_lead_stage',
  CRM_ASSIGN_AGENT      = 'crm_assign_agent',

  // ── INTEGRATIONS ──
  GOOGLE_CALENDAR       = 'google_calendar',
  SHOPIFY_ORDER         = 'shopify_order',
  HUBSPOT_CONTACT       = 'hubspot_contact',
  HTTP_REQUEST          = 'http_request',
  WEBHOOK_SEND          = 'webhook_send',
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
  config: Record<string, any>;
  inputs: string[];
  outputs: string[];
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface ExecutionContext {
  executionId: string;
  workflowId: string;
  accountId: string;
  mode: string;
  contactId?: string | null;
  variables: Record<string, any>; // Runtime local variables
  nodeData: Record<string, { output: any }>; // Stores full output of every executed node by Node ID or Name
  anamind: Record<string, any>;   // Loaded persistent customer context
  triggerData: Record<string, any>;
  logs: {
    nodeId: string;
    type: NodeType;
    startedAt: number;
    finishedAt?: number;
    status: 'success' | 'failed';
    error?: string;
    output?: any;
  }[];
}

export interface NodeResult {
  output: Record<string, any>;
  nextNodeIds: string[]; // Fallback list of nodes (legacy flat array)
  branchIndex?: string | number; // Specific edge sourceHandle to traverse (n8n style multi-branching)
}
