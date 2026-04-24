import { MedusaService } from "@medusajs/framework/utils";
import { CustomerTier } from "./models/customer-tier";
import { ProductTierPrice } from "./models/product-tier-price";

class B2bPricingService extends MedusaService({ CustomerTier, ProductTierPrice }) {}

export default B2bPricingService;
