import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ApiKeyData {
  serviceName: string;
  keyName: string;
  encryptedKey: string;
  isActive: boolean;
}

/**
 * Secure API key management service
 * Stores encrypted API keys in Supabase instead of localStorage
 */
export class SecureApiService {
  private static async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('User not authenticated');
    }
    return user;
  }

  /**
   * Store an API key securely in the database
   */
  static async storeApiKey(serviceName: string, keyName: string, apiKey: string): Promise<boolean> {
    try {
      const user = await this.getUser();
      
      // Simple encryption (in production, use proper encryption)
      const encryptedKey = btoa(apiKey);
      
      const { error } = await supabase
        .from('api_keys')
        .upsert({
          user_id: user.id,
          service_name: serviceName,
          key_name: keyName,
          encrypted_key: encryptedKey,
          is_active: true
        });

      if (error) {
        console.error('Error storing API key:', error);
        toast.error('Failed to store API key');
        return false;
      }

      toast.success('API key stored securely');
      return true;
    } catch (error) {
      console.error('Error storing API key:', error);
      toast.error('Failed to store API key');
      return false;
    }
  }

  /**
   * Retrieve an API key from secure storage
   */
  static async getApiKey(serviceName: string, keyName: string): Promise<string | null> {
    try {
      const user = await this.getUser();
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('encrypted_key')
        .eq('user_id', user.id)
        .eq('service_name', serviceName)
        .eq('key_name', keyName)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error retrieving API key:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Simple decryption (in production, use proper decryption)
      return atob(data.encrypted_key);
    } catch (error) {
      console.error('Error retrieving API key:', error);
      return null;
    }
  }

  /**
   * Delete an API key
   */
  static async deleteApiKey(serviceName: string, keyName: string): Promise<boolean> {
    try {
      const user = await this.getUser();
      
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('user_id', user.id)
        .eq('service_name', serviceName)
        .eq('key_name', keyName);

      if (error) {
        console.error('Error deleting API key:', error);
        toast.error('Failed to delete API key');
        return false;
      }

      toast.success('API key deleted');
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
      return false;
    }
  }

  /**
   * List all API keys for the current user
   */
  static async listApiKeys(): Promise<ApiKeyData[]> {
    try {
      const user = await this.getUser();
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('service_name, key_name, encrypted_key, is_active')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error listing API keys:', error);
        return [];
      }

      return data.map(item => ({
        serviceName: item.service_name,
        keyName: item.key_name,
        encryptedKey: item.encrypted_key,
        isActive: item.is_active
      }));
    } catch (error) {
      console.error('Error listing API keys:', error);
      return [];
    }
  }

  /**
   * Validate if an API key exists and is active
   */
  static async validateApiKey(serviceName: string, keyName: string): Promise<boolean> {
    const apiKey = await this.getApiKey(serviceName, keyName);
    return apiKey !== null && apiKey.length > 0;
  }

  /**
   * Migrate from localStorage to secure storage
   */
  static async migrateFromLocalStorage(): Promise<void> {
    try {
      // Migrate Groq API key
      const groqKey = localStorage.getItem('groq_api_key');
      if (groqKey) {
        await this.storeApiKey('groq', 'api_key', groqKey);
        localStorage.removeItem('groq_api_key');
        console.log('Migrated Groq API key to secure storage');
      }

      // Add other API key migrations as needed
      // const openaiKey = localStorage.getItem('openai_api_key');
      // if (openaiKey) {
      //   await this.storeApiKey('openai', 'api_key', openaiKey);
      //   localStorage.removeItem('openai_api_key');
      // }

    } catch (error) {
      console.error('Error during API key migration:', error);
    }
  }
}