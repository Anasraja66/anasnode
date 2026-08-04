import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma, isDbAvailable } from "@/lib/db";
import { AuthenticationError } from "@/lib/errors";

export type SessionUser = {
  id?: string;
  accountId?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;
    if (!sessionCookie) return null;

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!decodedToken?.email) return null;

    let accountId: string | undefined;
    let role: string | undefined;
    let userId: string | undefined;
    let name = decodedToken.name;

    if (isDbAvailable && prisma) {
      const dbUser = await prisma.user.findUnique({
        where: { email: decodedToken.email },
      });
      if (dbUser) {
        accountId = dbUser.accountId;
        role = dbUser.role || "owner";
        userId = dbUser.id;
        name = name || dbUser.name || undefined;
      }
    }

    return {
      id: userId ?? decodedToken.uid,
      email: decodedToken.email,
      name,
      accountId,
      role,
    };
  } catch (error) {
    return null;
  }
}

export async function getAccountId(): Promise<string | null> {
  const user = await getSessionUser();
  return user?.accountId ?? null;
}

export async function requireAccountId(): Promise<string> {
  const accountId = await getAccountId();
  if (!accountId) {
    throw new AuthenticationError("Unauthorized");
  }
  return accountId;
}
