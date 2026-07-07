/**
 * API Auth Helper
 *
 * Every API route should call requireAuth() at the top.
 * It returns the session + accountId, or throws a 401 response.
 *
 * Usage:
 *   const { accountId } = await requireAuth();
 *
 * Why a helper?
 *   Different files were using getServerSession(authOptions) vs auth() — two
 *   different NextAuth versions. This unifies them in one place so we only
 *   need to change one file if we update auth later.
 */

import { NextResponse } from "next/server";
import { auth } from "@/auth";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthResult {
  accountId: string;
  userId: string;
  email: string;
}

// ── Errors ────────────────────────────────────────────────────────────────────

/**
 * A special error we throw when auth fails.
 * API routes catch this and return it directly.
 */
export class AuthError extends Error {
  public readonly response: NextResponse;

  constructor(message = "Unauthorized") {
    super(message);
    this.response = NextResponse.json({ error: message }, { status: 401 });
  }
}

// ── Main Helper ───────────────────────────────────────────────────────────────

/**
 * Get the authenticated session or throw an AuthError.
 *
 * @throws {AuthError} if the request has no valid session
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await auth();

  if (!session?.user?.email) {
    throw new AuthError("Unauthorized — please log in");
  }

  const user = session.user as {
    email: string;
    accountId?: string;
    id?: string;
  };

  if (!user.accountId) {
    throw new AuthError("Account not found in session");
  }

  return {
    accountId: user.accountId,
    userId: user.id || "",
    email: user.email,
  };
}

// ── Convenience wrapper ───────────────────────────────────────────────────────

/**
 * Wraps a route handler with automatic auth.
 * If auth fails, returns 401 automatically.
 *
 * Usage:
 *   export const GET = withAuth(async ({ accountId }, request) => {
 *     ...
 *   });
 */
export function withAuth(
  handler: (auth: AuthResult, request: Request) => Promise<NextResponse>
) {
  return async function (request: Request): Promise<NextResponse> {
    try {
      const authResult = await requireAuth();
      return await handler(authResult, request);
    } catch (err) {
      if (err instanceof AuthError) {
        return err.response;
      }
      throw err;
    }
  };
}
