
import { useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  Calendar,
  X,
  Check
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
import { toast } from "sonner";

// Sample customer data
const initialCustomers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown",
    orders: 15,
    lastOrder: "2023-09-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.j@example.com",
    phone: "987-654-3210",
    address: "456 Elm St, Anytown",
    orders: 8,
    lastOrder: "2023-09-10",
    status: "Active",
  },
  {
    id: 3,
    name: "Robert Williams",
    email: "robert.w@example.com",
    phone: "555-123-4567",
    address: "789 Oak St, Anytown",
    orders: 22,
    lastOrder: "2023-09-01",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Sarah Davis",
    email: "sarah.d@example.com",
    phone: "111-222-3333",
    address: "101 Pine St, Anytown",
    orders: 5,
    lastOrder: "2023-08-20",
    status: "Active",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "444-555-6666",
    address: "222 Cedar St, Anytown",
    orders: 12,
    lastOrder: "2023-09-05",
    status: "Active",
  },
];

const CustomersPage = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Filter customers based on search query and filters
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatusFilter = !filterStatus || customer.status === filterStatus;
    
    return matchesSearch && matchesStatusFilter;
  });

  // Handle form input changes for new customer
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new customer
  const handleAddCustomer = () => {
    // Validate form
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone || !newCustomer.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Add new customer
    const newId = Math.max(...customers.map((customer) => customer.id)) + 1;
    
    const customerToAdd = {
      id: newId,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      orders: 0,
      lastOrder: new Date().toISOString().split('T')[0],
      status: "Active",
    };
    
    setCustomers([...customers, customerToAdd]);
    toast.success(`Customer ${newCustomer.name} has been added successfully`);
    
    // Reset form and close dialog
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    
    setIsAddDialogOpen(false);
  };

  // Handle editing a customer
  const handleEditCustomer = () => {
    if (!currentCustomer) return;
    
    // Update customer in the list
    const updatedCustomers = customers.map((customer) =>
      customer.id === currentCustomer.id ? currentCustomer : customer
    );
    
    setCustomers(updatedCustomers);
    toast.success(`Customer ${currentCustomer.name} has been updated successfully`);
    setIsEditDialogOpen(false);
  };

  // Handle deleting a customer
  const handleDeleteCustomer = () => {
    if (!currentCustomer) return;
    
    // Remove customer from the list
    const updatedCustomers = customers.filter((customer) => customer.id !== currentCustomer.id);
    
    setCustomers(updatedCustomers);
    toast.success(`Customer ${currentCustomer.name} has been deleted successfully`);
    setIsDeleteDialogOpen(false);
  };

  // Function to open edit dialog with customer data
  const openEditDialog = (customer: any) => {
    setCurrentCustomer(customer);
    setIsEditDialogOpen(true);
  };

  // Function to open delete dialog with customer data
  const openDeleteDialog = (customer: any) => {
    setCurrentCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  // Function to toggle customer status
  const toggleCustomerStatus = (customerId: number) => {
    const updatedCustomers = customers.map((customer) => {
      if (customer.id === customerId) {
        const newStatus = customer.status === "Active" ? "Inactive" : "Active";
        toast.success(`Customer ${customer.name} is now ${newStatus}`);
        return { ...customer, status: newStatus };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-gray-500">Manage customer accounts and information</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-swift-700 hover:bg-swift-800">
                <Plus className="h-4 w-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Create a new customer account and add their contact information.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={newCustomer.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={newCustomer.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="123-456-7890"
                    value={newCustomer.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, Anytown"
                    value={newCustomer.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-swift-700 hover:bg-swift-800" onClick={handleAddCustomer}>
                  Add Customer
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
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage all customer accounts and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search customers by name, email, or address"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
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
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      No customers found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>{customer.lastOrder}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            customer.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleCustomerStatus(customer.id)}
                            title={customer.status === "Active" ? "Deactivate customer" : "Activate customer"}
                          >
                            {customer.status === "Active" ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(customer)}
                            title="Edit customer"
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDeleteDialog(customer)}
                            title="Delete customer"
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
      
      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information and contact details.
            </DialogDescription>
          </DialogHeader>
          
          {currentCustomer && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={currentCustomer.name}
                  onChange={(e) =>
                    setCurrentCustomer({ ...currentCustomer, name: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  value={currentCustomer.email}
                  onChange={(e) =>
                    setCurrentCustomer({ ...currentCustomer, email: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={currentCustomer.phone}
                  onChange={(e) =>
                    setCurrentCustomer({ ...currentCustomer, phone: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={currentCustomer.address}
                  onChange={(e) =>
                    setCurrentCustomer({ ...currentCustomer, address: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={currentCustomer.status}
                  onValueChange={(value) =>
                    setCurrentCustomer({ ...currentCustomer, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-swift-700 hover:bg-swift-800" onClick={handleEditCustomer}>
              Update Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentCustomer && (
            <div className="py-4">
              <p className="text-sm text-gray-500">
                You are about to delete the customer:
              </p>
              <p className="font-medium mt-1">{currentCustomer.name}</p>
              <p className="text-sm text-gray-500 mt-1">{currentCustomer.email}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersPage;
