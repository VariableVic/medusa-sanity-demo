import { Product } from "@medusajs/medusa";
import {
  FirstDocumentMutationOptions,
  PatchOperations,
  SanityClient,
  createClient,
} from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { ProductDocumentCreateDTO } from "../types";

export default class SanityService {
  private apiToken: string;
  private projectId: string;
  private apiVersion: string;
  private dataset: "production" | "development";
  private client: SanityClient;

  constructor() {
    this.apiToken = process.env.SANITY_API_TOKEN;
    this.projectId = process.env.SANITY_PROJECT_ID;
    this.apiVersion = new Date().toISOString().split("T")[0];

    console.log({ apiVersion: this.apiVersion });

    this.dataset =
      process.env.node_env === "production" ? "production" : "development";

    this.client = createClient({
      projectId: this.projectId,
      apiVersion: this.apiVersion,
      dataset: this.dataset,
      token: this.apiToken,
      useCdn: false,
    });
  }

  async createProduct(
    product: Product,
    options?: FirstDocumentMutationOptions
  ): Promise<any> {
    console.log("Creating product in Sanity");
    const document: ProductDocumentCreateDTO = {
      _id: product.id,
      _type: "product",
      title: product.title,
      description: product.description || null,
    };
    return await this.client.create(document, options);
  }

  async updateProduct(product: Product): Promise<any> {
    const operations: PatchOperations = {
      set: {
        title: product.title,
        description: product.description || null,
      },
    };
    return await this.client.patch(product.id, operations).commit();
  }

  async deleteProduct(id: string): Promise<any> {
    return await this.client.delete(id);
  }

  imgUrlfor(source: SanityImageSource): string {
    const builder = imageUrlBuilder(this.client);
    return builder.image(source).url();
  }
}
