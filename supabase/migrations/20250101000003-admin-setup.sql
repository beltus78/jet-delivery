-- Swift Trace Hub - Admin User Setup
-- This migration creates the demo admin user account

-- ============================================================================
-- DEMO ADMIN USER CREATION
-- ============================================================================

-- Create the admin user in auth.users
-- Note: This will be handled by the signup process, but we'll create a placeholder
-- The actual user will be created when they sign up through the UI

-- Insert admin profile (this will be linked when the user signs up)
-- The user should sign up with: admin@jetdelivery.com / admin123

-- Create a function to set up the admin user after they sign up
CREATE OR REPLACE FUNCTION public.setup_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is the admin user, update their role
  IF NEW.email = 'admin@jetdelivery.com' THEN
    UPDATE public.profiles 
    SET 
      role = 'admin',
      first_name = 'Admin',
      last_name = 'User',
      is_active = true
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set up admin user
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.setup_admin_user();

-- ============================================================================
-- DEMO USER ACCOUNTS FOR TESTING
-- ============================================================================

-- Create additional demo users for testing different roles
-- These will be created when users sign up through the UI

-- Manager user: manager@jetdelivery.com / manager123
-- Operator user: operator@jetdelivery.com / operator123
-- Agent user: agent@jetdelivery.com / agent123
-- Viewer user: viewer@jetdelivery.com / viewer123

-- ============================================================================
-- DEMO LOGIN INSTRUCTIONS
-- ============================================================================

-- The following demo accounts can be used for testing:

-- 1. Admin Account (Full Access)
--    Email: admin@jetdelivery.com
--    Password: admin123
--    Role: admin
--    Permissions: All features and settings

-- 2. Manager Account (Management Access)
--    Email: manager@jetdelivery.com
--    Password: manager123
--    Role: manager
--    Permissions: Manage packages, deliveries, and staff

-- 3. Operator Account (Operations Access)
--    Email: operator@jetdelivery.com
--    Password: operator123
--    Role: operator
--    Permissions: Handle packages and update delivery statuses

-- 4. Agent Account (Customer Service Access)
--    Email: agent@jetdelivery.com
--    Password: agent123
--    Role: agent
--    Permissions: Customer service and package registration

-- 5. Viewer Account (Read-Only Access)
--    Email: viewer@jetdelivery.com
--    Password: viewer123
--    Role: viewer
--    Permissions: View-only access to reports and data

-- ============================================================================
-- DEMO TRACKING NUMBERS FOR TESTING
-- ============================================================================

-- The following tracking numbers can be used to test the tracking functionality:

-- 1. In Transit Package: JET20240101001
--    Status: In Transit
--    Route: Dallas → Denver
--    Current Location: Amarillo, TX

-- 2. Delivered Package: JET20240101002
--    Status: Delivered
--    Route: Dallas → Chicago
--    Delivered: January 5, 2024

-- 3. Out for Delivery Package: JET20240101003
--    Status: Out for Delivery
--    Route: Dallas → Miami
--    Current Location: Miami, FL

-- 4. Pending Package: JET20240101004
--    Status: Pending
--    Route: Dallas → Los Angeles
--    Current Location: Dallas, TX

-- 5. Express Package: JET20240101005
--    Status: In Transit
--    Route: Dallas → Seattle
--    Current Location: Boise, ID

-- ============================================================================
-- DEMO CUSTOMER DATA
-- ============================================================================

-- The following customer data is available for testing:

-- 1. John Smith (john.smith@example.com)
--    - Has package JET20240101001 (In Transit)
--    - Location: Denver, CO

-- 2. Emily Johnson (emily.johnson@example.com)
--    - Has package JET20240101002 (Delivered)
--    - Location: Chicago, IL

-- 3. Robert Williams (robert.williams@example.com)
--    - Has package JET20240101003 (Out for Delivery)
--    - Location: Miami, FL

-- 4. Sarah Davis (sarah.davis@example.com)
--    - Has package JET20240101004 (Pending)
--    - Location: Los Angeles, CA

-- 5. Michael Brown (michael.brown@example.com)
--    - Has package JET20240101005 (In Transit)
--    - Location: Seattle, WA

-- ============================================================================
-- SETUP INSTRUCTIONS
-- ============================================================================

-- To set up the demo environment:

-- 1. Run all migrations in order:
--    - 20250101000000-initial-schema.sql
--    - 20250101000001-auth-policies.sql
--    - 20250101000002-demo-data.sql
--    - 20250101000003-admin-setup.sql

-- 2. Sign up with the admin account:
--    - Go to /login
--    - Use email: admin@jetdelivery.com
--    - Use password: admin123
--    - The system will automatically assign admin role

-- 3. Test the tracking functionality:
--    - Go to /track
--    - Enter any of the demo tracking numbers
--    - View tracking details and timeline

-- 4. Test the admin panel:
--    - Go to /admin/dashboard
--    - View package statistics
--    - Manage packages and customers
--    - Test different user roles

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================

-- IMPORTANT: Change these demo passwords in production!

-- The demo passwords are intentionally simple for testing purposes.
-- In a production environment, you should:

-- 1. Use strong, unique passwords
-- 2. Enable two-factor authentication
-- 3. Implement password policies
-- 4. Use environment variables for sensitive data
-- 5. Enable audit logging
-- 6. Regular security reviews

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- If you encounter issues:

-- 1. Check that all migrations ran successfully
-- 2. Verify Supabase connection settings
-- 3. Check browser console for errors
-- 4. Verify environment variables are set
-- 5. Check RLS policies are working correctly
-- 6. Verify user authentication is working

-- For support, check the application logs and Supabase dashboard. 