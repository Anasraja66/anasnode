import { NextResponse } from "next/server";
import { requireAccountId } from "@/lib/auth/session";
import { parseSpreadsheetText, parseUploadAsync } from "@/lib/contacts/import-parse";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireAccountId();
    const contentType = request.headers.get("content-type") || "";

    let parsed: ReturnType<typeof parseSpreadsheetText>;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      const pasted = String(form.get("csv") || "").trim();

      if (file instanceof File && file.size > 0) {
        const buf = Buffer.from(await file.arrayBuffer());
        parsed = await parseUploadAsync(buf, file.name || "upload.xlsx");
      } else if (pasted) {
        parsed = parseSpreadsheetText(pasted);
      } else {
        return NextResponse.json({ error: "No data" }, { status: 400 });
      }
    } else {
      const body = await request.json();
      const text = String(body.csv || body.text || "").trim();
      if (!text) return NextResponse.json({ error: "No data" }, { status: 400 });
      parsed = parseSpreadsheetText(text);
    }

    return NextResponse.json({
      success: true,
      columns: parsed.columns,
      count: parsed.rows.length,
      skipped: parsed.skipped,
      preview: parsed.rows.slice(0, 8).map((r) => ({
        name: r.contactName,
        phone: r.phone,
        email: r.email,
        tags: r.tags,
        extra: Object.keys(r.customFields).length
          ? r.customFields
          : undefined,
      })),
    });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Preview failed" }, { status: 500 });
  }
}
