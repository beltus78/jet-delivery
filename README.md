# Swift Trace Hub - Enhanced Admin Dashboard

A modern, secure package tracking and delivery management system built with React, TypeScript, and Supabase.

## 🚀 Features

### ✨ **Simplified Shipment Management**
- **One-Click Package Creation**: Streamlined form for adding new shipments
- **Quick Status Updates**: Instant status changes with automatic tracking event creation
- **Real-Time Dashboard**: Live statistics and recent activity overview
- **Smart Search & Filtering**: Find packages by tracking number, customer, or status

### 🔒 **Enhanced Security**
- **Role-Based Access Control (RBAC)**: Admin, Manager, Operator, Agent, Viewer roles
- **Row Level Security (RLS)**: Database-level security policies
- **Audit Logging**: Complete tracking of all system changes
- **Secure Authentication**: Supabase Auth with session management
- **Input Validation**: Server-side and client-side validation

### 📊 **Comprehensive Tracking**
- **Real-Time Status Updates**: Live package status tracking
- **Detailed Event History**: Complete timeline of package journey
- **Location Tracking**: Origin, destination, and current location mapping
- **Delivery Estimates**: Smart ETA calculations based on priority

### 🎯 **User Experience**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Intuitive Interface**: Clean, modern UI with shadcn/ui components
- **Quick Actions**: One-click operations for common tasks
- **Bulk Operations**: Manage multiple packages efficiently

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Context + Hooks
- **Routing**: React Router v6
- **Notifications**: Sonner
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Docker (for local development)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd swift-trace-hub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the database migrations:
```bash
npx supabase db reset
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🔐 Authentication & Security

### Demo Accounts
- **Admin**: `admin@swifttracehub.com` / `admin123`
- **Manager**: `manager@swifttracehub.com` / `manager123`
- **Operator**: `operator@swifttracehub.com` / `operator123`

### Role Permissions

| Role | Create Packages | Edit Packages | Delete Packages | Manage Users | View Reports | System Settings |
|------|----------------|---------------|-----------------|--------------|--------------|-----------------|
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manager | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Operator | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Agent | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Viewer | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 📦 Package Management

### Creating a New Shipment
1. Navigate to **Packages** → **New Shipment**
2. Fill in customer information (or select existing customer)
3. Enter package details (description, weight, type)
4. Set origin and destination addresses
5. Choose service type and priority
6. Click **Create Shipment**

### Updating Package Status
1. Go to package details page
2. Use **Quick Status Update** buttons
3. Status changes automatically create tracking events
4. Real-time updates across the system

### Tracking Events
- **Created**: Package received and registered
- **Picked Up**: Package collected from sender
- **In Transit**: Package moving between facilities
- **Out for Delivery**: Package with delivery driver
- **Delivered**: Package successfully delivered

## 🗄️ Database Schema

### Core Tables
- **packages**: Main package information
- **customers**: Customer details and contact info
- **tracking_events**: Package status history
- **profiles**: User authentication and roles
- **audit_log**: System activity tracking

### Key Features
- **Automatic Tracking Numbers**: Generated using `generate_tracking_number()` function
- **Status Updates**: Handled by `update_package_status()` function
- **Audit Trail**: All changes logged automatically
- **RLS Policies**: Secure data access based on user roles

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   └── ...             # Public pages
├── services/           # API and business logic
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Components

#### Dashboard (`src/pages/admin/Dashboard.tsx`)
- Real-time statistics
- Recent shipments overview
- Quick action buttons
- System status monitoring

#### Packages Page (`src/pages/admin/PackagesPage.tsx`)
- Package listing with search/filter
- Status management
- Bulk operations
- Quick package creation

#### Package Details (`src/pages/admin/PackageDetailsPage.tsx`)
- Comprehensive package information
- Status update controls
- Tracking history
- Customer details

#### Create Package (`src/pages/admin/CreatePackagePage.tsx`)
- Streamlined package creation form
- Customer selection/creation
- Address management
- Service options

### Authentication System

#### Auth Provider (`src/hooks/useAuth.tsx`)
- Centralized authentication state
- Role-based access control
- Session management
- Security utilities

#### Security Features
- **Protected Routes**: Automatic redirect for unauthorized access
- **Role Validation**: Server-side and client-side role checks
- **Session Persistence**: Automatic session restoration
- **Secure Logout**: Proper session cleanup

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Ensure all environment variables are set in production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Database Migration
```bash
npx supabase db push
```

## 📊 Monitoring & Analytics

### System Statistics
- Total packages and customers
- Delivery success rates
- Revenue tracking
- User activity monitoring

### Audit Logging
- All database changes tracked
- User action history
- Security event monitoring
- Compliance reporting

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the provided SQL migrations
3. Configure RLS policies
4. Set up authentication providers

### Customization
- **Branding**: Update colors in `tailwind.config.ts`
- **Features**: Modify components in `src/components/`
- **Business Logic**: Update services in `src/services/`
- **Database**: Modify migrations in `supabase/migrations/`

## 🐛 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check Supabase connection
npx supabase status

# Reset local database
npx supabase db reset
```

#### Authentication Issues
- Verify environment variables
- Check Supabase Auth settings
- Clear browser cache and cookies

#### Build Errors
```bash
# Clear dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 📈 Performance

### Optimization Features
- **Lazy Loading**: Components loaded on demand
- **Caching**: React Query for API responses
- **Compression**: Optimized bundle sizes
- **CDN**: Static assets served from CDN

### Monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Load times and user interactions
- **Database Queries**: Query optimization and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

---

**Swift Trace Hub** - Simplifying package tracking and delivery management with security and ease.
