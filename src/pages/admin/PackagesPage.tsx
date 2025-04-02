
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter, ArrowUpDown, Package as PackageIcon, Truck, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample package data
const packages = [
  {
    id: "PKG001",
    trackingNumber: "SMS123456789",
    customer: "John Smith",
    from: "Dallas, TX",
    to: "Denver, CO",
    status: "In Transit",
    date: "2023-09-16",
    location: "Amarillo, TX"
  },
  {
    id: "PKG002",
    trackingNumber: "SMS987654321",
    customer: "Emily Johnson",
    from: "Dallas, TX",
    to: "Chicago, IL",
    status: "Delivered",
    date: "2023-09-15",
    location: "Chicago, IL"
  },
  {
    id: "PKG003",
    trackingNumber: "SMS456789123",
    customer: "Robert Williams",
    from: "Dallas, TX",
    to: "Miami, FL",
    status: "Processing",
    date: "2023-09-16",
    location: "Dallas, TX"
  },
  {
    id: "PKG004",
    trackingNumber: "SMS789123456",
    customer: "Sarah Davis",
    from: "Dallas, TX",
    to: "Los Angeles, CA",
    status: "Out for Delivery",
    date: "2023-09-16",
    location: "Los Angeles, CA"
  },
  {
    id: "PKG005",
    trackingNumber: "SMS321654987",
    customer: "Michael Brown",
    from: "Dallas, TX",
    to: "Seattle, WA",
    status: "Processing",
    date: "2023-09-16",
    location: "Dallas, TX"
  },
];

const PackagesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || pkg.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
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
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Packages</h1>
          <p className="text-gray-500">Manage and track all package shipments</p>
        </div>
        
        <Button className="gap-2 bg-swift-700 hover:bg-swift-800">
          <Plus className="h-4 w-4" />
          <span>New Package</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>All Packages</CardTitle>
            <CardDescription>View all packages in the system</CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search packages..."
                className="pl-10 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in transit">In Transit</SelectItem>
                  <SelectItem value="out for delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Packages</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From/To</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPackages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.trackingNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.customer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">From: {pkg.from}</span>
                              <span className="text-xs text-gray-500">To: {pkg.to}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{pkg.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(pkg.status)}`}>
                              {pkg.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{pkg.date}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Button asChild variant="outline" size="sm">
                                <Link to={`/admin/packages/${pkg.id}`}>
                                  <PackageIcon className="h-4 w-4 mr-1" />
                                  Details
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Truck className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredPackages.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No packages found matching your search criteria
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="active" className="mt-0">
              <div className="text-center py-6 text-gray-500">
                Active packages will be shown here
              </div>
            </TabsContent>
            
            <TabsContent value="delivered" className="mt-0">
              <div className="text-center py-6 text-gray-500">
                Delivered packages will be shown here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackagesPage;
