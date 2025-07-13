import { HttpClient } from "../client";
import { FaqGroupData, FaqGroupQueryOptions, ReaskedResponse } from "../types";

export class FaqService {
  constructor(private client: HttpClient) {}

  /**
   * Get FAQ group by slug
   */
  public async getFaqGroupBySlug(
    slug: string,
    options?: FaqGroupQueryOptions
  ): Promise<ReaskedResponse<FaqGroupData>> {
    const params = new URLSearchParams();

    if (options?.status) params.append("status", options.status);
    if (options?.langs) params.append("langs", options.langs.join(","));

    const queryString = params.toString();
    const endpoint = `/faq-groups/slug/${slug}${
      queryString ? `?${queryString}` : ""
    }`;

    try {
      const response = await this.client.get<ReaskedResponse<FaqGroupData>>(
        endpoint
      );

      if (response.status === "error") {
        return {
          status: "error",
          message: response.message,
        };
      }

      if (!response.data) {
        return {
          status: "error",
          message: "No data returned from Reasked API",
        };
      }

      return response;
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get FAQ group by ID
   */
  public async getFaqGroupById(
    id: string,
    options?: FaqGroupQueryOptions
  ): Promise<ReaskedResponse<FaqGroupData>> {
    const params = new URLSearchParams();

    if (options?.status) params.append("status", options.status);
    if (options?.langs) params.append("langs", options.langs.join(","));

    const queryString = params.toString();
    const endpoint = `/faq-groups/${id}${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await this.client.get<ReaskedResponse<FaqGroupData>>(
        endpoint
      );

      if (response.status === "error") {
        return {
          status: "error",
          message: response.message,
        };
      }

      if (!response.data) {
        return {
          status: "error",
          message: "No data returned from Reasked API",
        };
      }

      return response;
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
