
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface TrackingFormProps {
  onHomepage?: boolean;
  className?: string;
}

const TrackingForm = ({ onHomepage = false, className = "" }: TrackingFormProps) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }
    
    // In a real app, this would validate the tracking number format
    if (trackingNumber.length < 8) {
      toast.error("Please enter a valid tracking number");
      return;
    }
    
    // Redirect to the tracking details page
    navigate(`/track/${trackingNumber}`);
  };

  return (
    <div className={`${className} ${onHomepage ? "bg-white shadow-lg rounded-xl p-6" : ""}`}>
      {onHomepage && (
        <div className="mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-swift-700" />
          <h2 className="text-xl font-bold">Track Your Package</h2>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="h-11"
          />
        </div>
        <Button type="submit" className="h-11 gap-2">
          <Search className="h-4 w-4" />
          <span>Track</span>
        </Button>
      </form>
      
      {onHomepage && (
        <p className="text-sm text-gray-500 mt-2">
          Enter your tracking number to get real-time updates on your package location.
        </p>
      )}
    </div>
  );
};

export default TrackingForm;
