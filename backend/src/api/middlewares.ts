import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/products/:id/variants/:variantId",
      method: ["POST"],
      middlewares: [
        (req: any, _res: any, next: any) => {
          if (req.body?.options && !Array.isArray(req.body.options)) {
            delete req.body.options
          }
          next()
        }
      ]
    },
  ]
})
