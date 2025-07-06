import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Calendar,
  MapPin,
  User,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { PackageService } from "@/services/packageService";
import { CustomerService } from "@/services/customerService";
import { useAuth } from "@/hooks/useAuth";

interface PackageWithCustomer {
  id: string;
  tracking_number: string;
  status: string;
  description?: string;
  weight?: number;
  origin_address: string;
  origin_city: string;
  origin_state?: string;
  destination_address: string;
  destination_city: string;
  destination_state?: string;
  estimated_delivery_date?: string;
  created_at: string;
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}

export default function PackagesPage() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<PackageWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPackage, setSelectedPackage] = useState<PackageWithCustomer | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await PackageService.getAllPackages();
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    try {
      await PackageService.deletePackage(packageId);
      toast.success('Package deleted successfully');
      loadPackages();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  const handleStatusUpdate = async (packageId: string, newStatus: string) => {
    try {
      await PackageService.updatePackageStatus(packageId, newStatus);
      toast.success('Package status updated successfully');
      loadPackages();
    } catch (error) {
      console.error('Error updating package status:', error);
      toast.error('Failed to update package status');
    }
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

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${pkg.customer?.first_name} ${pkg.customer?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swift-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
          <p className="text-gray-600">
            Manage all your packages and track their status
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/packages/new">
            <Plus className="h-4 w-4 mr-2" />
            New Shipment
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by tracking number, description, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="picked_up">Picked Up</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(pkg.status)}
                  <Badge variant="outline" className={getStatusColor(pkg.status)}>
                    {pkg.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Package Actions</DialogTitle>
                      <DialogDescription>
                        Choose an action for package {pkg.tracking_number}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link to={`/admin/packages/${pkg.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link to={`/admin/packages/${pkg.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Package
                        </Link>
                      </Button>
                      <Select onValueChange={(value) => handleStatusUpdate(pkg.id, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="picked_up">Picked Up</SelectItem>
                          <SelectItem value="in_transit">In Transit</SelectItem>
                          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full justify-start">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Package
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Package</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete package {pkg.tracking_number}? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <CardTitle className="text-lg">{pkg.tracking_number}</CardTitle>
              <CardDescription>
                {pkg.description || 'No description provided'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span>
                  {pkg.customer ? `${pkg.customer.first_name} ${pkg.customer.last_name}` : 'Unknown Customer'}
                </span>
              </div>

              {/* Route Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Route:</span>
                </div>
                <div className="text-sm text-gray-600 pl-6">
                  <div>{pkg.origin_city}, {pkg.origin_state}</div>
                  <div className="text-gray-400">↓</div>
                  <div>{pkg.destination_city}, {pkg.destination_state}</div>
                </div>
              </div>

              {/* Package Details */}
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-500">Weight:</span>
                  <span className="ml-1 font-medium">
                    {pkg.weight ? `${pkg.weight} lbs` : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-1 font-medium">
                    {new Date(pkg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Estimated Delivery */}
              {pkg.estimated_delivery_date && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">ETA:</span>
                  <span className="font-medium">
                    {new Date(pkg.estimated_delivery_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/admin/packages/${pkg.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/admin/packages/${pkg.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPackages.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first shipment.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button asChild>
                <Link to="/admin/packages/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Shipment
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {packages.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {packages.filter(p => p.status === 'picked_up').length}
              </div>
              <div className="text-sm text-gray-600">Picked Up</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {packages.filter(p => p.status === 'in_transit').length}
              </div>
              <div className="text-sm text-gray-600">In Transit</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {packages.filter(p => p.status === 'out_for_delivery').length}
              </div>
              <div className="text-sm text-gray-600">Out for Delivery</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {packages.filter(p => p.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
