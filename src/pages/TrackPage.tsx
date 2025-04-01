
import { useState } from "react";
import TrackingForm from "@/components/TrackingForm";

const TrackPage = () => {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Track Your Package</h1>
          <p className="text-gray-600 mb-8 text-center">
            Enter your tracking number below to get real-time updates on your package's location and status.
          </p>
          
          <TrackingForm />
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Tracking Information</h2>
            <p className="text-gray-600">
              With Swift Mail Service tracking, you can:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-gray-600">
              <li>View real-time package location on an interactive map</li>
              <li>Get detailed status updates with timestamps</li>
              <li>See estimated delivery dates and times</li>
              <li>Receive notifications of delivery exceptions</li>
              <li>Verify delivery with proof of delivery information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;
