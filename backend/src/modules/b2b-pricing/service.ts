import { MedusaService } from "@medusajs/framework/utils";
import { CustomerTier } from "./models/customer-tier";
import { ProductTierPrice } from "./models/product-tier-price";

type TierType = "standard" | "tier1" | "tier2" | "tier3";

const TIER_DISCOUNTS: Record<TierType, { min: number; max: number }> = {
  standard: { min: 0, max: 0 },
  tier1: { min: 5, max: 10 },
  tier2: { min: 15, max: 20 },
  tier3: { min: 25, max: 30 },
};

class B2bPricingService extends MedusaService({ CustomerTier, ProductTierPrice }) {
  async getCustomerTier(customerId: string): Promise<TierType> {
    const tiers = await this.listCustomerTiers({ customer_id: customerId });
    return (tiers[0]?.tier as TierType) ?? "standard";
  }

  async setCustomerTier(customerId: string, tier: TierType, companyName?: string) {
    const existing = await this.listCustomerTiers({ customer_id: customerId });
    if (existing.length > 0) {
      return this.updateCustomerTiers(
        { customer_id: customerId },
        { tier, company_name: companyName ?? null }
      );
    }
    return this.createCustomerTiers({ customer_id: customerId, tier, company_name: companyName ?? null });
  }

  async getPricedVariant(variantId: string, customerId?: string): Promise<{ amount: number; tier: TierType } | null> {
    const tier: TierType = customerId ? await this.getCustomerTier(customerId) : "standard";
    const prices = await this.listProductTierPrices({ variant_id: variantId, tier });
    if (prices.length === 0) return null;
    return { amount: Number(prices[0].amount), tier };
  }

  async setProductTierPrices(
    productId: string,
    variantId: string,
    basePrice: number,
    currency: string = "usd"
  ) {
    const tiers: TierType[] = ["standard", "tier1", "tier2", "tier3"];
    const discountMidpoints: Record<TierType, number> = {
      standard: 0,
      tier1: 7.5,
      tier2: 17.5,
      tier3: 27.5,
    };

    const results = [];
    for (const tier of tiers) {
      const discount = discountMidpoints[tier];
      const amount = Math.round(basePrice * (1 - discount / 100));

      const existing = await this.listProductTierPrices({ variant_id: variantId, tier });
      if (existing.length > 0) {
        const updated = await this.updateProductTierPrices(
          { variant_id: variantId, tier },
          { amount, currency_code: currency }
        );
        results.push(updated);
      } else {
        const created = await this.createProductTierPrices({
          product_id: productId,
          variant_id: variantId,
          tier,
          currency_code: currency,
          amount,
        });
        results.push(created);
      }
    }
    return results;
  }

  getTierDiscountRange(tier: TierType) {
    return TIER_DISCOUNTS[tier];
  }
}

export default B2bPricingService;
