import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// Links every product that has no shipping profile to the default one, so
// cart completion's shipping-profile validation passes. Products imported in
// bulk were created without a shipping profile.
export default async function linkShippingProfile({ container }: { container: any }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fulfillment = container.resolve(Modules.FULFILLMENT)

  const profiles = await fulfillment.listShippingProfiles({}, { take: 1 })
  const profileId = profiles[0]?.id
  if (!profileId) throw new Error("No shipping profile found")
  logger.info(`Default shipping profile: ${profileId}`)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "shipping_profile.id"],
    pagination: { take: null } as any,
  })
  const need = products.filter((p: any) => !p.shipping_profile)
  logger.info(`Products total=${products.length}, missing shipping profile=${need.length}`)

  const BATCH = 200
  let done = 0
  for (let i = 0; i < need.length; i += BATCH) {
    const chunk = need.slice(i, i + BATCH)
    await link.create(
      chunk.map((p: any) => ({
        [Modules.PRODUCT]: { product_id: p.id },
        [Modules.FULFILLMENT]: { shipping_profile_id: profileId },
      }))
    )
    done += chunk.length
    logger.info(`linked: ${done}/${need.length}`)
  }
  logger.info(`✅ Done. Every product now has a shipping profile.`)
}
