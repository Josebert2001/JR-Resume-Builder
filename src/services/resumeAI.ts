
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

// New: Professional Summary
export const generateProfessionalSummary = async (
  role: string,
  industry: string,
  experience: string,
  skills: string[]
): Promise<string> => {
  try {
    const result = await invokeGroq("summary", { role, industry, experience, skills });
    return (result?.text as string) || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "";
  }
};

// New: Grouped Skills
export const suggestGroupedSkills = async (
  role: string,
  experience: string[],
  currentSkills: string[]
): Promise<{ technical: string[]; soft: string[] }> => {
  try {
    const result = await invokeGroq("skills_grouped", { role, experience, currentSkills });
    return {
      technical: (result?.skills?.technical as string[]) || [],
      soft: (result?.skills?.soft as string[]) || [],
    };
  } catch (error) {
    console.error("Error suggesting grouped skills:", error);
    return { technical: [], soft: [] };
  }
};

// New: ATS Optimization (detailed)
export const optimizeResumeATS = async (
  resumeText: string,
  jobDescription: string
): Promise<{
  missingKeywords: string[];
  suggestedImprovements: string[];
  quantifiableSuggestions: string[];
}> => {
  try {
    const result = await invokeGroq("ats_optimize", { resumeText, jobDescription });
    return {
      missingKeywords: (result?.missingKeywords as string[]) || [],
      suggestedImprovements: (result?.suggestedImprovements as string[]) || [],
      quantifiableSuggestions: (result?.quantifiableSuggestions as string[]) || [],
    };
  } catch (error) {
    console.error("Error optimizing resume:", error);
    return { missingKeywords: [], suggestedImprovements: [], quantifiableSuggestions: [] };
  }
};

// New: Career Assistant Q&A
export const careerAssistant = async (
  question: string,
  industry?: string,
  experienceLevel?: string
): Promise<string> => {
  try {
    const result = await invokeGroq("career_qa", { question, industry, experienceLevel });
    return (result?.text as string) || "";
  } catch (error) {
    console.error("Error with career assistant:", error);
    return "";
  }
};

// New: Orchestrate full resume pieces
export const orchestrateResume = async (
  payload: Record<string, unknown>
): Promise<{
  summary: string;
  workBullets: string[];
  educationEntries: string[];
  skills: { technical: string[]; soft: string[] };
}> => {
  try {
    const result = await invokeGroq("orchestrate", payload);
    return {
      summary: (result?.summary as string) || "",
      workBullets: (result?.workBullets as string[]) || [],
      educationEntries: (result?.educationEntries as string[]) || [],
      skills: {
        technical: (result?.skills?.technical as string[]) || [],
        soft: (result?.skills?.soft as string[]) || [],
      },
    };
  } catch (error) {
    console.error("Error orchestrating resume:", error);
    return { summary: "", workBullets: [], educationEntries: [], skills: { technical: [], soft: [] } };
  }
};
