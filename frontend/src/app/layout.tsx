import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/cart-context";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "ConnectBarcodes - Professional Barcode & POS Solutions", template: "%s | ConnectBarcodes" },
  description: "Shop Zebra, Honeywell, Datalogic, and Epson barcode scanners, label printers, and POS systems. B2B pricing tiers available — up to 30% off.",
  keywords: ["barcode scanner", "label printer", "POS system", "Zebra", "Honeywell", "Datalogic", "receipt printer"],
  authors: [{ name: "ConnectBarcodes" }],
  openGraph: {
    type: "website",
    siteName: "ConnectBarcodes",
    title: "ConnectBarcodes - Professional Barcode & POS Solutions",
    description: "Your trusted source for barcode scanners, label printers, and POS systems.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <CartProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </CartProvider>
      </body>
    </html>
  );
}
