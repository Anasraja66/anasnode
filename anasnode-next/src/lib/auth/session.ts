import { auth } from "@/auth";

export type SessionUser = {
  id?: string;
  accountId?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as SessionUser;
}

export async function getAccountId(): Promise<string | null> {
  const user = await getSessionUser();
  return user?.accountId ?? null;
}

export async function requireAccountId(): Promise<string> {
  const accountId = await getAccountId();
  if (!accountId) {
    const err = new Error("UNAUTHORIZED");
    throw err;
  }
  return accountId;
}
