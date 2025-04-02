
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface TrackingFormProps {
  onSubmit: (trackingNumber: string) => void;
  onHomepage?: boolean;
  className?: string;
}

const TrackingForm = ({ onSubmit, onHomepage, className }: TrackingFormProps) => {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSubmit(trackingNumber);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className || ""}`}>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter your tracking number"
            className="pl-10 w-full"
            required
          />
        </div>
        <Button type="submit" className="bg-swift-700 hover:bg-swift-800">
          Track Package
        </Button>
      </div>
    </form>
  );
};

export default TrackingForm;
