import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, userData: { first_name?: string; last_name?: string }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw new Error(error.message);
      }

      if (!user) return null;

      // Get user profile from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        first_name: profile?.first_name || user.user_metadata?.first_name,
        last_name: profile?.last_name || user.user_metadata?.last_name,
        role: profile?.role || 'user'
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }

      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return !!session;
  }

  // Update user profile
  static async updateProfile(userId: string, updates: { first_name?: string; last_name?: string; role?: string }) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Update password
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }
}

// Auth state listener
export const setupAuthListener = (onAuthStateChange: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      const user = await AuthService.getCurrentUser();
      onAuthStateChange(user);
    } else if (event === 'SIGNED_OUT') {
      onAuthStateChange(null);
    }
  });
}; 