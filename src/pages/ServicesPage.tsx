
import { Package, Truck, MapPin, Globe, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    title: "Standard Shipping",
    description: "Cost-effective shipping solution with reliable delivery times. Perfect for non-urgent shipments with full tracking capabilities.",
    features: [
      "Delivery within 3-5 business days",
      "Real-time tracking updates",
      "Package insurance up to $100",
      "Available for domestic and select international destinations",
    ],
    icon: Package,
    color: "bg-swift-100 text-swift-700",
  },
  {
    id: 2,
    title: "Express Delivery",
    description: "Expedited shipping service when time is critical. Get your packages delivered faster with priority handling.",
    features: [
      "Guaranteed delivery within 1-2 business days",
      "Priority handling at all facilities",
      "Package insurance up to $500",
      "Available for domestic and major international cities",
    ],
    icon: Truck,
    color: "bg-delivery-100 text-delivery-700",
  },
  {
    id: 3,
    title: "Same-Day Delivery",
    description: "Ultra-fast local delivery service for when packages need to arrive on the same day within your city.",
    features: [
      "Delivery within hours on the same day",
      "Available in select metropolitan areas",
      "Real-time delivery updates",
      "Package insurance included",
    ],
    icon: Clock,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: 4,
    title: "International Shipping",
    description: "Reliable global shipping solutions with customs handling and worldwide tracking for your international shipping needs.",
    features: [
      "Delivery to over 200 countries",
      "Customs documentation assistance",
      "Global tracking system",
      "Package insurance options available",
    ],
    icon: Globe,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: 5,
    title: "Freight Services",
    description: "Heavy-duty shipping solutions for large items, pallets, and commercial shipments requiring special handling.",
    features: [
      "Capacity for items up to 2000 lbs",
      "Specialized handling equipment",
      "Loading and unloading assistance",
      "Commercial and residential delivery options",
    ],
    icon: Truck,
    color: "bg-violet-100 text-violet-700",
  },
  {
    id: 6,
    title: "Secure Shipping",
    description: "Enhanced security measures for high-value or sensitive items requiring extra protection during transit.",
    features: [
      "Tamper-evident packaging",
      "Signature confirmation required",
      "Extended insurance coverage",
      "Discrete packaging options",
    ],
    icon: Shield,
    color: "bg-emerald-100 text-emerald-700",
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen pb-12 bg-gray-50">
      {/* Hero section */}
      <div className="relative py-20 bg-swift-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2065')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-swift-900/80 to-swift-700/70"></div>
        
        <div className="container relative z-10 px-4 mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Our Shipping Services</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Choose from our comprehensive range of shipping solutions designed to meet all your delivery needs.
          </p>
        </div>
      </div>
      
      {/* Services grid */}
      <div className="container px-4 mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col"
            >
              <div className={`${service.color} p-3 rounded-lg w-fit mb-4`}>
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              
              <div className="mt-2 mb-6 flex-grow">
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="space-y-1">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-delivery-500 text-lg leading-tight">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/contact">Get a Quote</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Call to action */}
      <div className="container px-4 mx-auto py-12">
        <div className="bg-swift-700 text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Shipping Solution?</h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-6">
            We understand that every business has unique shipping requirements. Contact us today to discuss a tailored shipping plan for your specific needs.
          </p>
          <Button asChild size="lg" className="bg-white text-swift-700 hover:bg-gray-100">
            <Link to="/contact">Contact Our Sales Team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
