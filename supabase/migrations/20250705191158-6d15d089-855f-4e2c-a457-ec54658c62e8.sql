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

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create packages table
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  
  -- Package details
  description TEXT,
  weight DECIMAL(10,2),
  dimensions JSONB, -- {length, width, height}
  value DECIMAL(10,2),
  
  -- Origin and destination
  origin_address TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  origin_state TEXT,
  origin_country TEXT NOT NULL,
  origin_postal_code TEXT,
  origin_lat DECIMAL(10,8),
  origin_lng DECIMAL(11,8),
  
  destination_address TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  destination_state TEXT,
  destination_country TEXT NOT NULL,
  destination_postal_code TEXT,
  destination_lat DECIMAL(10,8),
  destination_lng DECIMAL(11,8),
  
  -- Current location
  current_location TEXT,
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(11,8),
  
  -- Status and timing
  status package_status NOT NULL DEFAULT 'pending',
  estimated_delivery_date TIMESTAMP WITH TIME ZONE,
  actual_delivery_date TIMESTAMP WITH TIME ZONE,
  
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
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user authentication
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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