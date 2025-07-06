-- Swift Trace Hub - Audit Triggers
-- This migration creates audit triggers to log all database changes

-- ============================================================================
-- AUDIT TRIGGER FUNCTIONS
-- ============================================================================

-- Function to log changes to audit_log table
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  user_id UUID;
BEGIN
  -- Get current user ID
  user_id := auth.uid();
  
  -- Convert old and new data to JSONB
  IF TG_OP = 'DELETE' THEN
    old_data := to_jsonb(OLD);
    new_data := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'INSERT' THEN
    old_data := NULL;
    new_data := to_jsonb(NEW);
  END IF;
  
  -- Insert audit log entry
  INSERT INTO public.audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    user_id,
    TG_OP,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    old_data,
    new_data,
    inet_client_addr(),
    current_setting('request.headers', true)::jsonb->>'user-agent'
  );
  
  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- AUDIT TRIGGERS FOR ALL TABLES
-- ============================================================================

-- Customers table audit trigger
DROP TRIGGER IF EXISTS audit_customers_trigger ON public.customers;
CREATE TRIGGER audit_customers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- Packages table audit trigger
DROP TRIGGER IF EXISTS audit_packages_trigger ON public.packages;
CREATE TRIGGER audit_packages_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.packages
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- Tracking events table audit trigger
DROP TRIGGER IF EXISTS audit_tracking_events_trigger ON public.tracking_events;
CREATE TRIGGER audit_tracking_events_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.tracking_events
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- Profiles table audit trigger
DROP TRIGGER IF EXISTS audit_profiles_trigger ON public.profiles;
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- Delivery routes table audit trigger
DROP TRIGGER IF EXISTS audit_delivery_routes_trigger ON public.delivery_routes;
CREATE TRIGGER audit_delivery_routes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.delivery_routes
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- Delivery vehicles table audit trigger
DROP TRIGGER IF EXISTS audit_delivery_vehicles_trigger ON public.delivery_vehicles;
CREATE TRIGGER audit_delivery_vehicles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.delivery_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- Delivery assignments table audit trigger
DROP TRIGGER IF EXISTS audit_delivery_assignments_trigger ON public.delivery_assignments;
CREATE TRIGGER audit_delivery_assignments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.delivery_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- ============================================================================
-- SECURITY FUNCTIONS
-- ============================================================================

-- Function to check if user can access sensitive data
CREATE OR REPLACE FUNCTION public.can_access_sensitive_data()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  description TEXT,
  details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    event_type,
    'security_event',
    gen_random_uuid(),
    NULL,
    jsonb_build_object('description', description, 'details', details),
    inet_client_addr(),
    current_setting('request.headers', true)::jsonb->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- DATA VALIDATION FUNCTIONS
-- ============================================================================

-- Function to validate email format
CREATE OR REPLACE FUNCTION public.validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate phone number format
CREATE OR REPLACE FUNCTION public.validate_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN phone ~* '^\+?[1-9]\d{1,14}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate tracking number format
CREATE OR REPLACE FUNCTION public.validate_tracking_number(tracking_number TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN tracking_number ~* '^JET\d{12}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- DATA CLEANUP FUNCTIONS
-- ============================================================================

-- Function to clean old audit logs (keep last 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.audit_log 
  WHERE created_at < now() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to archive old packages (older than 1 year)
CREATE OR REPLACE FUNCTION public.archive_old_packages()
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  -- Update status to archived for old delivered packages
  UPDATE public.packages 
  SET status = 'archived'
  WHERE status = 'delivered' 
    AND actual_delivery_date < now() - INTERVAL '1 year';
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SCHEDULED TASKS
-- ============================================================================

-- Create a function to run scheduled maintenance
CREATE OR REPLACE FUNCTION public.run_scheduled_maintenance()
RETURNS VOID AS $$
BEGIN
  -- Clean up old audit logs
  PERFORM public.cleanup_old_audit_logs();
  
  -- Archive old packages
  PERFORM public.archive_old_packages();
  
  -- Log maintenance completion
  PERFORM public.log_security_event(
    'maintenance_completed',
    'Scheduled maintenance completed successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Create indexes for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON public.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_action ON public.audit_log(user_id, action);

-- ============================================================================
-- MONITORING FUNCTIONS
-- ============================================================================

-- Function to get system statistics
CREATE OR REPLACE FUNCTION public.get_system_stats()
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_packages', (SELECT COUNT(*) FROM public.packages),
    'active_packages', (SELECT COUNT(*) FROM public.packages WHERE status IN ('pending', 'in_transit', 'out_for_delivery')),
    'delivered_packages', (SELECT COUNT(*) FROM public.packages WHERE status = 'delivered'),
    'total_customers', (SELECT COUNT(*) FROM public.customers),
    'active_customers', (SELECT COUNT(*) FROM public.customers WHERE is_active = true),
    'total_users', (SELECT COUNT(*) FROM public.profiles),
    'active_users', (SELECT COUNT(*) FROM public.profiles WHERE is_active = true),
    'audit_log_entries', (SELECT COUNT(*) FROM public.audit_log WHERE created_at > now() - INTERVAL '24 hours'),
    'system_uptime', extract(epoch from now() - pg_postmaster_start_time())::integer
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION public.get_user_activity_summary(days INTEGER DEFAULT 7)
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  user_role TEXT,
  actions_count BIGINT,
  last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    al.user_id,
    p.email,
    p.role::TEXT,
    COUNT(*) as actions_count,
    MAX(al.created_at) as last_activity
  FROM public.audit_log al
  LEFT JOIN public.profiles p ON al.user_id = p.id
  WHERE al.created_at > now() - (days || ' days')::INTERVAL
    AND al.user_id IS NOT NULL
  GROUP BY al.user_id, p.email, p.role
  ORDER BY actions_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 