import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { QUOTE_MODULE } from "../../../modules/quote"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const quoteService = req.scope.resolve(QUOTE_MODULE) as any
  const quotes = await quoteService.listQuotes(
    {},
    { order: { created_at: "DESC" } }
  )

  const productService = req.scope.resolve("product") as any
  const allProductIds = new Set<string>()

  for (const quote of quotes) {
    const items = (quote as any).items
    if (!Array.isArray(items)) continue
    for (const item of items) {
      if (item.product_id?.startsWith("prod_")) {
        allProductIds.add(item.product_id)
      }
    }
  }

  const productMap = new Map<string, any>()

  if (allProductIds.size > 0) {
    try {
      const products = await productService.listProducts(
        { id: [...allProductIds] },
        {
          select: ["id", "title", "thumbnail", "description", "handle"],
          relations: ["variants"],
        }
      )
      for (const p of products) {
        const variant = p.variants?.[0]
        productMap.set(p.id, {
          title: p.title,
          thumbnail: p.thumbnail,
          description: p.description,
          handle: p.handle,
          sku: variant?.sku ?? null,
        })
      }
    } catch {
      // If product resolution fails, items keep their raw data
    }
  }

  for (const quote of quotes) {
    const items = (quote as any).items
    if (!Array.isArray(items)) continue
    for (const item of items) {
      const info = productMap.get(item.product_id)
      if (info) {
        item.product_name = item.product_name || info.title
        item.product_thumbnail = info.thumbnail
        item.product_handle = info.handle
        item.product_sku = info.sku
        item.product_description = info.description
      }
    }
  }

  return res.json({ quotes })
}
