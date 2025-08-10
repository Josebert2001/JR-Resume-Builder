
import { ChatGroq } from "@langchain/groq";
import { SecureApiService } from '@/services/secureApiService';

// Get API key from secure storage, fallback to localStorage for migration
const getApiKey = async (): Promise<string> => {
  try {
    // Try to get from secure storage first
    const secureKey = await SecureApiService.getApiKey('groq', 'api_key');
    if (secureKey) {
      return secureKey;
    }

    // Fallback to localStorage (for migration)
    const localKey = localStorage.getItem('groq_api_key');
    if (localKey) {
      // Migrate to secure storage
      await SecureApiService.storeApiKey('groq', 'api_key', localKey);
      localStorage.removeItem('groq_api_key');
      return localKey;
    }

    return import.meta.env.VITE_GROQ_API_KEY || '';
  } catch (error) {
    console.error('Error getting API key:', error);
    // Fallback to localStorage
    return localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || '';
  }
};

// Initialize ChatGroq
export const createGroqChat = async () => {
  const apiKey = await getApiKey();
  
  if (!apiKey) {
    throw new Error('Groq API key is not configured. Please set your API key in the settings.');
  }

  return new ChatGroq({
    apiKey: apiKey,
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
    maxTokens: 1024,
  });
};

// Function to check if the API key is valid
export const isApiKeyValid = async (): Promise<boolean> => {
  try {
    const apiKey = await getApiKey();
    return !!apiKey && apiKey.startsWith('gsk-');
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
};

// Function to safely parse JSON with error handling
export function safeJsonParse<T>(jsonString: string, defaultReturn: T): T {
  try {
    // Clean the JSON string
    const cleanedJsonString = jsonString
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*Here\s+is\s+.*?:\s*/i, '')
      .trim();
    
    // Try to extract JSON from the response
    const jsonMatch = cleanedJsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    
    return JSON.parse(cleanedJsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error, 'Input:', jsonString);
    return defaultReturn;
  }
}
