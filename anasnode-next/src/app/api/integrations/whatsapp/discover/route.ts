import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { discoverPhoneNumberIdFromToken, fetchPhoneNumberDetails } from "@/lib/meta/graph";
import { validatePhoneNumberId } from "@/lib/whatsapp/credentials";

export const dynamic = "force-dynamic";

/** POST { accessToken, phoneNumberId? } — verify or auto-discover Meta Phone number ID */
export async function POST(request: Request) {
  try {
    await requireAccountId();
    const { accessToken, phoneNumberId } = await request.json();

    if (!accessToken?.trim()) {
      return NextResponse.json({ error: "Access token is required" }, { status: 400 });
    }

    const token = accessToken.trim();

    if (phoneNumberId) {
      const check = validatePhoneNumberId(String(phoneNumberId));
      if (!check.ok) {
        return NextResponse.json({ error: check.error }, { status: 400 });
      }
      const meta = await fetchPhoneNumberDetails(check.normalized, token);
      if (!meta.displayPhone && !meta.verifiedName) {
        return NextResponse.json(
          {
            error:
              "Meta rejected this Phone number ID with your token. Copy both from the same Meta → API Setup page.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        phoneNumberId: check.normalized,
        displayPhone: meta.displayPhone,
        businessName: meta.verifiedName,
      });
    }

    const discovered = await discoverPhoneNumberIdFromToken(token);
    if (!discovered) {
      return NextResponse.json(
        {
          error:
            "Could not auto-detect. Open Meta → WhatsApp → API Setup and copy “Phone number ID” (15–16 digits) into the field below.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      phoneNumberId: discovered.phoneNumberId,
      displayPhone: discovered.displayPhone,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
