
import { ArrowRight, Package, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TrackingForm from "./TrackingForm";

const HomeHero = () => {
  return (
    <div className="relative overflow-hidden bg-swift-800 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-swift-900/90 to-swift-800/70"></div>
      
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Swift, Reliable Package Delivery
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-xl">
              Track your packages in real-time and enjoy fast, secure delivery to anywhere in the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-delivery-500 hover:bg-delivery-600 text-white gap-2">
                <Link to="/services">
                  <span>Our Services</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-white/10">
                  <Package className="h-5 w-5 text-delivery-300" />
                </div>
                <span>Secure Packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-white/10">
                  <Truck className="h-5 w-5 text-delivery-300" />
                </div>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-white/10">
                  <Clock className="h-5 w-5 text-delivery-300" />
                </div>
                <span>24/7 Tracking</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <TrackingForm onHomepage className="w-full max-w-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
