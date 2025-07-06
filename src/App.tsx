import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Public Pages
import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
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
import DeliveriesPage from "@/pages/admin/DeliveriesPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import UserManagementPage from "@/pages/admin/UserManagementPage";

// Protected Route Component
function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user, loading, requireAuth } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swift-700"></div>
      </div>
    );
  }

  if (!requireAuth(requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Admin Routes Component
function AdminRoutes() {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/packages" element={<PackagesPage />} />
        <Route path="/admin/packages/new" element={<CreatePackagePage />} />
        <Route path="/admin/packages/:id" element={<PackageDetailsPage />} />
        <Route path="/admin/packages/:id/edit" element={<CreatePackagePage />} />
        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/admin/deliveries" element={<DeliveriesPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/tracking/:trackingNumber" element={<TrackingDetailsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            
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
    </AuthProvider>
  );
}

export default App;
