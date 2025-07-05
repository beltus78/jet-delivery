import { TrackingEvent } from "@/components/TrackingTimeline";
import { TrackingDetailsType } from "@/components/TrackingOverview";
import { TrackingPoint } from "@/types/tracking";

// Mock locations for packages
const locations = {
  origin: { 
    id: "origin",
    lat: 32.9481, 
    lng: -96.7591, 
    label: "Dallas, TX" 
  },
  destination: { 
    id: "destination",
    lat: 39.7392, 
    lng: -104.9903, 
    label: "Denver, CO" 
  },
  current: { 
    id: "current",
    lat: 36.1699, 
    lng: -101.3864, 
    label: "Amarillo, TX" 
  },
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
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(303) 555-1234",
      address: "1234 Main St",
      city: "Denver",
      state: "CO",
      zip: "80202",
      country: "United States",
    },
    progress: 45,
    isDelivered: false,
    priority: "express",
    itemCount: 2,
    packageType: "Box",
    signatureRequired: true,
    specialInstructions: "Please leave with front desk if recipient is not available",
  },
  "JET240105001": {
    trackingNumber: "JET240105001",
    status: "In Transit",
    estimatedDelivery: "Jan 8, 2024",
    shippedDate: "Jan 5, 2024",
    service: "International Express",
    weight: "30g",
    from: {
      address: "124 apt road",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
      country: "United States",
    },
    to: {
      name: "Building: Al Khor Towers",
      email: "recipient@example.com",
      phone: "+971 50 123 4567",
      address: "Sheikh Rashid Bin Saeed Al Maktoum St, Al Rashidiya 1",
      city: "Ajman",
      state: "Ajman",
      zip: "00000",
      country: "UAE",
    },
    progress: 65,
    isDelivered: false,
    priority: "express",
    itemCount: 1,
    packageType: "Document",
    signatureRequired: true,
    specialInstructions: "A4 paper documents - Handle with care",
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
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      phone: "(303) 555-9876",
      address: "5678 Oak Ave",
      city: "Denver",
      state: "CO",
      zip: "80239",
      country: "United States",
    },
    progress: 100,
    isDelivered: true,
    priority: "standard",
    itemCount: 1,
    packageType: "Envelope",
    signatureRequired: false,
  },
};

// Names and email domains for random generation
const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com'];
const packageTypes = ['Box', 'Envelope', 'Tube', 'Pallet', 'Crate', 'Parcel'];
const specialInstructions = [
  "Please leave with neighbor if not home",
  "Call recipient before delivery",
  "Place package at back door",
  "Signature required - no exceptions",
  "Fragile - handle with care",
  "Do not leave unattended"
];

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
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const emailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
        const packageType = packageTypes[Math.floor(Math.random() * packageTypes.length)];
        const hasSpecialInstructions = Math.random() > 0.7;
        const priorityOptions = ["standard", "express", "priority"] as const;
        const priority = priorityOptions[Math.floor(Math.random() * priorityOptions.length)];
        const signatureRequired = Math.random() > 0.5;
        const itemCount = Math.floor(Math.random() * 5) + 1;
        
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
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`,
            phone: `(${Math.floor(Math.random() * 800) + 200}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            address: `${Math.floor(1000 + Math.random() * 8999)} ${["Main St", "Broadway", "Oak Ave", "Elm St"][Math.floor(Math.random() * 4)]}`,
            city: "Denver",
            state: "CO",
            zip: "80202",
            country: "United States",
          },
          progress: isDelivered ? 100 : Math.floor(Math.random() * 80) + 10,
          isDelivered,
          priority,
          itemCount,
          packageType,
          signatureRequired,
          ...(hasSpecialInstructions && {
            specialInstructions: specialInstructions[Math.floor(Math.random() * specialInstructions.length)]
          })
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
export const getTrackingMapData = (trackingNumber: string): Promise<{
  origin: TrackingPoint;
  destination: TrackingPoint;
  currentLocation: TrackingPoint;
  isDelivered: boolean;
}> => {
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
