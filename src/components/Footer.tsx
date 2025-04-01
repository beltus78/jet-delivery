
import { Link } from "react-router-dom";
import { Package, Truck, MapPin, Clock, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-swift-900 text-white pb-12">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6" />
              <h3 className="text-xl font-bold">Swift Mail Service</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Fast, reliable shipping solutions for businesses and individuals.
            </p>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-delivery-400" />
              <span className="text-sm text-gray-300">16000 Dallas Pkwy # 400, Dallas, TX 75248</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-delivery-400" />
              <span className="text-sm text-gray-300">(346) 298-4617</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-delivery-400" />
              <span className="text-sm text-gray-300">contact@swiftmailservice.com</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-300 hover:text-white transition-colors">
                  Track Package
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Express Shipping
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  International Delivery
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Freight Services
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Business Solutions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Swift Mail Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
