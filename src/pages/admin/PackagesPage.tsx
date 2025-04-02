
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Package, 
  ArrowRight, 
  Filter, 
  Calendar,
  Truck,
  FileDown,
  FileUp
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Sample package data
const samplePackages = [
  {
    id: "PKG001",
    tracking: "SMS123456789",
    customer: "John Smith",
    from: "Dallas, TX",
    to: "Denver, CO",
    status: "In Transit",
    date: "2023-09-16",
    priority: "express",
    weight: "3.5 lbs",
  },
  {
    id: "PKG002",
    tracking: "SMS987654321",
    customer: "Emily Johnson",
    from: "Dallas, TX",
    to: "Chicago, IL",
    status: "Delivered",
    date: "2023-09-15",
    priority: "standard",
    weight: "2.1 lbs",
  },
  {
    id: "PKG003",
    tracking: "SMS456789123",
    customer: "Robert Williams",
    from: "Dallas, TX",
    to: "Miami, FL",
    status: "Processing",
    date: "2023-09-16",
    priority: "economy",
    weight: "5.7 lbs",
  },
  {
    id: "PKG004",
    tracking: "SMS789123456",
    customer: "Sarah Davis",
    from: "Dallas, TX",
    to: "Los Angeles, CA",
    status: "Out for Delivery",
    date: "2023-09-16",
    priority: "express",
    weight: "1.2 lbs",
  },
  {
    id: "PKG005",
    tracking: "SMS321654987",
    customer: "Michael Brown",
    from: "Dallas, TX",
    to: "Seattle, WA",
    status: "Processing",
    date: "2023-09-16",
    priority: "standard",
    weight: "4.3 lbs",
  },
];

const PackagesPage = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [packages, setPackages] = useState(samplePackages);

  // New package form state
  const [newPackage, setNewPackage] = useState({
    customer: "",
    fromAddress: "",
    fromCity: "",
    fromState: "",
    fromZip: "",
    toName: "",
    toAddress: "",
    toCity: "",
    toState: "",
    toZip: "",
    weight: "",
    priority: "standard",
    packageType: "box",
    signatureRequired: false,
    specialInstructions: "",
  });

  const [showNewPackageDialog, setShowNewPackageDialog] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewPackage({
      ...newPackage,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewPackage({
      ...newPackage,
      [name]: value,
    });
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.tracking.toLowerCase().includes(searchText.toLowerCase()) ||
      pkg.customer.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || pkg.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === "all" || pkg.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPriority;
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

  const getPriorityColor = (priority: string) => {
    switch(priority.toLowerCase()) {
      case "express":
        return "bg-red-100 text-red-700";
      case "standard":
        return "bg-blue-100 text-blue-700";
      case "economy":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a new tracking number
    const newTrackingNumber = `SMS${Math.floor(Math.random() * 900000000) + 100000000}`;
    
    // Create a new package
    const createdPackage = {
      id: `PKG${Math.floor(Math.random() * 900) + 100}`,
      tracking: newTrackingNumber,
      customer: newPackage.customer,
      from: `${newPackage.fromCity}, ${newPackage.fromState}`,
      to: `${newPackage.toCity}, ${newPackage.toState}`,
      status: "Processing",
      date: new Date().toISOString().split('T')[0],
      priority: newPackage.priority,
      weight: `${newPackage.weight} lbs`,
    };
    
    // Add to packages list
    setPackages([createdPackage, ...packages]);
    
    // Close dialog and show success message
    setShowNewPackageDialog(false);
    toast.success("Package created successfully", {
      description: `Tracking number: ${newTrackingNumber}`
    });
    
    // Reset form
    setNewPackage({
      customer: "",
      fromAddress: "",
      fromCity: "",
      fromState: "",
      fromZip: "",
      toName: "",
      toAddress: "",
      toCity: "",
      toState: "",
      toZip: "",
      weight: "",
      priority: "standard",
      packageType: "box",
      signatureRequired: false,
      specialInstructions: "",
    });
  };

  const handleExportData = () => {
    toast.info("Exporting package data...");
    // In a real app, this would generate a CSV or Excel file
    setTimeout(() => {
      toast.success("Package data exported successfully");
    }, 1500);
  };

  const handleImportData = () => {
    toast.info("Import functionality would open a file dialog");
    // In a real app, this would open a file dialog
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Packages</h1>
            <p className="text-gray-500">Manage and track all packages</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <FileDown className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button variant="outline" onClick={handleImportData} className="gap-2">
              <FileUp className="h-4 w-4" />
              <span>Import</span>
            </Button>
            <Dialog open={showNewPackageDialog} onOpenChange={setShowNewPackageDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-swift-700 hover:bg-swift-800">
                  <Plus className="h-4 w-4" />
                  <span>New Package</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Package</DialogTitle>
                  <DialogDescription>
                    Enter the package details to create a new shipment
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePackage}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Sender Information</h3>
                        <Input
                          name="customer"
                          placeholder="Sender Name"
                          value={newPackage.customer}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          name="fromAddress"
                          placeholder="Address"
                          value={newPackage.fromAddress}
                          onChange={handleInputChange}
                          required
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            name="fromCity"
                            placeholder="City"
                            value={newPackage.fromCity}
                            onChange={handleInputChange}
                            required
                          />
                          <Input
                            name="fromState"
                            placeholder="State"
                            value={newPackage.fromState}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <Input
                          name="fromZip"
                          placeholder="ZIP Code"
                          value={newPackage.fromZip}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Recipient Information</h3>
                        <Input
                          name="toName"
                          placeholder="Recipient Name"
                          value={newPackage.toName}
                          onChange={handleInputChange}
                          required
                        />
                        <Input
                          name="toAddress"
                          placeholder="Address"
                          value={newPackage.toAddress}
                          onChange={handleInputChange}
                          required
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            name="toCity"
                            placeholder="City"
                            value={newPackage.toCity}
                            onChange={handleInputChange}
                            required
                          />
                          <Input
                            name="toState"
                            placeholder="State"
                            value={newPackage.toState}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <Input
                          name="toZip"
                          placeholder="ZIP Code"
                          value={newPackage.toZip}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Package Type</label>
                        <Select 
                          value={newPackage.packageType}
                          onValueChange={(value) => handleSelectChange("packageType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="envelope">Envelope</SelectItem>
                            <SelectItem value="box">Box</SelectItem>
                            <SelectItem value="tube">Tube</SelectItem>
                            <SelectItem value="pallet">Pallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Weight (lbs)</label>
                        <Input
                          name="weight"
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder="Weight"
                          value={newPackage.weight}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <Select 
                          value={newPackage.priority}
                          onValueChange={(value) => handleSelectChange("priority", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="express">Express</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Special Instructions</label>
                      <Input
                        name="specialInstructions"
                        placeholder="Special delivery instructions (optional)"
                        value={newPackage.specialInstructions}
                        onChange={handleInputChange}
                      />
                    </div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="signatureRequired"
                        checked={newPackage.signatureRequired}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-swift-600 focus:ring-swift-500"
                      />
                      <span className="text-sm">Require signature on delivery</span>
                    </label>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowNewPackageDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-swift-700 hover:bg-swift-800">
                      Create Package
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Packages</CardTitle>
              <CardDescription>View and filter all packages in the system</CardDescription>
            </div>
            <div className="flex items-center gap-4">
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
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
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
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(pkg.priority)}`}>
                                {pkg.priority.charAt(0).toUpperCase() + pkg.priority.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.weight}</td>
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
      </div>
    </AdminLayout>
  );
};

export default PackagesPage;
