import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Layout from "@/components/Layout";

// Public Pages
import Index from "@/pages/Index";
import ContactPage from "@/pages/ContactPage";
import ServicesPage from "@/pages/ServicesPage";
import TrackPage from "@/pages/TrackPage";
import TrackingDetailsPage from "@/pages/TrackingDetailsPage";
import NotFound from "@/pages/NotFound";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import PackagesPage from "@/pages/admin/PackagesPage";
import CreatePackagePage from "@/pages/admin/CreatePackagePage";
import PackageDetailsPage from "@/pages/admin/PackageDetailsPage";
import CustomersPage from "@/pages/admin/CustomersPage";
import CreateCustomerPage from "@/pages/admin/CreateCustomerPage";
import DeliveriesPage from "@/pages/admin/DeliveriesPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import UserManagementPage from "@/pages/admin/UserManagementPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/track/:trackingNumber" element={<TrackingDetailsPage />} />
            <Route path="/tracking/:trackingNumber" element={<TrackingDetailsPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="packages/new" element={<CreatePackagePage />} />
            <Route path="packages/:id" element={<PackageDetailsPage />} />
            <Route path="packages/:id/edit" element={<CreatePackagePage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/new" element={<CreateCustomerPage />} />
            <Route path="deliveries" element={<DeliveriesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route index element={<Dashboard />} />
          </Route>
          
          {/* Direct admin routes for production linking */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/packages" element={<PackagesPage />} />
          <Route path="/admin/packages/new" element={<CreatePackagePage />} />
          <Route path="/admin/packages/:id" element={<PackageDetailsPage />} />
          <Route path="/admin/packages/:id/edit" element={<CreatePackagePage />} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          <Route path="/admin/customers/new" element={<CreateCustomerPage />} />
          <Route path="/admin/deliveries" element={<DeliveriesPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </div>
    </Router>
  );
}

export default App;
