import { auth } from "@/auth";
import { ForbiddenError, AuthenticationError } from "@/lib/errors";

export type Role = 'owner' | 'admin' | 'user';

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) {
    throw new AuthenticationError();
  }
  return session.user;
}

export async function checkRole(allowedRoles: Role[]) {
  const user = await getCurrentUser();
  if (!allowedRoles.includes(user.role as Role)) {
    throw new ForbiddenError('You do not have permission to perform this action');
  }
  return user;
}

export async function isOwner() {
  return checkRole(['owner']);
}

export async function isAdmin() {
  return checkRole(['owner', 'admin']);
}
