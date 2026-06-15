import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/products/:id/variants/:variantId",
      method: ["POST"],
      middlewares: [
        (req: any, _res: any, next: any) => {
          // Medusa v2.6.1 bug: upsertWithReplace calls .map() on options but
          // the admin panel sends options as a plain object {name: value}.
          // Strip it so only non-options fields are updated; option values
          // on existing variants are immutable anyway.
          if (req.body?.options && !Array.isArray(req.body.options)) {
            delete req.body.options
          }
          next()
        }
      ]
    }
  ]
})
