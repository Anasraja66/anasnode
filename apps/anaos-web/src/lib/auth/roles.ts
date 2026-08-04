import { getSessionUser, SessionUser } from "@/lib/auth/session";
import { ForbiddenError, AuthenticationError } from "@/lib/errors";

export type Role = 'owner' | 'admin' | 'user' | 'super-admin';

export async function getCurrentUser(): Promise<SessionUser> {
  const session = await getSessionUser();
  if (!session?.email) {
    throw new AuthenticationError();
  }
  return session;
}

export async function checkRole(allowedRoles: Role[]) {
  const user = await getCurrentUser();
  if (!user.role || !allowedRoles.includes(user.role as Role)) {
    throw new ForbiddenError('You do not have permission to perform this action');
  }
  return user;
}

export async function isOwner() {
  return checkRole(['owner']);
}

export async function isAdmin() {
  return checkRole(['owner', 'admin', 'super-admin']);
}

export async function isSuperAdmin() {
  return checkRole(['super-admin']);
}
