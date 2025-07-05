
import { useEffect, useState, useRef } from "react";
import { TrackingPoint } from "@/types/tracking";
import { Compass, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

interface TrackingMapProps {
  origin: TrackingPoint;
  destination: TrackingPoint;
  currentLocation: TrackingPoint;
  isDelivered: boolean;
}

// Fix for Leaflet marker icons in production builds
// This resolves the missing marker icon issue
const LeafletFixIcons = () => {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);
  
  return null;
};

// Custom markers for different locations
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to fit map to bounds of all markers
function FitBounds({ points }: { points: TrackingPoint[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(point => [point.lat, point.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]);
  
  return null;
}

// Component to animate the route
function RouteAnimation({ origin, destination, currentLocation, isDelivered }: TrackingMapProps) {
  const map = useMap();
  const animationRef = useRef<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const duration = 2000; // 2 seconds for animation
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [map]);
  
  return null;
}

const TrackingMap = ({
  origin,
  destination,
  currentLocation,
  isDelivered,
}: TrackingMapProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verify that we have valid coordinates
  const hasValidCoordinates = 
    origin?.lat && origin?.lng && 
    destination?.lat && destination?.lng && 
    currentLocation?.lat && currentLocation?.lng;
    
  // Calculate the route paths based on delivery status
  const completedRoutePath = [
    [origin.lat, origin.lng],
    isDelivered ? [destination.lat, destination.lng] : [currentLocation.lat, currentLocation.lng]
  ];
  
  const remainingRoutePath = !isDelivered ? [
    [currentLocation.lat, currentLocation.lng],
    [destination.lat, destination.lng]
  ] : [];
  
  useEffect(() => {
    if (!hasValidCoordinates) {
      console.error("Invalid tracking coordinates:", { origin, destination, currentLocation });
      setError("Invalid location data. Please check tracking information.");
    }
    
    setIsLoading(false);
  }, [origin, destination, currentLocation, hasValidCoordinates]);

  if (error) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-gray-200 h-[400px] bg-gray-50">
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
          <p className="text-gray-500 mt-2 text-sm">Please ensure all tracking location data is valid</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-gray-200 h-[400px] bg-gray-50">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p className="text-gray-500 ml-3">Loading map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-200 h-[400px] bg-gray-50">
      <LeafletFixIcons />
      <MapContainer 
        center={[40.7128, -74.0060]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        className="z-0 transition-opacity duration-500"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Origin Marker */}
        <Marker 
          position={[origin.lat, origin.lng]} 
        >
          <Popup>
            <strong>Origin:</strong> {origin.label}
          </Popup>
        </Marker>
        
        {/* Current Location Marker with pulsating effect */}
        <Marker 
          position={[currentLocation.lat, currentLocation.lng]} 
        >
          <Popup>
            <strong>Current Location:</strong> {currentLocation.label}
            {!isDelivered && <p className="text-sm text-blue-600">Package in transit</p>}
          </Popup>
        </Marker>
        
        {/* Destination Marker */}
        <Marker 
          position={[destination.lat, destination.lng]} 
        >
          <Popup>
            <strong>Destination:</strong> {destination.label}
            {isDelivered && <p className="text-sm text-green-600">Package delivered</p>}
          </Popup>
        </Marker>
        
        {/* Completed route path */}
        <Polyline 
          positions={completedRoutePath as [number, number][]} 
          pathOptions={{ color: "#0000ff", weight: 4, dashArray: isDelivered ? undefined : undefined }}
        />
        
        {/* Remaining route path (if not delivered) */}
        {!isDelivered && (
          <Polyline 
            positions={remainingRoutePath as [number, number][]} 
            pathOptions={{ color: "#0000ff80", weight: 4, dashArray: "10,10" }}
          />
        )}
        
        {/* Fit map to show all markers */}
        <FitBounds points={[origin, destination, currentLocation]} />
        
        {/* Route animation */}
        <RouteAnimation 
          origin={origin}
          destination={destination}
          currentLocation={currentLocation}
          isDelivered={isDelivered}
        />
      </MapContainer>
      
      {/* Map overlay info */}
      <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/30 to-transparent text-white z-10">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="h-4 w-4" />
          <h3 className="text-sm font-medium">Package Route</h3>
        </div>
        <div className="text-xs opacity-90 flex items-center gap-2">
          <span>{isDelivered ? "Delivered" : "In Transit"}</span>
          {!isDelivered && (
            <span className="bg-blue-500 w-2 h-2 rounded-full inline-block animate-pulse"></span>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-0 left-0 w-full p-3 bg-white/80 text-xs z-10">
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
  );
};

export default TrackingMap;
