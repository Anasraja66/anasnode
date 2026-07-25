import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma, isDbAvailable } from "@/lib/db";

export type SessionUser = {
  id?: string;
  accountId?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("__session")?.value;
    if (!sessionCookie) return null;

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Fetch account Id from DB if available
    let accountId = undefined;
    if (isDbAvailable && prisma) {
      const dbUser = await prisma.user.findUnique({
        where: { email: decodedToken.email },
      });
      if (dbUser) accountId = dbUser.accountId;
    }

    return {
      id: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      accountId,
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
    const err = new Error("UNAUTHORIZED");
    throw err;
  }
  return accountId;
}
