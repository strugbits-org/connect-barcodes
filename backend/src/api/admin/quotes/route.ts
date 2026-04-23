import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

type QuoteBody = {
  customer_name: string;
  customer_email: string;
  company_name?: string;
  phone?: string;
  items: Array<{ product_id: string; quantity: number; notes?: string }>;
  message?: string;
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const quoteService = req.scope.resolve("quote") as any;
  const quotes = await quoteService.listQuotes({}, { relations: ["items"] });
  res.json({ quotes });
}

export async function POST(req: MedusaRequest<QuoteBody>, res: MedusaResponse) {
  const { customer_name, customer_email, company_name, phone, items, message } = req.body;

  if (!customer_name || !customer_email || !items?.length) {
    return res.status(400).json({ message: "Missing required fields: customer_name, customer_email, items" });
  }

  const quoteService = req.scope.resolve("quote") as any;
  const quote = await quoteService.createQuote({
    customer_name,
    customer_email,
    company_name,
    phone,
    items,
    message,
    status: "pending",
  });

  res.status(201).json({ quote });
}
