import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { ApiKeyItem } from '../types/api-key';

export class ApiKeyService {

  // Get all API keys
  async getAllApiKeys(): Promise<ApiKeyItem[]> {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching API keys:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllApiKeys:', error);
      return [];
    }
  }

  // Get API key by ID
  async getApiKeyById(id: string): Promise<ApiKeyItem | null> {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching API key:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getApiKeyById:', error);
      return null;
    }
  }

  // Create new API key
  async createApiKey(apiKey: Omit<ApiKeyItem, 'id' | 'created_at' | 'updated_at'>): Promise<ApiKeyItem> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();

      const newApiKey = {
        ...apiKey,
        id,
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newApiKey])
        .select()
        .single();

      if (error) {
        console.error('Error creating API key:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createApiKey:', error);
      throw error;
    }
  }

  // Update API key
  async updateApiKey(id: string, updates: Partial<Omit<ApiKeyItem, 'id' | 'created_at'>>): Promise<ApiKeyItem | null> {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('api_keys')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error updating API key:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateApiKey:', error);
      return null;
    }
  }

  // Delete API key
  async deleteApiKey(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting API key:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteApiKey:', error);
      return false;
    }
  }

  // Search API keys
  async searchApiKeys(query: string): Promise<ApiKeyItem[]> {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .or(`name.ilike.%${query}%,service.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching API keys:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchApiKeys:', error);
      return [];
    }
  }

  // Get API keys by category
  async getApiKeysByCategory(category: string): Promise<ApiKeyItem[]> {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching API keys by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getApiKeysByCategory:', error);
      return [];
    }
  }

  // Get statistics
  async getStatistics() {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('category');

      if (error) {
        console.error('Error fetching statistics:', error);
        throw error;
      }

      const total = data?.length || 0;

      // Group by category
      const categoryCount: Record<string, number> = {};
      data?.forEach(key => {
        categoryCount[key.category] = (categoryCount[key.category] || 0) + 1;
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
export const apiKeyService = new ApiKeyService();
