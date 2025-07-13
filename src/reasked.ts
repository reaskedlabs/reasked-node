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

  /**
   * @deprecated Use reasked.faq.getFaqGroupBySlug() instead
   */
  public async getFaqGroupBySlug(
    ...args: Parameters<FaqService["getFaqGroupBySlug"]>
  ) {
    return this.faq.getFaqGroupBySlug(...args);
  }

  /**
   * @deprecated Use reasked.faq.getFaqGroupById() instead
   */
  public async getFaqGroupById(
    ...args: Parameters<FaqService["getFaqGroupById"]>
  ) {
    return this.faq.getFaqGroupById(...args);
  }
}
