
import { useState } from "react";
import { 
  BarChart3, 
  Calendar, 
  FileDown, 
  FileText, 
  LineChart, 
  Package,
  Plus,
  Truck,
  PieChart,
  Users,
  DollarSign,
  ArrowDownRight,
  ArrowUpRight,
  MapPin
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPC, Pie, Cell, Legend } from "recharts";
import { toast } from "sonner";

// Sample data for the Shipments chart
const shipmentData = [
  { name: "Jan", value: 540 },
  { name: "Feb", value: 620 },
  { name: "Mar", value: 700 },
  { name: "Apr", value: 680 },
  { name: "May", value: 750 },
  { name: "Jun", value: 890 },
  { name: "Jul", value: 950 },
  { name: "Aug", value: 990 },
  { name: "Sep", value: 860 },
];

// Sample data for the Revenue chart
const revenueData = [
  { name: "Jan", value: 42500 },
  { name: "Feb", value: 48900 },
  { name: "Mar", value: 56700 },
  { name: "Apr", value: 54300 },
  { name: "May", value: 59200 },
  { name: "Jun", value: 72100 },
  { name: "Jul", value: 78600 },
  { name: "Aug", value: 82400 },
  { name: "Sep", value: 68900 },
];

// Sample data for service type distribution
const serviceTypeData = [
  { name: "Express", value: 45 },
  { name: "Standard", value: 35 },
  { name: "Economy", value: 20 },
];

// Sample data for package type distribution
const packageTypeData = [
  { name: "Box", value: 60 },
  { name: "Envelope", value: 25 },
  { name: "Tube", value: 10 },
  { name: "Pallet", value: 5 },
];

// Sample data for top destinations
const topDestinationsData = [
  { name: "Chicago", value: 152 },
  { name: "New York", value: 134 },
  { name: "Los Angeles", value: 118 },
  { name: "Miami", value: 97 },
  { name: "Seattle", value: 86 },
  { name: "Denver", value: 75 },
  { name: "Boston", value: 62 },
];

// Sample weekly delivery performance data
const weeklyPerformanceData = [
  { name: "Mon", onTime: 95, delayed: 5 },
  { name: "Tue", onTime: 97, delayed: 3 },
  { name: "Wed", onTime: 94, delayed: 6 },
  { name: "Thu", onTime: 92, delayed: 8 },
  { name: "Fri", onTime: 88, delayed: 12 },
  { name: "Sat", onTime: 90, delayed: 10 },
  { name: "Sun", onTime: 98, delayed: 2 },
];

// Random colors for pie charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    start: "2023-09-01",
    end: "2023-09-30"
  });

  const handleExportData = (reportType: string) => {
    toast.info(`Exporting ${reportType} report...`);
    // In a real app, this would generate a CSV or PDF report
    setTimeout(() => {
      toast.success(`${reportType} report exported successfully`);
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-gray-500">View and export detailed business reports</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleExportData("Monthly Summary")} className="gap-2">
              <FileDown className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg border">
          <div className="flex items-center gap-2">
            <div>
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-[180px]"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-[180px]"
              />
            </div>
          </div>
          <Button className="mt-6 bg-swift-700 hover:bg-swift-800">Apply Filter</Button>
        </div>

        <Tabs defaultValue="overview" className="w-full mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shipments">Shipments</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">1,248</div>
                    <Package className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex items-center mt-1 text-xs">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">12%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">342</div>
                    <Truck className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex items-center mt-1 text-xs">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">8%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">856</div>
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex items-center mt-1 text-xs">
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">24%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">$87,432</div>
                    <DollarSign className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex items-center mt-1 text-xs">
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500 font-medium">3%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipment Volume</CardTitle>
                  <CardDescription>Shipment trends for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={shipmentData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#0ea5e9"
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Revenue trends for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={revenueData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Type Distribution</CardTitle>
                  <CardDescription>Package distribution by service type</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPC>
                        <Pie
                          data={serviceTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {serviceTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </RechartsPC>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Package Type Distribution</CardTitle>
                  <CardDescription>Package distribution by type</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPC>
                        <Pie
                          data={packageTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {packageTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </RechartsPC>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Destinations</CardTitle>
                  <CardDescription>Most frequent shipping destinations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={topDestinationsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" name="Shipments" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Delivery Performance</CardTitle>
                  <CardDescription>On-time vs. delayed deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyPerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="onTime" stackId="a" fill="#10b981" name="On Time %" />
                        <Bar dataKey="delayed" stackId="a" fill="#ef4444" name="Delayed %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Available Reports</CardTitle>
                  <CardDescription>Download detailed reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Shipment Summary</h3>
                          <p className="text-xs text-gray-500">Detailed shipment activity for selected period</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleExportData("Shipment Summary")}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Financial Report</h3>
                          <p className="text-xs text-gray-500">Revenue and expense breakdown</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleExportData("Financial Report")}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full">
                          <Users className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Customer Activity</h3>
                          <p className="text-xs text-gray-500">Customer shipping patterns and activity</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleExportData("Customer Activity")}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <Truck className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Delivery Performance</h3>
                          <p className="text-xs text-gray-500">On-time performance and exceptions</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleExportData("Delivery Performance")}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="shipments" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Analysis</CardTitle>
                <CardDescription>Detailed view of shipping volumes and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={shipmentData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorShipment" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0ea5e9"
                        fillOpacity={1}
                        fill="url(#colorShipment)"
                        name="Shipments"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Shipment Distribution</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Express</span>
                        <span className="text-sm font-medium">{serviceTypeData[0].value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${serviceTypeData[0].value}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Standard</span>
                        <span className="text-sm font-medium">{serviceTypeData[1].value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${serviceTypeData[1].value}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Economy</span>
                        <span className="text-sm font-medium">{serviceTypeData[2].value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${serviceTypeData[2].value}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Key Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Total Shipments (Current Period)</span>
                        <span className="text-sm font-medium">1,248</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Average Daily Shipments</span>
                        <span className="text-sm font-medium">42</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Growth Rate (YoY)</span>
                        <span className="text-sm font-medium text-green-600">+18%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Average Package Weight</span>
                        <span className="text-sm font-medium">3.2 lbs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Financial performance and revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorRev)"
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Revenue by Service Type</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Express</span>
                        <span className="text-sm font-medium">$52,459</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Standard</span>
                        <span className="text-sm font-medium">$26,230</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Economy</span>
                        <span className="text-sm font-medium">$8,743</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Financial Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Total Revenue (Current Period)</span>
                        <span className="text-sm font-medium">$87,432</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Average Revenue per Shipment</span>
                        <span className="text-sm font-medium">$70.06</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Growth Rate (YoY)</span>
                        <span className="text-sm font-medium text-green-600">+14%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Most Profitable Route</span>
                        <span className="text-sm font-medium">Dallas → Chicago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>Analysis of delivery efficiency and service quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="onTime" fill="#10b981" name="On Time %" />
                      <Bar dataKey="delayed" fill="#ef4444" name="Delayed %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">On-Time Delivery Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">93.4%</div>
                        <div className="p-2 rounded-full bg-green-100">
                          <Truck className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex items-center mt-1 text-xs">
                        <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">2.1%</span>
                        <span className="text-gray-500 ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Average Delivery Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">2.3 days</div>
                        <div className="p-2 rounded-full bg-blue-100">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex items-center mt-1 text-xs">
                        <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">0.2 days</span>
                        <span className="text-gray-500 ml-1">improvement</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Customer Satisfaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">4.8/5.0</div>
                        <div className="p-2 rounded-full bg-amber-100">
                          <Users className="h-4 w-4 text-amber-600" />
                        </div>
                      </div>
                      <div className="flex items-center mt-1 text-xs">
                        <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-green-500 font-medium">0.3</span>
                        <span className="text-gray-500 ml-1">from last quarter</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Performance by Region</h3>
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time Rate</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Time</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Northeast</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">95.2%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.1 days</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.9/5.0</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">312</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Midwest</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">94.6%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.2 days</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.7/5.0</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">287</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">South</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">92.8%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.5 days</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.6/5.0</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">368</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">West</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">91.3%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.7 days</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.8/5.0</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">281</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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

export default ReportsPage;
