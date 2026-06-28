"use client";

import { SessionProvider } from "next-auth/react";

/** Avoid hammering /api/auth/session when dev server is slow. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      {children}
    </SessionProvider>
  );
}
