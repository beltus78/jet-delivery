
import { TrackingEvent } from "@/components/TrackingTimeline";
import { TrackingDetailsType } from "@/components/TrackingOverview";

// Mock locations for packages
const locations = {
  origin: { latitude: 32.9481, longitude: -96.7591, name: "Dallas, TX" },
  destination: { latitude: 39.7392, longitude: -104.9903, name: "Denver, CO" },
  current: { latitude: 36.1699, longitude: -101.3864, name: "Amarillo, TX" },
};

// Mock events for a package in transit
const inTransitEvents: TrackingEvent[] = [
  {
    id: "evt-1",
    status: "Order Placed",
    location: "Dallas, TX",
    timestamp: "2023-09-15T09:30:00",
    description: "Your package has been received by Swift Mail Service and is being prepared for shipment.",
    isCompleted: true,
    isCurrentEvent: false,
  },
  {
    id: "evt-2",
    status: "Processing",
    location: "Dallas Distribution Center, TX",
    timestamp: "2023-09-15T14:45:00",
    description: "Your package is being processed and sorted for shipping.",
    isCompleted: true,
    isCurrentEvent: false,
  },
  {
    id: "evt-3",
    status: "In Transit",
    location: "Amarillo, TX",
    timestamp: "2023-09-16T10:15:00",
    description: "Your package is in transit to the next facility.",
    isCompleted: false,
    isCurrentEvent: true,
  },
  {
    id: "evt-4",
    status: "Out for Delivery",
    location: "Denver, CO",
    timestamp: "2023-09-17T08:30:00",
    description: "Your package is out for delivery and will be delivered today.",
    isCompleted: false,
    isCurrentEvent: false,
  },
  {
    id: "evt-5",
    status: "Delivered",
    location: "Denver, CO",
    timestamp: "2023-09-17T15:20:00",
    description: "Your package has been delivered. Thank you for using Swift Mail Service!",
    isCompleted: false,
    isCurrentEvent: false,
  },
];

// Mock events for a delivered package
const deliveredEvents: TrackingEvent[] = [
  {
    id: "evt-1",
    status: "Order Placed",
    location: "Dallas, TX",
    timestamp: "2023-09-10T09:30:00",
    description: "Your package has been received by Swift Mail Service and is being prepared for shipment.",
    isCompleted: true,
    isCurrentEvent: false,
  },
  {
    id: "evt-2",
    status: "Processing",
    location: "Dallas Distribution Center, TX",
    timestamp: "2023-09-10T14:45:00",
    description: "Your package is being processed and sorted for shipping.",
    isCompleted: true,
    isCurrentEvent: false,
  },
  {
    id: "evt-3",
    status: "In Transit",
    location: "Amarillo, TX",
    timestamp: "2023-09-11T10:15:00",
    description: "Your package is in transit to the next facility.",
    isCompleted: true,
    isCurrentEvent: false,
  },
  {
    id: "evt-4",
    status: "Out for Delivery",
    location: "Denver, CO",
    timestamp: "2023-09-12T08:30:00",
    description: "Your package is out for delivery and will be delivered today.",
    isCompleted: true,
    isCurrentEvent: false,
  },
  {
    id: "evt-5",
    status: "Delivered",
    location: "Denver, CO",
    timestamp: "2023-09-12T15:20:00",
    description: "Your package has been delivered to the recipient. Signature captured. Thank you for using Swift Mail Service!",
    isCompleted: true,
    isCurrentEvent: true,
  },
];

// Mock tracking details
const mockTrackingDetails: Record<string, TrackingDetailsType> = {
  "SMS123456789": {
    trackingNumber: "SMS123456789",
    status: "In Transit",
    estimatedDelivery: "Sep 17, 2023",
    shippedDate: "Sep 15, 2023",
    service: "Express Delivery",
    weight: "3.5 lbs",
    from: {
      address: "16000 Dallas Pkwy # 400",
      city: "Dallas",
      state: "TX",
      zip: "75248",
      country: "United States",
    },
    to: {
      address: "1234 Main St",
      city: "Denver",
      state: "CO",
      zip: "80202",
      country: "United States",
    },
    progress: 45,
    isDelivered: false,
  },
  "SMS987654321": {
    trackingNumber: "SMS987654321",
    status: "Delivered",
    estimatedDelivery: "Sep 12, 2023",
    shippedDate: "Sep 10, 2023",
    service: "Standard Shipping",
    weight: "1.2 lbs",
    from: {
      address: "16000 Dallas Pkwy # 400",
      city: "Dallas",
      state: "TX",
      zip: "75248",
      country: "United States",
    },
    to: {
      address: "5678 Oak Ave",
      city: "Denver",
      state: "CO",
      zip: "80239",
      country: "United States",
    },
    progress: 100,
    isDelivered: true,
  },
};

// Function to get tracking details
export const getTrackingDetails = (trackingNumber: string): Promise<TrackingDetailsType> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const details = mockTrackingDetails[trackingNumber];
      if (details) {
        resolve(details);
      } else {
        // If tracking number doesn't exist in our mock data, create a random one
        const isDelivered = Math.random() > 0.5;
        const newDetails: TrackingDetailsType = {
          trackingNumber,
          status: isDelivered ? "Delivered" : "In Transit",
          estimatedDelivery: isDelivered ? "Sep 12, 2023" : "Sep 17, 2023",
          shippedDate: isDelivered ? "Sep 10, 2023" : "Sep 15, 2023",
          service: Math.random() > 0.5 ? "Express Delivery" : "Standard Shipping",
          weight: `${(1 + Math.random() * 5).toFixed(1)} lbs`,
          from: {
            address: "16000 Dallas Pkwy # 400",
            city: "Dallas",
            state: "TX",
            zip: "75248",
            country: "United States",
          },
          to: {
            address: `${Math.floor(1000 + Math.random() * 8999)} ${["Main St", "Broadway", "Oak Ave", "Elm St"][Math.floor(Math.random() * 4)]}`,
            city: "Denver",
            state: "CO",
            zip: "80202",
            country: "United States",
          },
          progress: isDelivered ? 100 : Math.floor(Math.random() * 80) + 10,
          isDelivered,
        };
        resolve(newDetails);
      }
    }, 800); // Simulate network delay
  });
};

// Function to get tracking events
export const getTrackingEvents = (trackingNumber: string): Promise<TrackingEvent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const details = mockTrackingDetails[trackingNumber];
      if (details && details.isDelivered) {
        resolve(deliveredEvents);
      } else {
        resolve(inTransitEvents);
      }
    }, 1000); // Simulate network delay
  });
};

// Function to get tracking map data
export const getTrackingMapData = (trackingNumber: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const details = mockTrackingDetails[trackingNumber];
      if (details && details.isDelivered) {
        resolve({
          origin: locations.origin,
          destination: locations.destination,
          currentLocation: locations.destination,
          isDelivered: true,
        });
      } else {
        resolve({
          origin: locations.origin,
          destination: locations.destination,
          currentLocation: locations.current,
          isDelivered: false,
        });
      }
    }, 1200); // Simulate network delay
  });
};
