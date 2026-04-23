const BRANDS = ["Zebra", "Honeywell", "Datalogic", "Epson", "Star Micronics", "Brother", "Bixolon"];

export default function BrandsSection() {
  return (
    <section className="py-12 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Authorized Dealer for Top Brands
        </p>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {BRANDS.map((brand) => (
            <div key={brand} className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl">
              <span className="text-lg font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
