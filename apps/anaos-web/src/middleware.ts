import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Ensure middleware runs on all paths except static assets, favicon, and api routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
