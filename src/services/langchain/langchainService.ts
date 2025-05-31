
import {
  resumeContentChain,
  workDescriptionChain,
  educationDescriptionChain,
  resumeAnalysisChain,
  skillsSuggestionChain
} from "./chains/resumeChains";

export type GenerationRequest = {
  name: string;
  email: string;
  phone: string;
  course: string;
  school: string;
  interests: string;
};

export type GenerationResponse = {
  summary: string;
  skills: string[];
};

export type ResponsibilityGenerationRequest = {
  position: string;
  company: string;
  industry?: string;
};

export type ResumeAnalysisResponse = {
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
  suggestions: string[];
};

export const generateResumeContent = async (data: GenerationRequest): Promise<GenerationResponse> => {
  if (!data.course || !data.school || !data.interests) {
    throw new Error('Missing required fields for resume content generation');
  }

  try {
    const result = await resumeContentChain.invoke({
      name: data.name,
      course: data.course,
      school: data.school,
      interests: data.interests
    });

    // Validate response structure
    if (!result.summary || !Array.isArray(result.skills)) {
      throw new Error('Invalid response structure from AI');
    }

    return {
      summary: result.summary,
      skills: result.skills
    };
  } catch (error) {
    console.error('Error generating resume content with LangChain:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate resume content');
  }
};

export const generateJobResponsibilities = async (data: ResponsibilityGenerationRequest): Promise<string> => {
  try {
    const result = await workDescriptionChain.invoke({
      position: data.position,
      company: data.company,
      industry: data.industry ? `in the ${data.industry} industry` : ''
    });

    return result.text || "Failed to generate responsibilities";
  } catch (error) {
    console.error('Error generating job responsibilities with LangChain:', error);
    throw new Error('Failed to generate job responsibilities');
  }
};

export const generateEducationDescription = async (
  degree: string,
  fieldOfStudy: string,
  school: string
): Promise<string> => {
  try {
    const result = await educationDescriptionChain.invoke({
      degree,
      fieldOfStudy,
      school
    });

    return result.text || '';
  } catch (error) {
    console.error('Error generating education description with LangChain:', error);
    return '';
  }
};

export const analyzeResume = async (resumeContent: string, jobDescription: string): Promise<ResumeAnalysisResponse> => {
  try {
    const result = await resumeAnalysisChain.invoke({
      resumeText: resumeContent,
      jobDescription: jobDescription
    });

    return {
      score: result?.score || 0,
      matchedKeywords: Array.isArray(result?.matchedKeywords) ? result.matchedKeywords : [],
      missedKeywords: Array.isArray(result?.missedKeywords) ? result.missedKeywords : [],
      suggestions: Array.isArray(result?.suggestions) ? result.suggestions : []
    };
  } catch (error) {
    console.error('Error analyzing resume with LangChain:', error);
    throw new Error('Failed to analyze resume');
  }
};

export const suggestSkills = async (
  position: string,
  experience: string[]
): Promise<string[]> => {
  try {
    const result = await skillsSuggestionChain.invoke({
      position,
      experience: experience.join(', ')
    });

    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Error suggesting skills with LangChain:', error);
    return [];
  }
};
