
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

interface TrackingMapProps {
  origin: Location;
  destination: Location;
  currentLocation: Location;
  isDelivered: boolean;
}

const MAP_API_KEY = "YOUR_MAPBOX_API_KEY"; // You would need to replace this with a real API key

const TrackingMap = ({ origin, destination, currentLocation, isDelivered }: TrackingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we would use a mapping library like Mapbox or Google Maps
    // For now, we'll just show a visual representation of the journey
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const calculateProgress = () => {
    // Simple linear calculation (would be more complex with real map distance)
    const startLat = origin.latitude;
    const startLng = origin.longitude;
    const endLat = destination.latitude;
    const endLng = destination.longitude;
    const currentLat = currentLocation.latitude;
    const currentLng = currentLocation.longitude;
    
    const totalDistance = Math.sqrt(
      Math.pow(endLat - startLat, 2) + Math.pow(endLng - startLng, 2)
    );
    
    const currentDistance = Math.sqrt(
      Math.pow(currentLat - startLat, 2) + Math.pow(currentLng - startLng, 2)
    );
    
    return (currentDistance / totalDistance) * 100;
  };

  const progress = isDelivered ? 100 : calculateProgress();

  return (
    <div className="relative bg-gray-50 rounded-lg shadow-lg overflow-hidden h-[400px] mb-6">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-10 h-10 border-4 border-swift-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div ref={mapRef} className="w-full h-full">
            {/* This would be replaced with an actual map in a real implementation */}
            <div className="relative w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s+0039a6(${origin.longitude},${origin.latitude}),pin-s+ea4335(${destination.longitude},${destination.latitude}),pin-s+14b8a6(${currentLocation.longitude},${currentLocation.latitude})/auto/500x400?access_token=${MAP_API_KEY}')] bg-cover opacity-60"></div>
              
              <div className="relative z-10 w-4/5 mx-auto">
                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-in-out",
                      isDelivered ? "bg-green-500" : "bg-swift-600"
                    )} 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-swift-700"></div>
                    <p className="text-xs mt-1 font-medium text-swift-800">{origin.name}</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-4 h-4 rounded-full",
                      isDelivered ? "bg-green-500" : "bg-gray-400"
                    )}></div>
                    <p className="text-xs mt-1 font-medium text-gray-700">{destination.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-sm">
                <p className="font-medium">Current Location:</p>
                <p className="text-gray-600">{currentLocation.name}</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 p-2 text-xs text-gray-500">
            Map visualization placeholder - implement with Mapbox/Google Maps
          </div>
        </>
      )}
    </div>
  );
};

export default TrackingMap;
