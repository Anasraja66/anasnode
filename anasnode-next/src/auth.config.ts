import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Providers are added in auth.ts to prevent Edge Runtime database import errors
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.accountId = user.accountId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.accountId = token.accountId;
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    }
  },
  pages: {
    signIn: "/login"
  }
} satisfies NextAuthConfig;
