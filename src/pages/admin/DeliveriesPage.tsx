import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Truck, 
  Calendar, 
  MapPin, 
  Clock, 
  UserCheck,
  Filter,
  ArrowRight,
  AlertTriangle
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Sample delivery data
const sampleDeliveries = [
  {
    id: "DEL001",
    driver: "Mark Johnson",
    vehicle: "Truck #421",
    status: "In Progress",
    packages: 12,
    completedPackages: 5,
    startTime: "08:30 AM",
    estimatedEndTime: "05:30 PM",
    route: "Dallas East Route",
    date: "2023-09-16"
  },
  {
    id: "DEL002",
    driver: "Sarah Williams",
    vehicle: "Van #112",
    status: "Completed",
    packages: 8,
    completedPackages: 8,
    startTime: "09:00 AM",
    estimatedEndTime: "03:00 PM",
    route: "Dallas Downtown",
    date: "2023-09-16"
  },
  {
    id: "DEL003",
    driver: "Robert Chen",
    vehicle: "Truck #315",
    status: "Delayed",
    packages: 15,
    completedPackages: 7,
    startTime: "07:45 AM",
    estimatedEndTime: "06:30 PM",
    route: "Dallas North Route",
    date: "2023-09-16"
  },
  {
    id: "DEL004",
    driver: "James Peterson",
    vehicle: "Van #207",
    status: "Scheduled",
    packages: 10,
    completedPackages: 0,
    startTime: "10:00 AM",
    estimatedEndTime: "04:30 PM",
    route: "Dallas West Route",
    date: "2023-09-17"
  },
  {
    id: "DEL005",
    driver: "Maria Rodriguez",
    vehicle: "Truck #118",
    status: "In Progress",
    packages: 14,
    completedPackages: 9,
    startTime: "08:15 AM",
    estimatedEndTime: "05:00 PM",
    route: "Dallas South Route",
    date: "2023-09-16"
  }
];

// Sample driver data
const sampleDrivers = [
  { id: "DRV001", name: "Mark Johnson", available: true },
  { id: "DRV002", name: "Sarah Williams", available: true },
  { id: "DRV003", name: "Robert Chen", available: false },
  { id: "DRV004", name: "James Peterson", available: true },
  { id: "DRV005", name: "Maria Rodriguez", available: false },
  { id: "DRV006", name: "David Thompson", available: true },
  { id: "DRV007", name: "Lisa Garcia", available: true },
  { id: "DRV008", name: "Michael Wilson", available: true },
];

// Sample vehicle data
const sampleVehicles = [
  { id: "VEH001", name: "Truck #421", type: "truck", available: false },
  { id: "VEH002", name: "Van #112", type: "van", available: true },
  { id: "VEH003", name: "Truck #315", type: "truck", available: false },
  { id: "VEH004", name: "Van #207", type: "van", available: false },
  { id: "VEH005", name: "Truck #118", type: "truck", available: false },
  { id: "VEH006", name: "Van #143", type: "van", available: true },
  { id: "VEH007", name: "Truck #276", type: "truck", available: true },
  { id: "VEH008", name: "Van #301", type: "van", available: true },
];

const DeliveriesPage = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [deliveries, setDeliveries] = useState(sampleDeliveries);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  
  // New delivery form state
  const [newDelivery, setNewDelivery] = useState({
    driver: "",
    vehicle: "",
    route: "",
    date: new Date().toISOString().split('T')[0],
    startTime: "08:00",
    estimatedEndTime: "17:00",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDelivery({
      ...newDelivery,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewDelivery({
      ...newDelivery,
      [name]: value,
    });
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.driver.toLowerCase().includes(searchText.toLowerCase()) ||
      delivery.route.toLowerCase().includes(searchText.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || delivery.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate = dateFilter === "all" || delivery.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in progress":
        return "bg-blue-100 text-blue-700";
      case "scheduled":
        return "bg-purple-100 text-purple-700";
      case "delayed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const calculateProgress = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };
  
  const handleCreateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new delivery
    const createdDelivery = {
      id: `DEL${Math.floor(Math.random() * 900) + 100}`,
      driver: newDelivery.driver,
      vehicle: newDelivery.vehicle,
      status: "Scheduled",
      packages: Math.floor(Math.random() * 15) + 5,
      completedPackages: 0,
      startTime: newDelivery.startTime,
      estimatedEndTime: newDelivery.estimatedEndTime,
      route: newDelivery.route,
      date: newDelivery.date
    };
    
    // Add to deliveries list
    setDeliveries([createdDelivery, ...deliveries]);
    
    // Close dialog and show success message
    setShowAssignDialog(false);
    toast.success("Delivery route created successfully");
    
    // Reset form
    setNewDelivery({
      driver: "",
      vehicle: "",
      route: "",
      date: new Date().toISOString().split('T')[0],
      startTime: "08:00",
      estimatedEndTime: "17:00",
      notes: ""
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Deliveries</h1>
            <p className="text-gray-500">Manage and track all delivery routes</p>
          </div>
          <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-swift-700 hover:bg-swift-800">
                <Truck className="h-4 w-4" />
                <span>Assign Route</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Delivery Route</DialogTitle>
                <DialogDescription>
                  Assign a driver and vehicle to a new delivery route
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDelivery}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Driver</label>
                    <Select 
                      value={newDelivery.driver}
                      onValueChange={(value) => handleSelectChange("driver", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleDrivers
                          .filter(driver => driver.available)
                          .map(driver => (
                            <SelectItem key={driver.id} value={driver.name}>
                              {driver.name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle</label>
                    <Select 
                      value={newDelivery.vehicle}
                      onValueChange={(value) => handleSelectChange("vehicle", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleVehicles
                          .filter(vehicle => vehicle.available)
                          .map(vehicle => (
                            <SelectItem key={vehicle.id} value={vehicle.name}>
                              {vehicle.name} ({vehicle.type})
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Route Name</label>
                    <Input
                      name="route"
                      placeholder="e.g., Dallas East Route"
                      value={newDelivery.route}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input
                        type="date"
                        name="date"
                        value={newDelivery.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Time</label>
                      <Input
                        type="time"
                        name="startTime"
                        value={newDelivery.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Time</label>
                      <Input
                        type="time"
                        name="estimatedEndTime"
                        value={newDelivery.estimatedEndTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Input
                      name="notes"
                      placeholder="Additional notes (optional)"
                      value={newDelivery.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowAssignDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-swift-700 hover:bg-swift-800">
                    Create Route
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Deliveries</CardTitle>
              <CardDescription>View and track all delivery routes and progress</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="search"
                    placeholder="Search deliveries..."
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
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={dateFilter === "all" ? "" : dateFilter}
                  onChange={(e) => setDateFilter(e.target.value || "all")}
                  className="w-[180px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="delayed">Delayed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDeliveries.map((delivery) => (
                          <tr key={delivery.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <UserCheck className="h-4 w-4 text-gray-400" />
                                <span>{delivery.driver}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Truck className="h-4 w-4 text-gray-400" />
                                <span>{delivery.vehicle}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{delivery.route}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(delivery.status)}`}>
                                {delivery.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div 
                                    className="bg-swift-600 h-2.5 rounded-full" 
                                    style={{ width: `${calculateProgress(delivery.completedPackages, delivery.packages)}%` }}
                                  ></div>
                                </div>
                                <span>{delivery.completedPackages}/{delivery.packages}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>{delivery.startTime} - {delivery.estimatedEndTime}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>{delivery.date}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Button asChild size="sm" variant="ghost">
                                <Link to={`/admin/deliveries/${delivery.id}`}>
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
              
              {/* Other tabs content similar to the "all" tab but filtered */}
              <TabsContent value="scheduled" className="mt-0">
                <div className="rounded-md border">
                  <div className="p-4 text-center text-gray-500">
                    Scheduled deliveries will appear here
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="in-progress" className="mt-0">
                <div className="rounded-md border">
                  <div className="p-4 text-center text-gray-500">
                    In-progress deliveries will appear here
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                <div className="rounded-md border">
                  <div className="p-4 text-center text-gray-500">
                    Completed deliveries will appear here
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="delayed" className="mt-0">
                <div className="rounded-md border">
                  <div className="p-4 text-center text-gray-500">
                    Delayed deliveries will appear here
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Availability</CardTitle>
              <CardDescription>Current status of delivery vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Available Vehicles</span>
                  <span className="text-sm text-green-600 font-medium">
                    {sampleVehicles.filter(v => v.available).length} of {sampleVehicles.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {sampleVehicles.map(vehicle => (
                    <div 
                      key={vehicle.id} 
                      className={`flex justify-between items-center p-2 rounded ${
                        vehicle.available ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className={`h-4 w-4 ${vehicle.available ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-sm">{vehicle.name}</span>
                        <span className="text-xs text-gray-500">({vehicle.type})</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        vehicle.available 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {vehicle.available ? 'Available' : 'In Use'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Driver Availability</CardTitle>
              <CardDescription>Current status of delivery drivers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Available Drivers</span>
                  <span className="text-sm text-green-600 font-medium">
                    {sampleDrivers.filter(d => d.available).length} of {sampleDrivers.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {sampleDrivers.map(driver => (
                    <div 
                      key={driver.id} 
                      className={`flex justify-between items-center p-2 rounded ${
                        driver.available ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className={`h-4 w-4 ${driver.available ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-sm">{driver.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        driver.available 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {driver.available ? 'Available' : 'On Delivery'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Delivery Issues</span>
            </CardTitle>
            <CardDescription>Routes with delays or other issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deliveries
                .filter(d => d.status.toLowerCase() === "delayed")
                .map(delivery => (
                  <div 
                    key={delivery.id} 
                    className="p-4 border border-amber-200 rounded-lg bg-amber-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          {delivery.route} ({delivery.id})
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Driver: {delivery.driver} • Vehicle: {delivery.vehicle}
                        </p>
                        <p className="text-sm text-amber-700 mt-2">
                          This delivery is experiencing delays.
                        </p>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/admin/deliveries/${delivery.id}`}>
                          Resolve Issue
                        </Link>
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{delivery.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{delivery.startTime} - {delivery.estimatedEndTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>{delivery.completedPackages}/{delivery.packages} Packages</span>
                      </div>
                    </div>
                  </div>
                ))}
              
              {deliveries.filter(d => d.status.toLowerCase() === "delayed").length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 rounded-full bg-green-100">
                      <Truck className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p>No delivery issues at this time.</p>
                  <p className="text-sm mt-1">All routes are running according to schedule.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DeliveriesPage;
