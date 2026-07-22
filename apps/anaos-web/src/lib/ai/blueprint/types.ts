import { z } from "zod";

export const WorkspaceBlueprintSchema = z.object({
  industryName: z.string().describe("The normalized name of the industry, e.g. 'Real Estate' or 'Logistics'"),
  agentPersona: z
    .string()
    .describe(
      "Detailed instructions for the AI Agent. It should act as a consultant or sales rep for this specific business. E.g. 'You are an AI consultant for Fazal Properties in Dubai...'"
    ),
  knowledgeBaseCategories: z
    .array(z.string())
    .describe(
      "A list of 3-5 categories/folders for their documents. E.g. ['Ready Properties', 'Off-plan Projects', 'Company Policies']"
    ),
  customFields: z
    .array(
      z.object({
        name: z.string().describe("CamelCase name of the field, e.g. 'budget'"),
        type: z.enum(["string", "number", "boolean", "date"]),
        description: z.string().describe("What this field stores"),
      })
    )
    .describe("3-5 custom fields required for this industry to be stored in the CRM Party metadata"),
  workflowSuggestions: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        triggerType: z.string().describe("E.g. 'trigger_whatsapp', 'trigger_facebook'"),
      })
    )
    .describe("2-3 automation workflows this business should have"),
});

export type WorkspaceBlueprint = z.infer<typeof WorkspaceBlueprintSchema>;
