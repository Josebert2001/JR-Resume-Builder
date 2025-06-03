
import { z } from 'zod';

/**
 * Extracts JSON from a mixed response that might contain extra text
 */
export const extractJsonFromResponse = (response: string): string | null => {
  try {
    // First try to parse the entire response as JSON
    JSON.parse(response.trim());
    return response.trim();
  } catch {
    // If that fails, try to find JSON object within the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        JSON.parse(jsonMatch[0]);
        return jsonMatch[0];
      } catch {
        // Try to find array JSON
        const arrayMatch = response.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          try {
            JSON.parse(arrayMatch[0]);
            return arrayMatch[0];
          } catch {
            return null;
          }
        }
        return null;
      }
    }
    return null;
  }
};

/**
 * Safely parses JSON with fallback error handling
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    const extracted = extractJsonFromResponse(jsonString);
    if (extracted) {
      return JSON.parse(extracted);
    }
    return fallback;
  } catch (error) {
    console.warn('JSON parsing failed:', error, 'Input:', jsonString);
    return fallback;
  }
};

/**
 * Validates parsed JSON against expected structure
 */
export const validateJsonStructure = (data: any, requiredFields: string[]): boolean => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  return requiredFields.every(field => {
    const hasField = field.split('.').reduce((obj, key) => obj && obj[key] !== undefined, data);
    return hasField;
  });
};

/**
 * Schema validation for resume content
 */
export const resumeContentSchema = z.object({
  summary: z.string().min(1),
  skills: z.array(z.string()).min(1)
});

/**
 * Schema validation for resume analysis
 */
export const resumeAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missedKeywords: z.array(z.string()),
  suggestions: z.array(z.string())
});

/**
 * Helper to clean AI response before parsing
 */
export const cleanAiResponse = (response: string): string => {
  return response
    .replace(/```json\s*/g, '') // Remove markdown JSON blocks
    .replace(/```\s*/g, '') // Remove markdown blocks
    .replace(/^\s*Here\s+is\s+.*?:\s*/i, '') // Remove "Here is..." prefixes
    .replace(/^\s*The\s+.*?:\s*/i, '') // Remove "The..." prefixes
    .trim();
};
