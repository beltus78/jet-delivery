import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { PackageService } from "@/services/packageService";
import { CustomerService } from "@/services/customerService";
import { AuthService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  totalPackages: number;
  activePackages: number;
  deliveredPackages: number;
  totalCustomers: number;
  revenue: number;
  pendingPackages: number;
  inTransitPackages: number;
  outForDeliveryPackages: number;
}

interface RecentPackage {
  id: string;
  tracking_number: string;
  status: string;
  customer_name: string;
  origin_city: string;
  destination_city: string;
  created_at: string;
  estimated_delivery_date?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 0,
    activePackages: 0,
    deliveredPackages: 0,
    totalCustomers: 0,
    revenue: 0,
    pendingPackages: 0,
    inTransitPackages: 0,
    outForDeliveryPackages: 0
  });
  const [recentPackages, setRecentPackages] = useState<RecentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load packages for stats
      const packages = await PackageService.getAllPackages();
      const customers = await CustomerService.getAllCustomers();
      
      // Calculate stats
      const totalPackages = packages.length;
      const activePackages = packages.filter(p => ['pending', 'picked_up', 'in_transit', 'out_for_delivery'].includes(p.status)).length;
      const deliveredPackages = packages.filter(p => p.status === 'delivered').length;
      const pendingPackages = packages.filter(p => p.status === 'pending').length;
      const inTransitPackages = packages.filter(p => p.status === 'in_transit').length;
      const outForDeliveryPackages = packages.filter(p => p.status === 'out_for_delivery').length;
      
      // Calculate revenue (mock calculation based on package count)
      const revenue = packages.reduce((sum, pkg) => {
        const basePrice = pkg.weight && pkg.weight > 10 ? 25 : 15;
        return sum + basePrice;
      }, 0);

      setStats({
        totalPackages,
        activePackages,
        deliveredPackages,
        totalCustomers: customers.length,
        revenue,
        pendingPackages,
        inTransitPackages,
        outForDeliveryPackages
      });

      // Get recent packages
      const recent = packages
        .slice(0, 10)
        .map(pkg => ({
          id: pkg.id,
          tracking_number: pkg.tracking_number,
          status: pkg.status,
          customer_name: pkg.customer ? `${pkg.customer.first_name} ${pkg.customer.last_name}` : 'Unknown',
          origin_city: pkg.origin_city,
          destination_city: pkg.destination_city,
          created_at: pkg.created_at,
          estimated_delivery_date: pkg.estimated_delivery_date
        }));

      setRecentPackages(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  const filteredPackages = recentPackages.filter(pkg => {
    const matchesSearch = pkg.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
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
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.first_name || 'Admin'}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your shipments today.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/packages/new">
            <Plus className="h-4 w-4 mr-2" />
            New Shipment
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPackages}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activePackages} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePackages}</div>
            <p className="text-xs text-muted-foreground">
              {stats.inTransitPackages} in transit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingPackages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inTransitPackages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Out for Delivery</p>
                <p className="text-2xl font-bold text-purple-600">{stats.outForDeliveryPackages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.deliveredPackages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shipments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Shipments</CardTitle>
              <CardDescription>
                Latest package updates and status changes
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/admin/packages">
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by tracking number or customer..."
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

          {/* Packages Table */}
          <div className="space-y-3">
            {filteredPackages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No shipments found matching your criteria.
              </div>
            ) : (
              filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(pkg.status)}
                      <Badge variant="outline" className={getStatusColor(pkg.status)}>
                        {pkg.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium">{pkg.tracking_number}</p>
                      <p className="text-sm text-gray-600">{pkg.customer_name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {pkg.origin_city} → {pkg.destination_city}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created {new Date(pkg.created_at).toLocaleDateString()}
                    </p>
                    {pkg.estimated_delivery_date && (
                      <p className="text-xs text-gray-500">
                        ETA: {new Date(pkg.estimated_delivery_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/packages/${pkg.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/packages/${pkg.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link to="/admin/packages/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New Shipment
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link to="/admin/customers/new">
                <Users className="h-4 w-4 mr-2" />
                Add New Customer
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link to="/admin/reports">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Authentication</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Secure
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Services</span>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                All systems are secure. No security alerts at this time.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 