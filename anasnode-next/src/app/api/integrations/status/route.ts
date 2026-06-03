import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { ANAOS_PLUGINS } from "@/lib/integrations/plugins";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accountId = await getAccountId();

    const credentials = accountId
      ? await prisma.integrationCredential.findMany({
          where: { accountId, isActive: true },
          select: { type: true, name: true, id: true },
        })
      : [];

    const credByType = new Map(credentials.map((c) => [c.type, c]));

    const whatsappEnv =
      !!process.env.WHATSAPP_ACCESS_TOKEN && !!process.env.WHATSAPP_PHONE_NUMBER_ID;

    const items = ANAOS_PLUGINS.map((def) => {
      const cred = credByType.get(def.id);
      let status: "connected" | "platform" | "available" | "coming_soon" =
        def.status === "coming_soon" ? "coming_soon" : "available";

      if (def.id === "whatsapp") {
        if (cred) status = "connected";
        else if (whatsappEnv) status = "platform";
      } else if (cred) {
        status = "connected";
      }

      return {
        id: def.id,
        name: def.name,
        category: def.category,
        connectLabel: def.connectLabel,
        status,
        credentialId: cred?.id ?? null,
        credentialName: cred?.name ?? null,
      };
    });

    return NextResponse.json({
      success: true,
      authenticated: !!accountId,
      integrations: items,
      summary: {
        connected: items.filter((i) => i.status === "connected").length,
        total: items.length,
      },
    });
  } catch (error) {
    console.error("integrations status error:", error);
    return NextResponse.json({ error: "Failed to load integrations" }, { status: 500 });
  }
}
