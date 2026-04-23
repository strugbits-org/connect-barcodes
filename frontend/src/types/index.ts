export type CustomerTier = "standard" | "tier1" | "tier2" | "tier3";

export type Product = {
  id: string;
  title: string;
  description?: string | null;
  handle: string;
  thumbnail?: string | null;
  status: string;
  metadata?: Record<string, unknown> | null;
  variants?: ProductVariant[];
  categories?: ProductCategory[];
  images?: ProductImage[];
  customer_tier?: CustomerTier;
};

export type ProductVariant = {
  id: string;
  title: string;
  sku?: string | null;
  prices?: VariantPrice[];
  tier_price?: number | null;
  tier?: CustomerTier;
};

export type VariantPrice = {
  id: string;
  amount: number;
  currency_code: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  handle: string;
};

export type ProductImage = {
  id: string;
  url: string;
};

export type CartItem = {
  id: string;
  quantity: number;
  variant_id: string;
  unit_price: number;
  title: string;
  thumbnail?: string | null;
  variant?: {
    title: string;
    product?: { title: string; thumbnail?: string | null };
  };
};

export type Cart = {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  region_id?: string;
  payment_sessions?: Array<{ provider_id: string; data: Record<string, unknown> }>;
};

export type Order = {
  id: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  display_id: number;
  created_at: string;
  total: number;
  subtotal: number;
  items: CartItem[];
  shipping_address?: Address;
  customer?: { email: string; first_name?: string; last_name?: string };
};

export type Address = {
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country_code?: string;
  phone?: string;
};

export type Quote = {
  id: string;
  customer_name: string;
  customer_email: string;
  company_name?: string;
  phone?: string;
  items: QuoteItem[];
  message?: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  created_at: string;
};

export type QuoteItem = {
  product_id: string;
  quantity: number;
  notes?: string;
};

export type AdminUser = {
  email: string;
  firstName?: string;
  lastName?: string;
};
