
import React from "react";
import { User } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "Swift Mail Service has completely transformed our shipping process. Their tracking system is outstanding and our customers love the transparency.",
    author: "Michael Johnson",
    position: "CEO, Tech Solutions Inc.",
  },
  {
    id: 2,
    quote: "As an ecommerce business, reliable shipping is crucial. Swift Mail Service delivers consistently and their tracking map is a game-changer.",
    author: "Sarah Thompson",
    position: "Founder, StyleShop",
  },
  {
    id: 3,
    quote: "The attention to detail and care given to our packages is unmatched. I can always count on Swift Mail for timely deliveries.",
    author: "David Chen",
    position: "Operations Manager, Global Exports",
  },
];

const HomeTestimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by businesses and individuals across the country for reliable, 
            transparent shipping services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-gray-50 rounded-lg p-6 shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-swift-100 mb-4 mx-auto">
                <User className="h-6 w-6 text-swift-700" />
              </div>
              <blockquote className="text-center">
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <footer>
                  <p className="font-medium text-swift-800">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.position}</p>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
