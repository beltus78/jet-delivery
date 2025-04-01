
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  Activity, 
  Settings, 
  LogOut, 
  Search, 
  Plus,
  Calendar,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for the chart
const data = [
  { name: "Jan", value: 540 },
  { name: "Feb", value: 620 },
  { name: "Mar", value: 700 },
  { name: "Apr", value: 680 },
  { name: "May", value: 750 },
  { name: "Jun", value: 890 },
  { name: "Jul", value: 950 },
];

// Sample package data
const recentPackages = [
  {
    id: "PKG001",
    tracking: "SMS123456789",
    customer: "John Smith",
    from: "Dallas, TX",
    to: "Denver, CO",
    status: "In Transit",
    date: "2023-09-16",
  },
  {
    id: "PKG002",
    tracking: "SMS987654321",
    customer: "Emily Johnson",
    from: "Dallas, TX",
    to: "Chicago, IL",
    status: "Delivered",
    date: "2023-09-15",
  },
  {
    id: "PKG003",
    tracking: "SMS456789123",
    customer: "Robert Williams",
    from: "Dallas, TX",
    to: "Miami, FL",
    status: "Processing",
    date: "2023-09-16",
  },
  {
    id: "PKG004",
    tracking: "SMS789123456",
    customer: "Sarah Davis",
    from: "Dallas, TX",
    to: "Los Angeles, CA",
    status: "Out for Delivery",
    date: "2023-09-16",
  },
  {
    id: "PKG005",
    tracking: "SMS321654987",
    customer: "Michael Brown",
    from: "Dallas, TX",
    to: "Seattle, WA",
    status: "Processing",
    date: "2023-09-16",
  },
];

const AdminDashboard = () => {
  const [searchText, setSearchText] = useState("");

  const filteredPackages = recentPackages.filter(pkg => 
    pkg.tracking.toLowerCase().includes(searchText.toLowerCase()) ||
    pkg.customer.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "in transit":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-amber-100 text-amber-700";
      case "out for delivery":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-swift-700" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>
        
        <div className="p-4 flex-1">
          <nav className="space-y-1">
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/admin/packages" className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>Packages</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/admin/deliveries" className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <span>Deliveries</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/admin/customers" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Customers</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/admin/reports" className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <span>Reports</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/admin/settings" className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </Button>
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <Button asChild variant="outline" className="w-full justify-start text-gray-600">
            <Link to="/" className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">Admin</Button>
          </div>
        </header>
        
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">1,248</div>
                  <Package className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">12%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">342</div>
                  <Truck className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">8%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">856</div>
                  <Users className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">24%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">$87,432</div>
                  <BarChart3 className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex items-center mt-1 text-xs">
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-red-500 font-medium">3%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Delivery Overview</CardTitle>
                <CardDescription>Delivery statistics for the past months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0ea5e9"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <Package className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Package Delivered</p>
                      <p className="text-xs text-gray-500">SMS987654321 was delivered to Chicago</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Truck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Shipment Created</p>
                      <p className="text-xs text-gray-500">New package SMS456789123 registered</p>
                      <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-amber-100">
                      <Users className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Customer</p>
                      <p className="text-xs text-gray-500">Robert Williams registered</p>
                      <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-purple-100">
                      <Truck className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status Updated</p>
                      <p className="text-xs text-gray-500">Package SMS789123456 is out for delivery</p>
                      <p className="text-xs text-gray-400 mt-1">8 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Packages</CardTitle>
                <CardDescription>Manage and track recent shipments</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="search"
                    placeholder="Search packages..."
                    className="pl-10 w-64"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <Button className="gap-2 bg-swift-700 hover:bg-swift-800">
                  <Plus className="h-4 w-4" />
                  <span>Add Package</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="processing">Processing</TabsTrigger>
                  <TabsTrigger value="in-transit">In Transit</TabsTrigger>
                  <TabsTrigger value="out-for-delivery">Out for Delivery</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking #</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredPackages.map((pkg) => (
                            <tr key={pkg.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.tracking}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.customer}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.from}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.to}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(pkg.status)}`}>
                                  {pkg.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span>{pkg.date}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Button asChild size="sm" variant="ghost">
                                  <Link to={`/admin/packages/${pkg.id}`}>
                                    <span>View</span>
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                  </Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="processing" className="mt-0">
                  {/* Similar table but filtered for processing status */}
                  <div className="rounded-md border">
                    <div className="p-4 text-center text-gray-500">
                      Processing packages will appear here
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="in-transit" className="mt-0">
                  {/* Similar table but filtered for in-transit status */}
                  <div className="rounded-md border">
                    <div className="p-4 text-center text-gray-500">
                      In-transit packages will appear here
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="out-for-delivery" className="mt-0">
                  {/* Similar table but filtered for out-for-delivery status */}
                  <div className="rounded-md border">
                    <div className="p-4 text-center text-gray-500">
                      Out for delivery packages will appear here
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="delivered" className="mt-0">
                  {/* Similar table but filtered for delivered status */}
                  <div className="rounded-md border">
                    <div className="p-4 text-center text-gray-500">
                      Delivered packages will appear here
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
