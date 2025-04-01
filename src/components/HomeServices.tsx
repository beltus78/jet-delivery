
import { Package, Truck, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "Standard Shipping",
    description: "Reliable delivery for non-urgent packages with full tracking capabilities.",
    icon: Package,
    color: "bg-swift-100 text-swift-700",
  },
  {
    id: 2,
    title: "Express Delivery",
    description: "Expedited shipping options when you need your packages delivered fast.",
    icon: Truck,
    color: "bg-delivery-100 text-delivery-700",
  },
  {
    id: 3,
    title: "Local Courier",
    description: "Same-day delivery options for local packages within your city.",
    icon: MapPin,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: 4,
    title: "International Shipping",
    description: "Global shipping solutions with customs handling and worldwide tracking.",
    icon: Globe,
    color: "bg-indigo-100 text-indigo-700",
  },
];

const HomeServices = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Shipping Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our range of shipping options designed to meet all your delivery needs,
            from standard shipping to express and international deliveries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col"
            >
              <div className={`${service.color} p-3 rounded-lg w-fit mb-4`}>
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
              <Button asChild variant="outline" className="mt-2 w-full">
                <Link to="/services">Learn More</Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-swift-700 hover:bg-swift-800">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeServices;
