import { Module } from "@medusajs/framework/utils";
import B2bPricingService from "./service";

export const B2B_PRICING_MODULE = "b2bPricing";

export default Module(B2B_PRICING_MODULE, {
  service: B2bPricingService,
});
