import { useState } from "react";
import { 
  Settings, 
  Globe, 
  Mail, 
  Bell, 
  Shield, 
  Lock, 
  CreditCard, 
  Clock, 
  Truck, 
  Package,
  Save,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner";

const SettingsPage = () => {
  const [siteName, setSiteName] = useState("Jet Delivery");
  const [supportEmail, setSupportEmail] = useState("support@jetdelivery.com");
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 123-4567");
  const [address, setAddress] = useState("123 Main St, Anytown, USA");
  const [mapApiKey, setMapApiKey] = useState("AIzaSyD7RZd5JPiPBmV8A14TP2oQ3YQSXtzTqgA");
  const [deliveryCost, setDeliveryCost] = useState("10.00");
  const [taxRate, setTaxRate] = useState("0.05");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enable2FA, setEnable2FA] = useState(false);
  const [automaticUpdates, setAutomaticUpdates] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      toast.success("Settings saved successfully!");
      setSaving(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your system settings</p>
        </div>
        <Button 
          className="gap-2 bg-swift-700 hover:bg-swift-800"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Manage your site name and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="siteName" className="text-sm font-medium">
                  Site Name
                </label>
                <Input
                  id="siteName"
                  placeholder="Jet Delivery"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="supportEmail" className="text-sm font-medium">
                  Support Email
                </label>
                <Input
                  id="supportEmail"
                  type="email"
                  placeholder="support@jetdelivery.com"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Textarea
                  id="address"
                  placeholder="123 Main St, Anytown, USA"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Configure external API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="mapApiKey" className="text-sm font-medium">
                  Google Maps API Key
                </label>
                <Input
                  id="mapApiKey"
                  type="password"
                  placeholder="AIzaSyAI42aRjF79hJMVoOC9G95rp0rxp8T3DFc"
                  value={mapApiKey}
                  onChange={(e) => setMapApiKey(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="localization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure currency, timezone, and measurement units</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="deliveryCost" className="text-sm font-medium">
                  Default Delivery Cost
                </label>
                <Input
                  id="deliveryCost"
                  placeholder="10.00"
                  value={deliveryCost}
                  onChange={(e) => setDeliveryCost(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="taxRate" className="text-sm font-medium">
                  Tax Rate
                </label>
                <Input
                  id="taxRate"
                  placeholder="0.05"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="timezone" className="text-sm font-medium">
                  Timezone
                </label>
                <Input
                  id="timezone"
                  placeholder="America/Los_Angeles"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage email and SMS notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="enableNotifications" className="text-sm font-medium">
                  Enable Notifications
                </label>
                <Switch
                  id="enableNotifications"
                  checked={enableNotifications}
                  onCheckedChange={(checked) => setEnableNotifications(checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="emailNotifications" className="text-sm font-medium">
                  Email Notifications
                </label>
                <Switch
                  id="emailNotifications"
                  disabled={!enableNotifications}
                  checked={enableNotifications}
                  onCheckedChange={(checked) => setEnableNotifications(checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="smsNotifications" className="text-sm font-medium">
                  SMS Notifications
                </label>
                <Switch
                  id="smsNotifications"
                  disabled={!enableNotifications}
                  checked={enableNotifications}
                  onCheckedChange={(checked) => setEnableNotifications(checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage password policies and authentication methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="enable2FA" className="text-sm font-medium">
                  Enable Two-Factor Authentication
                </label>
                <Switch
                  id="enable2FA"
                  checked={enable2FA}
                  onCheckedChange={(checked) => setEnable2FA(checked)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="passwordPolicy" className="text-sm font-medium">
                  Password Policy
                </label>
                <Input
                  id="passwordPolicy"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Manage system updates and data backups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="automaticUpdates" className="text-sm font-medium">
                  Automatic Updates
                </label>
                <Switch
                  id="automaticUpdates"
                  checked={automaticUpdates}
                  onCheckedChange={(checked) => setAutomaticUpdates(checked)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="backupSchedule" className="text-sm font-medium">
                  Backup Schedule
                </label>
                <Input
                  id="backupSchedule"
                  placeholder="Daily"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
