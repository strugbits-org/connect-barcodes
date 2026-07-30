import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { QUOTE_MODULE } from "../../../../modules/quote"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const quoteService = req.scope.resolve(QUOTE_MODULE) as any
  const quote = await quoteService.retrieveQuote(req.params.id)
  return res.json({ quote })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const quoteService = req.scope.resolve(QUOTE_MODULE) as any
  const body = req.body as Record<string, any>

  const updated = await quoteService.updateQuotes(req.params.id, {
    ...(body.status && { status: body.status }),
    ...(body.admin_notes !== undefined && { admin_notes: body.admin_notes }),
  })

  return res.json({ quote: updated })
}
