import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import algoliasearch from "algoliasearch"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const appId = process.env.ALGOLIA_APP_ID
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY
  const indexName = process.env.ALGOLIA_INDEX_NAME || "connect_barcodes_products"

  if (!appId || !adminKey) {
    return res.status(400).json({ error: "Algolia credentials not configured" })
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id", "title", "handle", "description", "thumbnail", "status",
      "collection.*",
      "categories.*",
      "images.*",
      "variants.*",
      "variants.prices.*",
    ],
    filters: { status: "published" },
    pagination: { take: null },
  })

  const records = (products as any[]).map((p: any) => {
    const usdPrice = p.variants
      ?.flatMap((v: any) => v.prices ?? [])
      .find((pr: any) => pr.currency_code === "usd")
    return {
      objectID: p.id,
      id: p.id,
      title: p.title,
      handle: p.handle,
      description: (p.description || "").slice(0, 500),
      thumbnail: p.thumbnail || p.images?.[0]?.url || "",
      status: p.status,
      brand: p.collection?.title || "",
      categories: (p.categories || []).map((c: any) => c.name),
      category_handles: (p.categories || []).map((c: any) => c.handle),
      sku: p.variants?.[0]?.sku || "",
      price: usdPrice ? usdPrice.amount / 100 : 0,
    }
  })

  const client = algoliasearch(appId, adminKey)
  const index = client.initIndex(indexName)

  await index.setSettings({
    searchableAttributes: ["title", "brand", "description", "sku", "categories"],
    attributesForFaceting: ["brand", "categories", "category_handles", "status"],
    customRanking: ["desc(price)"],
  })

  const { objectIDs } = await index.saveObjects(records)

  res.json({
    synced: objectIDs.length,
    index: indexName,
    sample: records.slice(0, 2).map((r: any) => ({ title: r.title, brand: r.brand, price: r.price, categories: r.categories })),
  })
}
