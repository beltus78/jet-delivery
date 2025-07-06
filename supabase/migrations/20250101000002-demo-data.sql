-- Swift Trace Hub - Demo Data
-- This migration inserts demo data for testing and demonstration

-- ============================================================================
-- DEMO ADMIN USER
-- ============================================================================

-- Insert demo admin user (password: admin123)
-- Note: This will be created when the user signs up through the UI
-- For now, we'll create a placeholder that will be updated when the user signs up

-- ============================================================================
-- DEMO CUSTOMERS
-- ============================================================================

INSERT INTO public.customers (first_name, last_name, email, phone, address, city, state, postal_code, country, company) VALUES
('John', 'Smith', 'john.smith@example.com', '(303) 555-1234', '1234 Main St', 'Denver', 'CO', '80202', 'United States', 'Tech Solutions Inc'),
('Emily', 'Johnson', 'emily.johnson@example.com', '(312) 555-5678', '5678 Oak Ave', 'Chicago', 'IL', '60601', 'United States', 'Marketing Pro'),
('Robert', 'Williams', 'robert.williams@example.com', '(305) 555-9012', '9012 Beach Blvd', 'Miami', 'FL', '33101', 'United States', 'Sunshine Corp'),
('Sarah', 'Davis', 'sarah.davis@example.com', '(213) 555-3456', '3456 Sunset Dr', 'Los Angeles', 'CA', '90210', 'United States', 'Creative Studios'),
('Michael', 'Brown', 'michael.brown@example.com', '(206) 555-7890', '7890 Rainier Ave', 'Seattle', 'WA', '98101', 'United States', 'Pacific Northwest Co'),
('Lisa', 'Wilson', 'lisa.wilson@example.com', '(512) 555-2345', '2345 Congress Ave', 'Austin', 'TX', '73301', 'United States', 'Texas Tech'),
('David', 'Miller', 'david.miller@example.com', '(404) 555-6789', '6789 Peachtree St', 'Atlanta', 'GA', '30301', 'United States', 'Southern Solutions'),
('Jennifer', 'Taylor', 'jennifer.taylor@example.com', '(617) 555-0123', '0123 Beacon St', 'Boston', 'MA', '02101', 'United States', 'New England Partners'),
('Christopher', 'Anderson', 'christopher.anderson@example.com', '(702) 555-4567', '4567 Las Vegas Blvd', 'Las Vegas', 'NV', '89101', 'United States', 'Desert Ventures'),
('Amanda', 'Thomas', 'amanda.thomas@example.com', '(602) 555-8901', '8901 Camelback Rd', 'Phoenix', 'AZ', '85001', 'United States', 'Arizona Innovations');

-- ============================================================================
-- DEMO PACKAGES
-- ============================================================================

INSERT INTO public.packages (
  tracking_number, customer_id, description, weight, dimensions, value,
  origin_address, origin_city, origin_state, origin_country, origin_postal_code, origin_lat, origin_lng,
  destination_address, destination_city, destination_state, destination_country, destination_postal_code, destination_lat, destination_lng,
  current_location, current_lat, current_lng, status, priority, estimated_delivery_date, service_type
) VALUES
-- Package 1: In Transit
('JET20240101001', (SELECT id FROM public.customers WHERE email = 'john.smith@example.com'),
 'Electronics package - Laptop and accessories', 5.5, '{"length": 20, "width": 15, "height": 8}',
 1200.00, '16000 Dallas Pkwy # 400', 'Dallas', 'TX', 'United States', '75248', 32.9481, -96.7591,
 '1234 Main St', 'Denver', 'CO', 'United States', '80202', 39.7392, -104.9903,
 'Amarillo, TX', 35.2219, -101.8313, 'in_transit', 'express', '2024-01-08 15:00:00+00', 'Express Delivery'),

-- Package 2: Delivered
('JET20240101002', (SELECT id FROM public.customers WHERE email = 'emily.johnson@example.com'),
 'Marketing materials - Brochures and samples', 2.3, '{"length": 12, "width": 9, "height": 3}',
 150.00, '16000 Dallas Pkwy # 400', 'Dallas', 'TX', 'United States', '75248', 32.9481, -96.7591,
 '5678 Oak Ave', 'Chicago', 'IL', 'United States', '60601', 41.8781, -87.6298,
 'Chicago, IL', 41.8781, -87.6298, 'delivered', 'standard', '2024-01-05 14:30:00+00', 'Standard Shipping'),

-- Package 3: Out for Delivery
('JET20240101003', (SELECT id FROM public.customers WHERE email = 'robert.williams@example.com'),
 'Beach equipment - Umbrellas and chairs', 8.7, '{"length": 30, "width": 25, "height": 12}',
 450.00, '16000 Dallas Pkwy # 400', 'Dallas', 'TX', 'United States', '75248', 32.9481, -96.7591,
 '9012 Beach Blvd', 'Miami', 'FL', 'United States', '33101', 25.7617, -80.1918,
 'Miami, FL', 25.7617, -80.1918, 'out_for_delivery', 'standard', '2024-01-07 16:00:00+00', 'Standard Shipping'),

-- Package 4: Pending
('JET20240101004', (SELECT id FROM public.customers WHERE email = 'sarah.davis@example.com'),
 'Art supplies - Canvas and paints', 3.2, '{"length": 18, "width": 14, "height": 6}',
 280.00, '16000 Dallas Pkwy # 400', 'Dallas', 'TX', 'United States', '75248', 32.9481, -96.7591,
 '3456 Sunset Dr', 'Los Angeles', 'CA', 'United States', '90210', 34.0522, -118.2437,
 'Dallas, TX', 32.9481, -96.7591, 'pending', 'standard', '2024-01-10 17:00:00+00', 'Standard Shipping'),

-- Package 5: In Transit
('JET20240101005', (SELECT id FROM public.customers WHERE email = 'michael.brown@example.com'),
 'Coffee beans - Premium blend', 4.1, '{"length": 16, "width": 12, "height": 8}',
 180.00, '16000 Dallas Pkwy # 400', 'Dallas', 'TX', 'United States', '75248', 32.9481, -96.7591,
 '7890 Rainier Ave', 'Seattle', 'WA', 'United States', '98101', 47.6062, -122.3321,
 'Boise, ID', 43.6150, -116.2023, 'in_transit', 'express', '2024-01-09 18:00:00+00', 'Express Delivery'),

-- Package 6: Delivered
('JET20240101006', (SELECT id FROM public.customers WHERE email = 'lisa.wilson@example.com'),
 'Software licenses - Digital delivery', 0.5, '{"length": 8, "width": 6, "height": 1}',
 2500.00, '16000 Dallas Pkwy # 400', 'Dallas', 'TX', 'United States', '75248', 32.9481, -96.7591,
 '2345 Congress Ave', 'Austin', 'TX', 'United States', '73301', 30.2672, -97.7431,
 'Austin, TX', 30.2672, -97.7431, 'delivered', 'express', '2024-01-04 12:00:00+00', 'Express Delivery'),

-- Package 7: Pending
('JET20240101007', (SELECT id FROM public.customers WHERE email = 'david.miller@example.com'),
 'Office furniture - Desk and chair', 25.0, '{"length": 60, "width": 30, "height": 30}',
 850.00, '16000 Dallas Pkwy # 400', 'Dallas', 'TX', 'United States', '75248', 32.9481, -96.7591,
 '6789 Peachtree St', 'Atlanta', 'GA', 'United States', '30301', 33.7490, -84.3880,
 'Dallas, TX', 32.9481, -96.7591, 'pending', 'standard', '2024-01-12 19:00:00+00', 'Standard Shipping'),

-- Package 8: In Transit
('JET20240101008', (SELECT id FROM public.customers WHERE email = 'jennifer.taylor@example.com'),
 'Books - Technical manuals', 6.8, '{"length": 22, "width": 18, "height": 10}',
 320.00, '16000 Dallas Pkwy # 400', 'Dallas', 'TX', 'United States', '75248', 32.9481, -96.7591,
 '0123 Beacon St', 'Boston', 'MA', 'United States', '02101', 42.3601, -71.0589,
 'New York, NY', 40.7128, -74.0060, 'in_transit', 'standard', '2024-01-11 20:00:00+00', 'Standard Shipping'),

-- Package 9: Out for Delivery
('JET20240101009', (SELECT id FROM public.customers WHERE email = 'christopher.anderson@example.com'),
 'Casino equipment - Gaming chips', 1.2, '{"length": 10, "width": 8, "height": 4}',
 1500.00, '16000 Dallas Pkwy # 400', 'Dallas', 'TX', 'United States', '75248', 32.9481, -96.7591,
 '4567 Las Vegas Blvd', 'Las Vegas', 'NV', 'United States', '89101', 36.1699, -115.1398,
 'Las Vegas, NV', 36.1699, -115.1398, 'out_for_delivery', 'express', '2024-01-06 21:00:00+00', 'Express Delivery'),

-- Package 10: Delivered
('JET20240101010', (SELECT id FROM public.customers WHERE email = 'amanda.thomas@example.com'),
 'Solar panels - Residential installation', 45.0, '{"length": 80, "width": 40, "height": 15}',
 3500.00, '16000 Dallas Pkwy # 400', 'Dallas', 'TX', 'United States', '75248', 32.9481, -96.7591,
 '8901 Camelback Rd', 'Phoenix', 'AZ', 'United States', '85001', 33.4484, -112.0740,
 'Phoenix, AZ', 33.4484, -112.0740, 'delivered', 'express', '2024-01-03 22:00:00+00', 'Express Delivery');

-- ============================================================================
-- DEMO TRACKING EVENTS
-- ============================================================================

-- Package 1: In Transit Events
INSERT INTO public.tracking_events (package_id, event_type, description, location, lat, lng) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101001'), 'created', 'Package created and received at Dallas facility', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101001'), 'picked_up', 'Package picked up by driver', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101001'), 'in_transit', 'Package in transit to next facility', 'Amarillo, TX', 35.2219, -101.8313);

-- Package 2: Delivered Events
INSERT INTO public.tracking_events (package_id, event_type, description, location, lat, lng) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101002'), 'created', 'Package created and received at Dallas facility', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101002'), 'picked_up', 'Package picked up by driver', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101002'), 'in_transit', 'Package in transit to Chicago', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101002'), 'arrived_at_facility', 'Package arrived at Chicago facility', 'Chicago, IL', 41.8781, -87.6298),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101002'), 'out_for_delivery', 'Package out for delivery', 'Chicago, IL', 41.8781, -87.6298),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101002'), 'delivered', 'Package delivered successfully. Signed by: Emily Johnson', 'Chicago, IL', 41.8781, -87.6298);

-- Package 3: Out for Delivery Events
INSERT INTO public.tracking_events (package_id, event_type, description, location, lat, lng) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101003'), 'created', 'Package created and received at Dallas facility', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101003'), 'picked_up', 'Package picked up by driver', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101003'), 'in_transit', 'Package in transit to Miami', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101003'), 'arrived_at_facility', 'Package arrived at Miami facility', 'Miami, FL', 25.7617, -80.1918),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101003'), 'out_for_delivery', 'Package out for delivery', 'Miami, FL', 25.7617, -80.1918);

-- Package 4: Pending Events
INSERT INTO public.tracking_events (package_id, event_type, description, location, lat, lng) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101004'), 'created', 'Package created and received at Dallas facility', 'Dallas, TX', 32.9481, -96.7591);

-- Package 5: In Transit Events
INSERT INTO public.tracking_events (package_id, event_type, description, location, lat, lng) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101005'), 'created', 'Package created and received at Dallas facility', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101005'), 'picked_up', 'Package picked up by driver', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101005'), 'in_transit', 'Package in transit to Seattle', 'Boise, ID', 43.6150, -116.2023);

-- Package 6: Delivered Events
INSERT INTO public.tracking_events (package_id, event_type, description, location, lat, lng) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101006'), 'created', 'Package created and received at Dallas facility', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101006'), 'picked_up', 'Package picked up by driver', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101006'), 'in_transit', 'Package in transit to Austin', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101006'), 'arrived_at_facility', 'Package arrived at Austin facility', 'Austin, TX', 30.2672, -97.7431),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101006'), 'out_for_delivery', 'Package out for delivery', 'Austin, TX', 30.2672, -97.7431),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101006'), 'delivered', 'Package delivered successfully. Signed by: Lisa Wilson', 'Austin, TX', 30.2672, -97.7431);

-- Package 7: Pending Events
INSERT INTO public.tracking_events (package_id, event_type, description, location, lat, lng) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101007'), 'created', 'Package created and received at Dallas facility', 'Dallas, TX', 32.9481, -96.7591);

-- Package 8: In Transit Events
INSERT INTO public.tracking_events (package_id, event_type, description, location, lat, lng) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101008'), 'created', 'Package created and received at Dallas facility', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101008'), 'picked_up', 'Package picked up by driver', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101008'), 'in_transit', 'Package in transit to Boston', 'New York, NY', 40.7128, -74.0060);

-- Package 9: Out for Delivery Events
INSERT INTO public.tracking_events (package_id, event_type, description, location, lat, lng) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101009'), 'created', 'Package created and received at Dallas facility', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101009'), 'picked_up', 'Package picked up by driver', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101009'), 'in_transit', 'Package in transit to Las Vegas', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101009'), 'arrived_at_facility', 'Package arrived at Las Vegas facility', 'Las Vegas, NV', 36.1699, -115.1398),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101009'), 'out_for_delivery', 'Package out for delivery', 'Las Vegas, NV', 36.1699, -115.1398);

-- Package 10: Delivered Events
INSERT INTO public.tracking_events (package_id, event_type, description, location, lat, lng) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101010'), 'created', 'Package created and received at Dallas facility', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101010'), 'picked_up', 'Package picked up by driver', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101010'), 'in_transit', 'Package in transit to Phoenix', 'Dallas, TX', 32.9481, -96.7591),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101010'), 'arrived_at_facility', 'Package arrived at Phoenix facility', 'Phoenix, AZ', 33.4484, -112.0740),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101010'), 'out_for_delivery', 'Package out for delivery', 'Phoenix, AZ', 33.4484, -112.0740),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101010'), 'delivered', 'Package delivered successfully. Signed by: Amanda Thomas', 'Phoenix, AZ', 33.4484, -112.0740);

-- ============================================================================
-- DEMO DELIVERY ROUTES
-- ============================================================================

INSERT INTO public.delivery_routes (name, description, origin_city, destination_city, estimated_duration_hours, distance_miles) VALUES
('Dallas to Denver Express', 'Express route from Dallas to Denver via Amarillo', 'Dallas', 'Denver', 24, 850),
('Dallas to Chicago Standard', 'Standard route from Dallas to Chicago', 'Dallas', 'Chicago', 48, 925),
('Dallas to Miami Coastal', 'Coastal route from Dallas to Miami', 'Dallas', 'Miami', 72, 1350),
('Dallas to Los Angeles Western', 'Western route from Dallas to Los Angeles', 'Dallas', 'Los Angeles', 60, 1435),
('Dallas to Seattle Pacific', 'Pacific route from Dallas to Seattle', 'Dallas', 'Seattle', 84, 2075),
('Dallas to Austin Local', 'Local route from Dallas to Austin', 'Dallas', 'Austin', 6, 195),
('Dallas to Atlanta Southern', 'Southern route from Dallas to Atlanta', 'Dallas', 'Atlanta', 48, 785),
('Dallas to Boston Northeast', 'Northeast route from Dallas to Boston', 'Dallas', 'Boston', 72, 1750),
('Dallas to Las Vegas Desert', 'Desert route from Dallas to Las Vegas', 'Dallas', 'Las Vegas', 48, 1225),
('Dallas to Phoenix Southwest', 'Southwest route from Dallas to Phoenix', 'Dallas', 'Phoenix', 36, 1065);

-- ============================================================================
-- DEMO DELIVERY VEHICLES
-- ============================================================================

INSERT INTO public.delivery_vehicles (vehicle_number, vehicle_type, capacity_weight, capacity_volume, driver_name, driver_phone, current_location, current_lat, current_lng) VALUES
('VD001', 'Delivery Van', 2000.00, 500.00, 'Mike Johnson', '(214) 555-1001', 'Dallas, TX', 32.9481, -96.7591),
('VD002', 'Delivery Van', 2000.00, 500.00, 'Sarah Wilson', '(214) 555-1002', 'Amarillo, TX', 35.2219, -101.8313),
('VD003', 'Delivery Van', 2000.00, 500.00, 'David Brown', '(214) 555-1003', 'Chicago, IL', 41.8781, -87.6298),
('VD004', 'Delivery Van', 2000.00, 500.00, 'Lisa Davis', '(214) 555-1004', 'Miami, FL', 25.7617, -80.1918),
('VD005', 'Delivery Van', 2000.00, 500.00, 'Robert Miller', '(214) 555-1005', 'Los Angeles, CA', 34.0522, -118.2437),
('VT001', 'Truck', 10000.00, 2000.00, 'James Taylor', '(214) 555-1006', 'Boise, ID', 43.6150, -116.2023),
('VT002', 'Truck', 10000.00, 2000.00, 'Jennifer Anderson', '(214) 555-1007', 'Austin, TX', 30.2672, -97.7431),
('VT003', 'Truck', 10000.00, 2000.00, 'Christopher Thomas', '(214) 555-1008', 'Atlanta, GA', 33.7490, -84.3880),
('VT004', 'Truck', 10000.00, 2000.00, 'Amanda Garcia', '(214) 555-1009', 'New York, NY', 40.7128, -74.0060),
('VT005', 'Truck', 10000.00, 2000.00, 'Michael Rodriguez', '(214) 555-1010', 'Las Vegas, NV', 36.1699, -115.1398);

-- ============================================================================
-- DEMO DELIVERY ASSIGNMENTS
-- ============================================================================

INSERT INTO public.delivery_assignments (package_id, vehicle_id, estimated_pickup_time, estimated_delivery_time, status) VALUES
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101001'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'VD001'), '2024-01-01 08:00:00+00', '2024-01-08 15:00:00+00', 'in_progress'),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101002'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'VD002'), '2024-01-01 09:00:00+00', '2024-01-05 14:30:00+00', 'completed'),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101003'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'VD003'), '2024-01-01 10:00:00+00', '2024-01-07 16:00:00+00', 'out_for_delivery'),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101004'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'VD004'), '2024-01-02 08:00:00+00', '2024-01-10 17:00:00+00', 'assigned'),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101005'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'VT001'), '2024-01-01 11:00:00+00', '2024-01-09 18:00:00+00', 'in_progress'),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101006'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'VD005'), '2024-01-01 12:00:00+00', '2024-01-04 12:00:00+00', 'completed'),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101007'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'VT002'), '2024-01-02 09:00:00+00', '2024-01-12 19:00:00+00', 'assigned'),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101008'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'VT003'), '2024-01-01 13:00:00+00', '2024-01-11 20:00:00+00', 'in_progress'),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101009'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'VT004'), '2024-01-01 14:00:00+00', '2024-01-06 21:00:00+00', 'out_for_delivery'),
((SELECT id FROM public.packages WHERE tracking_number = 'JET20240101010'), (SELECT id FROM public.delivery_vehicles WHERE vehicle_number = 'VT005'), '2024-01-01 15:00:00+00', '2024-01-03 22:00:00+00', 'completed'); 