import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Customer = Database['public']['Tables']['customers']['Row'];
type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export interface CustomerWithPackages extends Customer {
  packages?: Array<{
    id: string;
    tracking_number: string;
    status: string;
    created_at: string;
  }>;
}

export class CustomerService {
  // Get all customers with optional filters
  static async getCustomers(filters?: {
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Customer[]> {
    try {
      let query = supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
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
      console.error('Get customers error:', error);
      throw error;
    }
  }

  // Get customer by ID
  static async getCustomerById(id: string): Promise<CustomerWithPackages | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          packages(id, tracking_number, status, created_at)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Customer not found
        }
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Get customer by ID error:', error);
      throw error;
    }
  }

  // Get customer by email
  static async getCustomerByEmail(email: string): Promise<Customer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Customer not found
        }
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Get customer by email error:', error);
      throw error;
    }
  }

  // Create new customer
  static async createCustomer(customerData: CustomerInsert): Promise<Customer> {
    try {
      // Check if customer with email already exists
      const existingCustomer = await this.getCustomerByEmail(customerData.email);
      if (existingCustomer) {
        throw new Error('Customer with this email already exists');
      }

      const { data, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Create customer error:', error);
      throw error;
    }
  }

  // Update customer
  static async updateCustomer(id: string, updates: CustomerUpdate): Promise<Customer> {
    try {
      // If email is being updated, check if it's already taken
      if (updates.email) {
        const existingCustomer = await this.getCustomerByEmail(updates.email);
        if (existingCustomer && existingCustomer.id !== id) {
          throw new Error('Email is already taken by another customer');
        }
      }

      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Update customer error:', error);
      throw error;
    }
  }

  // Delete customer
  static async deleteCustomer(id: string): Promise<boolean> {
    try {
      // Check if customer has packages
      const customer = await this.getCustomerById(id);
      if (customer?.packages && customer.packages.length > 0) {
        throw new Error('Cannot delete customer with existing packages');
      }

      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Delete customer error:', error);
      throw error;
    }
  }

  // Search customers
  static async searchCustomers(searchTerm: string): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Search customers error:', error);
      throw error;
    }
  }

  // Get customer statistics
  static async getCustomerStats(): Promise<{
    total: number;
    active: number;
    newThisMonth: number;
    topCustomers: Array<{
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      package_count: number;
    }>;
  }> {
    try {
      // Get total customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('*');

      if (customersError) {
        throw new Error(customersError.message);
      }

      // Get customers with package counts
      const { data: customerPackages, error: packagesError } = await supabase
        .from('customers')
        .select(`
          id,
          first_name,
          last_name,
          email,
          packages(count)
        `);

      if (packagesError) {
        throw new Error(packagesError.message);
      }

      const total = customers?.length || 0;
      const active = customers?.filter(c => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return new Date(c.created_at) > lastMonth;
      }).length || 0;

      const newThisMonth = customers?.filter(c => {
        const thisMonth = new Date();
        thisMonth.setDate(1);
        return new Date(c.created_at) >= thisMonth;
      }).length || 0;

      // Get top customers by package count
      const topCustomers = customerPackages
        ?.map(cp => ({
          id: cp.id,
          first_name: cp.first_name,
          last_name: cp.last_name,
          email: cp.email,
          package_count: (cp.packages as any)?.length || 0
        }))
        .sort((a, b) => b.package_count - a.package_count)
        .slice(0, 5) || [];

      return {
        total,
        active,
        newThisMonth,
        topCustomers
      };
    } catch (error) {
      console.error('Get customer stats error:', error);
      throw error;
    }
  }

  // Bulk import customers
  static async bulkImportCustomers(customers: Omit<CustomerInsert, 'id' | 'created_at' | 'updated_at'>[]): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert(customers)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Bulk import customers error:', error);
      throw error;
    }
  }

  // Export customers
  static async exportCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Export customers error:', error);
      throw error;
    }
  }
} 