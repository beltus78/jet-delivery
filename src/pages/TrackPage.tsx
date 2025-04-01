
import { useState } from "react";
import TrackingForm from "@/components/TrackingForm";
import TrackingMap from "@/components/TrackingMap";
import TrackingOverview from "@/components/TrackingOverview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TrackingTimeline from "@/components/TrackingTimeline";

const TrackPage = () => {
  const [showSample, setShowSample] = useState(false);

  const sampleOrigin = { latitude: 32.9481, longitude: -96.7591, name: "Dallas, TX" };
  const sampleDestination = { latitude: 39.7392, longitude: -104.9903, name: "Denver, CO" };
  const sampleCurrentLocation = { latitude: 36.1699, longitude: -101.3864, name: "Amarillo, TX" };

  // Sample tracking events for the timeline
  const sampleTrackingEvents = [
    {
      id: "evt-1",
      status: "Order Placed",
      location: "Dallas, TX",
      timestamp: "2023-09-15T09:30:00",
      description: "Your package has been received by Swift Mail Service and is being prepared for shipment.",
      isCompleted: true,
      isCurrentEvent: false,
    },
    {
      id: "evt-2",
      status: "Processing",
      location: "Dallas Distribution Center, TX",
      timestamp: "2023-09-15T14:45:00",
      description: "Your package is being processed and sorted for shipping.",
      isCompleted: true,
      isCurrentEvent: false,
    },
    {
      id: "evt-3",
      status: "In Transit",
      location: "Amarillo, TX",
      timestamp: "2023-09-16T10:15:00",
      description: "Your package is in transit to the next facility.",
      isCompleted: false,
      isCurrentEvent: true,
    },
    {
      id: "evt-4",
      status: "Out for Delivery",
      location: "Denver, CO",
      timestamp: "2023-09-17T08:30:00",
      description: "Your package is out for delivery and will be delivered today.",
      isCompleted: false,
      isCurrentEvent: false,
    },
    {
      id: "evt-5",
      status: "Delivered",
      location: "Denver, CO",
      timestamp: "2023-09-17T15:20:00",
      description: "Your package has been delivered. Thank you for using Swift Mail Service!",
      isCompleted: false,
      isCurrentEvent: false,
    },
  ];

  // Sample tracking details for the overview - fixing the TS error by using the correct priority type
  const sampleTrackingDetails = {
    trackingNumber: "SMS123456789",
    status: "In Transit",
    estimatedDelivery: "Sep 17, 2023",
    shippedDate: "Sep 15, 2023",
    service: "Express Delivery",
    weight: "3.5 lbs",
    from: {
      address: "16000 Dallas Pkwy # 400",
      city: "Dallas",
      state: "TX",
      zip: "75248",
      country: "United States",
    },
    to: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(303) 555-1234",
      address: "1234 Main St",
      city: "Denver",
      state: "CO",
      zip: "80202",
      country: "United States",
    },
    progress: 45,
    isDelivered: false,
    priority: "express" as const, // Fixed the type error by using 'as const'
    itemCount: 2,
    packageType: "Box",
    signatureRequired: true,
    specialInstructions: "Please leave with front desk if recipient is not available",
  };

  const handleShowSample = () => {
    setShowSample(true);
    toast.info("Showing sample tracking map", {
      description: "This is how your package tracking will look"
    });
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Track Your Package</h1>
          <p className="text-gray-600 mb-8 text-center">
            Enter your tracking number below to get real-time updates on your package's location and status.
          </p>
          
          <TrackingForm />
          
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              onClick={handleShowSample} 
              className="text-swift-600 hover:text-swift-700"
            >
              See Sample Tracking
            </Button>
          </div>
          
          {showSample && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Sample Tracking Information</h2>
              <TrackingMap 
                origin={sampleOrigin}
                destination={sampleDestination}
                currentLocation={sampleCurrentLocation}
                isDelivered={false}
              />
              
              <div className="mt-6">
                <TrackingOverview details={sampleTrackingDetails} />
              </div>
              
              <div className="mb-6">
                <TrackingTimeline events={sampleTrackingEvents} />
              </div>
            </div>
          )}
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Tracking Information</h2>
            <p className="text-gray-600">
              With Swift Mail Service tracking, you can:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-gray-600">
              <li>View real-time package location on an interactive map</li>
              <li>Get detailed status updates with timestamps</li>
              <li>See estimated delivery dates and times</li>
              <li>Receive notifications of delivery exceptions</li>
              <li>Verify delivery with proof of delivery information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
