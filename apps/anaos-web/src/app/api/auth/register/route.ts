import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create a Master Account for the new user
    const newAccount = await prisma.account.create({
      data: {
        email,
        name,
      }
    });

    // 2. Create a default Workspace for this account
    await prisma.workspace.create({
      data: {
        accountId: newAccount.id,
        name: "My Workspace",
        industry: "General",
        slug: `workspace-${Date.now()}`,
        status: "active"
      }
    });

    // 3. Create the User linked to the account
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "owner",
        accountId: newAccount.id
      }
    });

    return NextResponse.json({ success: true, message: "Registration successful" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
