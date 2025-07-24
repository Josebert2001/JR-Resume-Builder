
import { ChatGroq } from "@langchain/groq";

// Get API key from localStorage or environment
const getApiKey = () => {
  return localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || '';
};

// Initialize ChatGroq
export const createGroqChat = () => {
  const apiKey = getApiKey();
  
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
export const isApiKeyValid = (): boolean => {
  const apiKey = getApiKey();
  return !!apiKey && apiKey.startsWith('gsk-');
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
