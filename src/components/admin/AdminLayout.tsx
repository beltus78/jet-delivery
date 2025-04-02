
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Search, 
  Bell,
  Menu,
  X,
  User,
  Home,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if screen is mobile on initial render and when window is resized
  useEffect(() => {
    const checkIfMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Check on initial render
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    toast.info("Logging out...");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleViewNotifications = () => {
    toast.info("You have 3 new notifications");
    setNotifications(0);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-swift-700" />
              <span className="font-bold text-lg">Swift Admin</span>
            </Link>
            <button
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto">
            <nav className="space-y-1">
              <Button
                asChild
                variant={location.pathname === "/admin/dashboard" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/dashboard"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/admin/packages" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/packages"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/packages" className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span>Packages</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/admin/deliveries" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/deliveries"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/deliveries" className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <span>Deliveries</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/admin/customers" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/customers"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/customers" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Customers</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/admin/reports" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/reports"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/reports" className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Reports</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/admin/settings" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/settings"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/settings" className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </Button>
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start text-gray-600"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </div>
            </Button>
            
            <div className="mt-8 px-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HelpCircle className="h-4 w-4" />
                <Link to="/help" className="hover:text-swift-700">Help & Support</Link>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Home className="h-4 w-4" />
                <Link to="/" className="hover:text-swift-700">Back to Website</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button
              className="md:inline-block text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <button
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <h1 className="text-xl font-semibold hidden md:block">
              {location.pathname === "/admin/dashboard" && "Dashboard"}
              {location.pathname === "/admin/packages" && "Packages"}
              {location.pathname === "/admin/deliveries" && "Deliveries"}
              {location.pathname === "/admin/customers" && "Customers"}
              {location.pathname === "/admin/reports" && "Reports"}
              {location.pathname === "/admin/settings" && "Settings"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-64"
              />
            </div>
            
            <button
              className="relative p-2 rounded-full hover:bg-gray-100"
              onClick={handleViewNotifications}
            >
              <Bell className="h-5 w-5 text-gray-500" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notifications}
                </span>
              )}
            </button>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@swiftmail.com</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md z-40">
            <nav className="px-4 py-2 space-y-1">
              <Button
                asChild
                variant={location.pathname === "/admin/dashboard" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/dashboard"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/admin/packages" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/packages"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/packages" className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span>Packages</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/admin/deliveries" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/deliveries"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/deliveries" className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <span>Deliveries</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/admin/customers" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/customers"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/customers" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Customers</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/admin/reports" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/reports"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/reports" className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Reports</span>
                </Link>
              </Button>
              <Button
                asChild
                variant={location.pathname === "/admin/settings" ? "default" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === "/admin/settings"
                    ? "bg-swift-700 hover:bg-swift-800"
                    : ""
                }`}
              >
                <Link to="/admin/settings" className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </Button>
            </nav>
            <div className="border-t p-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>
        )}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};
