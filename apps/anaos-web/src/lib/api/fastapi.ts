/**
 * FastAPI Bridge for AnasNode Business OS
 * 
 * This client handles communication with the high-performance Python backend.
 * We use FastAPI for:
 * 1. AI Processing (LangChain/LlamaIndex)
 * 2. Voice/Speech Synthesis (High concurrency)
 * 3. Heavy Data Processing
 */

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

export class FastApiClient {
  private static async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${FASTAPI_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        // In local dev, we don't want to wait forever if FastAPI is down
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(error.detail || `FastAPI error: ${response.status}`);
      }

      return response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.name === 'TimeoutError') {
        throw new Error("FastAPI server timeout (5s)");
      }
      throw new Error(`FastAPI unreachable at ${FASTAPI_URL}: ${e.message}`);
    }
  }

  // Health check
  static async checkHealth() {
    console.log(`[FastAPI] Checking health at ${FASTAPI_URL}...`);
    return this.request<{ status: string }>("/");
  }

  // AI & Workflow Execution (Python is better for this)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async executeWorkflow(workflowId: string, input: any) {
    return this.request(`/v1/workflows/${workflowId}/execute`, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  // Voice Chatbot Processing
  static async processVoice(audioData: Blob) {
    const formData = new FormData();
    formData.append("file", audioData);
    
    const response = await fetch(`${FASTAPI_URL}/v1/voice/process`, {
      method: "POST",
      body: formData,
    });
    
    return response.json();
  }

  // Analytics Engine
  static async getAnalytics(accountId: string) {
    return this.request(`/v1/analytics/${accountId}`);
  }
}
