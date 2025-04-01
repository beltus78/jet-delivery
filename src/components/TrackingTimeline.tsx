
import { Clock, Package, MapPin, Truck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description: string;
  isCompleted: boolean;
  isCurrentEvent: boolean;
}

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "order placed":
      return Package;
    case "processing":
      return Package;
    case "in transit":
      return Truck;
    case "out for delivery":
      return Truck;
    case "delivered":
      return CheckCircle;
    default:
      return MapPin;
  }
};

const TrackingTimeline = ({ events }: TrackingTimelineProps) => {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold">Tracking History</h3>
      <div className="space-y-8">
        {events.map((event, index) => {
          const StatusIcon = getStatusIcon(event.status);
          
          return (
            <div key={event.id} className="relative">
              {/* Connecting line */}
              {index < events.length - 1 && (
                <div className="absolute w-0.5 bg-gray-200 top-10 bottom-0 left-[14px]"></div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center mt-1",
                  event.isCurrentEvent && "bg-blue-500 animate-pulse",
                  event.isCompleted ? "bg-green-500" : "bg-gray-300"
                )}>
                  {event.isCompleted && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  )}
                </div>
                
                <div className={cn(
                  "w-full rounded-lg p-3",
                  event.isCurrentEvent && "bg-blue-50",
                  !event.isCurrentEvent && "hover:bg-gray-50 transition-colors"
                )}>
                  <div className="flex justify-between mb-1">
                    <h4 className={cn(
                      "font-medium flex items-center gap-2",
                      event.isCurrentEvent && "text-blue-700"
                    )}>
                      <StatusIcon className={cn(
                        "h-4 w-4",
                        event.isCurrentEvent ? "text-blue-500" : "text-gray-500"
                      )} />
                      {event.status}
                    </h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <time dateTime={event.timestamp}>
                        {new Date(event.timestamp).toLocaleString()}
                      </time>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                  
                  <p className="text-gray-700">{event.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingTimeline;
