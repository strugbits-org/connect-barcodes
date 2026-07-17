import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createStockLocationsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  createInventoryItemsWorkflow,
  createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows"

const STOCK_QTY = 100
const LOCATION_NAME = "Main Warehouse"
const BATCH = 100

export default async function setupInventory({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const stockLocation = container.resolve(Modules.STOCK_LOCATION)
  const salesChannel = container.resolve(Modules.SALES_CHANNEL)

  // 1) Stock location (create if missing)
  let [loc] = await stockLocation.listStockLocations({ name: LOCATION_NAME })
  if (!loc) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: { locations: [{ name: LOCATION_NAME }] },
    })
    loc = result[0]
    logger.info(`Created stock location ${loc.id}`)
  } else {
    logger.info(`Stock location already exists: ${loc.id}`)
  }

  // 2) Link every sales channel to the location
  const channels = await salesChannel.listSalesChannels()
  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: loc.id, add: channels.map((c: any) => c.id) },
  })
  logger.info(`Linked ${channels.length} sales channel(s) to location`)

  // 3) Find variants that manage inventory but have no inventory item yet
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "sku", "manage_inventory", "inventory_items.inventory_item_id"],
    filters: { deleted_at: null },
    pagination: { take: null } as any,
  })
  const need = variants.filter(
    (v: any) => v.manage_inventory && (!v.inventory_items || v.inventory_items.length === 0)
  )
  logger.info(`Variants total=${variants.length}, needing inventory=${need.length}`)

  // 4) Create inventory item + link + level, in batches
  let done = 0
  for (let i = 0; i < need.length; i += BATCH) {
    const chunk = need.slice(i, i + BATCH)

    const { result: items } = await createInventoryItemsWorkflow(container).run({
      input: { items: chunk.map((v: any) => ({ sku: v.sku || v.id, title: v.sku || v.id })) },
    })

    await link.create(
      chunk.map((v: any, idx: number) => ({
        [Modules.PRODUCT]: { variant_id: v.id },
        [Modules.INVENTORY]: { inventory_item_id: items[idx].id },
      }))
    )

    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: items.map((it: any) => ({
          inventory_item_id: it.id,
          location_id: loc.id,
          stocked_quantity: STOCK_QTY,
        })),
      },
    })

    done += chunk.length
    logger.info(`Inventory setup progress: ${done}/${need.length}`)
  }

  logger.info(`✅ Inventory setup complete. Location=${loc.id}, stocked ${done} variants @ ${STOCK_QTY} each.`)
}
