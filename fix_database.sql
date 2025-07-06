-- Fix Database Schema for Swift Trace Hub
-- This script will clean up existing objects and recreate them properly

-- Drop existing tables and types in the correct order
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.delivery_assignments CASCADE;
DROP TABLE IF EXISTS public.delivery_vehicles CASCADE;
DROP TABLE IF EXISTS public.delivery_routes CASCADE;
DROP TABLE IF EXISTS public.tracking_events CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS package_status CASCADE;
DROP TYPE IF EXISTS tracking_event_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.generate_tracking_number() CASCADE;
DROP FUNCTION IF EXISTS public.update_package_status(UUID, package_status, TEXT, TEXT) CASCADE;

-- Now recreate everything from scratch using the initial schema
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types for package status and event types
CREATE TYPE package_status AS ENUM (
  'pending',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'returned'
);

CREATE TYPE tracking_event_type AS ENUM (
  'created',
  'picked_up',
  'in_transit',
  'arrived_at_facility', 
  'departed_facility',
  'out_for_delivery',
  'delivery_attempted',
  'delivered',
  'exception',
  'cancelled',
  'returned'
);

CREATE TYPE user_role AS ENUM (
  'admin',
  'manager',
  'operator',
  'agent',
  'viewer'
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'United States',
  company TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create packages table
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  
  -- Package details
  description TEXT,
  weight DECIMAL(10,2),
  dimensions JSONB, -- {length, width, height}
  value DECIMAL(10,2),
  package_type TEXT DEFAULT 'Box',
  signature_required BOOLEAN DEFAULT false,
  special_instructions TEXT,
  
  -- Origin and destination
  origin_address TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  origin_state TEXT,
  origin_country TEXT NOT NULL DEFAULT 'United States',
  origin_postal_code TEXT,
  origin_lat DECIMAL(10,8),
  origin_lng DECIMAL(11,8),
  
  destination_address TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  destination_state TEXT,
  destination_country TEXT NOT NULL DEFAULT 'United States',
  destination_postal_code TEXT,
  destination_lat DECIMAL(10,8),
  destination_lng DECIMAL(11,8),
  
  -- Current location
  current_location TEXT,
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(11,8),
  
  -- Status and timing
  status package_status NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'standard',
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  actual_delivery_date TIMESTAMP WITH TIME ZONE,
  shipped_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Service details
  service_type TEXT DEFAULT 'Standard Shipping',
  carrier TEXT DEFAULT 'Jet Delivery',
  insurance_amount DECIMAL(10,2),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tracking events table
CREATE TABLE public.tracking_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  
  event_type tracking_event_type NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  
  -- Additional event details
  status_details TEXT,
  exception_reason TEXT,
  signed_by TEXT,
  delivery_attempts INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user authentication
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role user_role DEFAULT 'viewer',
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery routes table
CREATE TABLE public.delivery_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  origin_city TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  estimated_duration_hours INTEGER,
  distance_miles DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery vehicles table
CREATE TABLE public.delivery_vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number TEXT UNIQUE NOT NULL,
  vehicle_type TEXT NOT NULL,
  capacity_weight DECIMAL(10,2),
  capacity_volume DECIMAL(10,2),
  driver_name TEXT,
  driver_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  current_location TEXT,
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(11,8),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery assignments table
CREATE TABLE public.delivery_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.delivery_vehicles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  estimated_pickup_time TIMESTAMP WITH TIME ZONE,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_pickup_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'assigned',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit log table
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_active ON public.customers(is_active);
CREATE INDEX idx_packages_tracking_number ON public.packages(tracking_number);
CREATE INDEX idx_packages_status ON public.packages(status);
CREATE INDEX idx_packages_customer_id ON public.packages(customer_id);
CREATE INDEX idx_packages_created_at ON public.packages(created_at);
CREATE INDEX idx_tracking_events_package_id ON public.tracking_events(package_id);
CREATE INDEX idx_tracking_events_created_at ON public.tracking_events(created_at);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_active ON public.profiles(is_active);
CREATE INDEX idx_delivery_assignments_package_id ON public.delivery_assignments(package_id);
CREATE INDEX idx_delivery_assignments_vehicle_id ON public.delivery_assignments(vehicle_id);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delivery_routes_updated_at
  BEFORE UPDATE ON public.delivery_routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delivery_vehicles_updated_at
  BEFORE UPDATE ON public.delivery_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_delivery_assignments_updated_at
  BEFORE UPDATE ON public.delivery_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate tracking numbers
CREATE OR REPLACE FUNCTION public.generate_tracking_number()
RETURNS TEXT AS $$
DECLARE
  tracking_num TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    -- Generate a tracking number with format: JT-YYYYMMDD-XXXXX
    tracking_num := 'JT-' || to_char(now(), 'YYYYMMDD') || '-' || 
                   lpad(floor(random() * 100000)::text, 5, '0');
    
    -- Check if it already exists
    IF NOT EXISTS (SELECT 1 FROM public.packages WHERE tracking_number = tracking_num) THEN
      RETURN tracking_num;
    END IF;
    
    counter := counter + 1;
    IF counter > 100 THEN
      RAISE EXCEPTION 'Unable to generate unique tracking number after 100 attempts';
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to update package status
CREATE OR REPLACE FUNCTION public.update_package_status(
  p_package_id UUID,
  p_status package_status,
  p_location TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Update package status
  UPDATE public.packages 
  SET 
    status = p_status,
    current_location = COALESCE(p_location, current_location),
    updated_at = now()
  WHERE id = p_package_id;
  
  -- Add tracking event
  INSERT INTO public.tracking_events (package_id, event_type, description, location)
  VALUES (
    p_package_id,
    p_status::text::tracking_event_type,
    COALESCE(p_description, 'Status updated to ' || p_status),
    p_location
  );
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Users can view their own customer data" 
ON public.customers FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create customer data" 
ON public.customers FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own customer data" 
ON public.customers FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for packages
CREATE POLICY "Users can view all packages" 
ON public.packages FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create packages" 
ON public.packages FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update packages" 
ON public.packages FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- RLS Policies for tracking events
CREATE POLICY "Users can view all tracking events" 
ON public.tracking_events FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create tracking events" 
ON public.tracking_events FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- RLS Policies for delivery routes
CREATE POLICY "Authenticated users can view delivery routes" 
ON public.delivery_routes FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin users can manage delivery routes" 
ON public.delivery_routes FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- RLS Policies for delivery vehicles
CREATE POLICY "Authenticated users can view delivery vehicles" 
ON public.delivery_vehicles FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin users can manage delivery vehicles" 
ON public.delivery_vehicles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- RLS Policies for delivery assignments
CREATE POLICY "Authenticated users can view delivery assignments" 
ON public.delivery_assignments FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin users can manage delivery assignments" 
ON public.delivery_assignments FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- RLS Policies for audit log
CREATE POLICY "Admin users can view audit log" 
ON public.audit_log FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  )
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_values)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for important tables
CREATE TRIGGER audit_customers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_packages_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_tracking_events_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.tracking_events
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- Create validation functions
CREATE OR REPLACE FUNCTION public.validate_package_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate tracking number format
  IF NEW.tracking_number !~ '^[A-Z]{2}-\d{8}-\d{5}$' THEN
    RAISE EXCEPTION 'Invalid tracking number format. Expected format: XX-YYYYMMDD-XXXXX';
  END IF;
  
  -- Validate weight is positive
  IF NEW.weight IS NOT NULL AND NEW.weight <= 0 THEN
    RAISE EXCEPTION 'Package weight must be positive';
  END IF;
  
  -- Validate value is positive
  IF NEW.value IS NOT NULL AND NEW.value < 0 THEN
    RAISE EXCEPTION 'Package value cannot be negative';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create validation trigger for packages
CREATE TRIGGER validate_package_trigger
  BEFORE INSERT OR UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.validate_package_data();

-- Create monitoring function
CREATE OR REPLACE FUNCTION public.get_system_stats()
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_packages', (SELECT COUNT(*) FROM public.packages),
    'pending_packages', (SELECT COUNT(*) FROM public.packages WHERE status = 'pending'),
    'in_transit_packages', (SELECT COUNT(*) FROM public.packages WHERE status = 'in_transit'),
    'delivered_packages', (SELECT COUNT(*) FROM public.packages WHERE status = 'delivered'),
    'total_customers', (SELECT COUNT(*) FROM public.customers),
    'active_customers', (SELECT COUNT(*) FROM public.customers WHERE is_active = true),
    'total_events', (SELECT COUNT(*) FROM public.tracking_events),
    'today_events', (SELECT COUNT(*) FROM public.tracking_events WHERE created_at >= CURRENT_DATE),
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'admin_users', (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin')
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create demo admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@swifttracehub.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"first_name": "Admin", "last_name": "User"}',
  false
) ON CONFLICT (id) DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  is_active
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@swifttracehub.com',
  'Admin',
  'User',
  'admin',
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Insert demo data
INSERT INTO public.customers (first_name, last_name, email, phone, address, city, state, postal_code, country) VALUES
('John', 'Doe', 'john.doe@email.com', '+1-555-0101', '123 Main St', 'New York', 'NY', '10001', 'United States'),
('Jane', 'Smith', 'jane.smith@email.com', '+1-555-0102', '456 Oak Ave', 'Los Angeles', 'CA', '90210', 'United States'),
('Mike', 'Johnson', 'mike.johnson@email.com', '+1-555-0103', '789 Pine Rd', 'Chicago', 'IL', '60601', 'United States'),
('Sarah', 'Williams', 'sarah.williams@email.com', '+1-555-0104', '321 Elm St', 'Houston', 'TX', '77001', 'United States'),
('David', 'Brown', 'david.brown@email.com', '+1-555-0105', '654 Maple Dr', 'Phoenix', 'AZ', '85001', 'United States');

-- Insert demo packages
INSERT INTO public.packages (tracking_number, customer_id, description, weight, origin_address, origin_city, origin_state, origin_country, origin_postal_code, destination_address, destination_city, destination_state, destination_country, destination_postal_code, status, estimated_delivery_date) VALUES
('JT-20250101-00001', (SELECT id FROM public.customers WHERE email = 'john.doe@email.com'), 'Electronics Package', 5.5, '123 Main St', 'New York', 'NY', 'United States', '10001', '456 Oak Ave', 'Los Angeles', 'CA', 'United States', '90210', 'in_transit', now() + interval '3 days'),
('JT-20250101-00002', (SELECT id FROM public.customers WHERE email = 'jane.smith@email.com'), 'Clothing Package', 2.3, '456 Oak Ave', 'Los Angeles', 'CA', 'United States', '90210', '789 Pine Rd', 'Chicago', 'IL', 'United States', '60601', 'pending', now() + interval '5 days'),
('JT-20250101-00003', (SELECT id FROM public.customers WHERE email = 'mike.johnson@email.com'), 'Books Package', 1.8, '789 Pine Rd', 'Chicago', 'IL', 'United States', '60601', '321 Elm St', 'Houston', 'TX', 'United States', '77001', 'delivered', now() - interval '1 day'),
('JT-20250101-00004', (SELECT id FROM public.customers WHERE email = 'sarah.williams@email.com'), 'Home Goods', 8.2, '321 Elm St', 'Houston', 'TX', 'United States', '77001', '654 Maple Dr', 'Phoenix', 'AZ', 'United States', '85001', 'out_for_delivery', now() + interval '1 day'),
('JT-20250101-00005', (SELECT id FROM public.customers WHERE email = 'david.brown@email.com'), 'Sports Equipment', 12.5, '654 Maple Dr', 'Phoenix', 'AZ', 'United States', '85001', '123 Main St', 'New York', 'NY', 'United States', '10001', 'picked_up', now() + interval '7 days');

-- Insert demo tracking events
INSERT INTO public.tracking_events (package_id, event_type, description, location) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00001'), 'created', 'Package created and assigned tracking number', 'New York, NY'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00001'), 'picked_up', 'Package picked up from sender', 'New York, NY'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00001'), 'in_transit', 'Package in transit to destination', 'Chicago, IL'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00002'), 'created', 'Package created and assigned tracking number', 'Los Angeles, CA'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00003'), 'created', 'Package created and assigned tracking number', 'Chicago, IL'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00003'), 'picked_up', 'Package picked up from sender', 'Chicago, IL'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00003'), 'in_transit', 'Package in transit to destination', 'Houston, TX'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00003'), 'delivered', 'Package delivered successfully', 'Houston, TX'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00004'), 'created', 'Package created and assigned tracking number', 'Houston, TX'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00004'), 'picked_up', 'Package picked up from sender', 'Houston, TX'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00004'), 'in_transit', 'Package in transit to destination', 'Phoenix, AZ'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00004'), 'out_for_delivery', 'Package out for delivery', 'Phoenix, AZ'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00005'), 'created', 'Package created and assigned tracking number', 'Phoenix, AZ'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00005'), 'picked_up', 'Package picked up from sender', 'Phoenix, AZ');

-- Insert demo delivery routes
INSERT INTO public.delivery_routes (name, description, origin_city, destination_city, estimated_duration_hours, distance_miles) VALUES
('NYC-LA Express', 'Express route from New York to Los Angeles', 'New York', 'Los Angeles', 72, 2789),
('LA-Chicago Standard', 'Standard route from Los Angeles to Chicago', 'Los Angeles', 'Chicago', 48, 1744),
('Chicago-Houston Direct', 'Direct route from Chicago to Houston', 'Chicago', 'Houston', 24, 940),
('Houston-Phoenix Route', 'Route from Houston to Phoenix', 'Houston', 'Phoenix', 36, 1187),
('Phoenix-NYC Route', 'Route from Phoenix to New York', 'Phoenix', 'New York', 60, 2144);

-- Insert demo delivery vehicles
INSERT INTO public.delivery_vehicles (vehicle_number, vehicle_type, capacity_weight, capacity_volume, driver_name, driver_phone, current_location) VALUES
('V001', 'Delivery Van', 2000, 500, 'John Driver', '+1-555-1001', 'New York, NY'),
('V002', 'Truck', 5000, 1200, 'Mike Trucker', '+1-555-1002', 'Los Angeles, CA'),
('V003', 'Delivery Van', 2000, 500, 'Sarah Van', '+1-555-1003', 'Chicago, IL'),
('V004', 'Truck', 5000, 1200, 'David Hauler', '+1-555-1004', 'Houston, TX'),
('V005', 'Delivery Van', 2000, 500, 'Lisa Courier', '+1-555-1005', 'Phoenix, AZ');

-- Insert demo delivery assignments
INSERT INTO public.delivery_assignments (package_id, vehicle_id, assigned_at, estimated_pickup_time, estimated_delivery_time, status) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00001'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'V001'), now(), now(), now() + interval '3 days', 'assigned'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00002'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'V002'), now(), now() + interval '1 day', now() + interval '5 days', 'assigned'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00003'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'V003'), now() - interval '2 days', now() - interval '2 days', now() - interval '1 day', 'completed'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00004'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'V004'), now() - interval '1 day', now() - interval '1 day', now() + interval '1 day', 'in_progress'),
((SELECT id FROM public.packages WHERE tracking_number = 'JT-20250101-00005'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'V005'), now(), now(), now() + interval '7 days', 'assigned');

COMMIT; 