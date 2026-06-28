import { prisma } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/crypto";
import { chunkText } from "@/lib/knowledge/chunk";

export type KnowledgeDocRecord = {
  workspaceId?: string;
  sourceUrl?: string;
  title: string;
  content: string;
  chunks: string[];
  createdAt: string;
};

export async function saveKnowledgeDoc(params: {
  accountId: string;
  workspaceId?: string;
  sourceUrl?: string;
  title: string;
  content: string;
}) {
  const chunks = chunkText(params.content);
  const payload: KnowledgeDocRecord = {
    workspaceId: params.workspaceId,
    sourceUrl: params.sourceUrl,
    title: params.title,
    content: params.content.slice(0, 180_000),
    chunks,
    createdAt: new Date().toISOString(),
  };

  const saved = await prisma.integrationCredential.create({
    data: {
      accountId: params.accountId,
      type: "knowledge_doc",
      name: params.title.slice(0, 120),
      credentials: encrypt(JSON.stringify(payload)),
      isActive: true,
    },
    select: { id: true, name: true, createdAt: true },
  });

  return {
    id: saved.id,
    title: saved.name,
    chunkCount: chunks.length,
  };
}

export async function loadKnowledgeDocs(params: {
  accountId: string;
  workspaceId?: string;
  limit?: number;
}): Promise<Array<{ id: string; record: KnowledgeDocRecord }>> {
  const rows = await prisma.integrationCredential.findMany({
    where: {
      accountId: params.accountId,
      type: "knowledge_doc",
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
    take: Math.min(params.limit ?? 12, 25),
    select: { id: true, credentials: true },
  });

  const out: Array<{ id: string; record: KnowledgeDocRecord }> = [];
  for (const row of rows) {
    try {
      const parsed = JSON.parse(decrypt(row.credentials)) as KnowledgeDocRecord;
      if (params.workspaceId && parsed.workspaceId && parsed.workspaceId !== params.workspaceId) continue;
      out.push({ id: row.id, record: parsed });
    } catch {
      continue;
    }
  }
  return out;
}

function tokenize(text: string): string[] {
  const raw = text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/g)
    .filter(Boolean);

  const stop = new Set([
    "the","and","for","with","that","this","from","your","you","are","was","were","will","have","has","had","not",
    "but","can","could","should","would","into","onto","over","under","about","what","when","where","why","how",
    "then","than","them","they","their","there","here","just","like","also","only","very","more","most","some",
  ]);

  const filtered = raw.filter((w) => w.length >= 4 && !stop.has(w));
  return filtered.slice(0, 24);
}

export function buildKnowledgeContext(params: {
  query: string;
  docs: Array<{ id: string; record: KnowledgeDocRecord }>;
  maxChunks?: number;
  maxChars?: number;
}): { context: string | null; matchedDocIds: string[] } {
  const tokens = tokenize(params.query);
  if (tokens.length === 0) return { context: null, matchedDocIds: [] };

  const scored: Array<{ docId: string; title: string; chunk: string; score: number }> = [];

  for (const { id, record } of params.docs) {
    for (const chunk of record.chunks || []) {
      const hay = chunk.toLowerCase();
      let s = 0;
      for (const t of tokens) {
        if (hay.includes(t)) s += 1;
      }
      if (s > 0) scored.push({ docId: id, title: record.title, chunk, score: s });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, Math.min(params.maxChunks ?? 6, 10));
  if (picked.length === 0) return { context: null, matchedDocIds: [] };

  const maxChars = Math.min(params.maxChars ?? 1800, 3000);
  const matchedDocIds = [...new Set(picked.map((p) => p.docId))];

  let out = "";
  for (const p of picked) {
    const line = `- (${p.title}) ${p.chunk.replace(/\s+/g, " ").trim()}`;
    if (out.length + line.length + 1 > maxChars) break;
    out += (out ? "\n" : "") + line;
  }

  return {
    context: out ? `Knowledge Base (use as ground truth):\n${out}` : null,
    matchedDocIds,
  };
}

