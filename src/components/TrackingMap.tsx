
import { useEffect, useState, useRef } from "react";
import { TrackingPoint } from "@/types/tracking";
import { Compass, Navigation } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Animation effect for map entry
  useEffect(() => {
    if (mapRef.current && !error) {
      mapRef.current.style.opacity = "0";
      mapRef.current.style.transform = "scale(0.95)";
      
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.style.opacity = "1";
          mapRef.current.style.transform = "scale(1)";
        }
      }, 300);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mapUrl, error]);
  
  useEffect(() => {
    try {
      setIsLoading(true);
      // Using Google Maps with provided API key
      const apiKey = "AIzaSyD7RZd5JPiPBmV8A14TP2oQ3YQSXtzTqgA";
      
      // Validate coordinates before creating the map
      if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng || !currentLocation?.lat || !currentLocation?.lng) {
        console.error("Invalid tracking coordinates:", { origin, destination, currentLocation });
        setError("Invalid location data. Please check tracking information.");
        setIsLoading(false);
        return;
      }
      
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
        pathString += `&path=color:0x0000ff80|weight:5|geodesic:true|${currentLocation.lat},${currentLocation.lng}|${destination.lat},${destination.lng}`;
      }
      
      // Generate Google Maps static map URL with enhanced styling
      const mapStyle = "&style=feature:all|element:labels|visibility:on&style=feature:road|element:geometry|color:0x4286f4&style=feature:water|color:0xc4eefa";
      const url = `https://maps.googleapis.com/maps/api/staticmap?size=800x400&zoom=5${originMarker}${destinationMarker}${currentLocationMarker}${pathString}${mapStyle}&key=${apiKey}`;
      
      console.log("Generated map URL:", url);
      setMapUrl(url);
      setError(null);
    } catch (error) {
      console.error("Error generating map URL:", error);
      setError("Failed to generate map. Please check API configuration.");
    } finally {
      setIsLoading(false);
    }
  }, [origin, destination, currentLocation, isDelivered]);
  
  // Function to animate the pulsating dot
  const animateDot = () => {
    const dot = document.querySelector(".tracking-dot-pulse");
    if (dot && !isDelivered) {
      let scale = 1;
      let increasing = false;
      
      const animate = () => {
        if (increasing) {
          scale += 0.01;
          if (scale >= 1.3) increasing = false;
        } else {
          scale -= 0.01;
          if (scale <= 1) increasing = true;
        }
        
        if (dot instanceof HTMLElement) {
          dot.style.transform = `scale(${scale})`;
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  
  useEffect(() => {
    animateDot();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDelivered, isLoading]);
  
  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 h-[400px] bg-gray-50">
      {error ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
          <p className="text-gray-500 mt-2 text-sm">Please ensure Google Maps Static API is enabled in your Google Cloud Console</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p className="text-gray-500 ml-3">Loading map...</p>
        </div>
      ) : (
        <div className="relative h-full">
          <img 
            ref={mapRef}
            src={mapUrl} 
            alt="Package Route Map" 
            className="w-full h-full object-cover transition-all duration-500"
            onError={() => {
              console.error("Failed to load map image");
              setError("Failed to load map image. Please check API configuration.");
            }}
          />
          
          {/* Map overlay info */}
          <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/30 to-transparent text-white">
            <div className="flex items-center gap-2 mb-1">
              <Compass className="h-4 w-4" />
              <h3 className="text-sm font-medium">Package Route</h3>
            </div>
            <div className="text-xs opacity-90 flex items-center gap-2">
              <span>{isDelivered ? "Delivered" : "In Transit"}</span>
              {!isDelivered && (
                <span className="tracking-dot-pulse bg-blue-500 w-2 h-2 rounded-full inline-block"></span>
              )}
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-0 left-0 w-full p-3 bg-white/80 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  <span>{origin.label}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>{currentLocation.label}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                  <span>{destination.label}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-gray-600">
                <Navigation className="h-3 w-3" />
                <span>{Math.round(Math.random() * 900 + 100)} miles</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingMap;
