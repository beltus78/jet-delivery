
import { useState } from "react";
import TrackingForm from "@/components/TrackingForm";
import TrackingMap from "@/components/TrackingMap";
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
              <h2 className="text-xl font-semibold mb-4">Sample Tracking Map</h2>
              <TrackingMap 
                origin={sampleOrigin}
                destination={sampleDestination}
                currentLocation={sampleCurrentLocation}
                isDelivered={false}
              />
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Package Status: In Transit</h3>
                <p className="text-blue-700">
                  Your package has left Dallas, TX and is currently in Amarillo, TX. 
                  It is on its way to Denver, CO and is expected to arrive in 2 days.
                </p>
                <div className="mt-2 grid grid-cols-5 gap-1">
                  <div className="col-span-2 h-2 bg-blue-500 rounded-l-full"></div>
                  <div className="col-span-3 h-2 bg-gray-300 rounded-r-full"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Shipped</span>
                  <span>In Transit</span>
                  <span>Out for Delivery</span>
                  <span>Delivered</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
                <TrackingTimeline events={sampleTrackingEvents} />
              </div>
              
              <div className="flex gap-2 text-sm text-gray-600 italic">
                <span className="font-medium">Estimated delivery:</span>
                <span>Sep 17, 2023</span>
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
