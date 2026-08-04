import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { AuthError, ForbiddenError } from "@/lib/errors";

export async function requireAuth() {
    const user = await getSessionUser();

    if (!user?.email) {
        throw new AuthError("Unauthorized — please log in");
    }

    if (!user.accountId) {
        throw new AuthError("Account not found in session");
    }

    return user;
}

export async function requireAccount() {
    const user = await requireAuth();
    return user.accountId;
}

export async function requireRole(allowedRoles: string[]) {
    const user = await requireAuth();
    if (!user.role || !allowedRoles.includes(user.role)) {
        throw new ForbiddenError("You do not have permission to perform this action");
    }
    return user;
}

export async function requireOwner() {
    return requireRole(["owner"]);
}

export async function requireAdmin() {
    return requireRole(["owner", "admin", "super-admin"]);
}

export async function requireSuperAdmin() {
    return requireRole(["super-admin"]);
}
