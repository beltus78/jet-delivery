import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Search, 
  ArrowRight, 
  UserPlus, 
  Package, 
  Mail, 
  Phone,
  MapPin,
  UserCheck,
  Clock,
  Filter
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

// Sample customer data
const sampleCustomers = [
  {
    id: "CUS001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(303) 555-1234",
    address: "1234 Main St, Denver, CO 80202",
    totalOrders: 8,
    lastOrder: "2023-09-14",
    status: "active",
    type: "business",
    joined: "2022-05-10"
  },
  {
    id: "CUS002",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "(312) 555-5678",
    address: "5678 Oak Ave, Chicago, IL 60611",
    totalOrders: 5,
    lastOrder: "2023-09-10",
    status: "active",
    type: "personal",
    joined: "2022-07-22"
  },
  {
    id: "CUS003",
    name: "Robert Williams",
    email: "robert.williams@example.com",
    phone: "(305) 555-9876",
    address: "9876 Palm Blvd, Miami, FL 33139",
    totalOrders: 2,
    lastOrder: "2023-09-05",
    status: "inactive",
    type: "personal",
    joined: "2023-01-15"
  },
  {
    id: "CUS004",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    phone: "(213) 555-4321",
    address: "4321 Sunset Dr, Los Angeles, CA 90210",
    totalOrders: 12,
    lastOrder: "2023-09-15",
    status: "active",
    type: "business",
    joined: "2021-11-08"
  },
  {
    id: "CUS005",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "(206) 555-8765",
    address: "8765 Pine St, Seattle, WA 98101",
    totalOrders: 3,
    lastOrder: "2023-08-28",
    status: "active",
    type: "personal",
    joined: "2022-12-03"
  },
  {
    id: "CUS006",
    name: "Acme Corporation",
    email: "shipping@acmecorp.com",
    phone: "(415) 555-7890",
    address: "7890 Market St, San Francisco, CA 94103",
    totalOrders: 24,
    lastOrder: "2023-09-16",
    status: "active",
    type: "business",
    joined: "2021-06-17"
  }
];

const CustomersPage = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [customers, setCustomers] = useState(sampleCustomers);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    type: "personal"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewCustomer({
      ...newCustomer,
      [name]: value,
    });
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesType = typeFilter === "all" || customer.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "business":
        return "bg-blue-100 text-blue-700";
      case "personal":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new customer
    const createdCustomer = {
      id: `CUS${Math.floor(Math.random() * 900) + 100}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: `${newCustomer.address}, ${newCustomer.city}, ${newCustomer.state} ${newCustomer.zip}`,
      totalOrders: 0,
      lastOrder: "-",
      status: "active",
      type: newCustomer.type,
      joined: new Date().toISOString().split('T')[0]
    };
    
    // Add to customers list
    setCustomers([createdCustomer, ...customers]);
    
    // Close dialog and show success message
    setShowAddDialog(false);
    toast.success("Customer added successfully");
    
    // Reset form
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      type: "personal"
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-gray-500">Manage customer accounts and view shipping history</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-swift-700 hover:bg-swift-800">
                <UserPlus className="h-4 w-4" />
                <span>Add Customer</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter customer details to create a new account
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCustomer}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Customer Type</label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="type"
                              value="personal"
                              checked={newCustomer.type === "personal"}
                              onChange={() => handleSelectChange("type", "personal")}
                              className="text-swift-600 focus:ring-swift-500"
                            />
                            <span>Personal</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="type"
                              value="business"
                              checked={newCustomer.type === "business"}
                              onChange={() => handleSelectChange("type", "business")}
                              className="text-swift-600 focus:ring-swift-500"
                            />
                            <span>Business</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      name="name"
                      placeholder={newCustomer.type === "business" ? "Business Name" : "Full Name"}
                      value={newCustomer.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={newCustomer.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        name="phone"
                        placeholder="Phone Number"
                        value={newCustomer.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      name="address"
                      placeholder="Street Address"
                      value={newCustomer.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input
                        name="city"
                        placeholder="City"
                        value={newCustomer.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Input
                        name="state"
                        placeholder="State"
                        value={newCustomer.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ZIP Code</label>
                      <Input
                        name="zip"
                        placeholder="ZIP Code"
                        value={newCustomer.zip}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-swift-700 hover:bg-swift-800">
                    Add Customer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Customers</CardTitle>
              <CardDescription>View and manage customer accounts</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="pl-10 w-64"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-10 w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Types</option>
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Customers</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="recent">Recent Orders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCustomers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <UserCheck className="h-4 w-4 text-gray-400" />
                                <span>{customer.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span>{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{customer.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(customer.type)}`}>
                                {customer.type.charAt(0).toUpperCase() + customer.type.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}>
                                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span>{customer.totalOrders}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>{customer.lastOrder}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {customer.joined}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Button asChild size="sm" variant="ghost">
                                <Link to={`/admin/customers/${customer.id}`}>
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
              <TabsContent value="business" className="mt-0">
                <div className="rounded-md border">
                  <div className="p-4 text-center text-gray-500">
                    Business customers will appear here
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="personal" className="mt-0">
                <div className="rounded-md border">
                  <div className="p-4 text-center text-gray-500">
                    Personal customers will appear here
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recent" className="mt-0">
                <div className="rounded-md border">
                  <div className="p-4 text-center text-gray-500">
                    Customers with recent orders will appear here
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{customers.length}</div>
                <Users className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-green-500 font-medium">{customers.filter(c => c.joined.startsWith("2023")).length} new</span>
                <span className="text-gray-500 ml-1">this year</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Business Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{customers.filter(c => c.type === "business").length}</div>
                <Users className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-gray-500">
                  {Math.round((customers.filter(c => c.type === "business").length / customers.length) * 100)}% of customers
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {customers.reduce((total, customer) => total + customer.totalOrders, 0)}
                </div>
                <Package className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-gray-500">From all customers</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomersPage;
