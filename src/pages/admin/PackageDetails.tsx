
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Printer, MapPin, Package as PackageIcon, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import TrackingMap from '@/components/TrackingMap';
import TrackingTimeline from '@/components/TrackingTimeline';
import PackageLocationEditor from '@/components/admin/PackageLocationEditor';
import { TrackingPoint, TrackingDetails } from '@/types/tracking';
import { TrackingEvent } from '@/components/TrackingTimeline';

// Mock function to fetch package details
const fetchPackageDetails = async (id: string): Promise<{ 
  details: any; 
  events: TrackingEvent[];
  mapData: {
    origin: TrackingPoint;
    destination: TrackingPoint;
    currentLocation: TrackingPoint;
    isDelivered: boolean;
  }
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const isDelivered = Math.random() > 0.7;
  
  // Sample data
  const origin: TrackingPoint = {
    id: "loc-1",
    lat: 32.9481,
    lng: -96.7591,
    label: "Dallas, TX"
  };
  
  const destination: TrackingPoint = {
    id: "loc-2",
    lat: 39.7392,
    lng: -104.9903,
    label: "Denver, CO"
  };
  
  const currentLocation: TrackingPoint = isDelivered ? destination : {
    id: "loc-3",
    lat: 36.1699,
    lng: -101.3864,
    label: "Amarillo, TX"
  };
  
  const details = {
    id,
    trackingNumber: `SMS${id.slice(0, 6)}`,
    status: isDelivered ? "Delivered" : "In Transit",
    estimatedDelivery: isDelivered ? "Sep 12, 2023" : "Sep 17, 2023",
    shippedDate: isDelivered ? "Sep 10, 2023" : "Sep 15, 2023",
    service: Math.random() > 0.5 ? "Express Delivery" : "Standard Shipping",
    weight: `${(1 + Math.random() * 5).toFixed(1)} lbs`,
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(303) 555-1234"
    },
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
    priority: Math.random() > 0.7 ? "express" : "standard",
    itemCount: Math.floor(Math.random() * 3) + 1,
    packageType: ["Box", "Envelope", "Parcel"][Math.floor(Math.random() * 3)],
  };
  
  const events = [];
  events.push({
    id: "evt-1",
    status: "Order Placed",
    location: "Dallas, TX",
    timestamp: isDelivered ? "2023-09-10T09:30:00" : "2023-09-15T09:30:00",
    description: "Your package has been received and is being prepared for shipment.",
    isCompleted: true,
    isCurrentEvent: false,
  });
  
  events.push({
    id: "evt-2",
    status: "Processing",
    location: "Dallas Distribution Center, TX",
    timestamp: isDelivered ? "2023-09-10T14:45:00" : "2023-09-15T14:45:00", 
    description: "Your package is being processed and sorted for shipping.",
    isCompleted: true,
    isCurrentEvent: false,
  });
  
  if (!isDelivered) {
    events.push({
      id: "evt-3",
      status: "In Transit",
      location: currentLocation.label,
      timestamp: "2023-09-16T10:15:00",
      description: "Your package is in transit to the next facility.",
      isCompleted: false,
      isCurrentEvent: true,
    });
    
    events.push({
      id: "evt-4",
      status: "Out for Delivery",
      location: "Denver, CO",
      timestamp: "2023-09-17T08:30:00",
      description: "Your package will be out for delivery soon.",
      isCompleted: false,
      isCurrentEvent: false,
    });
    
    events.push({
      id: "evt-5",
      status: "Delivered",
      location: "Denver, CO",
      timestamp: "2023-09-17T15:20:00",
      description: "Pending delivery.",
      isCompleted: false,
      isCurrentEvent: false,
    });
  } else {
    events.push({
      id: "evt-3",
      status: "In Transit",
      location: "Amarillo, TX",
      timestamp: "2023-09-11T10:15:00",
      description: "Your package is in transit to the next facility.",
      isCompleted: true,
      isCurrentEvent: false,
    });
    
    events.push({
      id: "evt-4",
      status: "Out for Delivery",
      location: "Denver, CO",
      timestamp: "2023-09-12T08:30:00",
      description: "Your package is out for delivery and will be delivered today.",
      isCompleted: true,
      isCurrentEvent: false,
    });
    
    events.push({
      id: "evt-5",
      status: "Delivered",
      location: "Denver, CO",
      timestamp: "2023-09-12T15:20:00",
      description: "Your package has been delivered. Thank you for using our service!",
      isCompleted: true,
      isCurrentEvent: true,
    });
  }
  
  return {
    details,
    events,
    mapData: {
      origin,
      destination,
      currentLocation,
      isDelivered
    }
  };
};

// Mock function to update package location
const updatePackageLocation = async (packageId: string, location: TrackingPoint): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Location updated for package ${packageId}:`, location);
  // In a real app, this would send the update to your API
  // For now, we'll just return success
  return;
};

const PackageDetails = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [packageDetails, setPackageDetails] = useState<any>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [mapData, setMapData] = useState<any>(null);
  
  useEffect(() => {
    const loadPackageDetails = async () => {
      try {
        setLoading(true);
        const { details, events, mapData } = await fetchPackageDetails(id);
        setPackageDetails(details);
        setTrackingEvents(events);
        setMapData(mapData);
      } catch (error) {
        console.error("Error loading package details:", error);
        toast.error("Failed to load package details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadPackageDetails();
    }
  }, [id]);
  
  const handleLocationUpdate = async (location: TrackingPoint) => {
    if (!packageDetails) return;
    
    try {
      await updatePackageLocation(id, location);
      
      // Update local state to reflect the change
      const updatedMapData = {
        ...mapData,
        currentLocation: location
      };
      setMapData(updatedMapData);
      
      // Update the relevant event in the timeline
      const updatedEvents = trackingEvents.map(event => {
        if (event.status === "In Transit" && event.isCurrentEvent) {
          return {
            ...event,
            location: location.label,
            description: `Your package is in transit through ${location.label}.`
          };
        }
        return event;
      });
      setTrackingEvents(updatedEvents);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating location:", error);
      return Promise.reject(error);
    }
  };
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (!packageDetails) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Package Not Found</h3>
            <p className="text-red-700 text-sm">Could not find package with ID: {id}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link to="/admin/packages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packages
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const { trackingNumber, status, estimatedDelivery, shippedDate, service, weight, priority } = packageDetails;
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Button asChild variant="outline" size="sm" className="mb-2">
            <Link to="/admin/packages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packages
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Package Details</h1>
          <p className="text-gray-500">
            Tracking Number: <span className="font-medium">{trackingNumber}</span>
            {priority === "express" && (
              <Badge className="ml-2 bg-amber-500" variant="default">Express</Badge>
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <PackageLocationEditor 
            trackingNumber={trackingNumber}
            currentLocation={mapData.currentLocation}
            onLocationUpdate={handleLocationUpdate}
          />
          
          <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-swift-600" />
              Package Route
            </CardTitle>
            <CardDescription>
              Current location and delivery route visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mapData && (
              <TrackingMap
                origin={mapData.origin}
                destination={mapData.destination}
                currentLocation={mapData.currentLocation}
                isDelivered={mapData.isDelivered}
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageIcon className="h-5 w-5 text-swift-600" />
              Package Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <p className="font-semibold">{status}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Service Type</h3>
                <p>{service}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Weight</h3>
                <p>{weight}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Ship Date</h3>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p>{shippedDate}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Delivery</h3>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p>{estimatedDelivery}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Package Type</h3>
                <p>{packageDetails.packageType}</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Sender Information</h3>
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <p className="text-sm">{packageDetails.from.address}</p>
                  <p className="text-sm">{packageDetails.from.city}, {packageDetails.from.state} {packageDetails.from.zip}</p>
                  <p className="text-sm">{packageDetails.from.country}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Recipient Information</h3>
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <p className="text-sm font-medium">{packageDetails.to.name}</p>
                  <p className="text-sm">{packageDetails.to.email}</p>
                  <p className="text-sm">{packageDetails.to.phone}</p>
                  <p className="text-sm">{packageDetails.to.address}</p>
                  <p className="text-sm">{packageDetails.to.city}, {packageDetails.to.state} {packageDetails.to.zip}</p>
                  <p className="text-sm">{packageDetails.to.country}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-swift-600" />
              Delivery Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="status">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="status">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Current Status</span>
                      <Badge variant={status === "Delivered" ? "secondary" : "default"} 
                        className={status === "Delivered" ? "bg-green-500 hover:bg-green-600" : ""}>
                        {status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Current Location</span>
                      <span className="text-sm">{mapData.currentLocation.label}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Origin</span>
                      <span className="text-sm">{mapData.origin.label}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Destination</span>
                      <span className="text-sm">{mapData.destination.label}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Location Coordinates</h4>
                    <div className="bg-gray-50 rounded p-2 border border-gray-100 text-xs font-mono">
                      <div>Current: {mapData.currentLocation.lat}, {mapData.currentLocation.lng}</div>
                      <div>Origin: {mapData.origin.lat}, {mapData.origin.lng}</div>
                      <div>Destination: {mapData.destination.lat}, {mapData.destination.lng}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="actions">
                <div className="space-y-4">
                  <Button className="w-full gap-2" variant="outline">
                    <MapPin className="h-4 w-4" />
                    <span>Mark as Delivered</span>
                  </Button>
                  
                  <Button className="w-full gap-2" variant="outline">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Flag Issue</span>
                  </Button>
                  
                  <Button className="w-full gap-2" variant="outline">
                    <Printer className="h-4 w-4" />
                    <span>Print Label</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-swift-600" />
            Tracking Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrackingTimeline events={trackingEvents} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageDetails;
