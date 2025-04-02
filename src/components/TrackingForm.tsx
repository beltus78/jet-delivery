
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export interface TrackingFormProps {
  onSubmit: (trackingNumber: string) => void;
  onHomepage?: boolean;
  className?: string;
}

const TrackingForm: React.FC<TrackingFormProps> = ({
  onSubmit,
  onHomepage = false,
  className = ''
}) => {
  const [trackingNumber, setTrackingNumber] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSubmit(trackingNumber);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-2 ${className}`}
    >
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Enter your tracking number"
          className={`pl-10 ${onHomepage ? 'h-12' : ''}`}
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
      </div>
      <Button 
        type="submit" 
        className={`bg-swift-600 hover:bg-swift-700 ${onHomepage ? 'h-12 px-8' : ''}`}
      >
        {onHomepage ? 'Track Package' : 'Track'}
      </Button>
    </form>
  );
};

export default TrackingForm;
