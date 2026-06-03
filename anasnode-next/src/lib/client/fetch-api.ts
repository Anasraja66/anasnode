/** Client-side fetch that never throws — avoids Next.js error overlay on network failures. */
export async function fetchApi<T = Record<string, unknown>>(
  url: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, { ...init, credentials: "same-origin" });
    let data: T | null = null;
    try {
      data = (await res.json()) as T;
    } catch {
      data = null;
    }
    if (!res.ok) {
      const err =
        (data as { error?: string } | null)?.error ||
        `Request failed (${res.status})`;
      return { ok: false, status: res.status, data, error: err };
    }
    return { ok: true, status: res.status, data, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    return { ok: false, status: 0, data: null, error: message };
  }
}
