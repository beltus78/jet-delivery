-- Swift Trace Hub - Authentication and Authorization Policies
-- This migration sets up Row Level Security (RLS) policies for all tables

-- Enable Row Level Security on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CUSTOMERS TABLE POLICIES
-- ============================================================================

-- Users can view all customers
CREATE POLICY "Users can view all customers" 
ON public.customers FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Admin and Manager can create customers
CREATE POLICY "Admin and Manager can create customers" 
ON public.customers FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Admin and Manager can update customers
CREATE POLICY "Admin and Manager can update customers" 
ON public.customers FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Only Admin can delete customers
CREATE POLICY "Only Admin can delete customers" 
ON public.customers FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- PACKAGES TABLE POLICIES
-- ============================================================================

-- Users can view all packages
CREATE POLICY "Users can view all packages" 
ON public.packages FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Admin, Manager, and Operator can create packages
CREATE POLICY "Admin, Manager, and Operator can create packages" 
ON public.packages FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager', 'operator')
  )
);

-- Admin, Manager, and Operator can update packages
CREATE POLICY "Admin, Manager, and Operator can update packages" 
ON public.packages FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager', 'operator')
  )
);

-- Only Admin and Manager can delete packages
CREATE POLICY "Only Admin and Manager can delete packages" 
ON public.packages FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- ============================================================================
-- TRACKING EVENTS TABLE POLICIES
-- ============================================================================

-- Users can view all tracking events
CREATE POLICY "Users can view all tracking events" 
ON public.tracking_events FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Admin, Manager, and Operator can create tracking events
CREATE POLICY "Admin, Manager, and Operator can create tracking events" 
ON public.tracking_events FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager', 'operator')
  )
);

-- Admin and Manager can update tracking events
CREATE POLICY "Admin and Manager can update tracking events" 
ON public.tracking_events FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Only Admin can delete tracking events
CREATE POLICY "Only Admin can delete tracking events" 
ON public.tracking_events FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can create their own profile (handled by trigger)
CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Only Admin can delete profiles
CREATE POLICY "Only Admin can delete profiles" 
ON public.profiles FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- DELIVERY ROUTES TABLE POLICIES
-- ============================================================================

-- Users can view all delivery routes
CREATE POLICY "Users can view all delivery routes" 
ON public.delivery_routes FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Admin and Manager can create delivery routes
CREATE POLICY "Admin and Manager can create delivery routes" 
ON public.delivery_routes FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Admin and Manager can update delivery routes
CREATE POLICY "Admin and Manager can update delivery routes" 
ON public.delivery_routes FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Only Admin can delete delivery routes
CREATE POLICY "Only Admin can delete delivery routes" 
ON public.delivery_routes FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- DELIVERY VEHICLES TABLE POLICIES
-- ============================================================================

-- Users can view all delivery vehicles
CREATE POLICY "Users can view all delivery vehicles" 
ON public.delivery_vehicles FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Admin and Manager can create delivery vehicles
CREATE POLICY "Admin and Manager can create delivery vehicles" 
ON public.delivery_vehicles FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Admin and Manager can update delivery vehicles
CREATE POLICY "Admin and Manager can update delivery vehicles" 
ON public.delivery_vehicles FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Only Admin can delete delivery vehicles
CREATE POLICY "Only Admin can delete delivery vehicles" 
ON public.delivery_vehicles FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- DELIVERY ASSIGNMENTS TABLE POLICIES
-- ============================================================================

-- Users can view all delivery assignments
CREATE POLICY "Users can view all delivery assignments" 
ON public.delivery_assignments FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Admin, Manager, and Operator can create delivery assignments
CREATE POLICY "Admin, Manager, and Operator can create delivery assignments" 
ON public.delivery_assignments FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager', 'operator')
  )
);

-- Admin, Manager, and Operator can update delivery assignments
CREATE POLICY "Admin, Manager, and Operator can update delivery assignments" 
ON public.delivery_assignments FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager', 'operator')
  )
);

-- Only Admin and Manager can delete delivery assignments
CREATE POLICY "Only Admin and Manager can delete delivery assignments" 
ON public.delivery_assignments FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- ============================================================================
-- AUDIT LOG TABLE POLICIES
-- ============================================================================

-- Only Admin can view audit logs
CREATE POLICY "Only Admin can view audit logs" 
ON public.audit_log FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- System can insert audit logs (no user check for system operations)
CREATE POLICY "System can insert audit logs" 
ON public.audit_log FOR INSERT 
WITH CHECK (true);

-- Only Admin can delete audit logs
CREATE POLICY "Only Admin can delete audit logs" 
ON public.audit_log FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================================================
-- HELPER FUNCTIONS FOR ROLE CHECKING
-- ============================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is manager or admin
CREATE OR REPLACE FUNCTION public.is_manager_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is operator or higher
CREATE OR REPLACE FUNCTION public.is_operator_or_higher()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager', 'operator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 