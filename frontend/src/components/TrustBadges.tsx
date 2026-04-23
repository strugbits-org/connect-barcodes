import { Shield, Truck, HeadphonesIcon, RefreshCw, Award, Users } from "lucide-react";

const BADGES = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $200", color: "text-blue-600" },
  { icon: Shield, title: "2-Year Warranty", desc: "On all hardware", color: "text-green-600" },
  { icon: HeadphonesIcon, title: "Expert Support", desc: "Mon-Fri 8am-6pm ET", color: "text-purple-600" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day return policy", color: "text-orange-600" },
  { icon: Award, title: "Authorized Dealer", desc: "All major brands", color: "text-red-600" },
  { icon: Users, title: "B2B Pricing", desc: "Up to 30% off", color: "text-teal-600" },
];

export default function TrustBadges() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {BADGES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-3 ${color}`}>
                <Icon size={22} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
