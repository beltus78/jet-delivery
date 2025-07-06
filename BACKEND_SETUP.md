# Backend Setup Guide - Swift Trace Hub

## Overview

This document outlines the backend architecture and setup for the Swift Trace Hub application. The backend is built using **Supabase** as the primary database and authentication service.

## Architecture

### Technology Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Supabase REST API + Row Level Security (RLS)
- **Real-time**: Supabase Realtime (for live updates)
- **Storage**: Supabase Storage (for file uploads)

### Database Schema

#### Tables

1. **customers** - Customer information
2. **packages** - Package tracking data
3. **tracking_events** - Package tracking history
4. **profiles** - User authentication profiles

#### Relationships
- `packages.customer_id` → `customers.id`
- `tracking_events.package_id` → `packages.id`
- `profiles.id` → `auth.users.id`

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Application Configuration
VITE_APP_NAME=Swift Trace Hub
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3000/api

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

### Supabase Setup

1. **Create Supabase Project**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Create new project
   supabase projects create swift-trace-hub
   ```

2. **Get Project Credentials**
   - Go to your Supabase dashboard
   - Navigate to Settings → API
   - Copy the URL and anon key

3. **Run Migrations**
   ```bash
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Run migrations
   supabase db push
   ```

## Service Layer

### Authentication Service (`src/services/authService.ts`)

Handles user authentication and authorization:

```typescript
// Key methods:
- signIn(email, password)
- signUp(email, password, userData)
- signOut()
- getCurrentUser()
- resetPassword(email)
- updatePassword(newPassword)
```

### Package Service (`src/services/packageService.ts`)

Manages package tracking and delivery:

```typescript
// Key methods:
- getPackages(filters)
- getPackageById(id)
- getPackageByTrackingNumber(trackingNumber)
- createPackage(packageData)
- updatePackage(id, updates)
- updatePackageStatus(id, status, location)
- deletePackage(id)
- createTrackingEvent(eventData)
- getTrackingEvents(packageId)
- searchPackages(searchTerm)
- getPackageStats()
```

### Customer Service (`src/services/customerService.ts`)

Handles customer management:

```typescript
// Key methods:
- getCustomers(filters)
- getCustomerById(id)
- getCustomerByEmail(email)
- createCustomer(customerData)
- updateCustomer(id, updates)
- deleteCustomer(id)
- searchCustomers(searchTerm)
- getCustomerStats()
- bulkImportCustomers(customers)
- exportCustomers()
```

### Tracking Service (`src/services/trackingService.ts`)

Provides tracking functionality with fallback to mock data:

```typescript
// Key methods:
- getTrackingDetails(trackingNumber)
- getTrackingEvents(trackingNumber)
- getTrackingMapData(trackingNumber)
```

## Error Handling

### Centralized Error Handler (`src/utils/errorHandler.ts`)

Provides consistent error handling across the application:

```typescript
// Features:
- Supabase error mapping
- Network error detection
- Authentication error handling
- Validation error processing
- Retry mechanism for network requests
```

### Error Types

- **NOT_FOUND**: Record not found (404)
- **DUPLICATE_ENTRY**: Unique constraint violation (409)
- **FOREIGN_KEY_VIOLATION**: Referenced record missing (400)
- **AUTH_ERROR**: Authentication failed (401)
- **VALIDATION_ERROR**: Invalid input data (400)
- **NETWORK_ERROR**: Connection issues (0)
- **UNKNOWN_ERROR**: Unexpected errors (500)

## Security

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

```sql
-- Example: Packages table
CREATE POLICY "Users can view all packages" 
ON public.packages FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create packages" 
ON public.packages FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);
```

### Authentication Flow

1. User signs in with email/password
2. Supabase validates credentials
3. JWT token is stored in localStorage
4. Token is automatically included in API requests
5. RLS policies enforce access control

## Data Validation

### Input Validation

All service methods include validation:

```typescript
// Example: Customer creation
static async createCustomer(customerData: CustomerInsert): Promise<Customer> {
  // Check if customer with email already exists
  const existingCustomer = await this.getCustomerByEmail(customerData.email);
  if (existingCustomer) {
    throw new Error('Customer with this email already exists');
  }
  // ... rest of method
}
```

### Type Safety

Full TypeScript integration with generated types from Supabase:

```typescript
import type { Database } from '@/integrations/supabase/types';

type Package = Database['public']['Tables']['packages']['Row'];
type PackageInsert = Database['public']['Tables']['packages']['Insert'];
```

## Development vs Production

### Development Mode
- Uses mock data as fallback
- Detailed error logging
- Debug mode enabled
- Local development database

### Production Mode
- Real Supabase database
- Error reporting to monitoring service
- Optimized performance
- Production database with backups

## API Endpoints

### Authentication
- `POST /auth/signin` - User login
- `POST /auth/signup` - User registration
- `POST /auth/signout` - User logout
- `POST /auth/reset-password` - Password reset

### Packages
- `GET /packages` - List packages
- `GET /packages/:id` - Get package details
- `POST /packages` - Create package
- `PUT /packages/:id` - Update package
- `DELETE /packages/:id` - Delete package
- `GET /packages/track/:trackingNumber` - Track package

### Customers
- `GET /customers` - List customers
- `GET /customers/:id` - Get customer details
- `POST /customers` - Create customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Tracking Events
- `GET /tracking-events/:packageId` - Get package events
- `POST /tracking-events` - Create tracking event

## Monitoring and Logging

### Error Tracking
- Console logging for development
- Structured error objects
- Error context preservation
- Retry mechanism for transient failures

### Performance Monitoring
- API response time tracking
- Database query optimization
- Network request monitoring
- User interaction analytics

## Deployment

### Environment Setup
1. Set up Supabase project
2. Configure environment variables
3. Run database migrations
4. Set up monitoring and logging
5. Configure domain and SSL

### CI/CD Pipeline
1. Run tests
2. Build application
3. Deploy to hosting platform
4. Run post-deployment checks
5. Monitor application health

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check Supabase credentials
   - Verify RLS policies
   - Check token expiration

2. **Database Connection Issues**
   - Verify Supabase URL
   - Check network connectivity
   - Validate API keys

3. **Type Errors**
   - Regenerate Supabase types
   - Check TypeScript configuration
   - Verify import paths

### Debug Mode

Enable debug mode in development:

```env
VITE_ENABLE_DEBUG_MODE=true
```

This will provide additional logging and error details.

## Security Best Practices

1. **Never expose service role keys in client code**
2. **Use RLS policies for data access control**
3. **Validate all user inputs**
4. **Implement proper error handling**
5. **Use HTTPS in production**
6. **Regular security audits**
7. **Keep dependencies updated**

## Performance Optimization

1. **Use database indexes for frequently queried fields**
2. **Implement pagination for large datasets**
3. **Cache frequently accessed data**
4. **Optimize database queries**
5. **Use connection pooling**
6. **Implement request debouncing**

## Backup and Recovery

1. **Regular database backups**
2. **Test recovery procedures**
3. **Monitor backup success**
4. **Document recovery steps**
5. **Version control for schema changes** 