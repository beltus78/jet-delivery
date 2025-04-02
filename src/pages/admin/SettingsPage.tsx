
import { useState } from "react";
import {
  Settings,
  Save,
  UserCircle,
  BellRing,
  Lock,
  Shield,
  Globe,
  CreditCard,
  Mail,
  Bell,
  Key,
  Truck as TruckIcon,
  Map,
  Clipboard,
  Zap,
  Upload
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SettingsPage = () => {
  const [companyName, setCompanyName] = useState("Swift Mail Service");
  const [emailAddress, setEmailAddress] = useState("admin@swiftmail.com");
  const [supportEmail, setSupportEmail] = useState("support@swiftmail.com");
  const [phoneNumber, setPhoneNumber] = useState("(555) 123-4567");
  const [address, setAddress] = useState("16000 Dallas Pkwy # 400, Dallas, TX 75248");
  
  const [notifyNewPackages, setNotifyNewPackages] = useState(true);
  const [notifyDeliveryUpdates, setNotifyDeliveryUpdates] = useState(true);
  const [notifySystemAlerts, setNotifySystemAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  const [trackingPrefix, setTrackingPrefix] = useState("SMS");
  const [defaultWeightUnit, setDefaultWeightUnit] = useState("lbs");
  const [defaultDistanceUnit, setDefaultDistanceUnit] = useState("miles");
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState("AIzaSyAI42aRjF79hJMVoOC9G95rp0rxp8T3DFc");
  const [smtpServer, setSmtpServer] = useState("smtp.swiftmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("notifications@swiftmail.com");
  
  const handleSaveGeneralSettings = () => {
    toast.success("General settings have been saved successfully");
  };
  
  const handleSaveNotificationSettings = () => {
    toast.success("Notification settings have been saved successfully");
  };
  
  const handleSaveSystemSettings = () => {
    toast.success("System settings have been saved successfully");
  };
  
  const handleSaveIntegrationSettings = () => {
    toast.success("Integration settings have been saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage system settings and preferences</p>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> System
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Integrations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TruckIcon className="h-8 w-8 text-swift-700" />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" /> Upload New Logo
                  </Button>
                </div>
              </div>
              
              <Button
                className="bg-swift-700 hover:bg-swift-800 mt-2 gap-2"
                onClick={handleSaveGeneralSettings}
              >
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Switch id="twoFactor" />
                <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch id="sessionTimeout" defaultChecked />
                <Label htmlFor="sessionTimeout">
                  Automatically log out after inactivity (30 minutes)
                </Label>
              </div>
              
              <Button
                className="bg-swift-700 hover:bg-swift-800 mt-2 gap-2"
              >
                <Lock className="h-4 w-4" /> Update Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control what notifications you receive and how
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-swift-700" />
                    <Label htmlFor="notifyNewPackages">New Package Registrations</Label>
                  </div>
                  <Switch
                    id="notifyNewPackages"
                    checked={notifyNewPackages}
                    onCheckedChange={setNotifyNewPackages}
                  />
                </div>
                
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <TruckIcon className="h-5 w-5 text-swift-700" />
                    <Label htmlFor="notifyDeliveryUpdates">Delivery Status Updates</Label>
                  </div>
                  <Switch
                    id="notifyDeliveryUpdates"
                    checked={notifyDeliveryUpdates}
                    onCheckedChange={setNotifyDeliveryUpdates}
                  />
                </div>
                
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-swift-700" />
                    <Label htmlFor="notifySystemAlerts">System Alerts</Label>
                  </div>
                  <Switch
                    id="notifySystemAlerts"
                    checked={notifySystemAlerts}
                    onCheckedChange={setNotifySystemAlerts}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t mt-4">
                <h3 className="text-sm font-medium mb-3">Notification Channels</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-swift-700" />
                      <Label htmlFor="inAppNotifications">In-App Notifications</Label>
                    </div>
                    <Switch id="inAppNotifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-swift-700" />
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  {emailNotifications && (
                    <div className="ml-7 mt-2">
                      <Label htmlFor="notificationEmail" className="text-sm">
                        Notification Email Address
                      </Label>
                      <Input
                        id="notificationEmail"
                        className="mt-1"
                        value="admin@swiftmail.com"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                className="bg-swift-700 hover:bg-swift-800 mt-4 gap-2"
                onClick={handleSaveNotificationSettings}
              >
                <Save className="h-4 w-4" /> Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure system-wide settings and defaults
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackingPrefix">Tracking Number Prefix</Label>
                <Input
                  id="trackingPrefix"
                  value={trackingPrefix}
                  onChange={(e) => setTrackingPrefix(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: {trackingPrefix}123456789
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultWeightUnit">Default Weight Unit</Label>
                  <Select
                    value={defaultWeightUnit}
                    onValueChange={setDefaultWeightUnit}
                  >
                    <SelectTrigger id="defaultWeightUnit">
                      <SelectValue placeholder="Select weight unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="oz">Ounces (oz)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultDistanceUnit">Default Distance Unit</Label>
                  <Select
                    value={defaultDistanceUnit}
                    onValueChange={setDefaultDistanceUnit}
                  >
                    <SelectTrigger id="defaultDistanceUnit">
                      <SelectValue placeholder="Select distance unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="miles">Miles</SelectItem>
                      <SelectItem value="km">Kilometers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select
                  value={defaultCurrency}
                  onValueChange={setDefaultCurrency}
                >
                  <SelectTrigger id="defaultCurrency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Switch id="darkMode" />
                <Label htmlFor="darkMode">Enable Dark Mode</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch id="compactView" />
                <Label htmlFor="compactView">Use Compact View</Label>
              </div>
              
              <Button
                className="bg-swift-700 hover:bg-swift-800 mt-4 gap-2"
                onClick={handleSaveSystemSettings}
              >
                <Save className="h-4 w-4" /> Save System Settings
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage system data and exports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch id="autoBackup" defaultChecked />
                <Label htmlFor="autoBackup">Enable Automatic Daily Backups</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch id="dataRetention" defaultChecked />
                <Label htmlFor="dataRetention">
                  Retain delivery data for 12 months
                </Label>
              </div>
              
              <div className="pt-4 flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2">
                  <Clipboard className="h-4 w-4" /> Export All Data
                </Button>
                <Button variant="outline" className="gap-2">
                  <Clipboard className="h-4 w-4" /> Export Customers
                </Button>
                <Button variant="outline" className="gap-2">
                  <Clipboard className="h-4 w-4" /> Export Deliveries
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Manage API keys and third-party integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex">
                  <Input
                    id="apiKey"
                    value="sk_test_51JyUwrR0nZILZj8WZYZZZeGhH7XOW"
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button className="rounded-l-none bg-swift-700 hover:bg-swift-800">
                    <Key className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your API key. Keep this secure and do not share it publicly.
                </p>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label htmlFor="googleMapsApiKey">Google Maps API Key</Label>
                <Input
                  id="googleMapsApiKey"
                  value={googleMapsApiKey}
                  onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used for maps and location tracking features.
                </p>
              </div>
              
              <div className="pt-4 border-t mt-4">
                <h3 className="text-sm font-medium mb-3">Email Integration</h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">SMTP Server</Label>
                    <Input
                      id="smtpServer"
                      value={smtpServer}
                      onChange={(e) => setSmtpServer(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={smtpUsername}
                      onChange={(e) => setSmtpUsername(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input id="smtpPassword" type="password" value="••••••••••••" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t mt-4">
                <h3 className="text-sm font-medium mb-3">Payment Integration</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <Switch id="enablePayments" />
                  <Label htmlFor="enablePayments">Enable Payment Processing</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentProcessor">Payment Processor</Label>
                  <Select defaultValue="stripe">
                    <SelectTrigger id="paymentProcessor">
                      <SelectValue placeholder="Select payment processor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 mt-3">
                  <Label htmlFor="stripeApiKey">Stripe API Key</Label>
                  <Input
                    id="stripeApiKey"
                    value="pk_test_51JyUwrR0nZILZj8WZYZZZeGhH7XOW"
                  />
                </div>
              </div>
              
              <Button
                className="bg-swift-700 hover:bg-swift-800 mt-4 gap-2"
                onClick={handleSaveIntegrationSettings}
              >
                <Save className="h-4 w-4" /> Save Integration Settings
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>
                Manage third-party service connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <Map className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Google Maps</p>
                      <p className="text-sm text-gray-500">Connected</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded">
                      <CreditCard className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Stripe Payments</p>
                      <p className="text-sm text-gray-500">Connected</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Mailchimp</p>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Social Media Integration</p>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
