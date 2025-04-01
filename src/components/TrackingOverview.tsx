
import { Package, Calendar, MapPin, Clock, Truck, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface TrackingDetailsType {
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  shippedDate: string;
  service: string;
  weight: string;
  from: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  to: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  progress: number;
  isDelivered: boolean;
}

interface TrackingOverviewProps {
  details: TrackingDetailsType;
}

const TrackingOverview = ({ details }: TrackingOverviewProps) => {
  const { 
    trackingNumber, 
    status, 
    estimatedDelivery, 
    shippedDate, 
    service, 
    weight, 
    from, 
    to, 
    progress, 
    isDelivered 
  } = details;

  const formatAddress = (addr: typeof from) => {
    return `${addr.address}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-swift-600" />
            Package Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
              <p className="font-semibold">{trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-flex h-2 w-2 rounded-full",
                  isDelivered ? "bg-green-500" : "bg-swift-500 animate-pulse-slow",
                )}></span>
                <p className="font-semibold">{status}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Shipped Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p>{shippedDate}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p>{estimatedDelivery}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Service</p>
              <p>{service}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Weight</p>
              <p>{weight}</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <h3 className="font-medium">Delivery Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipped</span>
                <span className="text-gray-500">In Transit</span>
                <span className="text-gray-500">Out for Delivery</span>
                <span className="text-gray-500">Delivered</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-swift-600" />
            Shipping Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">From</p>
              <p className="text-sm">{formatAddress(from)}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-10 border-l-2 border-dashed border-gray-300 ml-2"></div>
              <div className="bg-gray-100 rounded-full p-2">
                <Truck className="h-4 w-4 text-swift-600" />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">To</p>
              <p className="text-sm">{formatAddress(to)}</p>
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Status</p>
              <div className="flex items-center gap-2 text-sm">
                {isDelivered ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-600">Delivered</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-swift-600" />
                    <span className="font-medium">{status}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingOverview;
