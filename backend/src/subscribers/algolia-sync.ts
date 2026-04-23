import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
);
const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME || "connect_barcodes_products");

type ProductEventData = {
  id: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  status?: string;
  handle?: string;
  variants?: Array<{ id: string; title: string; prices?: Array<{ amount: number; currency_code: string }> }>;
  categories?: Array<{ id: string; name: string }>;
  tags?: Array<{ value: string }>;
  metadata?: Record<string, unknown>;
};

async function syncProductToAlgolia(productId: string, container: any) {
  try {
    const productModuleService = container.resolve("product");
    const [products] = await productModuleService.listAndCountProducts(
      { id: [productId] },
      {
        relations: ["variants", "variants.prices", "categories", "tags", "images"],
        select: ["id", "title", "description", "thumbnail", "status", "handle", "metadata"],
      }
    );

    if (!products.length) return;

    const product = products[0] as ProductEventData;

    if (product.status === "published") {
      const basePrice = product.variants?.[0]?.prices?.find((p) => p.currency_code === "usd")?.amount || 0;

      await index.saveObject({
        objectID: product.id,
        id: product.id,
        title: product.title,
        description: product.description,
        thumbnail: product.thumbnail,
        handle: product.handle,
        status: product.status,
        price: basePrice / 100,
        categories: product.categories?.map((c) => c.name) || [],
        tags: product.tags?.map((t) => t.value) || [],
        brand: (product.metadata as any)?.brand || "",
        sku: (product.metadata as any)?.sku || "",
        variants: product.variants?.map((v) => ({
          id: v.id,
          title: v.title,
          price: v.prices?.find((p) => p.currency_code === "usd")?.amount || 0,
        })) || [],
        _tags: product.categories?.map((c) => c.name) || [],
      });

      console.log(`[Algolia] Synced product: ${product.id} - ${product.title}`);
    } else {
      await index.deleteObject(productId);
      console.log(`[Algolia] Removed unpublished product: ${productId}`);
    }
  } catch (error) {
    console.error(`[Algolia] Failed to sync product ${productId}:`, error);
  }
}

export default async function algoliaProductSync({ event, container }: SubscriberArgs<{ id: string }>) {
  const productId = event.data.id;
  await syncProductToAlgolia(productId, container);
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
};
