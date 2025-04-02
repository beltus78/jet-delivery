
import { useState } from "react";
import { 
  Truck, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  ArrowUpDown, 
  MapPin, 
  Package as PackageIcon, 
  Clock, 
  Edit, 
  Eye, 
  MoreHorizontal 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Sample data for deliveries
const sampleDeliveries = [
  {
    id: "DEL001",
    packageId: "PKG001",
    trackingNumber: "SMS123456789",
    status: "In Transit",
    driver: "John Smith",
    vehicle: "Truck 102",
    origin: "Dallas, TX",
    destination: "Denver, CO",
    estimatedDelivery: "2023-09-17",
    lastUpdated: "2023-09-16 10:15:00",
    progress: 45,
    priority: "Express",
  },
  {
    id: "DEL002",
    packageId: "PKG002",
    trackingNumber: "SMS987654321",
    status: "Delivered",
    driver: "Emily Johnson",
    vehicle: "Van 054",
    origin: "Dallas, TX",
    destination: "Chicago, IL",
    estimatedDelivery: "2023-09-15",
    lastUpdated: "2023-09-15 14:30:00",
    progress: 100,
    priority: "Standard",
  },
  {
    id: "DEL003",
    packageId: "PKG003",
    trackingNumber: "SMS456789123",
    status: "Out for Delivery",
    driver: "Michael Williams",
    vehicle: "Truck 078",
    origin: "Dallas, TX",
    destination: "Miami, FL",
    estimatedDelivery: "2023-09-16",
    lastUpdated: "2023-09-16 09:00:00",
    progress: 80,
    priority: "Express",
  },
  {
    id: "DEL004",
    packageId: "PKG004",
    trackingNumber: "SMS789123456",
    status: "In Transit",
    driver: "Sarah Davis",
    vehicle: "Truck 034",
    origin: "Dallas, TX",
    destination: "Los Angeles, CA",
    estimatedDelivery: "2023-09-18",
    lastUpdated: "2023-09-16 07:45:00",
    progress: 30,
    priority: "Standard",
  },
  {
    id: "DEL005",
    packageId: "PKG005",
    trackingNumber: "SMS321654987",
    status: "Processing",
    driver: "Robert Brown",
    vehicle: "Unassigned",
    origin: "Dallas, TX",
    destination: "Seattle, WA",
    estimatedDelivery: "2023-09-19",
    lastUpdated: "2023-09-16 06:30:00",
    progress: 10,
    priority: "Expedited",
  },
];

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700";
    case "in transit":
      return "bg-blue-100 text-blue-700";
    case "out for delivery":
      return "bg-purple-100 text-purple-700";
    case "processing":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Priority color mapping
const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "express":
      return "bg-red-100 text-red-700";
    case "expedited":
      return "bg-orange-100 text-orange-700";
    case "standard":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState(sampleDeliveries);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<string | undefined>(undefined);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // Filter deliveries based on search and filters
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatusFilter = !filterStatus || delivery.status === filterStatus;
    const matchesPriorityFilter = !filterPriority || delivery.priority === filterPriority;
    
    return matchesSearch && matchesStatusFilter && matchesPriorityFilter;
  });

  // Handle status update
  const handleStatusUpdate = (deliveryId: string, newStatus: string) => {
    const updatedDeliveries = deliveries.map(delivery => {
      if (delivery.id === deliveryId) {
        let progress = delivery.progress;
        
        // Update progress based on new status
        if (newStatus === "Delivered") {
          progress = 100;
        } else if (newStatus === "Out for Delivery") {
          progress = 80;
        } else if (newStatus === "In Transit") {
          progress = 45;
        } else if (newStatus === "Processing") {
          progress = 10;
        }
        
        return {
          ...delivery,
          status: newStatus,
          progress,
          lastUpdated: new Date().toISOString().replace("T", " ").substring(0, 19)
        };
      }
      return delivery;
    });
    
    setDeliveries(updatedDeliveries);
    toast.success(`Delivery ${deliveryId} status updated to ${newStatus}`);
    setIsUpdateDialogOpen(false);
  };

  // View delivery details
  const viewDeliveryDetails = (delivery: any) => {
    setSelectedDelivery(delivery);
    setIsDetailsDialogOpen(true);
  };

  // Open update dialog
  const openUpdateDialog = (delivery: any) => {
    setSelectedDelivery(delivery);
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Deliveries</h1>
          <p className="text-gray-500">Manage and track all deliveries in the system</p>
        </div>
        
        <div className="flex gap-2">
          <Button className="gap-2 bg-swift-700 hover:bg-swift-800">
            <Plus className="h-4 w-4" /> New Delivery
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Delivery Management</CardTitle>
          <CardDescription>
            View, filter, and update delivery statuses
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search by tracking #, driver or destination"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                onValueChange={(value) => setFilterStatus(value || undefined)}
              >
                <SelectTrigger className="w-[170px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                onValueChange={(value) => setFilterPriority(value || undefined)}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by priority" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Express">Express</SelectItem>
                  <SelectItem value="Expedited">Expedited</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <span>ID</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>Destination</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Estimated Delivery</span>
                    </div>
                  </TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                      No deliveries found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.id}</TableCell>
                      <TableCell>{delivery.trackingNumber}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            delivery.status
                          )}`}
                        >
                          {delivery.status}
                        </span>
                      </TableCell>
                      <TableCell>{delivery.driver}</TableCell>
                      <TableCell>{delivery.vehicle}</TableCell>
                      <TableCell>{delivery.destination}</TableCell>
                      <TableCell>{delivery.estimatedDelivery}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                            delivery.priority
                          )}`}
                        >
                          {delivery.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => viewDeliveryDetails(delivery)}
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openUpdateDialog(delivery)}
                          >
                            <Edit className="h-4 w-4 text-amber-500" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusUpdate(delivery.id, "Processing")}>
                                Mark as Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(delivery.id, "In Transit")}>
                                Mark as In Transit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(delivery.id, "Out for Delivery")}>
                                Mark as Out for Delivery
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(delivery.id, "Delivered")}>
                                Mark as Delivered
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Delivery Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogDescription>
              Complete information about the delivery.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDelivery && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Delivery ID</p>
                  <p className="font-medium">{selectedDelivery.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Package ID</p>
                  <p className="font-medium">{selectedDelivery.packageId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-medium">{selectedDelivery.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      selectedDelivery.status
                    )}`}
                  >
                    {selectedDelivery.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driver</p>
                  <p className="font-medium">{selectedDelivery.driver}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">{selectedDelivery.vehicle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Origin</p>
                  <p className="font-medium">{selectedDelivery.origin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">{selectedDelivery.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="font-medium">{selectedDelivery.estimatedDelivery}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{selectedDelivery.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                      selectedDelivery.priority
                    )}`}
                  >
                    {selectedDelivery.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-swift-600 h-2.5 rounded-full" 
                      style={{ width: `${selectedDelivery.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  className="bg-swift-700 hover:bg-swift-800" 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    openUpdateDialog(selectedDelivery);
                  }}
                >
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>
              Change the current status of the delivery.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDelivery && (
            <div className="py-4">
              <p className="text-sm text-gray-500">Delivery ID</p>
              <p className="font-medium">{selectedDelivery.id}</p>
              
              <p className="text-sm text-gray-500 mt-4">Tracking Number</p>
              <p className="font-medium">{selectedDelivery.trackingNumber}</p>
              
              <p className="text-sm text-gray-500 mt-4">Current Status</p>
              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                  selectedDelivery.status
                )}`}
              >
                {selectedDelivery.status}
              </span>
              
              <p className="text-sm text-gray-500 mt-4">New Status</p>
              <div className="space-y-2 mt-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate(selectedDelivery.id, "Processing")}
                >
                  <div className="w-full flex items-center justify-between">
                    <span>Processing</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
                      Processing
                    </span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate(selectedDelivery.id, "In Transit")}
                >
                  <div className="w-full flex items-center justify-between">
                    <span>In Transit</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      In Transit
                    </span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate(selectedDelivery.id, "Out for Delivery")}
                >
                  <div className="w-full flex items-center justify-between">
                    <span>Out for Delivery</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                      Out for Delivery
                    </span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate(selectedDelivery.id, "Delivered")}
                >
                  <div className="w-full flex items-center justify-between">
                    <span>Delivered</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      Delivered
                    </span>
                  </div>
                </Button>
              </div>
              
              <div className="mt-6 text-right">
                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveriesPage;
