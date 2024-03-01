import {
  MedusaRequest,
  MedusaResponse,
  ProductService,
} from "@medusajs/medusa";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import SanityService from "src/services/sanity";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const data = req.body;

  console.log("webhook called with data: ", data);

  const productService = req.scope.resolve<ProductService>("productService");
  const sanityService = req.scope.resolve<SanityService>("sanityService");

  const { _id, ...product } = data;

  if (!_id) {
    res.status(400).json({ message: "id is required" });
    return;
  }

  if (product.images?.length) {
    product.images = product.images.map((image: SanityImageSource) =>
      sanityService.imgUrlfor(image)
    );
  }

  const updatedProduct = await productService.update(_id, product);

  if (!updatedProduct) {
    res.status(404).json({ message: "product not found" });
    return;
  }

  try {
    res.status(200).json({ product: updatedProduct });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { id } = req.body;

  const productService = req.scope.resolve<ProductService>("productService");

  try {
    await productService.delete(id);
    res.status(200).json({ message: "product deleted" });
    return;
  } catch (error) {
    res.status(500).json({ error });
    return;
  }
}
