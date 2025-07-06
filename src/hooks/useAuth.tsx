import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthService, User } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { first_name?: string; last_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  requireAuth: (requiredRole?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await checkUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error: any) {
      // Don't log errors for missing sessions (normal case)
      if (!error.message?.includes('Auth session missing')) {
        console.error('Error checking user:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: authUser } = await AuthService.signIn(email, password);
      
      if (authUser) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { first_name?: string; last_name?: string }) => {
    try {
      setLoading(true);
      const { user: authUser } = await AuthService.signUp(email, password, userData);
      
      if (authUser) {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        toast.success('Account created successfully!');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await AuthService.signOut();
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role || '');
  };

  const requireAuth = (requiredRole?: string): boolean => {
    if (!user) return false;
    if (requiredRole && !hasRole(requiredRole)) return false;
    return true;
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
    requireAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for role-based route protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, requireAuth } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swift-700"></div>
        </div>
      );
    }

    if (!requireAuth(requiredRole)) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              {!user 
                ? 'You must be logged in to access this page.'
                : requiredRole 
                  ? `You need ${requiredRole} permissions to access this page.`
                  : 'You do not have permission to access this page.'
              }
            </p>
            <a 
              href="/login" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-swift-600 hover:bg-swift-700"
            >
              Go to Login
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Hook for checking if user can access admin features
export function useAdminAccess() {
  const { hasRole, hasAnyRole } = useAuth();
  
  return {
    isAdmin: hasRole('admin'),
    isManager: hasRole('manager'),
    isOperator: hasRole('operator'),
    isAgent: hasRole('agent'),
    isViewer: hasRole('viewer'),
    canManageUsers: hasAnyRole(['admin', 'manager']),
    canManagePackages: hasAnyRole(['admin', 'manager', 'operator']),
    canViewReports: hasAnyRole(['admin', 'manager', 'operator']),
    canEditSettings: hasRole('admin'),
  };
}

// Hook for checking if user can perform specific actions
export function usePermissions() {
  const { hasRole, hasAnyRole } = useAuth();
  
  return {
    canCreatePackages: hasAnyRole(['admin', 'manager', 'operator']),
    canEditPackages: hasAnyRole(['admin', 'manager', 'operator']),
    canDeletePackages: hasAnyRole(['admin', 'manager']),
    canUpdateStatus: hasAnyRole(['admin', 'manager', 'operator']),
    canViewCustomers: hasAnyRole(['admin', 'manager', 'operator', 'agent']),
    canEditCustomers: hasAnyRole(['admin', 'manager', 'operator']),
    canDeleteCustomers: hasAnyRole(['admin', 'manager']),
    canViewAuditLogs: hasAnyRole(['admin', 'manager']),
    canManageSystem: hasRole('admin'),
  };
} 