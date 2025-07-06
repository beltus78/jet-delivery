-- Swift Trace Hub - Initial Database Schema
-- This migration creates the complete database structure for the application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types for package status and event types
DO $$ BEGIN
    CREATE TYPE package_status AS ENUM (
      'pending',
      'picked_up',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'returned'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
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
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
      'admin',
      'manager',
      'operator',
      'agent',
      'viewer'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
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
CREATE TABLE IF NOT EXISTS public.packages (
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
CREATE TABLE IF NOT EXISTS public.tracking_events (
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
CREATE TABLE IF NOT EXISTS public.profiles (
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
CREATE TABLE IF NOT EXISTS public.delivery_routes (
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
CREATE TABLE IF NOT EXISTS public.delivery_vehicles (
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
CREATE TABLE IF NOT EXISTS public.delivery_assignments (
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
CREATE TABLE IF NOT EXISTS public.audit_log (
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
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_active ON public.customers(is_active);
CREATE INDEX IF NOT EXISTS idx_packages_tracking_number ON public.packages(tracking_number);
CREATE INDEX IF NOT EXISTS idx_packages_status ON public.packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_customer_id ON public.packages(customer_id);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON public.packages(created_at);
CREATE INDEX IF NOT EXISTS idx_tracking_events_package_id ON public.tracking_events(package_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_created_at ON public.tracking_events(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_delivery_assignments_package_id ON public.delivery_assignments(package_id);
CREATE INDEX IF NOT EXISTS idx_delivery_assignments_vehicle_id ON public.delivery_assignments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_customers_updated_at ON public.customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_packages_updated_at ON public.packages;
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_delivery_routes_updated_at ON public.delivery_routes;
CREATE TRIGGER update_delivery_routes_updated_at
  BEFORE UPDATE ON public.delivery_routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_delivery_vehicles_updated_at ON public.delivery_vehicles;
CREATE TRIGGER update_delivery_vehicles_updated_at
  BEFORE UPDATE ON public.delivery_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_delivery_assignments_updated_at ON public.delivery_assignments;
CREATE TRIGGER update_delivery_assignments_updated_at
  BEFORE UPDATE ON public.delivery_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate tracking numbers
CREATE OR REPLACE FUNCTION public.generate_tracking_number()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT := 'JET';
  year TEXT := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  month TEXT := LPAD(EXTRACT(MONTH FROM CURRENT_DATE)::TEXT, 2, '0');
  day TEXT := LPAD(EXTRACT(DAY FROM CURRENT_DATE)::TEXT, 2, '0');
  sequence_num INTEGER;
  tracking_number TEXT;
BEGIN
  -- Get the next sequence number for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(tracking_number FROM 12) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.packages
  WHERE tracking_number LIKE prefix || year || month || day || '%';
  
  -- Format: JET20240101001
  tracking_number := prefix || year || month || day || LPAD(sequence_num::TEXT, 3, '0');
  
  RETURN tracking_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to update package status and create tracking event
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
  
  -- Create tracking event
  INSERT INTO public.tracking_events (
    package_id,
    event_type,
    description,
    location
  ) VALUES (
    p_package_id,
    p_status::tracking_event_type,
    COALESCE(p_description, 'Package status updated to ' || p_status),
    COALESCE(p_location, 'Unknown Location')
  );
END;
$$ LANGUAGE plpgsql; 