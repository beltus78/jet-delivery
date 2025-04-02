
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TrackingForm from "@/components/TrackingForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

const TrackPage = () => {
  const navigate = useNavigate();

  const handleTrackSubmit = (trackingNumber: string) => {
    navigate(`/track/${trackingNumber}`);
  };

  return (
    <div className="container max-w-5xl mx-auto py-16 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="p-3 rounded-full bg-swift-100 mb-4">
          <Truck className="h-8 w-8 text-swift-700" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Track Your Package</h1>
        <p className="text-gray-500 max-w-2xl">
          Enter your tracking number to get real-time updates about your package's
          location and delivery status
        </p>
      </div>
      
      <Card className="max-w-2xl mx-auto mb-12">
        <CardHeader>
          <CardTitle>Track a Package</CardTitle>
          <CardDescription>
            Enter your tracking number to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrackingForm onSubmit={handleTrackSubmit} />
        </CardContent>
      </Card>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">How to Track Your Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-swift-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-swift-700 font-bold">1</span>
            </div>
            <h3 className="font-medium mb-2">Find Your Tracking Number</h3>
            <p className="text-gray-500 text-sm">
              Your tracking number is in your shipping confirmation email or receipt
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-swift-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-swift-700 font-bold">2</span>
            </div>
            <h3 className="font-medium mb-2">Enter Tracking Number</h3>
            <p className="text-gray-500 text-sm">
              Insert your tracking number in the form above
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-swift-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-swift-700 font-bold">3</span>
            </div>
            <h3 className="font-medium mb-2">View Shipment Details</h3>
            <p className="text-gray-500 text-sm">
              Get real-time updates on your package's journey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
