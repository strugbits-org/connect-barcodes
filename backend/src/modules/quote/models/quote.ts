import { model } from "@medusajs/framework/utils"

export const Quote = model.define("quote", {
  id: model.id().primaryKey(),
  customer_name: model.text(),
  customer_email: model.text(),
  company_name: model.text().nullable(),
  phone: model.text().nullable(),
  items: model.json(),
  message: model.text().nullable(),
  status: model.enum(["pending", "reviewed", "approved", "rejected"]).default("pending"),
  admin_notes: model.text().nullable(),
})
