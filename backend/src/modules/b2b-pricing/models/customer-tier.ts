import { model } from "@medusajs/framework/utils";

export const CustomerTier = model.define("customer_tier", {
  id: model.id().primaryKey(),
  customer_id: model.text().unique(),
  tier: model.enum(["standard", "tier1", "tier2", "tier3"]).default("standard"),
  company_name: model.text().nullable(),
  notes: model.text().nullable(),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
});

export type CustomerTierDTO = {
  id: string;
  customer_id: string;
  tier: "standard" | "tier1" | "tier2" | "tier3";
  company_name?: string | null;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
};
