import { TrackingEvent } from "@/components/TrackingTimeline";
import { TrackingDetailsType } from "@/components/TrackingOverview";
import { TrackingPoint } from "@/types/tracking";
import { PackageService } from "./packageService";
import { supabase } from "@/integrations/supabase/client";

// Mock locations for packages (fallback)
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

// Mock events for a package in transit (fallback)
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

// Mock events for a delivered package (fallback)
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

// Mock tracking details (fallback)
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
      phone: "(312) 555-5678",
      address: "5678 Oak Ave",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "United States",
    },
    progress: 100,
    isDelivered: true,
    priority: "standard",
    itemCount: 1,
    packageType: "Envelope",
    signatureRequired: false,
    specialInstructions: "",
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

// Convert database package to tracking details format
const convertPackageToTrackingDetails = (pkg: any): TrackingDetailsType => {
  const isDelivered = pkg.status === 'delivered';
  const progress = isDelivered ? 100 : 
    pkg.status === 'out_for_delivery' ? 90 :
    pkg.status === 'in_transit' ? 60 :
    pkg.status === 'picked_up' ? 30 : 10;

  return {
    trackingNumber: pkg.tracking_number,
    status: pkg.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    estimatedDelivery: pkg.estimated_delivery_date ? new Date(pkg.estimated_delivery_date).toLocaleDateString() : 'TBD',
    shippedDate: new Date(pkg.created_at).toLocaleDateString(),
    service: pkg.weight && pkg.weight > 10 ? "Express Delivery" : "Standard Shipping",
    weight: pkg.weight ? `${pkg.weight} ${pkg.weight > 10 ? 'lbs' : 'g'}` : 'N/A',
    from: {
      address: pkg.origin_address,
      city: pkg.origin_city,
      state: pkg.origin_state || '',
      zip: pkg.origin_postal_code || '',
      country: pkg.origin_country,
    },
    to: {
      name: pkg.customer?.first_name && pkg.customer?.last_name ? 
        `${pkg.customer.first_name} ${pkg.customer.last_name}` : 'Recipient',
      email: pkg.customer?.email || 'N/A',
      phone: pkg.customer?.phone || 'N/A',
      address: pkg.destination_address,
      city: pkg.destination_city,
      state: pkg.destination_state || '',
      zip: pkg.destination_postal_code || '',
      country: pkg.destination_country,
    },
    progress,
    isDelivered,
    priority: pkg.weight && pkg.weight > 10 ? "express" : "standard",
    itemCount: 1,
    packageType: pkg.weight && pkg.weight > 10 ? "Box" : "Document",
    signatureRequired: pkg.weight && pkg.weight > 10,
    specialInstructions: "",
  };
};

// Convert database events to tracking events format
const convertEventsToTrackingEvents = (events: any[]): TrackingEvent[] => {
  return events.map((event, index) => ({
    id: event.id,
    status: event.event_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    location: event.location || 'Unknown Location',
    timestamp: event.created_at,
    description: event.description,
    isCompleted: index < events.length - 1,
    isCurrentEvent: index === events.length - 1,
  }));
};

// Function to get tracking details
export const getTrackingDetails = async (trackingNumber: string): Promise<TrackingDetailsType> => {
  try {
    // Try to get from database first
    const packageData = await PackageService.getPackageByTrackingNumber(trackingNumber);
    
    if (packageData) {
      return convertPackageToTrackingDetails(packageData);
    }

    // Fallback to mock data
    const mockData = mockTrackingDetails[trackingNumber];
    if (mockData) {
      return mockData;
    }

    throw new Error('Tracking number not found');
  } catch (error) {
    console.error('Error fetching tracking details:', error);
    
    // Return mock data as fallback
    const mockData = mockTrackingDetails[trackingNumber];
    if (mockData) {
      return mockData;
    }
    
    throw error;
  }
};

// Function to get tracking events
export const getTrackingEvents = async (trackingNumber: string): Promise<TrackingEvent[]> => {
  try {
    // Try to get from database first
    const packageData = await PackageService.getPackageByTrackingNumber(trackingNumber);
    
    if (packageData && packageData.tracking_events) {
      return convertEventsToTrackingEvents(packageData.tracking_events);
    }

    // Fallback to mock data
    const mockData = mockTrackingDetails[trackingNumber];
    if (mockData) {
      return mockData.isDelivered ? deliveredEvents : inTransitEvents;
    }

    throw new Error('Tracking events not found');
  } catch (error) {
    console.error('Error fetching tracking events:', error);
    
    // Return mock data as fallback
    const mockData = mockTrackingDetails[trackingNumber];
    if (mockData) {
      return mockData.isDelivered ? deliveredEvents : inTransitEvents;
    }
    
    throw error;
  }
};

// Function to get tracking map data
export const getTrackingMapData = async (trackingNumber: string): Promise<{
  origin: TrackingPoint;
  destination: TrackingPoint;
  currentLocation: TrackingPoint;
  isDelivered: boolean;
}> => {
  try {
    // Try to get from database first
    const packageData = await PackageService.getPackageByTrackingNumber(trackingNumber);
    
    if (packageData) {
      return {
        origin: {
          id: "origin",
          lat: packageData.origin_lat || 32.9481,
          lng: packageData.origin_lng || -96.7591,
          label: `${packageData.origin_city}, ${packageData.origin_state || ''}`
        },
        destination: {
          id: "destination",
          lat: packageData.destination_lat || 39.7392,
          lng: packageData.destination_lng || -104.9903,
          label: `${packageData.destination_city}, ${packageData.destination_state || ''}`
        },
        currentLocation: {
          id: "current",
          lat: packageData.current_lat || packageData.origin_lat || 32.9481,
          lng: packageData.current_lng || packageData.origin_lng || -96.7591,
          label: packageData.current_location || packageData.origin_city
        },
        isDelivered: packageData.status === 'delivered'
      };
    }

    // Fallback to mock data
    const mockData = mockTrackingDetails[trackingNumber];
    if (mockData) {
      return {
        origin: locations.origin,
        destination: locations.destination,
        currentLocation: locations.current,
        isDelivered: mockData.isDelivered
      };
    }

    throw new Error('Tracking map data not found');
  } catch (error) {
    console.error('Error fetching tracking map data:', error);
    
    // Return mock data as fallback
    const mockData = mockTrackingDetails[trackingNumber];
    if (mockData) {
      return {
        origin: locations.origin,
        destination: locations.destination,
        currentLocation: locations.current,
        isDelivered: mockData.isDelivered
      };
    }
    
    throw error;
  }
};
