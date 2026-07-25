import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/voice-agent
// Fetches the voice agent configuration for the current account.
export async function GET(req: Request) {
  try {
    // Note: In a real app, extract accountId from session/auth. Using mock account for now.
    const accountId = "mock-account-id"; // TODO: Replace with getServerSession(authOptions).user.accountId

    let agent = await prisma.voiceAgent.findFirst({
      where: { accountId },
    });

    // If no agent exists for this account, return default values
    if (!agent) {
      return NextResponse.json({
        success: true,
        data: {
          systemPrompt: "You are an AI assistant for a real estate agency.",
          firstMessage: "Hello! How can I help you today?",
          voiceId: "eleven_rachel",
          provider: "anaos",
          customApiKey: "",
          twilioNumberId: "",
        },
      });
    }

    return NextResponse.json({ success: true, data: agent });
  } catch (error) {
    console.error("Failed to fetch Voice Agent:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/voice-agent
// Upserts the voice agent configuration.
export async function POST(req: Request) {
  try {
    const accountId = "mock-account-id"; // TODO: Replace with real auth
    const body = await req.json();

    const {
      systemPrompt,
      firstMessage,
      voiceId,
      provider,
      customApiKey,
    } = body;

    // Validate provider
    if (!["anaos", "vapi", "bland", "retell"].includes(provider)) {
      return NextResponse.json(
        { success: false, error: "Invalid provider" },
        { status: 400 }
      );
    }

    // Check if an agent already exists
    const existing = await prisma.voiceAgent.findFirst({
      where: { accountId },
    });

    let agent;
    if (existing) {
      agent = await prisma.voiceAgent.update({
        where: { id: existing.id },
        data: {
          systemPrompt,
          firstMessage,
          voiceId,
          provider,
          customApiKey,
        },
      });
    } else {
      agent = await prisma.voiceAgent.create({
        data: {
          accountId,
          systemPrompt,
          firstMessage,
          voiceId,
          provider,
          customApiKey,
        },
      });
    }

    return NextResponse.json({ success: true, data: agent });
  } catch (error) {
    console.error("Failed to save Voice Agent:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
