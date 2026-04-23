import { model } from "@medusajs/framework/utils";

export const ProductTierPrice = model.define("product_tier_price", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  variant_id: model.text(),
  tier: model.enum(["standard", "tier1", "tier2", "tier3"]),
  currency_code: model.text().default("usd"),
  amount: model.bigNumber(),
  created_at: model.dateTime(),
  updated_at: model.dateTime(),
});

export type ProductTierPriceDTO = {
  id: string;
  product_id: string;
  variant_id: string;
  tier: "standard" | "tier1" | "tier2" | "tier3";
  currency_code: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
};
