import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

// Creates a product collection per brand (from product.metadata.brand) and
// assigns every product to its brand's collection, so the storefront can filter
// by brand via the native collection_id filter (metadata isn't filterable).
export default async function setupBrandCollections({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productModule = container.resolve(Modules.PRODUCT)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "collection_id", "metadata"],
    pagination: { take: null } as any,
  })

  // Group product ids by brand slug.
  const byBrand = new Map<string, { title: string; ids: string[] }>()
  for (const p of products) {
    const raw = p.metadata?.brand ? String(p.metadata.brand).trim() : ""
    if (!raw) continue
    const handle = slugify(raw)
    if (!handle) continue
    if (!byBrand.has(handle)) byBrand.set(handle, { title: raw, ids: [] })
    byBrand.get(handle)!.ids.push(p.id)
  }
  logger.info(`brands found: ${byBrand.size}, products with a brand: ${[...byBrand.values()].reduce((a, b) => a + b.ids.length, 0)}`)

  // Existing collections (idempotent re-runs).
  const existing = await productModule.listProductCollections({}, { take: null })
  const byHandle = new Map<string, any>(existing.map((c: any) => [c.handle, c]))

  const toCreate = [...byBrand.entries()]
    .filter(([handle]) => !byHandle.has(handle))
    .map(([handle, { title }]) => ({ title, handle }))
  if (toCreate.length) {
    const created = await productModule.createProductCollections(toCreate)
    for (const c of created) byHandle.set(c.handle, c)
    logger.info(`created ${created.length} brand collections`)
  }

  // Assign products to their brand collection, in batches.
  let assigned = 0
  const BATCH = 200
  for (const [handle, { ids }] of byBrand.entries()) {
    const col = byHandle.get(handle)
    if (!col) continue
    for (let i = 0; i < ids.length; i += BATCH) {
      await productModule.updateProducts({ id: ids.slice(i, i + BATCH) } as any, { collection_id: col.id })
      assigned += Math.min(BATCH, ids.length - i)
    }
  }
  logger.info(`✅ Done. Assigned ${assigned} products across ${byBrand.size} brand collections.`)
}
