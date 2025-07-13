export type ReaskedOptions = {
  host?: string;
  timeout?: number;
  retries?: number;
  debug?: boolean;
};

export interface ReaskedResponse<T = any> {
  status: "success" | "error";
  data?: T;
  message?: string;
}

export interface ReaskedError {
  status: "error";
  message: string;
}

export interface FaqTranslation {
  question: string;
  answer: string;
  lang: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Faq {
  id: string;
  status: "draft" | "published";
  position: number;
  createdAt: string;
  updatedAt: string;
  translations: FaqTranslation[];
}

export interface FaqGroupTranslation {
  name: string;
  description: string;
  lang: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqGroupData {
  id: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  translations: FaqGroupTranslation[];
  faqs: Faq[];
}

export type ReaskedRequestOptions = {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
};

export type ReaskedMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export class Reasked {
  private baseURL: string;
  private apiKey: string;
  private timeout: number;
  private retries: number;
  private debug: boolean;

  constructor(apiKey: string, options: ReaskedOptions) {
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

  public async getFaqGroupBySlug(
    slug: string,
    options?: {
      status?: "all" | "draft" | "published";
      langs?: string[];
    }
  ): Promise<ReaskedResponse<FaqGroupData>> {
    this.debugLog(`[slug=${slug}] Getting FAQ group by slug`, options);

    const params = new URLSearchParams();

    if (options?.status) params.append("status", options.status);
    if (options?.langs) params.append("langs", options.langs.join(","));

    const queryString = params.toString();
    const endpoint = `/faq-groups/slug/${slug}${
      queryString ? `?${queryString}` : ""
    }`;

    this.debugLog(`[slug=${slug}] Constructed endpoint: ${endpoint}`);

    try {
      const response = await this.get<ReaskedResponse<FaqGroupData>>(endpoint);

      this.debugLog(`[slug=${slug}] API response status: ${response.status}`);

      if (response.status === "error") {
        this.debugLog(`[slug=${slug}] API returned error: ${response.message}`);
        return {
          status: "error",
          message: response.message,
        };
      }

      if (!response.data) {
        this.debugLog(`[slug=${slug}] No data returned from API`);
        return {
          status: "error",
          message: "No data returned from Reasked API",
        };
      }

      this.debugLog(
        `[slug=${slug}] Successfully retrieved FAQ group with ${response.data.faqs.length} FAQs`
      );
      return response;
    } catch (error) {
      this.debugLog(
        `[slug=${slug}] Error occurred: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public async getFaqGroupById(
    id: string,
    options?: {
      status?: "all" | "draft" | "published";
      langs?: string[];
    }
  ): Promise<ReaskedResponse<FaqGroupData>> {
    this.debugLog(`Getting FAQ group by ID: ${id}`, { id, ...options });

    const params = new URLSearchParams();

    if (options?.status) params.append("status", options.status);
    if (options?.langs) params.append("langs", options.langs.join(","));

    const queryString = params.toString();
    const endpoint = `/faq-groups/${id}${queryString ? `?${queryString}` : ""}`;

    this.debugLog(`Constructed endpoint for ID ${id}: ${endpoint}`);

    try {
      const response = await this.get<ReaskedResponse<FaqGroupData>>(endpoint);

      this.debugLog(`API response status for ID ${id}: ${response.status}`);

      if (response.status === "error") {
        this.debugLog(`API returned error for ID ${id}: ${response.message}`);
        return {
          status: "error",
          message: response.message,
        };
      }

      if (!response.data) {
        this.debugLog(`No data returned from API for ID ${id}`);
        return {
          status: "error",
          message: "No data returned from Reasked API",
        };
      }

      this.debugLog(
        `Successfully retrieved FAQ group for ID ${id} with ${response.data.faqs.length} FAQs`
      );
      return response;
    } catch (error) {
      this.debugLog(
        `Error occurred for ID ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requestOptions?: ReaskedRequestOptions
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

  private async get<T>(
    endpoint: string,
    options?: ReaskedRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, options);
  }

  private async post<T>(
    endpoint: string,
    data?: any,
    options?: ReaskedRequestOptions
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

  private async put<T>(
    endpoint: string,
    data?: any,
    options?: ReaskedRequestOptions
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

  private async delete<T>(
    endpoint: string,
    options?: ReaskedRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" }, options);
  }

  private async patch<T>(
    endpoint: string,
    data?: any,
    options?: ReaskedRequestOptions
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
}
