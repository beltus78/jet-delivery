
import { Truck, Package, Globe, Users } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: Package,
    value: "10M+",
    label: "Packages Delivered",
    color: "text-swift-600",
  },
  {
    id: 2,
    icon: Truck,
    value: "500+",
    label: "Delivery Vehicles",
    color: "text-delivery-600",
  },
  {
    id: 3,
    icon: Globe,
    value: "50+",
    label: "Countries Served",
    color: "text-indigo-600",
  },
  {
    id: 4,
    icon: Users,
    value: "5K+",
    label: "Happy Customers",
    color: "text-amber-600",
  },
];

const HomeStats = () => {
  return (
    <section className="py-12 bg-swift-900 text-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center p-6 bg-white/5 rounded-lg">
              <div className={`${stat.color} mb-3`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-300 text-center">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
