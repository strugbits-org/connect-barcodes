import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createInventoryLevelsWorkflow } from "@medusajs/medusa/core-flows"

const STOCK_QTY = 100
const LOCATION_NAME = "Main Warehouse"

export default async function fixInventoryLevels({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const stockLocation = container.resolve(Modules.STOCK_LOCATION)

  const [loc] = await stockLocation.listStockLocations({ name: LOCATION_NAME })
  if (!loc) throw new Error(`No location named ${LOCATION_NAME}`)

  // All inventory items with their existing levels
  const { data: items } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku", "location_levels.location_id"],
    pagination: { take: null } as any,
  })

  const missing = items.filter(
    (it: any) => !(it.location_levels || []).some((l: any) => l.location_id === loc.id)
  )
  logger.info(`inventory items total=${items.length}, missing level at ${LOCATION_NAME}=${missing.length}`)

  const BATCH = 100
  let done = 0
  for (let i = 0; i < missing.length; i += BATCH) {
    const chunk = missing.slice(i, i + BATCH)
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: chunk.map((it: any) => ({
          inventory_item_id: it.id,
          location_id: loc.id,
          stocked_quantity: STOCK_QTY,
        })),
      },
    })
    done += chunk.length
    logger.info(`created levels: ${done}/${missing.length}`)
  }
  logger.info(`✅ Done. Every inventory item now has a level at ${LOCATION_NAME}.`)
}
