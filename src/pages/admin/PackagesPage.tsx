
import { useState } from "react";
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Filter,
  Truck,
  MapPin,
  User,
  Calendar,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

// Sample package data
const initialPackages = [
  {
    id: "PKG001",
    tracking: "SMS123456789",
    customer: "John Smith",
    origin: "Dallas, TX",
    destination: "Denver, CO",
    status: "In Transit",
    date: "2023-09-16",
    notes: "Package is on its way",
  },
  {
    id: "PKG002",
    tracking: "SMS987654321",
    customer: "Emily Johnson",
    origin: "Dallas, TX",
    destination: "Chicago, IL",
    status: "Delivered",
    date: "2023-09-15",
    notes: "Package delivered successfully",
  },
  {
    id: "PKG003",
    tracking: "SMS456789123",
    customer: "Robert Williams",
    origin: "Dallas, TX",
    destination: "Miami, FL",
    status: "Processing",
    date: "2023-09-16",
    notes: "Package is being processed",
  },
  {
    id: "PKG004",
    tracking: "SMS789123456",
    customer: "Sarah Davis",
    origin: "Dallas, TX",
    destination: "Los Angeles, CA",
    status: "Out for Delivery",
    date: "2023-09-16",
    notes: "Package is out for delivery",
  },
  {
    id: "PKG005",
    tracking: "SMS321654987",
    customer: "Michael Brown",
    origin: "Dallas, TX",
    destination: "Seattle, WA",
    status: "Processing",
    date: "2023-09-16",
    notes: "Package is being processed",
  },
];

const statusOptions = [
  "Processing",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Delayed",
];

const PackagesPage = () => {
  const [packages, setPackages] = useState(initialPackages);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<any>(null);
  const [newPackage, setNewPackage] = useState({
    tracking: "",
    customer: "",
    origin: "",
    destination: "",
    status: "Processing",
    date: "",
    notes: "",
  });

  // Filter packages based on search query and filters
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.tracking.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatusFilter = !filterStatus || pkg.status === filterStatus;
    
    return matchesSearch && matchesStatusFilter;
  });

  // Handle form input changes for new package
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPackage((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new package
  const handleAddPackage = () => {
    // Validate form
    if (!newPackage.tracking || !newPackage.customer || !newPackage.origin || !newPackage.destination) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Add new package
    const newId = Math.max(...packages.map((pkg) => parseInt(pkg.id.replace("PKG", "")))) + 1;
    const currentDate = new Date().toISOString().slice(0, 10);
    
    const packageToAdd = {
      id: `PKG${newId.toString().padStart(3, "0")}`,
      tracking: newPackage.tracking,
      customer: newPackage.customer,
      origin: newPackage.origin,
      destination: newPackage.destination,
      status: newPackage.status,
      date: currentDate,
      notes: newPackage.notes,
    };
    
    setPackages([...packages, packageToAdd]);
    toast.success(`Package ${newPackage.tracking} has been added successfully`);
    
    // Reset form and close dialog
    setNewPackage({
      tracking: "",
      customer: "",
      origin: "",
      destination: "",
      status: "Processing",
      date: "",
      notes: "",
    });
    
    setIsAddDialogOpen(false);
  };

  // Handle editing a package
  const handleEditPackage = () => {
    if (!currentPackage) return;
    
    // Update package in the list
    const updatedPackages = packages.map((pkg) =>
      pkg.id === currentPackage.id ? currentPackage : pkg
    );
    
    setPackages(updatedPackages);
    toast.success(`Package ${currentPackage.tracking} has been updated successfully`);
    setIsEditDialogOpen(false);
  };

  // Handle deleting a package
  const handleDeletePackage = () => {
    if (!currentPackage) return;
    
    // Remove package from the list
    const updatedPackages = packages.filter((pkg) => pkg.id !== currentPackage.id);
    
    setPackages(updatedPackages);
    toast.success(`Package ${currentPackage.tracking} has been deleted successfully`);
    setIsDeleteDialogOpen(false);
  };

  // Function to open edit dialog with package data
  const openEditDialog = (pkg: any) => {
    setCurrentPackage(pkg);
    setIsEditDialogOpen(true);
  };

  // Function to open delete dialog with package data
  const openDeleteDialog = (pkg: any) => {
    setCurrentPackage(pkg);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Packages</h1>
          <p className="text-gray-500">Manage packages and their delivery status</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-swift-700 hover:bg-swift-800">
                <Plus className="h-4 w-4" /> Add Package
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Package</DialogTitle>
                <DialogDescription>
                  Create a new package and assign appropriate details.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="tracking" className="text-sm font-medium">
                    Tracking Number
                  </label>
                  <Input
                    id="tracking"
                    name="tracking"
                    placeholder="Enter tracking number"
                    value={newPackage.tracking}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="customer" className="text-sm font-medium">
                    Customer Name
                  </label>
                  <Input
                    id="customer"
                    name="customer"
                    type="text"
                    placeholder="Enter customer name"
                    value={newPackage.customer}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="origin" className="text-sm font-medium">
                    Origin
                  </label>
                  <Input
                    id="origin"
                    name="origin"
                    placeholder="Enter origin location"
                    value={newPackage.origin}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="destination" className="text-sm font-medium">
                    Destination
                  </label>
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="Enter destination location"
                    value={newPackage.destination}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setNewPackage((prev) => ({ ...prev, status: value }))
                    }
                    value={newPackage.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Enter any notes about the package"
                    value={newPackage.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-swift-700 hover:bg-swift-800" onClick={handleAddPackage}>
                  Add Package
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" /> Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" /> Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" /> Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Package List</CardTitle>
          <CardDescription>Manage all packages and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search packages by tracking, customer, or location"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                onValueChange={(value) => setFilterStatus(value || undefined)}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No packages found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.tracking}</TableCell>
                      <TableCell>{pkg.customer}</TableCell>
                      <TableCell>{pkg.origin}</TableCell>
                      <TableCell>{pkg.destination}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            pkg.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : pkg.status === "In Transit"
                              ? "bg-blue-100 text-blue-700"
                              : pkg.status === "Out for Delivery"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {pkg.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{pkg.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(pkg)}
                            title="Edit package"
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDeleteDialog(pkg)}
                            title="Delete package"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
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
      
      {/* Edit Package Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>
              Update package information and status.
            </DialogDescription>
          </DialogHeader>
          
          {currentPackage && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tracking Number</label>
                <Input
                  value={currentPackage.tracking}
                  onChange={(e) =>
                    setCurrentPackage({ ...currentPackage, tracking: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name</label>
                <Input
                  value={currentPackage.customer}
                  onChange={(e) =>
                    setCurrentPackage({ ...currentPackage, customer: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Origin</label>
                <Input
                  value={currentPackage.origin}
                  onChange={(e) =>
                    setCurrentPackage({ ...currentPackage, origin: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination</label>
                <Input
                  value={currentPackage.destination}
                  onChange={(e) =>
                    setCurrentPackage({ ...currentPackage, destination: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={currentPackage.status}
                  onValueChange={(value) =>
                    setCurrentPackage({ ...currentPackage, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={currentPackage.notes}
                  onChange={(e) =>
                    setCurrentPackage({ ...currentPackage, notes: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-swift-700 hover:bg-swift-800" onClick={handleEditPackage}>
              Update Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Package Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this package? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentPackage && (
            <div className="py-4">
              <p className="text-sm text-gray-500">
                You are about to delete the package with tracking number:
              </p>
              <p className="font-medium mt-1">{currentPackage.tracking}</p>
              <p className="text-sm text-gray-500 mt-1">Customer: {currentPackage.customer}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePackage}>
              Delete Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackagesPage;
