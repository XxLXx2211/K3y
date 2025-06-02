import { v4 as uuidv4 } from 'uuid';
import { ApiKeyItem } from '../types/api-key';

const STORAGE_KEY = 'api-keys-database';

export class ApiKeyService {
  private getStoredData(): ApiKeyItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private saveData(data: ApiKeyItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save data');
    }
  }

  // Get all API keys
  getAllApiKeys(): ApiKeyItem[] {
    try {
      const data = this.getStoredData();
      // Sort by creation time (newest first) - we'll use id as a proxy for creation time
      return data.sort((a, b) => b.id.localeCompare(a.id));
    } catch (error) {
      console.error('Error fetching API keys:', error);
      throw new Error('Failed to fetch API keys');
    }
  }

  // Get API key by ID
  getApiKeyById(id: string): ApiKeyItem | null {
    try {
      const data = this.getStoredData();
      const item = data.find(key => key.id === id);
      return item || null;
    } catch (error) {
      console.error('Error fetching API key by ID:', error);
      throw new Error('Failed to fetch API key');
    }
  }

  // Create new API key
  createApiKey(apiKey: Omit<ApiKeyItem, 'id'>): ApiKeyItem {
    try {
      const data = this.getStoredData();
      const id = uuidv4();
      const newApiKey: ApiKeyItem = {
        id,
        ...apiKey
      };

      data.push(newApiKey);
      this.saveData(data);

      return newApiKey;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw new Error('Failed to create API key');
    }
  }

  // Update API key
  updateApiKey(id: string, updates: Partial<Omit<ApiKeyItem, 'id'>>): ApiKeyItem | null {
    try {
      const data = this.getStoredData();
      const index = data.findIndex(key => key.id === id);

      if (index === -1) {
        return null;
      }

      // Update the item
      const updatedItem: ApiKeyItem = {
        ...data[index],
        ...updates
      };

      data[index] = updatedItem;
      this.saveData(data);

      return updatedItem;
    } catch (error) {
      console.error('Error updating API key:', error);
      throw new Error('Failed to update API key');
    }
  }

  // Delete API key
  deleteApiKey(id: string): boolean {
    try {
      const data = this.getStoredData();
      const initialLength = data.length;
      const filteredData = data.filter(key => key.id !== id);

      if (filteredData.length < initialLength) {
        this.saveData(filteredData);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting API key:', error);
      throw new Error('Failed to delete API key');
    }
  }

  // Search API keys
  searchApiKeys(query: string): ApiKeyItem[] {
    try {
      const data = this.getStoredData();
      const searchTerm = query.toLowerCase();

      return data.filter(key =>
        key.name.toLowerCase().includes(searchTerm) ||
        key.service.toLowerCase().includes(searchTerm) ||
        key.category.toLowerCase().includes(searchTerm) ||
        (key.description && key.description.toLowerCase().includes(searchTerm))
      ).sort((a, b) => b.id.localeCompare(a.id));
    } catch (error) {
      console.error('Error searching API keys:', error);
      throw new Error('Failed to search API keys');
    }
  }

  // Get API keys by category
  getApiKeysByCategory(category: string): ApiKeyItem[] {
    try {
      const data = this.getStoredData();
      return data.filter(key => key.category === category)
                 .sort((a, b) => b.id.localeCompare(a.id));
    } catch (error) {
      console.error('Error fetching API keys by category:', error);
      throw new Error('Failed to fetch API keys by category');
    }
  }

  // Get statistics
  getStatistics() {
    try {
      const data = this.getStoredData();
      const total = data.length;

      // Group by category
      const categoryCount: Record<string, number> = {};
      data.forEach(key => {
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
      console.error('Error fetching statistics:', error);
      throw new Error('Failed to fetch statistics');
    }
  }
}

// Export singleton instance
export const apiKeyService = new ApiKeyService();
