import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export function formatPriceDollars(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export const TIER_LABELS: Record<string, string> = {
  standard: "Standard",
  tier1: "Tier 1 (5-10% off)",
  tier2: "Tier 2 (15-20% off)",
  tier3: "Tier 3 (25-30% off)",
};

export const TIER_DISCOUNT: Record<string, number> = {
  standard: 0,
  tier1: 7.5,
  tier2: 17.5,
  tier3: 27.5,
};

export function getPricedAmount(baseAmount: number, tier: string): number {
  const discount = TIER_DISCOUNT[tier] ?? 0;
  return Math.round(baseAmount * (1 - discount / 100));
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}
