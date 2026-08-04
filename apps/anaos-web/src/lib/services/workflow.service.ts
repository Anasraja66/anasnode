import { prisma } from "@/lib/db";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export class WorkflowService {
    static async list(accountId: string, workspaceId?: string) {
        logger.info("Listing workflows", { accountId, workspaceId });

        const query: any = { accountId };
        if (workspaceId) query.workspaceId = workspaceId;

        const workflows = await prisma.workflow.findMany({
            where: query,
            orderBy: { createdAt: "desc" },
        });

        return workflows.map((workflow) => ({
            ...workflow,
            definition: JSON.parse(workflow.definition || "{}"),
            variables: JSON.parse(workflow.variables || "[]"),
            stats: JSON.parse(workflow.stats || "{}"),
        }));
    }

    static async getById(accountId: string, id: string) {
        logger.info("Fetching workflow", { accountId, id });

        const workflow = await prisma.workflow.findFirst({
            where: { id, accountId },
        });

        if (!workflow) {
            throw new NotFoundError("Workflow not found");
        }

        return {
            ...workflow,
            definition: JSON.parse(workflow.definition || "{}"),
            variables: JSON.parse(workflow.variables || "[]"),
            stats: JSON.parse(workflow.stats || "{}"),
        };
    }

    static async create(accountId: string, data: { name: string; description?: string; workspaceId: string; definition?: any; variables?: any }) {
        logger.info("Creating workflow", { accountId, data });

        if (!data.name || !data.workspaceId) {
            throw new ValidationError("Missing required fields: name and workspaceId");
        }

        const workflow = await prisma.workflow.create({
            data: {
                accountId,
                workspaceId: data.workspaceId,
                name: data.name,
                description: data.description || "",
                definition: JSON.stringify(data.definition || {}),
                variables: JSON.stringify(data.variables || []),
                stats: JSON.stringify({ runs: 0, success: 0, failed: 0 }),
            },
        });

        return {
            ...workflow,
            definition: data.definition || {},
            variables: data.variables || [],
            stats: { runs: 0, success: 0, failed: 0 },
        };
    }

    static async update(accountId: string, id: string, data: { name?: string; description?: string; definition?: any; variables?: any; isActive?: boolean }) {
        logger.info("Updating workflow", { accountId, id, data });

        const workflow = await prisma.workflow.findFirst({ where: { id, accountId } });
        if (!workflow) {
            throw new NotFoundError("Workflow not found");
        }

        const updated = await prisma.workflow.update({
            where: { id },
            data: {
                name: data.name ?? workflow.name,
                description: data.description ?? workflow.description,
                definition: data.definition !== undefined ? JSON.stringify(data.definition) : workflow.definition,
                variables: data.variables !== undefined ? JSON.stringify(data.variables) : workflow.variables,
                isActive: data.isActive !== undefined ? data.isActive : workflow.isActive,
                version: workflow.version + 1,
            },
        });

        return {
            ...updated,
            definition: JSON.parse(updated.definition || "{}"),
            variables: JSON.parse(updated.variables || "[]"),
            stats: JSON.parse(updated.stats || "{}"),
        };
    }

    static async activate(accountId: string, id: string) {
        logger.info("Activating workflow", { accountId, id });

        const workflow = await this.getById(accountId, id);
        const nodes = workflow.definition?.nodes || [];
        const hasTrigger = nodes.some((node: any) => node.type?.startsWith("trigger_"));
        const hasAction = nodes.some((node: any) => !node.type?.startsWith("trigger_"));

        if (!hasTrigger || !hasAction) {
            throw new ValidationError("Workflow must contain at least one trigger and one action to activate.");
        }

        const updated = await prisma.workflow.update({
            where: { id },
            data: { isActive: true },
        });

        return {
            ...updated,
            definition: JSON.parse(updated.definition || "{}"),
            variables: JSON.parse(updated.variables || "[]"),
            stats: JSON.parse(updated.stats || "{}"),
        };
    }

    static async deactivate(accountId: string, id: string) {
        logger.info("Deactivating workflow", { accountId, id });
        await this.getById(accountId, id);

        const updated = await prisma.workflow.update({
            where: { id },
            data: { isActive: false },
        });

        return {
            ...updated,
            definition: JSON.parse(updated.definition || "{}"),
            variables: JSON.parse(updated.variables || "[]"),
            stats: JSON.parse(updated.stats || "{}"),
        };
    }
}
