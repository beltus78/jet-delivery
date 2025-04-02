
import { useState } from "react";
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  Clock,
  Filter,
  Truck,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  PieChart,
  LineChart,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartLineChart,
  Line,
  PieChart as RechartPieChart,
  Pie,
  Cell,
} from "recharts";

// Sample data for charts
const monthlyDeliveryData = [
  { name: "Jan", value: 540 },
  { name: "Feb", value: 620 },
  { name: "Mar", value: 700 },
  { name: "Apr", value: 680 },
  { name: "May", value: 750 },
  { name: "Jun", value: 890 },
  { name: "Jul", value: 950 },
  { name: "Aug", value: 870 },
  { name: "Sep", value: 930 },
  { name: "Oct", value: 720 },
  { name: "Nov", value: 680 },
  { name: "Dec", value: 940 },
];

const deliveryStatusData = [
  { name: "Delivered", value: 720 },
  { name: "In Transit", value: 320 },
  { name: "Processing", value: 180 },
  { name: "Delayed", value: 40 },
];

const COLORS = ["#16a34a", "#0ea5e9", "#eab308", "#ef4444"];

const regionData = [
  { name: "West", delivered: 280, inTransit: 120, processing: 60 },
  { name: "Midwest", delivered: 200, inTransit: 80, processing: 40 },
  { name: "Northeast", delivered: 180, inTransit: 70, processing: 30 },
  { name: "South", delivered: 300, inTransit: 100, processing: 50 },
];

const packageTypeData = [
  { name: "Standard", value: 450 },
  { name: "Express", value: 300 },
  { name: "Overnight", value: 150 },
  { name: "Economy", value: 100 },
];

const ReportsPage = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");
  const [selectedReportType, setSelectedReportType] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500">View delivery statistics and performance metrics</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12,482</div>
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
            <CardTitle className="text-sm font-medium text-gray-500">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">94.3%</div>
              <Clock className="h-4 w-4 text-gray-500" />
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
            <CardTitle className="text-sm font-medium text-gray-500">Packages Handled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">18,346</div>
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
            <CardTitle className="text-sm font-medium text-gray-500">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">4.8/5</div>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center mt-1 text-xs">
              <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">0.2</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Delivery Analytics</CardTitle>
              <CardDescription>Monthly delivery volume and performance metrics</CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={selectedTimeframe}
                onValueChange={setSelectedTimeframe}
              >
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <SelectValue placeholder="Timeframe" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={selectedReportType}
                onValueChange={setSelectedReportType}
              >
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Report Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  <SelectItem value="express">Express Only</SelectItem>
                  <SelectItem value="standard">Standard Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deliveries">
            <TabsList className="mb-4">
              <TabsTrigger value="deliveries">
                <BarChart3 className="h-4 w-4 mr-2" /> Deliveries
              </TabsTrigger>
              <TabsTrigger value="status">
                <PieChart className="h-4 w-4 mr-2" /> Status Breakdown
              </TabsTrigger>
              <TabsTrigger value="regional">
                <LineChart className="h-4 w-4 mr-2" /> Regional Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="deliveries" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyDeliveryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => [`${value} deliveries`, 'Volume']} />
                    <Legend />
                    <Bar dataKey="value" name="Deliveries" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="status" className="mt-0">
              <div className="h-[400px] flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="w-full md:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPieChart>
                      <Pie
                        data={deliveryStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deliveryStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => [`${value} packages`, 'Count']} />
                    </RechartPieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full md:w-1/2 h-full">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Status Breakdown</h3>
                    <div className="space-y-2">
                      {deliveryStatusData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span>{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.value}</span>
                            <span className="text-gray-500 text-sm">
                              ({((item.value / deliveryStatusData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium mb-2">Package Types</h4>
                      <div className="space-y-2">
                        {packageTypeData.map((item) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <span className="text-sm">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-swift-600 h-1.5 rounded-full"
                                  style={{
                                    width: `${(item.value / packageTypeData.reduce((acc, curr) => acc + curr.value, 0)) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{item.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="regional" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={regionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="delivered" name="Delivered" fill="#16a34a" />
                    <Bar dataKey="inTransit" name="In Transit" fill="#0ea5e9" />
                    <Bar dataKey="processing" name="Processing" fill="#eab308" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Delivery efficiency and on-time performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartLineChart
                  data={monthlyDeliveryData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Deliveries"
                    stroke="#0ea5e9"
                    activeDot={{ r: 8 }}
                  />
                </RechartLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>View and download recent system reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Monthly Performance Report</p>
                    <p className="text-sm text-gray-500">September 2023</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="gap-1">
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Customer Satisfaction Report</p>
                    <p className="text-sm text-gray-500">Q3 2023</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="gap-1">
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">Regional Delivery Analysis</p>
                    <p className="text-sm text-gray-500">August 2023</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="gap-1">
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Operational Efficiency Report</p>
                    <p className="text-sm text-gray-500">July 2023</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="gap-1">
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
