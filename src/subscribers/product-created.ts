import {
  ProductService,
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/medusa";
import SanityService from "../services/sanity";
import { ProductEvent } from "../types";

export default async function productCreatedHandler({
  data,
  container,
}: SubscriberArgs<ProductEvent>) {
  const productService = container.resolve<ProductService>("productService");

  const product = await productService.retrieve(data.id);

  if (data.no_notification || !product) {
    return;
  }

  const sanityService = container.resolve<SanityService>("sanityService");

  try {
    await sanityService.createProduct(product);
    console.log(`Product with id ${data.id} created in Sanity`);
    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

export const config: SubscriberConfig = {
  event: "product.created",
};
