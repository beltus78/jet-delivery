import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  Scale, 
  FileText, 
  ArrowLeft,
  Edit,
  Save,
  Loader2,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  Eye,
  History,
  Route
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PackageService } from "@/services/packageService";
import { TrackingService } from "@/services/trackingService";


interface TrackingEvent {
  id: string;
  event_type: string;
  description: string;
  location?: string;
  created_at: string;
}

interface PackageWithEvents {
  id: string;
  tracking_number: string;
  status: string;
  description?: string;
  weight?: number;
  package_type: string;
  signature_required: boolean;
  special_instructions?: string;
  origin_address: string;
  origin_city: string;
  origin_state?: string;
  origin_country: string;
  origin_postal_code?: string;
  destination_address: string;
  destination_city: string;
  destination_state?: string;
  destination_country: string;
  destination_postal_code?: string;
  current_location?: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  service_type: string;
  priority: string;
  value?: number;
  created_at: string;
  updated_at: string;
  customer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  tracking_events: TrackingEvent[];
}

export default function PackageDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [packageData, setPackageData] = useState<PackageWithEvents | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadPackage();
    }
  }, [id]);

  const loadPackage = async () => {
    try {
      setLoading(true);
      const data = await PackageService.getPackageById(id!);
      if (data) {
        setPackageData(data);
        setFormData(data);
      } else {
        toast.error('Package not found');
        navigate('/admin/packages');
      }
    } catch (error) {
      console.error('Error loading package:', error);
      toast.error('Failed to load package details');
      navigate('/admin/packages');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!packageData) return;

    try {
      setSaving(true);
      await PackageService.updatePackageStatus(packageData.id, newStatus);
      toast.success('Package status updated successfully');
      loadPackage(); // Reload to get updated data
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update package status');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!packageData || !formData) return;

    try {
      setSaving(true);
      const { id, tracking_number, created_at, updated_at, customer, tracking_events, ...updateData } = formData;
      await PackageService.updatePackage(packageData.id, updateData);
      toast.success('Package updated successfully');
      setEditing(false);
      loadPackage();
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error('Failed to update package');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'picked_up':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'out_for_delivery':
        return <MapPin className="h-4 w-4" />;
      case 'picked_up':
        return <Package className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Package not found</p>
        <Button onClick={() => navigate('/admin/packages')} className="mt-4">
          Back to Packages
        </Button>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">
              Package Details
            </h1>
            <p className="text-gray-600">
              {packageData.tracking_number}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {!editing && (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {editing && (
            <>
              <Button variant="outline" onClick={() => {
                setEditing(false);
                setFormData(packageData);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Status</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(packageData.status)}
                  <Badge variant="outline" className={getStatusColor(packageData.status)}>
                    {packageData.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Tracking Number</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input value={packageData.tracking_number} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(packageData.tracking_number)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Estimated Delivery</Label>
                  <div className="mt-1 text-sm">
                    {packageData.estimated_delivery_date 
                      ? new Date(packageData.estimated_delivery_date).toLocaleDateString()
                      : 'Not set'
                    }
                  </div>
                </div>
                <div>
                  <Label>Service Type</Label>
                  <div className="mt-1 text-sm">{packageData.service_type}</div>
                </div>
              </div>

              {/* Quick Status Update */}
              <div className="mt-4 pt-4 border-t">
                <Label>Quick Status Update</Label>
                <div className="flex space-x-2 mt-2">
                  {['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'].map((status) => (
                    <Button
                      key={status}
                      variant={packageData.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusUpdate(status)}
                      disabled={saving || packageData.status === status}
                    >
                      {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {packageData.customer ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <div className="mt-1">
                      {packageData.customer.first_name} {packageData.customer.last_name}
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="mt-1">{packageData.customer.email}</div>
                  </div>
                  {packageData.customer.phone && (
                    <div>
                      <Label>Phone</Label>
                      <div className="mt-1">{packageData.customer.phone}</div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No customer assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Route className="h-5 w-5" />
                <span>Route Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Origin</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{packageData.origin_city}, {packageData.origin_state}</div>
                    <div className="text-sm text-gray-600">{packageData.origin_address}</div>
                    {packageData.origin_postal_code && (
                      <div className="text-sm text-gray-600">{packageData.origin_postal_code}</div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Destination</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">{packageData.destination_city}, {packageData.destination_state}</div>
                    <div className="text-sm text-gray-600">{packageData.destination_address}</div>
                    {packageData.destination_postal_code && (
                      <div className="text-sm text-gray-600">{packageData.destination_postal_code}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          {/* Tracking Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Tracking History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {packageData.tracking_events.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tracking events yet</p>
                ) : (
                  packageData.tracking_events.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {event.event_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(event.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        {event.location && (
                          <p className="text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {/* Package Details Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Package Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">Description</Label>
                  {editing ? (
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded border">
                      {packageData.description || 'No description'}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="package_type">Package Type</Label>
                  {editing ? (
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
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded border">
                      {packageData.package_type}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  {editing ? (
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight || 0}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded border">
                      {packageData.weight || 'N/A'}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="value">Declared Value ($)</Label>
                  {editing ? (
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={formData.value || 0}
                      onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded border">
                      ${packageData.value || 'N/A'}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  {editing ? (
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
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded border">
                      {packageData.priority}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="special_instructions">Special Instructions</Label>
                {editing ? (
                  <Textarea
                    id="special_instructions"
                    value={formData.special_instructions || ''}
                    onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                  />
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded border">
                    {packageData.special_instructions || 'None'}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="signature_required"
                  checked={editing ? formData.signature_required : packageData.signature_required}
                  onCheckedChange={(checked) => handleInputChange('signature_required', checked)}
                  disabled={!editing}
                />
                <Label htmlFor="signature_required">Signature Required</Label>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Created</Label>
                  <div className="mt-1">
                    {new Date(packageData.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <div className="mt-1">
                    {new Date(packageData.updated_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Package ID</Label>
                  <div className="mt-1 font-mono text-xs">{packageData.id}</div>
                </div>
                <div>
                  <Label>Service Type</Label>
                  <div className="mt-1">{packageData.service_type}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 