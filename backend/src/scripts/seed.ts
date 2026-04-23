import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import algoliasearch from "algoliasearch";

const PRODUCTS = [
  {
    title: "Zebra ZT411 Industrial Printer",
    description: "High-performance industrial label printer with 4-inch print width, 300 dpi resolution, and dual connectivity. Perfect for warehouses and manufacturing floors.",
    handle: "zebra-zt411-industrial-printer",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1612198273689-b22fa91e1f21?w=400",
    metadata: { brand: "Zebra", sku: "ZT411-4", category: "Label Printers" },
    categories: ["label-printers"],
    variants: [{ title: "Default", sku: "ZT411-4-STD", prices: [{ currency_code: "usd", amount: 89900 }] }],
  },
  {
    title: "Honeywell Xenon 1950 Barcode Scanner",
    description: "Area-imaging scanner with superior performance on 1D and 2D barcodes. Designed for high-volume retail and light industrial environments.",
    handle: "honeywell-xenon-1950",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    metadata: { brand: "Honeywell", sku: "1950G-USB", category: "Barcode Scanners" },
    categories: ["barcode-scanners"],
    variants: [{ title: "USB", sku: "1950G-USB", prices: [{ currency_code: "usd", amount: 29900 }] }],
  },
  {
    title: "Datalogic QuickScan QD2430 Scanner",
    description: "Omnidirectional 2D imager with green spot good-read indicator. Reads barcodes off mobile phone screens. Ideal for retail checkout.",
    handle: "datalogic-quickscan-qd2430",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    metadata: { brand: "Datalogic", sku: "QD2430-BK", category: "Barcode Scanners" },
    categories: ["barcode-scanners"],
    variants: [{ title: "Black USB", sku: "QD2430-BK", prices: [{ currency_code: "usd", amount: 22900 }] }],
  },
  {
    title: "Zebra DS9308 Presentation Scanner",
    description: "Multi-plane omnidirectional imager that delivers fast, reliable scanning performance. Features CodeGate technology for targeted scanning.",
    handle: "zebra-ds9308-presentation",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    metadata: { brand: "Zebra", sku: "DS9308-SR", category: "Barcode Scanners" },
    categories: ["barcode-scanners"],
    variants: [{ title: "Standard Range", sku: "DS9308-SR", prices: [{ currency_code: "usd", amount: 34900 }] }],
  },
  {
    title: "Epson TM-T88VI Receipt Printer",
    description: "High-speed 80mm thermal receipt printer with USB, Serial, Ethernet, and Bluetooth. Industry-standard for POS systems.",
    handle: "epson-tm-t88vi-receipt-printer",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
    metadata: { brand: "Epson", sku: "TM-T88VI-082", category: "Receipt Printers" },
    categories: ["receipt-printers"],
    variants: [{ title: "USB + Ethernet", sku: "TM-T88VI-082", prices: [{ currency_code: "usd", amount: 49900 }] }],
  },
  {
    title: "Honeywell CT40 Mobile Computer",
    description: "Enterprise-grade Android mobile computer with 5-inch display, 1D/2D scanning, and 4G LTE. Built for warehouse and field service.",
    handle: "honeywell-ct40-mobile-computer",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400",
    metadata: { brand: "Honeywell", sku: "CT40-L0N-28C110E", category: "Mobile Computers" },
    categories: ["mobile-computers"],
    variants: [{ title: "Standard", sku: "CT40-L0N-28C110E", prices: [{ currency_code: "usd", amount: 129900 }] }],
  },
  {
    title: "Zebra TC52 Touch Computer",
    description: "Rugged Android enterprise mobile computer with 5-inch display, Snapdragon processor, and comprehensive scanning capabilities.",
    handle: "zebra-tc52-touch-computer",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400",
    metadata: { brand: "Zebra", sku: "TC520K-1PEZU4P-A6", category: "Mobile Computers" },
    categories: ["mobile-computers"],
    variants: [{ title: "Standard", sku: "TC520K-1PEZU4P-A6", prices: [{ currency_code: "usd", amount: 149900 }] }],
  },
  {
    title: "Zebra ZD421 Desktop Label Printer",
    description: "Compact 4-inch desktop printer with wireless connectivity. Supports ZPL and EPL label formats. Ideal for small business labeling.",
    handle: "zebra-zd421-desktop-printer",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1612198273689-b22fa91e1f21?w=400",
    metadata: { brand: "Zebra", sku: "ZD4A022-D01W01EZ", category: "Label Printers" },
    categories: ["label-printers"],
    variants: [{ title: "Wireless", sku: "ZD4A022-D01W01EZ", prices: [{ currency_code: "usd", amount: 44900 }] }],
  },
  {
    title: "Datalogic PowerScan 9600 Industrial Scanner",
    description: "Long-range omnidirectional laser scanner for industrial applications. Reads damaged and poorly printed barcodes up to 10m away.",
    handle: "datalogic-powerscan-9600",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    metadata: { brand: "Datalogic", sku: "PM9600-HP", category: "Industrial Scanners" },
    categories: ["barcode-scanners"],
    variants: [{ title: "High Power", sku: "PM9600-HP", prices: [{ currency_code: "usd", amount: 89900 }] }],
  },
  {
    title: "Star Micronics TSP143IIIU Receipt Printer",
    description: "USB-powered thermal receipt printer with auto-cutter. Print receipts without an outlet — powered directly by USB from your POS terminal.",
    handle: "star-micronics-tsp143iiiu",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
    metadata: { brand: "Star Micronics", sku: "39472190", category: "Receipt Printers" },
    categories: ["receipt-printers"],
    variants: [{ title: "USB Self-Powered", sku: "39472190", prices: [{ currency_code: "usd", amount: 27900 }] }],
  },
  {
    title: "Honeywell 1452g Wireless Scanner",
    description: "Cordless area-imaging scanner with Bluetooth connectivity and charging base. 33-foot wireless range for flexible use.",
    handle: "honeywell-1452g-wireless",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    metadata: { brand: "Honeywell", sku: "1452G1D-2USB-5", category: "Barcode Scanners" },
    categories: ["barcode-scanners"],
    variants: [{ title: "Bluetooth Kit", sku: "1452G1D-2USB-5", prices: [{ currency_code: "usd", amount: 39900 }] }],
  },
  {
    title: "Zebra MP7000 Grocery Scanner Scale",
    description: "Ultra-high-performance omnidirectional bioptical scanner scale. Purpose-built for grocery checkout with integrated weighing platform.",
    handle: "zebra-mp7000-scanner-scale",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    metadata: { brand: "Zebra", sku: "MP7000-MNS0M00WW", category: "Scanner Scales" },
    categories: ["barcode-scanners"],
    variants: [{ title: "With Scale", sku: "MP7000-MNS0M00WW", prices: [{ currency_code: "usd", amount: 149900 }] }],
  },
  {
    title: "Epson ColorWorks C3500 Label Printer",
    description: "Color label printer for on-demand printing of high-quality labels. Supports variable data printing for batch lots and expiration dates.",
    handle: "epson-colorworks-c3500",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1612198273689-b22fa91e1f21?w=400",
    metadata: { brand: "Epson", sku: "C3500-TM", category: "Label Printers" },
    categories: ["label-printers"],
    variants: [{ title: "Standard", sku: "C3500-TM", prices: [{ currency_code: "usd", amount: 79900 }] }],
  },
  {
    title: "Datalogic Gryphon GD4520 Linear Scanner",
    description: "High-performance linear imager with multiple interface support. Features an ergonomic design and soft-touch coating for extended use.",
    handle: "datalogic-gryphon-gd4520",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400",
    metadata: { brand: "Datalogic", sku: "GD4520-BK", category: "Barcode Scanners" },
    categories: ["barcode-scanners"],
    variants: [{ title: "Black USB", sku: "GD4520-BK", prices: [{ currency_code: "usd", amount: 19900 }] }],
  },
  {
    title: "Brother RJ-3200 Mobile Printer",
    description: "Rugged mobile printer for field service professionals. Prints 3-inch labels and receipts. Works with iOS, Android, and Windows devices.",
    handle: "brother-rj3200-mobile-printer",
    status: "published" as const,
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
    metadata: { brand: "Brother", sku: "RJ3200", category: "Mobile Printers" },
    categories: ["label-printers"],
    variants: [{ title: "Standard", sku: "RJ3200", prices: [{ currency_code: "usd", amount: 34900 }] }],
  },
];

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  logger.info("Starting ConnectBarcodes seed...");

  const productModuleService = container.resolve("product") as any;
  const salesChannelModuleService = container.resolve("salesChannel") as any;
  const categoryModuleService = container.resolve("productCategory") as any;
  const b2bService = container.resolve("b2bPricing") as any;

  logger.info("Creating sales channel...");
  const [defaultChannel] = await salesChannelModuleService.listSalesChannels({ name: "Default Sales Channel" });
  const salesChannelId = defaultChannel?.id;

  logger.info("Creating product categories...");
  const categoryMap: Record<string, string> = {};
  const categoryDefs = [
    { name: "Barcode Scanners", handle: "barcode-scanners" },
    { name: "Label Printers", handle: "label-printers" },
    { name: "Receipt Printers", handle: "receipt-printers" },
    { name: "Mobile Computers", handle: "mobile-computers" },
    { name: "POS Systems", handle: "pos-systems" },
    { name: "Supplies & Media", handle: "supplies-media" },
    { name: "Accessories", handle: "accessories" },
  ];

  for (const cat of categoryDefs) {
    const existing = await categoryModuleService.listProductCategories({ handle: cat.handle });
    if (existing.length > 0) {
      categoryMap[cat.handle] = existing[0].id;
    } else {
      const created = await categoryModuleService.createProductCategories({ name: cat.name, handle: cat.handle, is_active: true });
      categoryMap[cat.handle] = created.id;
    }
  }

  logger.info("Seeding 15 products...");
  const algoliaClient = algoliasearch(
    process.env.ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_API_KEY!
  );
  const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX_NAME || "connect_barcodes_products");

  for (const productDef of PRODUCTS) {
    const existing = await productModuleService.listProducts({ handle: productDef.handle });
    if (existing.length > 0) {
      logger.info(`Skipping existing product: ${productDef.title}`);
      continue;
    }

    const categoryIds = productDef.categories
      .map((handle) => categoryMap[handle])
      .filter(Boolean)
      .map((id) => ({ id }));

    const product = await productModuleService.createProducts({
      title: productDef.title,
      description: productDef.description,
      handle: productDef.handle,
      status: productDef.status,
      thumbnail: productDef.thumbnail,
      metadata: productDef.metadata,
      categories: categoryIds,
      variants: productDef.variants.map((v) => ({
        title: v.title,
        sku: v.sku,
        prices: v.prices,
        manage_inventory: false,
      })),
    });

    logger.info(`Created product: ${product.title}`);

    // Set B2B tier prices
    for (const variant of product.variants || []) {
      const basePrice = productDef.variants[0]?.prices[0]?.amount || 0;
      await b2bService.setProductTierPrices(product.id, variant.id, basePrice);
    }

    // Sync to Algolia
    const basePrice = productDef.variants[0]?.prices[0]?.amount || 0;
    await algoliaIndex.saveObject({
      objectID: product.id,
      id: product.id,
      title: product.title,
      description: product.description,
      thumbnail: product.thumbnail,
      handle: product.handle,
      status: product.status,
      price: basePrice / 100,
      categories: productDef.categories,
      brand: (productDef.metadata as any).brand,
      sku: (productDef.metadata as any).sku,
    });
  }

  logger.info("Seed completed successfully!");
}
