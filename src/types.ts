export interface ReaskedOptions {
  host?: string;
  timeout?: number;
  retries?: number;
  debug?: boolean;
}

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

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FaqGroupQueryOptions {
  status?: "all" | "draft" | "published";
  langs?: string[];
}
