import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

type QuoteBody = {
  customer_name: string;
  customer_email: string;
  company_name?: string;
  phone?: string;
  items: Array<{ product_id: string; quantity: number; notes?: string }>;
  message?: string;
};

export async function POST(req: MedusaRequest<QuoteBody>, res: MedusaResponse) {
  const { customer_name, customer_email, company_name, phone, items, message } = req.body;

  if (!customer_name || !customer_email || !items?.length) {
    return res.status(400).json({
      message: "Missing required fields: customer_name, customer_email, items",
    });
  }

  const logger = req.scope.resolve("logger") as any;
  logger.info(`[Quote] New quote request from ${customer_name} <${customer_email}>`);

  // Store in a notification or email here in production
  // For now return a success response with a generated quote ID
  const quoteId = `Q-${Date.now()}`;

  res.status(201).json({
    quote: {
      id: quoteId,
      customer_name,
      customer_email,
      company_name,
      phone,
      items,
      message,
      status: "pending",
      created_at: new Date().toISOString(),
    },
  });
}
