import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Package = Database['public']['Tables']['packages']['Row'];
type PackageInsert = Database['public']['Tables']['packages']['Insert'];
type PackageUpdate = Database['public']['Tables']['packages']['Update'];
type TrackingEvent = Database['public']['Tables']['tracking_events']['Row'];
type TrackingEventInsert = Database['public']['Tables']['tracking_events']['Insert'];

export interface PackageWithCustomer extends Package {
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
  };
}

export interface PackageWithEvents extends Package {
  tracking_events: TrackingEvent[];
}

export class PackageService {
  // Get all packages with optional filters
  static async getPackages(filters?: {
    status?: string;
    customer_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<PackageWithCustomer[]> {
    try {
      let query = supabase
        .from('packages')
        .select(`
          *,
          customer:customers(first_name, last_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get packages error:', error);
      throw error;
    }
  }

  // Get package by ID
  static async getPackageById(id: string): Promise<PackageWithEvents | null> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          tracking_events(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Package not found
        }
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Get package by ID error:', error);
      throw error;
    }
  }

  // Get package by tracking number
  static async getPackageByTrackingNumber(trackingNumber: string): Promise<PackageWithEvents | null> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          tracking_events(*)
        `)
        .eq('tracking_number', trackingNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Package not found
        }
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Get package by tracking number error:', error);
      throw error;
    }
  }

  // Create new package
  static async createPackage(packageData: PackageInsert): Promise<Package> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert(packageData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Create initial tracking event
      await this.createTrackingEvent({
        package_id: data.id,
        event_type: 'created',
        description: 'Package created and received',
        location: packageData.origin_city + ', ' + packageData.origin_state,
        lat: packageData.origin_lat,
        lng: packageData.origin_lng
      });

      return data;
    } catch (error) {
      console.error('Create package error:', error);
      throw error;
    }
  }

  // Update package
  static async updatePackage(id: string, updates: PackageUpdate): Promise<Package> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Update package error:', error);
      throw error;
    }
  }

  // Update package status
  static async updatePackageStatus(id: string, status: string, location?: string): Promise<Package> {
    try {
      const updates: PackageUpdate = { status: status as any };
      
      if (location) {
        updates.current_location = location;
      }

      const packageData = await this.updatePackage(id, updates);

      // Create tracking event for status change
      await this.createTrackingEvent({
        package_id: id,
        event_type: status as any,
        description: `Package status updated to ${status}`,
        location: location || packageData.current_location,
        lat: packageData.current_lat,
        lng: packageData.current_lng
      });

      return packageData;
    } catch (error) {
      console.error('Update package status error:', error);
      throw error;
    }
  }

  // Delete package
  static async deletePackage(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Delete package error:', error);
      throw error;
    }
  }

  // Create tracking event
  static async createTrackingEvent(eventData: TrackingEventInsert): Promise<TrackingEvent> {
    try {
      const { data, error } = await supabase
        .from('tracking_events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Create tracking event error:', error);
      throw error;
    }
  }

  // Get tracking events for a package
  static async getTrackingEvents(packageId: string): Promise<TrackingEvent[]> {
    try {
      const { data, error } = await supabase
        .from('tracking_events')
        .select('*')
        .eq('package_id', packageId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get tracking events error:', error);
      throw error;
    }
  }

  // Search packages
  static async searchPackages(searchTerm: string): Promise<PackageWithCustomer[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          customer:customers(first_name, last_name, email, phone)
        `)
        .or(`tracking_number.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Search packages error:', error);
      throw error;
    }
  }

  // Get package statistics
  static async getPackageStats(): Promise<{
    total: number;
    inTransit: number;
    delivered: number;
    pending: number;
    cancelled: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('status');

      if (error) {
        throw new Error(error.message);
      }

      const stats = {
        total: data?.length || 0,
        inTransit: data?.filter(p => p.status === 'in_transit').length || 0,
        delivered: data?.filter(p => p.status === 'delivered').length || 0,
        pending: data?.filter(p => p.status === 'pending').length || 0,
        cancelled: data?.filter(p => p.status === 'cancelled').length || 0,
      };

      return stats;
    } catch (error) {
      console.error('Get package stats error:', error);
      throw error;
    }
  }
} 