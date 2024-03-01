import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import SanityService from "../services/sanity";
import { ProductEvent } from "../types";

export default async function productDeletedHandler({
  data,
  container,
}: SubscriberArgs<ProductEvent>) {
  const sanityService = container.resolve<SanityService>("sanityService");

  try {
    await sanityService.deleteProduct(data.id);
    console.log(`Product with id ${data.id} deleted in Sanity`);
    return;
  } catch (error) {
    console.log(error);
    return;
  }
}

export const config: SubscriberConfig = {
  event: "product.deleted",
};
