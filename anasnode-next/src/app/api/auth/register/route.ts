import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { defaultPlatformLanguageSettingsJson } from "@/lib/i18n/platform";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Account first, then link the user to it
    const account = await prisma.account.create({
      data: {
        email,
        name: `${name}'s Account`
      }
    });

    // Create User linked to the new account
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        accountId: account.id,
        role: "owner"
      }
    });

    // Auto-create a default workspace for this new account so they have an initial dashboard
    await prisma.workspace.create({
      data: {
        accountId: account.id,
        name: "My First Workspace",
        industry: "General Business",
        slug: "my-first-workspace",
        status: "draft",
        languageSettings: defaultPlatformLanguageSettingsJson(),
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountId: user.accountId
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
