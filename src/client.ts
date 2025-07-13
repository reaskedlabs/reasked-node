import { RequestOptions, ReaskedOptions } from "./types";

export class HttpClient {
  private baseURL: string;
  private apiKey: string;
  private timeout: number;
  private retries: number;
  private debug: boolean;

  constructor(apiKey: string, options: ReaskedOptions = {}) {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    this.apiKey = apiKey;
    this.baseURL = options.host || "https://api.reasked.com";
    this.timeout = options.timeout || 30000;
    this.retries = options.retries || 3;
    this.debug = options.debug || false;
  }

  private debugLog(message: string, data?: any): void {
    if (this.debug) {
      console.log(`[Reasked Debug] ${message}`, data ? data : "");
    }
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requestOptions?: RequestOptions
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const timeout = requestOptions?.timeout || this.timeout;
    const retries = requestOptions?.retries || this.retries;

    this.debugLog(`Making ${options.method || "GET"} request to: ${url}`);
    this.debugLog(`Request timeout: ${timeout}ms, retries: ${retries}`);

    const config: RequestInit = {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
        ...requestOptions?.headers,
      },
      ...options,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      this.debugLog(`Attempt ${attempt + 1}/${retries + 1}`);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        this.debugLog(
          `Response status: ${response.status} ${response.statusText}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          this.debugLog(`API error response:`, errorData);
          throw new Error(
            errorData.message ||
              `API request failed: ${response.status} ${response.statusText}`
          );
        }

        const responseData = await response.json();
        this.debugLog(`Request successful, response data:`, responseData);
        return responseData;
      } catch (error) {
        lastError = error as Error;

        if (error instanceof Error && error.name === "AbortError") {
          this.debugLog(`Request timeout after ${timeout}ms`);
          throw new Error(`Request timeout after ${timeout}ms`);
        }

        this.debugLog(`Attempt ${attempt + 1} failed:`, error);

        if (attempt === retries) {
          this.debugLog(`All ${retries + 1} attempts failed, throwing error`);
          throw lastError;
        }

        // Exponential backoff
        const backoffTime = Math.pow(2, attempt) * 1000;
        this.debugLog(`Waiting ${backoffTime}ms before retry`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }

    throw lastError;
  }

  public async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, options);
  }

  public async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      options
    );
  }

  public async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      options
    );
  }

  public async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PATCH",
        body: data ? JSON.stringify(data) : undefined,
      },
      options
    );
  }

  public async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" }, options);
  }
}
