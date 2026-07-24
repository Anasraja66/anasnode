import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { parseSpreadsheetText, parseUploadAsync } from "@/lib/contacts/import-parse";
import { upsertImportedContact } from "@/lib/contacts/upsert";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const accountId = await requireAccountId();
    const contentType = request.headers.get("content-type") || "";

    let parsed: ReturnType<typeof parseSpreadsheetText>;
    let filename = "paste.csv";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      const pasted = String(form.get("csv") || form.get("text") || "").trim();

      if (file instanceof File && file.size > 0) {
        filename = file.name || "upload.xlsx";
        const buf = Buffer.from(await file.arrayBuffer());
        parsed = await parseUploadAsync(buf, filename);
      } else if (pasted) {
        parsed = parseSpreadsheetText(pasted);
      } else {
        return NextResponse.json({ error: "Upload a file or paste sheet data" }, { status: 400 });
      }
    } else {
      const body = await request.json();
      const text = String(body.csv || body.text || "").trim();
      if (!text) {
        return NextResponse.json({ error: "Paste or upload your sheet" }, { status: 400 });
      }
      parsed = parseSpreadsheetText(text);
    }

    if (parsed.rows.length === 0) {
      return NextResponse.json(
        {
          error:
            "No valid rows. Need a phone column (phone, mobile, whatsapp). Other columns map automatically.",
          columns: parsed.columns,
          skipped: parsed.skipped,
        },
        { status: 400 }
      );
    }

    const workspace = await prisma.workspace.findFirst({
      where: { accountId },
      orderBy: { createdAt: "desc" },
    });

    let created = 0;
    let updated = 0;
    const errors: string[] = [];

    const rows = parsed.rows.slice(0, 5000);
    const BATCH_SIZE = 50;
    const startTime = Date.now();
    const MAX_DURATION_MS = 7500; // 7.5 seconds (Vercel hobby limit is 10s)

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      if (Date.now() - startTime > MAX_DURATION_MS) {
        break;
      }
      const batch = rows.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (row) => {
          try {
            const existing = await prisma.inboxConversation.findUnique({
              where: {
                accountId_channel_contactPhone: {
                  accountId,
                  channel: "whatsapp",
                  contactPhone: row.phone,
                },
              },
            });
            await upsertImportedContact({
              accountId,
              workspaceId: workspace?.id,
              row,
            });
            if (existing) updated++;
            else created++;
          } catch {
            if (errors.length < 8) errors.push(row.phone);
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
      created,
      updated,
      total: parsed.rows.length,
      skipped: parsed.skipped,
      columns: parsed.columns,
      errors,
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("contacts import:", e);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
