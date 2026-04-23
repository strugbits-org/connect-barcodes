import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { B2B_PRICING_MODULE } from "../../../modules/b2b-pricing";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { customer_id, category, search, limit = "20", offset = "0" } = req.query as Record<string, string>;

  const productService = req.scope.resolve("product") as any;
  const b2bService = req.scope.resolve(B2B_PRICING_MODULE) as any;

  const filters: Record<string, unknown> = { status: ["published"] };
  if (category) filters["categories"] = { handle: category };

  const [products, count] = await productService.listAndCountProducts(filters, {
    relations: ["variants", "variants.prices", "categories", "images", "tags"],
    take: parseInt(limit),
    skip: parseInt(offset),
  });

  const customerTier = customer_id ? await b2bService.getCustomerTier(customer_id) : "standard";

  const enrichedProducts = await Promise.all(
    products.map(async (product: any) => {
      const variantPrices = await Promise.all(
        (product.variants || []).map(async (variant: any) => {
          const tierPrice = await b2bService.listProductTierPrices({
            variant_id: variant.id,
            tier: customerTier,
          });
          return {
            ...variant,
            tier_price: tierPrice[0]?.amount ?? null,
            tier: customerTier,
          };
        })
      );
      return { ...product, variants: variantPrices, customer_tier: customerTier };
    })
  );

  res.json({ products: enrichedProducts, count, offset: parseInt(offset), limit: parseInt(limit) });
}
