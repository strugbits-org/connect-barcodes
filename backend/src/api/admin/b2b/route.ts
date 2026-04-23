import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { B2B_PRICING_MODULE } from "../../../modules/b2b-pricing";

type B2bTierBody = {
  customer_id: string;
  tier: "standard" | "tier1" | "tier2" | "tier3";
  company_name?: string;
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const b2bService = req.scope.resolve(B2B_PRICING_MODULE) as any;
  const tiers = await b2bService.listCustomerTiers({});
  res.json({ customer_tiers: tiers });
}

export async function POST(req: MedusaRequest<B2bTierBody>, res: MedusaResponse) {
  const { customer_id, tier, company_name } = req.body;
  if (!customer_id || !tier) {
    return res.status(400).json({ message: "customer_id and tier are required" });
  }
  const b2bService = req.scope.resolve(B2B_PRICING_MODULE) as any;
  const result = await b2bService.setCustomerTier(customer_id, tier, company_name);
  res.json({ customer_tier: result });
}
