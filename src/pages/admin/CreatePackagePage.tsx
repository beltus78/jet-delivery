import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  Scale, 
  FileText, 
  ArrowLeft,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { PackageService } from "@/services/packageService";
import { CustomerService } from "@/services/customerService";
import { useAuth } from "@/hooks/useAuth";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

interface PackageFormData {
  customer_id?: string;
  description: string;
  weight: number;
  package_type: string;
  signature_required: boolean;
  special_instructions: string;
  origin_address: string;
  origin_city: string;
  origin_state: string;
  origin_country: string;
  origin_postal_code: string;
  destination_address: string;
  destination_city: string;
  destination_state: string;
  destination_country: string;
  destination_postal_code: string;
  estimated_delivery_date: string;
  service_type: string;
  priority: string;
  value: number;
}

export default function CreatePackagePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState<PackageFormData>({
    description: '',
    weight: 0,
    package_type: 'Box',
    signature_required: false,
    special_instructions: '',
    origin_address: '',
    origin_city: '',
    origin_state: '',
    origin_country: 'United States',
    origin_postal_code: '',
    destination_address: '',
    destination_city: '',
    destination_state: '',
    destination_country: 'United States',
    destination_postal_code: '',
    estimated_delivery_date: '',
    service_type: 'Standard Shipping',
    priority: 'standard',
    value: 0
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await CustomerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
    }
  };

  const handleInputChange = (field: keyof PackageFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'description', 'origin_address', 'origin_city', 'origin_state',
      'destination_address', 'destination_city', 'destination_state'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof PackageFormData]) {
        toast.error(`Please fill in the ${field.replace('_', ' ')} field`);
        return false;
      }
    }

    if (formData.weight <= 0) {
      toast.error('Weight must be greater than 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Calculate estimated delivery date if not provided
      let estimatedDelivery = formData.estimated_delivery_date;
      if (!estimatedDelivery) {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + (formData.priority === 'express' ? 2 : 5));
        estimatedDelivery = deliveryDate.toISOString().split('T')[0];
      }

      const packageData = {
        ...formData,
        estimated_delivery_date: estimatedDelivery,
        tracking_number: await PackageService.generateTrackingNumber(),
        status: 'pending' as const
      };

      const newPackage = await PackageService.createPackage(packageData);
      
      toast.success('Package created successfully!');
      navigate(`/admin/packages/${newPackage.id}`);
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error('Failed to create package');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrigin = () => {
    setFormData(prev => ({
      ...prev,
      destination_address: prev.origin_address,
      destination_city: prev.origin_city,
      destination_state: prev.origin_state,
      destination_country: prev.origin_country,
      destination_postal_code: prev.origin_postal_code
    }));
    toast.success('Origin address copied to destination');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/packages')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Packages
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Shipment</h1>
            <p className="text-gray-600">
              Add a new package to your delivery system
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Customer Information</span>
            </CardTitle>
            <CardDescription>
              Select an existing customer or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select onValueChange={(value) => handleInputChange('customer_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} ({customer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/customers/new">
                    <User className="h-4 w-4 mr-2" />
                    Add New Customer
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Package Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Package Details</span>
            </CardTitle>
            <CardDescription>
              Basic information about the package
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the package contents"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="package_type">Package Type</Label>
                <Select value={formData.package_type} onValueChange={(value) => handleInputChange('package_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Box">Box</SelectItem>
                    <SelectItem value="Envelope">Envelope</SelectItem>
                    <SelectItem value="Tube">Tube</SelectItem>
                    <SelectItem value="Pallet">Pallet</SelectItem>
                    <SelectItem value="Crate">Crate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weight">Weight (lbs) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="0.0"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">Declared Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service_type">Service Type</Label>
                <Select value={formData.service_type} onValueChange={(value) => handleInputChange('service_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard Shipping">Standard Shipping</SelectItem>
                    <SelectItem value="Express Delivery">Express Delivery</SelectItem>
                    <SelectItem value="Overnight Delivery">Overnight Delivery</SelectItem>
                    <SelectItem value="International">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="signature_required"
                  checked={formData.signature_required}
                  onCheckedChange={(checked) => handleInputChange('signature_required', checked)}
                />
                <Label htmlFor="signature_required">Signature Required</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="special_instructions">Special Instructions</Label>
              <Textarea
                id="special_instructions"
                placeholder="Any special handling instructions"
                value={formData.special_instructions}
                onChange={(e) => handleInputChange('special_instructions', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Origin Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Origin Address</span>
            </CardTitle>
            <CardDescription>
              Where the package is being shipped from
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="origin_address">Street Address *</Label>
              <Input
                id="origin_address"
                placeholder="123 Main Street"
                value={formData.origin_address}
                onChange={(e) => handleInputChange('origin_address', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="origin_city">City *</Label>
                <Input
                  id="origin_city"
                  placeholder="New York"
                  value={formData.origin_city}
                  onChange={(e) => handleInputChange('origin_city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="origin_state">State *</Label>
                <Input
                  id="origin_state"
                  placeholder="NY"
                  value={formData.origin_state}
                  onChange={(e) => handleInputChange('origin_state', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="origin_postal_code">Postal Code</Label>
                <Input
                  id="origin_postal_code"
                  placeholder="10001"
                  value={formData.origin_postal_code}
                  onChange={(e) => handleInputChange('origin_postal_code', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="origin_country">Country</Label>
              <Select value={formData.origin_country} onValueChange={(value) => handleInputChange('origin_country', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Destination Address */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Destination Address</span>
                </CardTitle>
                <CardDescription>
                  Where the package is being shipped to
                </CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={handleCopyOrigin}>
                Copy from Origin
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="destination_address">Street Address *</Label>
              <Input
                id="destination_address"
                placeholder="456 Oak Avenue"
                value={formData.destination_address}
                onChange={(e) => handleInputChange('destination_address', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="destination_city">City *</Label>
                <Input
                  id="destination_city"
                  placeholder="Los Angeles"
                  value={formData.destination_city}
                  onChange={(e) => handleInputChange('destination_city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="destination_state">State *</Label>
                <Input
                  id="destination_state"
                  placeholder="CA"
                  value={formData.destination_state}
                  onChange={(e) => handleInputChange('destination_state', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="destination_postal_code">Postal Code</Label>
                <Input
                  id="destination_postal_code"
                  placeholder="90210"
                  value={formData.destination_postal_code}
                  onChange={(e) => handleInputChange('destination_postal_code', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="destination_country">Country</Label>
              <Select value={formData.destination_country} onValueChange={(value) => handleInputChange('destination_country', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Delivery Options</span>
            </CardTitle>
            <CardDescription>
              Set delivery preferences and estimated delivery date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="estimated_delivery_date">Estimated Delivery Date</Label>
              <Input
                id="estimated_delivery_date"
                type="date"
                value={formData.estimated_delivery_date}
                onChange={(e) => handleInputChange('estimated_delivery_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-sm text-gray-500 mt-1">
                Leave blank to auto-calculate based on priority
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/packages')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Shipment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 