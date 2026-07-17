import Medusa from "@medusajs/js-sdk";

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_f90e01a551c291ea8e59dc37d0e668b074bf3f8003212d5048abe50985302e91"

export const medusa = new Medusa({
  baseUrl: BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
  auth: { type: "session" },
});

// Fields needed for the storefront, including per-region calculated prices.
// Without a region_id + calculated_price, the store API returns no price and
// the UI shows $0.00.
const PRODUCT_FIELDS =
  "id,title,handle,thumbnail,description,status,metadata,variants.id,variants.title,variants.sku,*variants.calculated_price";

// The store needs a region to calculate prices. Cache the default region id
// so we don't refetch it on every product query.
let cachedRegionId: string | null | undefined;
async function getDefaultRegionId(): Promise<string | undefined> {
  if (cachedRegionId !== undefined) return cachedRegionId ?? undefined;
  try {
    const { regions } = await medusa.store.region.list();
    cachedRegionId = regions?.[0]?.id ?? null;
  } catch {
    cachedRegionId = null;
  }
  return cachedRegionId ?? undefined;
}

export async function getProducts(params?: {
  limit?: number;
  offset?: number;
  category_id?: string[];
  collection_id?: string[];
  q?: string;
  customer_id?: string;
}) {
  try {
    const region_id = await getDefaultRegionId();
    const response = await medusa.store.product.list({
      limit: params?.limit ?? 12,
      offset: params?.offset ?? 0,
      fields: PRODUCT_FIELDS,
      ...(region_id && { region_id }),
      // Store API filters by category_id (category_handle is unsupported and errors).
      ...(params?.category_id && { category_id: params.category_id }),
      // Brands are modeled as collections (metadata isn't filterable by the store API).
      ...(params?.collection_id && { collection_id: params.collection_id }),
      ...(params?.q && { q: params.q }),
    });
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], count: 0, offset: 0, limit: 12 };
  }
}

export async function getProduct(id: string) {
  try {
    const region_id = await getDefaultRegionId();
    const response = await medusa.store.product.retrieve(id, {
      fields: PRODUCT_FIELDS,
      ...(region_id && { region_id }),
    });
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getProductByHandle(handle: string) {
  try {
    const region_id = await getDefaultRegionId();
    const response = await medusa.store.product.list({
      handle,
      fields: PRODUCT_FIELDS,
      ...(region_id && { region_id }),
    });
    return response.products?.[0] ?? null;
  } catch (error) {
    console.error("Error fetching product by handle:", error);
    return null;
  }
}

export async function getCategories() {
  try {
    const response = await medusa.store.category.list();
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { product_categories: [] };
  }
}

// Brands are modeled as collections.
export async function getCollections() {
  try {
    return await medusa.store.collection.list({ limit: 100, fields: "id,title,handle" } as any);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return { collections: [] };
  }
}

export async function getCart(cartId: string) {
  try {
    const response = await medusa.store.cart.retrieve(cartId);
    return response;
  } catch (error) {
    return null;
  }
}

export async function createCart(regionId?: string) {
  try {
    const response = await medusa.store.cart.create({ region_id: regionId });
    return response;
  } catch (error) {
    console.error("Error creating cart:", error);
    return null;
  }
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  try {
    const response = await medusa.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });
    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
  }
}

export async function updateCartItem(cartId: string, lineId: string, quantity: number) {
  try {
    const response = await medusa.store.cart.updateLineItem(cartId, lineId, { quantity });
    return response;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return null;
  }
}

export async function removeCartItem(cartId: string, lineId: string) {
  try {
    await medusa.store.cart.deleteLineItem(cartId, lineId);
    return true;
  } catch (error) {
    console.error("Error removing cart item:", error);
    return false;
  }
}

export async function updateCart(cartId: string, data: Record<string, any>) {
  try {
    return await medusa.store.cart.update(cartId, data as any);
  } catch (error) {
    console.error("Error updating cart:", error);
    return null;
  }
}

export async function listCartShippingOptions(cartId: string) {
  try {
    const response = await medusa.store.fulfillment.listCartOptions({ cart_id: cartId });
    return response.shipping_options ?? [];
  } catch (error) {
    console.error("Error listing shipping options:", error);
    return [];
  }
}

export async function addShippingMethod(cartId: string, optionId: string) {
  try {
    return await medusa.store.cart.addShippingMethod(cartId, { option_id: optionId });
  } catch (error) {
    console.error("Error adding shipping method:", error);
    return null;
  }
}

export async function initiatePaymentSession(cart: any, providerId = "pp_stripe_stripe") {
  try {
    return await medusa.store.payment.initiatePaymentSession(cart, { provider_id: providerId });
  } catch (error) {
    console.error("Error initiating payment session:", error);
    return null;
  }
}

export async function completeCart(cartId: string) {
  try {
    return await medusa.store.cart.complete(cartId);
  } catch (error) {
    console.error("Error completing cart:", error);
    return null;
  }
}

export async function getRegions() {
  try {
    const response = await medusa.store.region.list();
    return response;
  } catch (error) {
    return { regions: [] };
  }
}

export async function submitQuote(data: {
  customer_name: string;
  customer_email: string;
  company_name?: string;
  phone?: string;
  items: Array<{ product_id: string; quantity: number; notes?: string }>;
  message?: string;
}) {
  const res = await fetch(`${BACKEND_URL}/store/quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ── Customer auth / orders ───────────────────────────────────────────────────
export async function registerCustomer(data: {
  email: string; password: string; first_name?: string; last_name?: string;
}) {
  const creds = { email: data.email, password: data.password };
  const customerBody = { email: data.email, first_name: data.first_name, last_name: data.last_name };

  try {
    // Happy path: create the auth identity, then the linked customer record.
    await medusa.auth.register("customer", "emailpass", creds);
    await medusa.store.customer.create(customerBody);
  } catch (err: any) {
    if (!/already exists/i.test(String(err?.message ?? ""))) throw err;

    // The auth identity already exists (guest checkout, or a half-finished
    // attempt that created the identity but never linked a customer). We can't
    // recover through the SDK's session login — an unlinked identity has no
    // customer actor, so the session step 401s. Instead, get a raw token and
    // link a customer to the identity directly, then log in normally.
    const authRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
    if (!authRes.ok) {
      throw new Error("This email is already registered. Please sign in instead.");
    }
    const { token } = await authRes.json();

    // Create + link the customer (ignore if it's already linked).
    await fetch(`${BACKEND_URL}/store/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-publishable-api-key": PUBLISHABLE_KEY,
      },
      body: JSON.stringify(customerBody),
    });
  }

  // Establish a clean, linked session.
  await medusa.auth.login("customer", "emailpass", creds);
}

export async function loginCustomer(email: string, password: string) {
  return await medusa.auth.login("customer", "emailpass", { email, password });
}

export async function logoutCustomer() {
  try { await medusa.auth.logout(); } catch { /* ignore */ }
}

export async function getCustomer() {
  try {
    const { customer } = await medusa.store.customer.retrieve();
    return customer ?? null;
  } catch {
    return null;
  }
}

export async function listOrders() {
  try {
    const { orders } = await medusa.store.order.list({ limit: 50, order: "-created_at" } as any);
    return orders ?? [];
  } catch (error) {
    console.error("Error listing orders:", error);
    return [];
  }
}
