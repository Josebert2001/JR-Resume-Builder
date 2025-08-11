export type GenerationResponse = {
  education?: string;
  workExperience?: string;
  skills?: string[];
  analysis?: {
    score: number;
    matchedKeywords: string[];
    missedKeywords: string[];
    suggestions: string[];
  };
};

// This module intentionally only exports types to satisfy imports.
// AI calls are handled via Supabase Edge Functions through src/services/resumeAI.ts.
