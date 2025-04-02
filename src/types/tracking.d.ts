
export interface TrackingPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

export interface TrackingDetails {
  id: string;
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  origin: string;
  destination: string;
  currentLocation?: string;
  history: {
    status: string;
    location: string;
    timestamp: string;
    note?: string;
  }[];
  route?: TrackingPoint[];
}
