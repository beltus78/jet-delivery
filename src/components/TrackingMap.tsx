
import { useEffect, useState } from "react";
import { TrackingPoint } from "@/types/tracking";

interface TrackingMapProps {
  origin: TrackingPoint;
  destination: TrackingPoint;
  currentLocation: TrackingPoint;
  isDelivered: boolean;
}

const TrackingMap = ({
  origin,
  destination,
  currentLocation,
  isDelivered,
}: TrackingMapProps) => {
  const [mapUrl, setMapUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      // Using Google Maps with provided API key
      const apiKey = "AIzaSyAI42aRjF79hJMVoOC9G95rp0rxp8T3DFc";
      
      // Create marker string for origin, destination and current location
      const originMarker = `&markers=color:green|label:A|${origin.lat},${origin.lng}`;
      const destinationMarker = `&markers=color:red|label:B|${destination.lat},${destination.lng}`;
      const currentLocationMarker = `&markers=color:blue|label:C|${currentLocation.lat},${currentLocation.lng}`;
      
      // Create path string based on delivery status
      let pathString = "";
      if (isDelivered) {
        // If delivered, show complete path from origin to destination
        pathString = `&path=color:0x0000ff|weight:5|${origin.lat},${origin.lng}|${destination.lat},${destination.lng}`;
      } else {
        // If not delivered, show path from origin to current location
        pathString = `&path=color:0x0000ff|weight:5|${origin.lat},${origin.lng}|${currentLocation.lat},${currentLocation.lng}`;
        // Add dotted path from current location to destination (using different style)
        pathString += `&path=color:0x0000ff80|weight:5|${currentLocation.lat},${currentLocation.lng}|${destination.lat},${destination.lng}`;
      }
      
      // Generate Google Maps static map URL - make sure all parameters are properly formatted
      const url = `https://maps.googleapis.com/maps/api/staticmap?size=800x400&zoom=5${originMarker}${destinationMarker}${currentLocationMarker}${pathString}&key=${apiKey}`;
      
      console.log("Generated map URL:", url);
      setMapUrl(url);
      setError(null);
    } catch (error) {
      console.error("Error generating map URL:", error);
      setError("Failed to generate map. Please check API configuration.");
    }
  }, [origin, destination, currentLocation, isDelivered]);
  
  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 h-[400px] bg-gray-50">
      {error ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
          <p className="text-gray-500 mt-2 text-sm">Please ensure Google Maps Static API is enabled in your Google Cloud Console</p>
        </div>
      ) : mapUrl ? (
        <img 
          src={mapUrl} 
          alt="Package Route Map" 
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("Failed to load map image");
            setError("Failed to load map image. Please check API configuration.");
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default TrackingMap;
