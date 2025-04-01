
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import TrackingOverview from "@/components/TrackingOverview";
import TrackingMap from "@/components/TrackingMap";
import TrackingTimeline from "@/components/TrackingTimeline";
import { 
  getTrackingDetails, 
  getTrackingEvents, 
  getTrackingMapData 
} from "@/services/trackingService";
import type { TrackingDetailsType } from "@/components/TrackingOverview";
import type { TrackingEvent } from "@/components/TrackingTimeline";

const TrackingDetailsPage = () => {
  const { trackingNumber = "" } = useParams<{ trackingNumber: string }>();
  const [loading, setLoading] = useState(true);
  const [trackingDetails, setTrackingDetails] = useState<TrackingDetailsType | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [mapData, setMapData] = useState<any>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        
        // Fetch tracking data from our mock service
        const details = await getTrackingDetails(trackingNumber);
        const events = await getTrackingEvents(trackingNumber);
        const map = await getTrackingMapData(trackingNumber);
        
        setTrackingDetails(details);
        setTrackingEvents(events);
        setMapData(map);
        
        toast.success("Tracking information loaded successfully");
      } catch (error) {
        console.error("Error fetching tracking data:", error);
        toast.error("Failed to load tracking information");
      } finally {
        setLoading(false);
      }
    };
    
    if (trackingNumber) {
      fetchTrackingData();
    }
  }, [trackingNumber]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="mb-2"
            >
              <Link to="/track">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tracking
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">Tracking Details</h1>
            {!loading && trackingDetails && (
              <p className="text-gray-500">
                Tracking Number: <span className="font-medium">{trackingDetails.trackingNumber}</span>
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 print:hidden" 
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
        </div>
        
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-[200px] w-full rounded-lg col-span-1 md:col-span-2" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        ) : (
          <>
            {trackingDetails && mapData ? (
              <>
                <TrackingMap 
                  origin={mapData.origin} 
                  destination={mapData.destination}
                  currentLocation={mapData.currentLocation}
                  isDelivered={mapData.isDelivered}
                />
                
                <TrackingOverview details={trackingDetails} />
                
                <TrackingTimeline events={trackingEvents} />
              </>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-2">No Tracking Information Found</h2>
                <p className="text-gray-600 mb-4">
                  We couldn't find any tracking information for the provided tracking number.
                  Please check the tracking number and try again.
                </p>
                <Button asChild>
                  <Link to="/track">Try Another Tracking Number</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrackingDetailsPage;
