
import { useState } from "react";
import {
  UserPlus,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Check,
  X,
  Upload,
  Download,
  Filter
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Sample user data
const initialUsers = [
  {
    id: 1,
    name: "Admin User",
            email: "admin@jetdelivery.com",
    role: "Admin",
    status: "Active",

    permissions: ["all"],
  },
  {
    id: 2,
    name: "Sarah Manager",
            email: "sarah@jetdelivery.com",
    role: "Manager",
    status: "Active",

    permissions: ["packages", "deliveries", "customers"],
  },
  {
    id: 3,
    name: "John Operator",
            email: "john@jetdelivery.com",
    role: "Operator",
    status: "Active",

    permissions: ["packages", "deliveries"],
  },
  {
    id: 4,
    name: "Emily Agent",
            email: "emily@jetdelivery.com",
    role: "Agent",
    status: "Inactive",

    permissions: ["customers"],
  },
  {
    id: 5,
    name: "Michael Viewer",
            email: "michael@jetdelivery.com",
    role: "Viewer",
    status: "Active",

    permissions: ["view"],
  },
];

// Available roles with their descriptions
const roles = [
  { 
    value: "Admin", 
    label: "Admin", 
    description: "Full access to all features and settings" 
  },
  { 
    value: "Manager", 
    label: "Manager", 
    description: "Manage packages, deliveries, and staff" 
  },
  { 
    value: "Operator", 
    label: "Operator", 
    description: "Handle packages and update delivery statuses" 
  },
  { 
    value: "Agent", 
    label: "Agent", 
    description: "Customer service and package registration" 
  },
  { 
    value: "Viewer", 
    label: "Viewer", 
    description: "View-only access to reports and data" 
  },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRoleFilter = !filterRole || filterRole === "all" || user.role === filterRole;
    const matchesStatusFilter = !filterStatus || filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRoleFilter && matchesStatusFilter;
  });

  // Handle form input changes for new user
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new user
  const handleAddUser = () => {
    // Validate form
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Add new user
    const newId = Math.max(...users.map((user) => user.id)) + 1;
    const currentDate = new Date().toISOString().replace("T", " ").substring(0, 19);
    
    const userToAdd = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Active",

      permissions: newUser.role === "Admin" ? ["all"] : ["view"],
    };
    
    setUsers([...users, userToAdd]);
    toast.success(`User ${newUser.name} has been added successfully`);
    
    // Reset form and close dialog
    setNewUser({
      name: "",
      email: "",
      role: "",
      password: "",
      confirmPassword: "",
    });
    
    setIsAddDialogOpen(false);
  };

  // Handle editing a user
  const handleEditUser = () => {
    if (!currentUser) return;
    
    // Update user in the list
    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? currentUser : user
    );
    
    setUsers(updatedUsers);
    toast.success(`User ${currentUser.name} has been updated successfully`);
    setIsEditDialogOpen(false);
  };

  // Handle deleting a user
  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    // Remove user from the list
    const updatedUsers = users.filter((user) => user.id !== currentUser.id);
    
    setUsers(updatedUsers);
    toast.success(`User ${currentUser.name} has been deleted successfully`);
    setIsDeleteDialogOpen(false);
  };

  // Function to open edit dialog with user data
  const openEditDialog = (user: any) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  // Function to open delete dialog with user data
  const openDeleteDialog = (user: any) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Function to toggle user status
  const toggleUserStatus = (userId: number) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        const newStatus = user.status === "Active" ? "Inactive" : "Active";
        toast.success(`User ${user.name} is now ${newStatus}`);
        return { ...user, status: newStatus };
      }
      return user;
    });
    
    setUsers(updatedUsers);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500">Manage users and their roles in the system</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-swift-700 hover:bg-swift-800">
                <UserPlus className="h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account and assign appropriate roles and permissions.
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
                    value={newUser.name}
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
                    value={newUser.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Role
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setNewUser((prev) => ({ ...prev, role: value }))
                    }
                    value={newUser.role}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex flex-col">
                            <span>{role.label}</span>
                            <span className="text-xs text-gray-500">{role.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={newUser.password}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newUser.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-swift-700 hover:bg-swift-800" onClick={handleAddUser}>
                  Add User
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
          <CardTitle>User List</CardTitle>
          <CardDescription>Manage all user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search users by name or email"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                onValueChange={(value) => setFilterRole(value || undefined)}
              >
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No users found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-swift-600" />
                          <span>{user.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleUserStatus(user.id)}
                            title={user.status === "Active" ? "Deactivate user" : "Activate user"}
                          >
                            {user.status === "Active" ? (
                              <X className="h-4 w-4 text-red-500" />
                            ) : (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(user)}
                            title="Edit user"
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDeleteDialog(user)}
                            title="Delete user"
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
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role.
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={currentUser.name}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, name: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  value={currentUser.email}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value) =>
                    setCurrentUser({ ...currentUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <span>{role.label}</span>
                          <span className="text-xs text-gray-500">
                            {role.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={currentUser.status}
                  onValueChange={(value) =>
                    setCurrentUser({ ...currentUser, status: value })
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
            <Button className="bg-swift-700 hover:bg-swift-800" onClick={handleEditUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <div className="py-4">
              <p className="text-sm text-gray-500">
                You are about to delete the user:
              </p>
              <p className="font-medium mt-1">{currentUser.name}</p>
              <p className="text-sm text-gray-500 mt-1">{currentUser.email}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
