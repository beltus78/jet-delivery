# Database Setup Guide - Swift Trace Hub

## Overview

This guide provides step-by-step instructions for setting up the complete database backend for the Swift Trace Hub application using Supabase.

## Prerequisites

- Supabase account
- Supabase CLI installed
- Node.js and npm installed
- Git repository cloned

## Quick Setup

### 1. Create Supabase Project

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Create new project
supabase projects create swift-trace-hub

# Note down the project reference ID
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Application Configuration
VITE_APP_NAME=Jet Delivery
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3000/api

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

### 3. Link Project and Run Migrations

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Run all migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --project-id your-project-ref > src/integrations/supabase/types.ts
```

## Migration Files Overview

The database setup consists of 4 migration files that must be run in order:

### 1. `20250101000000-initial-schema.sql`
- Creates all database tables
- Sets up indexes and constraints
- Creates utility functions
- Establishes data relationships

**Tables Created:**
- `customers` - Customer information
- `packages` - Package tracking data
- `tracking_events` - Package tracking history
- `profiles` - User authentication profiles
- `delivery_routes` - Delivery route information
- `delivery_vehicles` - Vehicle management
- `delivery_assignments` - Package-vehicle assignments
- `audit_log` - Security audit trail

### 2. `20250101000001-auth-policies.sql`
- Enables Row Level Security (RLS)
- Creates comprehensive access control policies
- Implements role-based permissions
- Provides security helper functions

**Security Features:**
- Role-based access control
- Data isolation by user role
- Secure API endpoints
- Audit trail protection

### 3. `20250101000002-demo-data.sql`
- Inserts comprehensive demo data
- Creates test customers and packages
- Sets up tracking events
- Provides delivery routes and vehicles

**Demo Data Includes:**
- 10 customers with complete information
- 10 packages in various states
- Complete tracking event history
- Delivery routes and vehicle assignments

### 4. `20250101000003-admin-setup.sql`
- Sets up demo admin user
- Creates role assignment triggers
- Provides login instructions
- Includes troubleshooting guide

### 5. `20250101000004-audit-triggers.sql`
- Creates audit logging system
- Implements data validation
- Sets up monitoring functions
- Provides maintenance utilities

## Demo Accounts

After running the migrations, you can use these demo accounts:

### Admin Account (Full Access)
- **Email:** admin@jetdelivery.com
- **Password:** admin123
- **Role:** admin
- **Permissions:** All features and settings

### Manager Account (Management Access)
- **Email:** manager@jetdelivery.com
- **Password:** manager123
- **Role:** manager
- **Permissions:** Manage packages, deliveries, and staff

### Operator Account (Operations Access)
- **Email:** operator@jetdelivery.com
- **Password:** operator123
- **Role:** operator
- **Permissions:** Handle packages and update delivery statuses

### Agent Account (Customer Service Access)
- **Email:** agent@jetdelivery.com
- **Password:** agent123
- **Role:** agent
- **Permissions:** Customer service and package registration

### Viewer Account (Read-Only Access)
- **Email:** viewer@jetdelivery.com
- **Password:** viewer123
- **Role:** viewer
- **Permissions:** View-only access to reports and data

## Demo Tracking Numbers

Use these tracking numbers to test the tracking functionality:

### In Transit Packages
- **JET20240101001** - Dallas → Denver (Current: Amarillo, TX)
- **JET20240101005** - Dallas → Seattle (Current: Boise, ID)
- **JET20240101008** - Dallas → Boston (Current: New York, NY)

### Delivered Packages
- **JET20240101002** - Dallas → Chicago (Delivered: Jan 5, 2024)
- **JET20240101006** - Dallas → Austin (Delivered: Jan 4, 2024)
- **JET20240101010** - Dallas → Phoenix (Delivered: Jan 3, 2024)

### Out for Delivery Packages
- **JET20240101003** - Dallas → Miami (Current: Miami, FL)
- **JET20240101009** - Dallas → Las Vegas (Current: Las Vegas, NV)

### Pending Packages
- **JET20240101004** - Dallas → Los Angeles (Current: Dallas, TX)
- **JET20240101007** - Dallas → Atlanta (Current: Dallas, TX)

## Database Schema

### Core Tables

#### customers
```sql
- id (UUID, Primary Key)
- first_name (TEXT, Required)
- last_name (TEXT, Required)
- email (TEXT, Unique, Required)
- phone (TEXT)
- address, city, state, postal_code, country
- company, notes
- is_active (BOOLEAN, Default: true)
- created_at, updated_at (Timestamps)
```

#### packages
```sql
- id (UUID, Primary Key)
- tracking_number (TEXT, Unique, Required)
- customer_id (UUID, Foreign Key)
- description, weight, dimensions (JSONB)
- value, package_type, signature_required
- origin_address, origin_city, origin_state, origin_country
- destination_address, destination_city, destination_state, destination_country
- current_location, current_lat, current_lng
- status (ENUM: pending, picked_up, in_transit, out_for_delivery, delivered, cancelled, returned)
- priority, estimated_delivery_date, actual_delivery_date
- service_type, carrier, insurance_amount
- created_at, updated_at (Timestamps)
```

#### tracking_events
```sql
- id (UUID, Primary Key)
- package_id (UUID, Foreign Key, Required)
- event_type (ENUM: created, picked_up, in_transit, arrived_at_facility, departed_facility, out_for_delivery, delivery_attempted, delivered, exception, cancelled, returned)
- description (TEXT, Required)
- location, lat, lng
- status_details, exception_reason, signed_by
- delivery_attempts (INTEGER, Default: 0)
- created_at (Timestamp)
```

#### profiles
```sql
- id (UUID, Primary Key, References auth.users)
- email, first_name, last_name
- role (ENUM: admin, manager, operator, agent, viewer)
- phone, avatar_url
- is_active (BOOLEAN, Default: true)
- last_login, preferences (JSONB)
- created_at, updated_at (Timestamps)
```

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with role-based policies:

- **Admin:** Full access to all data
- **Manager:** Can manage packages, customers, and staff
- **Operator:** Can handle packages and update statuses
- **Agent:** Can manage customers and create packages
- **Viewer:** Read-only access to reports and data

### Authentication
- JWT-based authentication via Supabase Auth
- Automatic session management
- Password reset functionality
- Role-based access control

### Audit Logging
- All database changes are logged
- User activity tracking
- Security event monitoring
- Compliance reporting

## Testing the Setup

### 1. Test Authentication
```bash
# Start the development server
npm run dev

# Go to /login
# Use admin@jetdelivery.com / admin123
# Should redirect to /admin/dashboard
```

### 2. Test Package Tracking
```bash
# Go to /track
# Enter tracking number: JET20240101001
# Should show tracking details and timeline
```

### 3. Test Admin Panel
```bash
# Go to /admin/dashboard
# Should show package statistics
# Test different admin features
```

### 4. Test Different User Roles
```bash
# Sign up with different demo accounts
# Test role-based permissions
# Verify access restrictions
```

## Troubleshooting

### Common Issues

#### 1. Migration Errors
```bash
# Check Supabase connection
supabase status

# Reset database (WARNING: This will delete all data)
supabase db reset

# Run migrations again
supabase db push
```

#### 2. Authentication Issues
- Verify environment variables are set correctly
- Check Supabase project settings
- Ensure RLS policies are working
- Verify user roles are assigned correctly

#### 3. Type Generation Issues
```bash
# Regenerate types
supabase gen types typescript --project-id your-project-ref > src/integrations/supabase/types.ts

# Restart development server
npm run dev
```

#### 4. Permission Errors
- Check user role assignments
- Verify RLS policies
- Ensure proper authentication
- Check audit logs for details

### Debug Mode

Enable debug mode in your `.env` file:
```env
VITE_ENABLE_DEBUG_MODE=true
```

This will provide additional logging and error details.

## Production Deployment

### 1. Environment Setup
```bash
# Set production environment variables
# Use production Supabase project
# Configure custom domain
# Set up SSL certificates
```

### 2. Security Hardening
```bash
# Change all demo passwords
# Enable two-factor authentication
# Set up monitoring and alerting
# Configure backup schedules
```

### 3. Performance Optimization
```bash
# Monitor database performance
# Optimize queries and indexes
# Set up connection pooling
# Configure caching strategies
```

## Maintenance

### Regular Tasks
- Monitor audit logs
- Clean up old data
- Update security policies
- Backup database
- Review user permissions

### Automated Maintenance
The system includes automated functions for:
- Cleaning old audit logs (90 days)
- Archiving old packages (1 year)
- System statistics monitoring
- User activity tracking

## Support

For additional support:
1. Check the application logs
2. Review Supabase dashboard
3. Consult the audit logs
4. Verify environment configuration
5. Test with demo accounts

## Security Notes

⚠️ **IMPORTANT:** The demo passwords are intentionally simple for testing. In production:

1. Use strong, unique passwords
2. Enable two-factor authentication
3. Implement password policies
4. Use environment variables for sensitive data
5. Enable audit logging
6. Regular security reviews
7. Monitor for suspicious activity 