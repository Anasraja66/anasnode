import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma, isDbAvailable } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    // Verify token and create session cookie
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Set cookie expiry to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // Handle user sync with Postgres (create Workspace and User record if missing)
    if (isDbAvailable && prisma) {
      const uid = decodedToken.uid;
      const email = decodedToken.email || "";
      const name = decodedToken.name || email.split("@")[0] || "User";

      let dbUser = await prisma.user.findUnique({
        where: { email },
        include: { account: true },
      });

      if (!dbUser) {
        // Find existing account by domain or create new one
        const domain = email.split("@")[1];
        let accountId = "";

        if (domain && !["gmail.com", "yahoo.com", "hotmail.com"].includes(domain)) {
          const existingAccount = await prisma.account.findFirst({
            where: { domain },
          });
          
          if (existingAccount) {
            accountId = existingAccount.id;
          }
        }

        if (!accountId) {
          const account = await prisma.account.create({
            data: {
              email: email,
              name: `${name}'s Account`,
            },
          });
          accountId = account.id;

          // Create default workspace for new account
          await prisma.workspace.create({
            data: {
              accountId,
              name: "Default Workspace",
              slug: `workspace-${Date.now()}`,
              industry: "General",
            },
          });
        }

        // Create user
        dbUser = await prisma.user.create({
          data: {
            email,
            password: uid, // Store Firebase UID as placeholder password
            name,
            role: "owner",
            accountId,
          },
          include: { account: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("__session");
  return NextResponse.json({ success: true });
}
