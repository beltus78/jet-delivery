
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Timer, LocateFixed, Clock } from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export interface TrackingMapProps {
  origin: Location;
  destination: Location;
  currentLocation: Location;
  isDelivered: boolean;
  googleMapsApiKey?: string;
}

const TrackingMap = ({ origin, destination, currentLocation, isDelivered, googleMapsApiKey }: TrackingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [animationProgress, setAnimationProgress] = useState(0);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [traveledDistance, setTraveledDistance] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState('');

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

  useEffect(() => {
    // In a real implementation, we would use a mapping library like Mapbox or Google Maps
    // For now, we'll just show a visual representation of the journey
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Calculate total distances (in miles - rough approximation using the Haversine formula)
    const totalDistance = calculateHaversineDistance(
      origin.latitude, origin.longitude,
      destination.latitude, destination.longitude
    );

    const traveledDist = calculateHaversineDistance(
      origin.latitude, origin.longitude,
      currentLocation.latitude, currentLocation.longitude
    );

    const remaining = totalDistance - traveledDist;

    setTraveledDistance(Math.round(traveledDist));
    setRemainingDistance(Math.round(remaining));

    // Calculate estimated time remaining (assuming average speed of 50 mph)
    const hoursRemaining = remaining / 50;
    const days = Math.floor(hoursRemaining / 24);
    const hours = Math.floor(hoursRemaining % 24);
    
    if (isDelivered) {
      setEstimatedTimeRemaining('Delivered');
    } else if (days > 0) {
      setEstimatedTimeRemaining(`${days}d ${hours}h remaining`);
    } else {
      setEstimatedTimeRemaining(`${hours}h remaining`);
    }

    // Set initial animation progress
    setAnimationProgress(isDelivered ? 100 : progress);

    // Animation loop
    let animationFrame: number;
    let startTime: number | null = null;
    const animationDuration = 3000; // 3 seconds for demonstration
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      if (elapsed < animationDuration) {
        // Update package position along the path
        const progressValue = isDelivered 
          ? 100 
          : Math.min(progress, (elapsed / animationDuration) * progress);
          
        setAnimationProgress(progressValue);
        
        // Calculate package position for visualization
        const x = (progressValue / 100) * 100; // percentage across the x-axis
        setCurrentPosition({ x, y: 0 });
        
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Ensure we reach the exact target position
        setAnimationProgress(isDelivered ? 100 : progress);
        const x = (progress / 100) * 100;
        setCurrentPosition({ x, y: 0 });
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isDelivered, progress]);

  // Function to calculate distance using the Haversine formula
  const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };

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
              <div className="absolute inset-0 bg-cover opacity-60" style={{
                backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=${currentLocation.latitude},${currentLocation.longitude}&zoom=5&size=600x400&maptype=roadmap&markers=color:blue%7Clabel:O%7C${origin.latitude},${origin.longitude}&markers=color:red%7Clabel:D%7C${destination.latitude},${destination.longitude}&markers=color:green%7Clabel:C%7C${currentLocation.latitude},${currentLocation.longitude}&key=${googleMapsApiKey || ""}')`
              }}></div>
              
              <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-lg shadow text-sm space-y-2 z-20">
                <div className="flex items-center gap-2">
                  <LocateFixed className="h-4 w-4 text-swift-600" />
                  <div>
                    <div className="text-xs text-gray-500">Distance traveled</div>
                    <div className="font-medium">{traveledDistance} miles</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-swift-600" />
                  <div>
                    <div className="text-xs text-gray-500">Remaining</div>
                    <div className="font-medium">{remainingDistance} miles</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-swift-600" />
                  <div>
                    <div className="text-xs text-gray-500">ETA</div>
                    <div className="font-medium">{estimatedTimeRemaining}</div>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 w-4/5 mx-auto">
                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000 ease-in-out",
                      isDelivered ? "bg-green-500" : "bg-swift-600"
                    )} 
                    style={{ width: `${animationProgress}%` }}
                  ></div>
                </div>
                
                {/* Package icon animated along the path */}
                <div 
                  className="absolute -top-4 transform -translate-x-1/2 transition-all duration-500 ease-in-out"
                  style={{ left: `${currentPosition.x}%` }}
                >
                  <div className={cn(
                    "w-8 h-8 bg-white rounded-full border-2 flex items-center justify-center shadow-md",
                    isDelivered ? "border-green-500" : "border-swift-600 tracking-animation"
                  )}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </div>
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white mx-auto -mt-1"></div>
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
        </>
      )}
    </div>
  );
};

export default TrackingMap;
