import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { QUOTE_MODULE } from "../../../modules/quote"

const CreateQuoteSchema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1),
        product_name: z.string().optional(),
        quantity: z.number().int().positive(),
        notes: z.string().optional(),
      })
    )
    .min(1),
  message: z.string().optional(),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = CreateQuoteSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    })
  }

  const quoteService = req.scope.resolve(QUOTE_MODULE) as any
  const data = parsed.data

  const quote = await quoteService.createQuotes({
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    company_name: data.company_name || null,
    phone: data.phone || null,
    items: data.items,
    message: data.message || null,
    status: "pending",
  })

  return res.status(201).json({ quote })
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const quoteService = req.scope.resolve(QUOTE_MODULE) as any
  const email = req.query.email as string | undefined
  const filters: Record<string, any> = {}
  if (email) filters.customer_email = email

  const quotes = await quoteService.listQuotes(
    filters,
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
          select: ["id", "title", "thumbnail", "handle"],
          relations: ["variants"],
        }
      )
      for (const p of products) {
        const variant = p.variants?.[0]
        productMap.set(p.id, {
          title: p.title,
          thumbnail: p.thumbnail,
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
      }
    }
  }

  return res.json({ quotes })
}
