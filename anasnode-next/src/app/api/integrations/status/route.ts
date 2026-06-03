import { NextResponse } from "next/server";
import { getAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { ANAOS_PLUGINS } from "@/lib/integrations/plugins";
import { decrypt } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accountId = await getAccountId();

    const credentials = accountId
      ? await prisma.integrationCredential.findMany({
          where: { accountId, isActive: true },
          select: { type: true, name: true, id: true, credentials: true },
        })
      : [];

    const credByType = new Map(credentials.map((c) => [c.type, c]));

    const whatsappEnv =
      !!process.env.WHATSAPP_ACCESS_TOKEN && !!process.env.WHATSAPP_PHONE_NUMBER_ID;

    // Check if Meta ecosystem is connected
    const metaCred = credByType.get("whatsapp");
    let hasMeta = !!metaCred;
    let instagramConnected = false;
    let facebookConnected = false;

    if (metaCred) {
      try {
        const parsed = JSON.parse(decrypt(metaCred.credentials));
        instagramConnected = Array.isArray(parsed.instagramAccountIds) && parsed.instagramAccountIds.length > 0;
        facebookConnected = Array.isArray(parsed.pageIds) && parsed.pageIds.length > 0;
      } catch {
        // fallback to true if decrypt fails but credential exists
        instagramConnected = true;
        facebookConnected = true;
      }
    }

    const items = ANAOS_PLUGINS.map((def) => {
      const cred = credByType.get(def.id);
      let status: "connected" | "platform" | "available" | "coming_soon" =
        def.status === "coming_soon" ? "coming_soon" : "available";

      if (def.providerId === "meta") {
        if (def.id === "whatsapp") {
          if (hasMeta) status = "connected";
          else if (whatsappEnv) status = "platform";
        } else if (def.id === "instagram") {
          if (instagramConnected || hasMeta) status = "connected";
        } else if (def.id === "facebook") {
          if (facebookConnected || hasMeta) status = "connected";
        }
      } else if (cred) {
        status = "connected";
      }

      // Fallback for Google Workspace integrations if email SMTP is connected
      if (def.providerId === "google" && def.id !== "smtp") {
        const hasGmail = credByType.has("smtp");
        if (hasGmail) {
          status = "connected";
        }
      }

      return {
        id: def.id,
        name: def.name,
        category: def.category,
        providerId: def.providerId,
        connectLabel: def.connectLabel,
        status,
        credentialId: cred?.id ?? (def.providerId === "meta" && metaCred ? metaCred.id : null),
        credentialName: cred?.name ?? (def.providerId === "meta" && metaCred ? metaCred.name : null),
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
