import axios, { AxiosInstance } from "axios";

export interface ReaskedConfig {
  orgSecret: string;
  baseURL?: string;
}

export interface FAQGetParams {
  id: string;
}

export interface FAQResponse {
  id: string;
  question: string;
  answer: string;
  // Add other FAQ fields as needed
}

export class Reasked {
  private client: AxiosInstance;
  public readonly faq: {
    get: (params: FAQGetParams) => Promise<FAQResponse>;
  };

  constructor(config: string | ReaskedConfig) {
    const orgSecret = typeof config === "string" ? config : config.orgSecret;
    const baseURL =
      typeof config === "string"
        ? "https://api.reasked.com/v1"
        : config.baseURL || "https://api.reasked.com/v1";

    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${orgSecret}`,
        "Content-Type": "application/json",
      },
    });

    this.faq = {
      get: async (params: FAQGetParams): Promise<FAQResponse> => {
        const response = await this.client.get(`/faq/${params.id}`);
        return response.data;
      },
    };
  }
}
