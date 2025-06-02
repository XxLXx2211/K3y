import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { PasswordItem } from '../types/api-key';

export class PasswordService {
  // Get all passwords
  async getAllPasswords(): Promise<PasswordItem[]> {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching passwords:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllPasswords:', error);
      return [];
    }
  }

  // Get password by ID
  async getPasswordById(id: string): Promise<PasswordItem | null> {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching password:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getPasswordById:', error);
      return null;
    }
  }

  // Create new password
  async createPassword(password: Omit<PasswordItem, 'id' | 'created_at' | 'updated_at'>): Promise<PasswordItem> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      const newPassword = {
        ...password,
        id,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('passwords')
        .insert([newPassword])
        .select()
        .single();

      if (error) {
        console.error('Error creating password:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createPassword:', error);
      throw error;
    }
  }

  // Update password
  async updatePassword(id: string, updates: Partial<Omit<PasswordItem, 'id' | 'created_at'>>): Promise<PasswordItem | null> {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('passwords')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error updating password:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updatePassword:', error);
      return null;
    }
  }

  // Delete password
  async deletePassword(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('passwords')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting password:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deletePassword:', error);
      return false;
    }
  }

  // Search passwords
  async searchPasswords(query: string): Promise<PasswordItem[]> {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .or(`name.ilike.%${query}%,service.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching passwords:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchPasswords:', error);
      return [];
    }
  }

  // Get passwords by category
  async getPasswordsByCategory(category: string): Promise<PasswordItem[]> {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching passwords by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPasswordsByCategory:', error);
      return [];
    }
  }

  // Get statistics
  async getStatistics() {
    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('category');

      if (error) {
        console.error('Error fetching statistics:', error);
        throw error;
      }

      const total = data?.length || 0;
      
      // Group by category
      const categoryCount: Record<string, number> = {};
      data?.forEach(password => {
        categoryCount[password.category] = (categoryCount[password.category] || 0) + 1;
      });

      const byCategory = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      return {
        total,
        byCategory
      };
    } catch (error) {
      console.error('Error in getStatistics:', error);
      return { total: 0, byCategory: [] };
    }
  }
}

// Export singleton instance
export const passwordService = new PasswordService();
