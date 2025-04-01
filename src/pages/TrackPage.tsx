
import { useState } from "react";
import TrackingForm from "@/components/TrackingForm";
import TrackingMap from "@/components/TrackingMap";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TrackPage = () => {
  const [showSample, setShowSample] = useState(false);

  const sampleOrigin = { latitude: 32.9481, longitude: -96.7591, name: "Dallas, TX" };
  const sampleDestination = { latitude: 39.7392, longitude: -104.9903, name: "Denver, CO" };
  const sampleCurrentLocation = { latitude: 36.1699, longitude: -101.3864, name: "Amarillo, TX" };

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
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h3 className="font-medium text-blue-800 mb-2">Package Status: In Transit</h3>
                <p className="text-blue-700">
                  Your package has left Dallas, TX and is currently in Amarillo, TX. 
                  It is on its way to Denver, CO and is expected to arrive in 2 days.
                </p>
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
