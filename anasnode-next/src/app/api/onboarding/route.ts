import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, role, workspaceName, style } = await request.json();

    if (!name || !role || !workspaceName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const email = session.user.email;

    // Find the user to get user id and accountId
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. Update the user details
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        role: role.toLowerCase()
      }
    });

    // 2. Find their default workspace or any workspace to update
    const firstWorkspace = await prisma.workspace.findFirst({
      where: { accountId: user.accountId },
      orderBy: { createdAt: "asc" }
    });

    const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (firstWorkspace) {
      // Update existing workspace
      await prisma.workspace.update({
        where: { id: firstWorkspace.id },
        data: {
          name: workspaceName,
          slug,
          industry: role // Use role as a starting industry context
        }
      });
    } else {
      // Create a new one if it doesn't exist
      await prisma.workspace.create({
        data: {
          accountId: user.accountId,
          name: workspaceName,
          slug,
          industry: role,
          status: "draft"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
