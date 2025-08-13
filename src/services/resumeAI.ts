
import { supabase } from "@/integrations/supabase/client";

// Helper to invoke the Edge Function that proxies Groq API
async function invokeGroq(action: string, payload: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("groq-generate", {
    body: { action, ...payload },
  });

  if (error) {
    console.error(`Groq function error [${action}]`, error);
    throw error;
  }
  return data as any;
}

export const generateEducationDescription = async (
  degree: string,
  fieldOfStudy: string,
  school: string
): Promise<string> => {
  try {
    const result = await invokeGroq("education", { degree, fieldOfStudy, school });
    return (result?.text as string) || "";
  } catch (error) {
    console.error("Error generating education description:", error);
    return "";
  }
};

export const generateWorkDescription = async (
  position: string,
  company: string,
  industry?: string
): Promise<string> => {
  try {
    const result = await invokeGroq("work", { position, company, industry });
    return (result?.text as string) || "";
  } catch (error) {
    console.error("Error generating work description:", error);
    return "";
  }
};

export const suggestSkills = async (
  position: string,
  experience: string[]
): Promise<string[]> => {
  try {
    const result = await invokeGroq("skills", { position, experience });
    const skills = (result?.skills as string[]) || [];
    return Array.isArray(skills) ? skills : [];
  } catch (error) {
    console.error("Error suggesting skills:", error);
    return [];
  }
};

export const analyzeResume = async (
  resumeText: string,
  jobDescription: string
): Promise<{
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
  suggestions: string[];
}> => {
  try {
    const result = await invokeGroq("analyze", { resumeText, jobDescription });
    return {
      score: Number(result?.score) || 0,
      matchedKeywords: (result?.matchedKeywords as string[]) || [],
      missedKeywords: (result?.missedKeywords as string[]) || [],
      suggestions: (result?.suggestions as string[]) || [],
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return { 
      score: 0, 
      matchedKeywords: [], 
      missedKeywords: [], 
      suggestions: ["Failed to complete AI analysis."] 
    };
  }
};
