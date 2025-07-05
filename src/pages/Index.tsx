
import HomeHero from "@/components/HomeHero";
import HomeServices from "@/components/HomeServices";
import HomeTestimonials from "@/components/HomeTestimonials";
import HomeStats from "@/components/HomeStats";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HomeHero />
      <HomeServices />
      <HomeStats />
      <HomeTestimonials />
      
      {/* Contact section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Get in Touch With Us</h2>
                <p className="text-gray-600 mb-6">
                Have questions about our delivery services? Our team is ready to help with all your shipping needs. 
                Contact us today for a custom delivery solution.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-swift-100">
                    <MapPin className="h-5 w-5 text-swift-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">16000 Dallas Pkwy # 400, Dallas, TX 75248, United States</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-swift-100">
                    <Phone className="h-5 w-5 text-swift-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">(346) 298-4617</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-swift-100">
                    <Mail className="h-5 w-5 text-swift-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">contact@jetdelivery.com</p>
                  </div>
                </div>
              </div>
              
              <Button asChild className="mt-6 gap-2 bg-swift-700 hover:bg-swift-800">
                <Link to="/contact">
                  <span>Contact Us</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="rounded-lg overflow-hidden h-[400px] shadow-lg">
              <iframe
                title="Jet Delivery Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3347.6598121566147!2d-96.82442408481056!3d32.97741808091052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c23d5eeed355f%3A0x648a6a8201a1b6be!2s16000%20Dallas%20Pkwy%20%23%20400%2C%20Dallas%2C%20TX%2075248%2C%20USA!5e0!3m2!1sen!2sng!4v1645435695914!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
