
import { useState } from "react";
import { 
  Settings, 
  User, 
  UserPlus, 
  Users, 
  Lock, 
  Bell, 
  Mail,
  Building, 
  MapPin,
  Phone,
  Globe,
  Check,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Shield,
  ShieldX
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Sample user data
const sampleUsers = [
  {
    id: "USR001",
    name: "Admin User",
    email: "admin@swiftmail.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-09-16 08:45 AM"
  },
  {
    id: "USR002",
    name: "Sarah Williams",
    email: "sarah.williams@swiftmail.com",
    role: "manager",
    status: "active",
    lastLogin: "2023-09-15 04:22 PM"
  },
  {
    id: "USR003",
    name: "Robert Chen",
    email: "robert.chen@swiftmail.com",
    role: "dispatcher",
    status: "active",
    lastLogin: "2023-09-16 09:30 AM"
  },
  {
    id: "USR004",
    name: "James Peterson",
    email: "james.peterson@swiftmail.com",
    role: "customer_service",
    status: "inactive",
    lastLogin: "2023-09-10 11:15 AM"
  },
  {
    id: "USR005",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@swiftmail.com",
    role: "manager",
    status: "active",
    lastLogin: "2023-09-16 07:55 AM"
  }
];

const SettingsPage = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  
  // Company profile state
  const [companyProfile, setCompanyProfile] = useState({
    name: "Swift Mail Service",
    email: "info@swiftmail.com",
    phone: "(214) 555-7890",
    address: "16000 Dallas Pkwy # 400",
    city: "Dallas",
    state: "TX",
    zip: "75248",
    country: "United States",
    website: "www.swiftmail.com"
  });
  
  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "customer_service",
    password: "",
    confirmPassword: ""
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    systemNotifications: true,
    deliveryUpdates: true,
    marketingEmails: false,
    weeklyReports: true,
    securityAlerts: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyProfile({
      ...companyProfile,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleNotificationChange = (setting: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: checked
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Company profile updated successfully");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification settings updated successfully");
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Create a new user
    const createdUser = {
      id: `USR${Math.floor(Math.random() * 900) + 100}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      lastLogin: "Never"
    };
    
    // Add to users list
    setUsers([...users, createdUser]);
    
    // Close dialog and show success message
    setShowAddUserDialog(false);
    toast.success("User added successfully");
    
    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "customer_service",
      password: "",
      confirmPassword: ""
    });
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case "admin":
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
            <ShieldCheck className="h-3 w-3" />
            <span>Admin</span>
          </div>
        );
      case "manager":
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            <Shield className="h-3 w-3" />
            <span>Manager</span>
          </div>
        );
      case "dispatcher":
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <Truck className="h-3 w-3" />
            <span>Dispatcher</span>
          </div>
        );
      case "customer_service":
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
            <Users className="h-3 w-3" />
            <span>Customer Service</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            <User className="h-3 w-3" />
            <span>User</span>
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
        <Check className="h-3 w-3" />
        <span>Active</span>
      </div>
    ) : (
      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
        <ShieldX className="h-3 w-3" />
        <span>Inactive</span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500">Manage system settings and user accounts</p>
          </div>
        </div>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Company Profile</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>User Management</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Manage your company information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                          id="company-name"
                          name="name"
                          value={companyProfile.name}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-website">Website</Label>
                        <Input
                          id="company-website"
                          name="website"
                          value={companyProfile.website}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company-email">Email</Label>
                        <Input
                          id="company-email"
                          name="email"
                          type="email"
                          value={companyProfile.email}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-phone">Phone</Label>
                        <Input
                          id="company-phone"
                          name="phone"
                          value={companyProfile.phone}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-address">Address</Label>
                      <Input
                        id="company-address"
                        name="address"
                        value={companyProfile.address}
                        onChange={handleProfileInputChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company-city">City</Label>
                        <Input
                          id="company-city"
                          name="city"
                          value={companyProfile.city}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-state">State</Label>
                        <Input
                          id="company-state"
                          name="state"
                          value={companyProfile.state}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-zip">ZIP Code</Label>
                        <Input
                          id="company-zip"
                          name="zip"
                          value={companyProfile.zip}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-country">Country</Label>
                        <Input
                          id="company-country"
                          name="country"
                          value={companyProfile.country}
                          onChange={handleProfileInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-swift-700 hover:bg-swift-800">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Add and manage user accounts</CardDescription>
                </div>
                <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-swift-700 hover:bg-swift-800">
                      <UserPlus className="h-4 w-4" />
                      <span>Add User</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a new user account with appropriate roles and permissions
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUser}>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="user-name">Full Name</Label>
                          <Input
                            id="user-name"
                            name="name"
                            placeholder="Enter user's full name"
                            value={newUser.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-email">Email</Label>
                          <Input
                            id="user-email"
                            name="email"
                            type="email"
                            placeholder="Enter user's email address"
                            value={newUser.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-role">Role</Label>
                          <Select 
                            value={newUser.role}
                            onValueChange={(value) => handleSelectChange("role", value)}
                          >
                            <SelectTrigger id="user-role">
                              <SelectValue placeholder="Select user role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="dispatcher">Dispatcher</SelectItem>
                              <SelectItem value="customer_service">Customer Service</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-password">Password</Label>
                          <Input
                            id="user-password"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-confirm-password">Confirm Password</Label>
                          <Input
                            id="user-confirm-password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            value={newUser.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowAddUserDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-swift-700 hover:bg-swift-800">
                          Add User
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                                <span>{user.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getRoleBadge(user.role)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(user.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="ghost" className="h-8 px-2">
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Role Permissions</CardTitle>
                  <CardDescription>Manage what each role can access</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-red-500" />
                        <span>Admin Role</span>
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">
                        Full access to all system features and settings
                      </div>
                      <div className="space-y-2 border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-packages">Packages Management</Label>
                          <Switch id="admin-packages" checked={true} disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-deliveries">Deliveries Management</Label>
                          <Switch id="admin-deliveries" checked={true} disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-customers">Customers Management</Label>
                          <Switch id="admin-customers" checked={true} disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-reports">Reports Access</Label>
                          <Switch id="admin-reports" checked={true} disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-settings">Settings Access</Label>
                          <Switch id="admin-settings" checked={true} disabled />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-users">User Management</Label>
                          <Switch id="admin-users" checked={true} disabled />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span>Manager Role</span>
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">
                        Access to operations and staff management
                      </div>
                      <div className="space-y-2 border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="manager-packages">Packages Management</Label>
                          <Switch id="manager-packages" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="manager-deliveries">Deliveries Management</Label>
                          <Switch id="manager-deliveries" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="manager-customers">Customers Management</Label>
                          <Switch id="manager-customers" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="manager-reports">Reports Access</Label>
                          <Switch id="manager-reports" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="manager-settings">Settings Access</Label>
                          <Switch id="manager-settings" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="manager-users">User Management</Label>
                          <Switch id="manager-users" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Additional Roles</CardTitle>
                  <CardDescription>Customized permissions for specific roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-green-500" />
                        <span>Dispatcher Role</span>
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">
                        Focuses on delivery and route management
                      </div>
                      <div className="space-y-2 border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="dispatcher-packages">Packages Management</Label>
                          <Switch id="dispatcher-packages" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="dispatcher-deliveries">Deliveries Management</Label>
                          <Switch id="dispatcher-deliveries" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="dispatcher-customers">Customers Management</Label>
                          <Switch id="dispatcher-customers" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="dispatcher-reports">Reports Access</Label>
                          <Switch id="dispatcher-reports" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-amber-500" />
                        <span>Customer Service Role</span>
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">
                        Focuses on customer support and package tracking
                      </div>
                      <div className="space-y-2 border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cs-packages">View Packages</Label>
                          <Switch id="cs-packages" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cs-edit-packages">Edit Packages</Label>
                          <Switch id="cs-edit-packages" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cs-customers">Customers Management</Label>
                          <Switch id="cs-customers" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="cs-delivery-view">View Deliveries</Label>
                          <Switch id="cs-delivery-view" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="bg-swift-700 hover:bg-swift-800">
                        Save Permissions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure when and how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNotifications}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Email Notifications</h3>
                      <div className="space-y-3 border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-alerts" className="font-medium">Email Alerts</Label>
                            <p className="text-sm text-gray-500">Receive important system alerts via email</p>
                          </div>
                          <Switch 
                            id="email-alerts" 
                            checked={notificationSettings.emailAlerts}
                            onCheckedChange={(checked) => handleNotificationChange("emailAlerts", checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="security-alerts" className="font-medium">Security Alerts</Label>
                            <p className="text-sm text-gray-500">Receive security-related alerts via email</p>
                          </div>
                          <Switch 
                            id="security-alerts" 
                            checked={notificationSettings.securityAlerts}
                            onCheckedChange={(checked) => handleNotificationChange("securityAlerts", checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="weekly-reports" className="font-medium">Weekly Reports</Label>
                            <p className="text-sm text-gray-500">Receive weekly performance and activity reports</p>
                          </div>
                          <Switch 
                            id="weekly-reports" 
                            checked={notificationSettings.weeklyReports}
                            onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="marketing-emails" className="font-medium">Marketing Emails</Label>
                            <p className="text-sm text-gray-500">Receive promotional and marketing communications</p>
                          </div>
                          <Switch 
                            id="marketing-emails" 
                            checked={notificationSettings.marketingEmails}
                            onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">System Notifications</h3>
                      <div className="space-y-3 border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="system-notifications" className="font-medium">System Notifications</Label>
                            <p className="text-sm text-gray-500">Receive in-app notifications about system events</p>
                          </div>
                          <Switch 
                            id="system-notifications" 
                            checked={notificationSettings.systemNotifications}
                            onCheckedChange={(checked) => handleNotificationChange("systemNotifications", checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="delivery-updates" className="font-medium">Delivery Updates</Label>
                            <p className="text-sm text-gray-500">Receive notifications about delivery status changes</p>
                          </div>
                          <Switch 
                            id="delivery-updates" 
                            checked={notificationSettings.deliveryUpdates}
                            onCheckedChange={(checked) => handleNotificationChange("deliveryUpdates", checked)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">SMS Notifications</h3>
                      <div className="space-y-3 border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sms-alerts" className="font-medium">SMS Alerts</Label>
                            <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
                          </div>
                          <Switch 
                            id="sms-alerts" 
                            checked={notificationSettings.smsAlerts}
                            onCheckedChange={(checked) => handleNotificationChange("smsAlerts", checked)}
                          />
                        </div>
                        
                        {notificationSettings.smsAlerts && (
                          <div className="space-y-2 mt-2 pl-2 border-l-2 border-gray-200">
                            <div className="space-y-1">
                              <Label htmlFor="phone-number" className="text-sm">Phone Number</Label>
                              <Input id="phone-number" placeholder="Enter phone number" defaultValue="(214) 555-7890" />
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <input type="checkbox" id="verify-phone" className="rounded border-gray-300" />
                              <Label htmlFor="verify-phone">Verify phone number for SMS notifications</Label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-swift-700 hover:bg-swift-800">
                        Save Notification Settings
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security preferences and password settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Password Settings</h3>
                    <div className="space-y-3 border rounded-md p-4">
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" placeholder="Enter current password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" placeholder="Enter new password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                        </div>
                        <div className="flex justify-end">
                          <Button type="button" onClick={() => toast.success("Password changed successfully")} className="bg-swift-700 hover:bg-swift-800">
                            Change Password
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Login Security</h3>
                    <div className="space-y-3 border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="two-factor" className="font-medium">Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <Switch id="two-factor" defaultChecked={false} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="session-timeout" className="font-medium">Session Timeout</Label>
                          <p className="text-sm text-gray-500">Automatically log out after a period of inactivity</p>
                        </div>
                        <Select defaultValue="60">
                          <SelectTrigger id="session-timeout" className="w-[180px]">
                            <SelectValue placeholder="Select timeout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                            <SelectItem value="240">4 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="secure-login-history" className="font-medium">Login History</Label>
                          <p className="text-sm text-gray-500">View your recent account login activity</p>
                        </div>
                        <Button variant="outline" onClick={() => toast.info("Login history would be displayed here")}>
                          View History
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">API Access</h3>
                    <div className="space-y-3 border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="api-access" className="font-medium">API Access</Label>
                          <p className="text-sm text-gray-500">Enable API access for external integrations</p>
                        </div>
                        <Switch id="api-access" defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="api-keys" className="font-medium">API Keys</Label>
                          <p className="text-sm text-gray-500">Manage API keys for accessing your account data</p>
                        </div>
                        <Button variant="outline" onClick={() => toast.info("API key management would be shown here")}>
                          Manage Keys
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => toast.success("Security settings saved")} className="bg-swift-700 hover:bg-swift-800">
                      Save Security Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
