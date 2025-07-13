import { HttpClient } from "./client";
import { FaqService } from "./services/faq";
import { ReaskedOptions } from "./types";

export class Reasked {
  private client: HttpClient;
  public faq: FaqService;

  constructor(apiKey: string, options: ReaskedOptions = {}) {
    this.client = new HttpClient(apiKey, options);
    this.faq = new FaqService(this.client);
  }
}
