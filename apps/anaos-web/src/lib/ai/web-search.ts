/**
 * Live web search — disabled by default. Enable later with ANAOS_WEB_SEARCH=true
 * and TAVILY_API_KEY or GOOGLE_CSE_* in .env
 */

export type SearchHit = {
  title: string;
  url: string;
  snippet: string;
};

export function shouldResearchWeb(_text: string): boolean {
  return process.env.ANAOS_WEB_SEARCH === "true";
}

export async function runWebResearch(
  _message: string,
  _industry: string
): Promise<string | null> {
  return null;
}
