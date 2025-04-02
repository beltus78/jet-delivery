
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TrackPage from "./pages/TrackPage";
import TrackingDetailsPage from "./pages/TrackingDetailsPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import PackagesPage from "./pages/admin/PackagesPage";
import PackageDetails from "./pages/admin/PackageDetails";
import DeliveriesPage from "./pages/admin/DeliveriesPage";
import CustomersPage from "./pages/admin/CustomersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import UserManagementPage from "./pages/admin/UserManagementPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/track/:trackingNumber" element={<TrackingDetailsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="packages/:id" element={<PackageDetails />} />
            <Route path="deliveries" element={<DeliveriesPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="users" element={<UserManagementPage />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
