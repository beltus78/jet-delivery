
import { useEffect, useState } from "react";
import { PackageLocation } from "@/types/tracking";

interface TrackingMapProps {
  origin: PackageLocation;
  destination: PackageLocation;
  currentLocation: PackageLocation;
  isDelivered: boolean;
}

const TrackingMap = ({
  origin,
  destination,
  currentLocation,
  isDelivered,
}: TrackingMapProps) => {
  const [mapUrl, setMapUrl] = useState("");
  
  useEffect(() => {
    // Using Google Maps with provided API key
    const apiKey = "AIzaSyAI42aRjF79hJMVoOC9G95rp0rxp8T3DFc";
    
    // Create marker string for origin, destination and current location
    const originMarker = `&markers=color:green|label:A|${origin.lat},${origin.lng}`;
    const destinationMarker = `&markers=color:red|label:B|${destination.lat},${destination.lng}`;
    const currentLocationMarker = `&markers=color:blue|label:C|${currentLocation.lat},${currentLocation.lng}`;
    
    // Create path string between origin, current location, and destination
    let pathString = "";
    if (isDelivered) {
      // If delivered, show complete path from origin to destination
      pathString = `&path=color:0x0000ff|weight:5|${origin.lat},${origin.lng}|${destination.lat},${destination.lng}`;
    } else {
      // If not delivered, show path from origin to current location
      pathString = `&path=color:0x0000ff|weight:5|${origin.lat},${origin.lng}|${currentLocation.lat},${currentLocation.lng}`;
      // Add dotted path from current location to destination
      pathString += `&path=color:0x0000ff|weight:5|geodesic:true|${currentLocation.lat},${currentLocation.lng}|${destination.lat},${destination.lng}`;
    }
    
    // Generate Google Maps static map URL
    const url = `https://maps.googleapis.com/maps/api/staticmap?size=800x400&zoom=5${originMarker}${destinationMarker}${currentLocationMarker}${pathString}&key=${apiKey}`;
    
    setMapUrl(url);
  }, [origin, destination, currentLocation, isDelivered]);
  
  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 h-[400px] bg-gray-50">
      {mapUrl ? (
        <img 
          src={mapUrl} 
          alt="Package Route Map" 
          className="w-full h-full object-cover"
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
