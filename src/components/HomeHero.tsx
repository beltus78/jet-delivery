
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import TrackingForm from "@/components/TrackingForm";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HomeHero = () => {
  const handleTrackingSubmit = (trackingNumber: string) => {
    window.location.href = `/track/${trackingNumber}`;
  };

  return (
    <div className="relative bg-white py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5"></div>
      
      <Container className="relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Fast, Reliable <span className="text-swift-600">Delivery</span> Services Nationwide
          </h1>
          <p className="text-xl text-gray-600 mb-8 mx-auto max-w-3xl">
            Ship with confidence using our secure, efficient, and affordable shipping services. 
            Track your package or get a quick quote today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-swift-600 hover:bg-swift-700">
              <Link to="/services" className="flex items-center">
                Our Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 max-w-3xl mx-auto border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Your Package</h2>
            <p className="text-gray-600">Enter your tracking number to get real-time updates on your shipment</p>
          </div>
          
          <TrackingForm 
            onSubmit={handleTrackingSubmit} 
            onHomepage={true} 
            className="max-w-2xl mx-auto" 
          />
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Don't have a tracking number? <Link to="/contact" className="text-swift-600 hover:underline">Contact us</Link> for assistance.</p>
          </div>
        </div>
      </Container>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-100 to-transparent"></div>
    </div>
  );
};

export default HomeHero;
