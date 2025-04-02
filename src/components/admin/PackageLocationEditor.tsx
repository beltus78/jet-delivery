
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TrackingPoint } from '@/types/tracking';
import { MapPin, Save } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

const formSchema = z.object({
  lat: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90, {
    message: "Latitude must be between -90 and 90"
  }),
  lng: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180, {
    message: "Longitude must be between -180 and 180"
  }),
  label: z.string().min(2, {
    message: "Location name must be at least 2 characters"
  })
});

interface PackageLocationEditorProps {
  trackingNumber: string;
  currentLocation: TrackingPoint;
  onLocationUpdate: (location: TrackingPoint) => Promise<void>;
}

const PackageLocationEditor = ({ 
  trackingNumber, 
  currentLocation,
  onLocationUpdate 
}: PackageLocationEditorProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lat: currentLocation.lat.toString(),
      lng: currentLocation.lng.toString(),
      label: currentLocation.label
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const updatedLocation: TrackingPoint = {
        id: currentLocation.id,
        lat: parseFloat(values.lat),
        lng: parseFloat(values.lng),
        label: values.label
      };
      
      await onLocationUpdate(updatedLocation);
      toast.success("Package location updated successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error updating package location:", error);
      toast.error("Failed to update package location");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MapPin className="h-4 w-4" />
          <span>Update Location</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Package Location</DialogTitle>
          <DialogDescription>
            Update the current location for tracking #{trackingNumber}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Chicago Distribution Center" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 41.8781" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. -87.6298" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? 'Updating...' : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PackageLocationEditor;
