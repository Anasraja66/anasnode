import { NextResponse } from "next/server";
import { esClient } from "@/lib/db/searchEngine";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const statsOnly = searchParams.get("stats") === "true";

  try {
    // Return engine stats if requested
    if (statsOnly) {
      return NextResponse.json({ success: true, stats: esClient.getStats() });
    }

    if (!query) {
      const allDocs = await esClient.getAll();
      return NextResponse.json({ success: true, results: allDocs, mode: "all" });
    }

    // TF-IDF powered search
    const results = await esClient.search(query);

    return NextResponse.json({
      success: true,
      results,
      mode: "tfidf",
      query,
      count: results.length,
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
