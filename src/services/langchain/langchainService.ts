
import {
  resumeContentChain,
  workDescriptionChain,
  educationDescriptionChain,
  resumeAnalysisChain,
  skillsSuggestionChain
} from "./chains/resumeChains";
import {
  resumeConversationChain,
  skillsConversationChain,
  careerConversationChain,
  resumeConversationMemory,
  skillsConversationMemory,
  careerConversationMemory
} from "./chains/conversationChains";
import {
  comprehensiveResumeAnalysisChain,
  industryOptimizationChain
} from "./chains/advancedResumeChains";
import { 
  safeJsonParse, 
  validateJsonStructure, 
  resumeContentSchema, 
  resumeAnalysisSchema,
  cleanAiResponse 
} from "./utils/responseParser";
import { performHealthCheck, HealthCheckResult } from "./utils/healthCheck";

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

export type ComprehensiveAnalysisResponse = {
  analysis: {
    strengths: string[];
    weaknesses: string[];
    missingElements: string[];
    industryAlignment: string;
    overallScore: number;
  };
  improvements: {
    priorityActions: string[];
    contentSuggestions: {
      summary: string;
      skills: string[];
      experiences: string[];
    };
    formattingTips: string[];
    keywordOptimization: string[];
  };
  atsOptimization: {
    atsScore: number;
    formatIssues: string[];
    keywordMatches: string[];
    missingKeywords: string[];
    optimizedSections: {
      skills: string[];
      experience: string[];
    };
    recommendations: string[];
  };
};

export type ConversationResponse = {
  response: string;
  context: string;
};

// Health check function using new dedicated service
export const checkLangchainHealth = async (): Promise<HealthCheckResult> => {
  return performHealthCheck();
};

export const generateResumeContent = async (data: GenerationRequest): Promise<GenerationResponse> => {
  console.log('LangChain: Starting resume content generation', data);
  
  if (!data.course || !data.school || !data.interests) {
    throw new Error('Missing required fields for resume content generation');
  }

  // Check API key before proceeding
  const apiKey = localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API key not configured. Please add your API key in the settings.');
  }

  try {
    console.log('LangChain: Invoking resume content chain');
    const result = await resumeContentChain.invoke({
      name: data.name,
      course: data.course,
      school: data.school,
      interests: data.interests
    });

    console.log('LangChain: Raw resume content chain result:', result);

    // Handle the result more robustly
    let parsedResult;
    if (typeof result === 'string') {
      const cleanedResponse = cleanAiResponse(result);
      console.log('LangChain: Cleaned response:', cleanedResponse);
      
      parsedResult = safeJsonParse(cleanedResponse, { summary: '', skills: [] });
    } else if (result && typeof result === 'object') {
      parsedResult = result;
    } else {
      throw new Error('Invalid response format from AI');
    }

    // Validate the structure
    if (!validateJsonStructure(parsedResult, ['summary', 'skills'])) {
      console.error('LangChain: Invalid response structure:', parsedResult);
      throw new Error('AI response missing required fields (summary or skills)');
    }

    // Additional validation using zod schema
    try {
      const validatedResult = resumeContentSchema.parse(parsedResult);
      return {
        summary: validatedResult.summary,
        skills: validatedResult.skills
      };
    } catch (validationError) {
      console.error('LangChain: Schema validation failed:', validationError);
      
      // Fallback with basic validation
      if (parsedResult.summary && Array.isArray(parsedResult.skills)) {
        return {
          summary: String(parsedResult.summary),
          skills: parsedResult.skills.filter(skill => typeof skill === 'string' && skill.trim().length > 0)
        };
      }
      
      throw new Error('Generated content does not meet quality standards');
    }
  } catch (error) {
    console.error('LangChain: Error generating resume content:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Please configure your Groq API key to use AI features.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
    
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

    // Handle string or object result
    if (typeof result === 'string') {
      return result;
    } else if (result && typeof result === 'object' && 'text' in result) {
      return String(result.text);
    }

    return "Failed to generate responsibilities";
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

    if (typeof result === 'string') {
      return result;
    } else if (result && typeof result === 'object' && 'text' in result) {
      return String(result.text);
    }

    return '';
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

    console.log('LangChain: Raw resume analysis result:', result);

    let parsedResult;
    if (typeof result === 'string') {
      const cleanedResponse = cleanAiResponse(result);
      parsedResult = safeJsonParse(cleanedResponse, {
        score: 0,
        matchedKeywords: [],
        missedKeywords: [],
        suggestions: []
      });
    } else if (result && typeof result === 'object') {
      parsedResult = result;
    } else {
      throw new Error('Invalid response format from AI');
    }

    // Validate using zod schema
    try {
      const validatedResult = resumeAnalysisSchema.parse(parsedResult);
      return validatedResult;
    } catch (validationError) {
      console.warn('LangChain: Schema validation failed, using fallback parsing:', validationError);
      
      // Fallback validation with guaranteed required properties
      return {
        score: typeof parsedResult?.score === 'number' ? Math.max(0, Math.min(100, parsedResult.score)) : 0,
        matchedKeywords: Array.isArray(parsedResult?.matchedKeywords) ? parsedResult.matchedKeywords : [],
        missedKeywords: Array.isArray(parsedResult?.missedKeywords) ? parsedResult.missedKeywords : [],
        suggestions: Array.isArray(parsedResult?.suggestions) ? parsedResult.suggestions : []
      };
    }
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

    console.log('LangChain: Raw skills suggestion result:', result);

    let parsedResult;
    if (typeof result === 'string') {
      const cleanedResponse = cleanAiResponse(result);
      parsedResult = safeJsonParse(cleanedResponse, []);
    } else if (Array.isArray(result)) {
      parsedResult = result;
    } else {
      parsedResult = [];
    }

    // Ensure we return an array of strings
    if (Array.isArray(parsedResult)) {
      return parsedResult.filter(skill => typeof skill === 'string' && skill.trim().length > 0);
    }

    return [];
  } catch (error) {
    console.error('Error suggesting skills with LangChain:', error);
    return [];
  }
};

export const getResumeConversationResponse = async (input: string): Promise<ConversationResponse> => {
  try {
    console.log('LangChain: Processing resume conversation input:', input);
    
    // Check API key
    const apiKey = localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Groq API key not configured. Please add your API key in the settings.');
    }

    // Validate input
    if (!input || input.trim().length === 0) {
      throw new Error('Please provide a valid question or request.');
    }

    const result = await resumeConversationChain.invoke({
      input: input.trim()
    });

    console.log('LangChain: Resume conversation result:', result);

    // Handle different possible response formats
    let response = '';
    if (typeof result === 'string') {
      response = result;
    } else if (result && typeof result === 'object') {
      response = result.response || result.text || result.output || 'No response generated';
    } else {
      response = 'No response generated';
    }

    if (!response || response.trim().length === 0) {
      throw new Error('Empty response from AI. Please try rephrasing your question.');
    }

    return {
      response: response,
      context: 'resume_assistance'
    };
  } catch (error) {
    console.error('LangChain: Error in resume conversation:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Please configure your Groq API key to use AI chat features.');
      } else if (error.message.includes('additional_kwargs')) {
        console.log('LangChain: Clearing conversation memory due to memory error');
        await clearResumeConversationMemory();
        throw new Error('Conversation memory error. Memory has been cleared - please try again.');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to process resume conversation');
  }
};

export const getSkillsConversationResponse = async (input: string): Promise<ConversationResponse> => {
  try {
    console.log('LangChain: Processing skills conversation input:', input);
    
    // Check API key
    const apiKey = localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Groq API key not configured. Please add your API key in the settings.');
    }

    if (!input || input.trim().length === 0) {
      throw new Error('Please provide a valid question or request.');
    }
    
    const result = await skillsConversationChain.invoke({
      input: input.trim()
    });

    console.log('LangChain: Skills conversation result:', result);

    let response = '';
    if (typeof result === 'string') {
      response = result;
    } else if (result && typeof result === 'object') {
      response = result.response || result.text || result.output || 'No response generated';
    } else {
      response = 'No response generated';
    }

    if (!response || response.trim().length === 0) {
      throw new Error('Empty response from AI. Please try rephrasing your question.');
    }

    return {
      response: response,
      context: 'skills_development'
    };
  } catch (error) {
    console.error('LangChain: Error in skills conversation:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Please configure your Groq API key to use AI chat features.');
      } else if (error.message.includes('additional_kwargs')) {
        console.log('LangChain: Clearing skills conversation memory due to memory error');
        await clearSkillsConversationMemory();
        throw new Error('Conversation memory error. Memory has been cleared - please try again.');
      }
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to process skills conversation');
  }
};

export const getCareerConversationResponse = async (input: string): Promise<ConversationResponse> => {
  try {
    console.log('LangChain: Processing career conversation input:', input);
    
    // Check API key
    const apiKey = localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('Groq API key not configured. Please add your API key in the settings.');
    }

    if (!input || input.trim().length === 0) {
      throw new Error('Please provide a valid question or request.');
    }
    
    const result = await careerConversationChain.invoke({
      input: input.trim()
    });

    console.log('LangChain: Career conversation result:', result);

    let response = '';
    if (typeof result === 'string') {
      response = result;
    } else if (result && typeof result === 'object') {
      response = result.response || result.text || result.output || 'No response generated';
    } else {
      response = 'No response generated';
    }

    if (!response || response.trim().length === 0) {
      throw new Error('Empty response from AI. Please try rephrasing your question.');
    }

    return {
      response: response,
      context: 'career_guidance'
    };
  } catch (error) {
    console.error('LangChain: Error in career conversation:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Please configure your Groq API key to use AI chat features.');
      } else if (error.message.includes('additional_kwargs')) {
        console.log('LangChain: Clearing career conversation memory due to memory error');
        await clearCareerConversationMemory();
        throw new Error('Conversation memory error. Memory has been cleared - please try again.');
      }
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to process career conversation');
  }
};

export const getComprehensiveResumeAnalysis = async (
  resumeContent: string,
  targetRole: string,
  industry: string,
  jobDescription: string
): Promise<ComprehensiveAnalysisResponse> => {
  try {
    const result = await comprehensiveResumeAnalysisChain.invoke({
      resumeContent,
      targetRole,
      industry,
      jobDescription
    });

    return {
      analysis: result.analysis || {
        strengths: [],
        weaknesses: [],
        missingElements: [],
        industryAlignment: 'low',
        overallScore: 0
      },
      improvements: result.improvements || {
        priorityActions: [],
        contentSuggestions: { summary: '', skills: [], experiences: [] },
        formattingTips: [],
        keywordOptimization: []
      },
      atsOptimization: result.atsOptimization || {
        atsScore: 0,
        formatIssues: [],
        keywordMatches: [],
        missingKeywords: [],
        optimizedSections: { skills: [], experience: [] },
        recommendations: []
      }
    };
  } catch (error) {
    console.error('Error in comprehensive resume analysis:', error);
    throw new Error('Failed to perform comprehensive analysis');
  }
};

export const getIndustryOptimization = async (
  resumeContent: string,
  targetRole: string,
  industry: string
): Promise<{
  industryKeywords: string[];
  preferredFormat: string;
  essentialSkills: string[];
  industryTrends: string[];
  optimizedContent: {
    summary: string;
    skills: string[];
    experience: string[];
  };
  additionalSections: string[];
}> => {
  try {
    const result = await industryOptimizationChain.invoke({
      resumeContent,
      targetRole,
      industry
    });

    // Type assertion to handle ChainValues return type
    const typedResult = result as any;

    return {
      industryKeywords: Array.isArray(typedResult?.industryKeywords) ? typedResult.industryKeywords : [],
      preferredFormat: typedResult?.preferredFormat || '',
      essentialSkills: Array.isArray(typedResult?.essentialSkills) ? typedResult.essentialSkills : [],
      industryTrends: Array.isArray(typedResult?.industryTrends) ? typedResult.industryTrends : [],
      optimizedContent: {
        summary: typedResult?.optimizedContent?.summary || '',
        skills: Array.isArray(typedResult?.optimizedContent?.skills) ? typedResult.optimizedContent.skills : [],
        experience: Array.isArray(typedResult?.optimizedContent?.experience) ? typedResult.optimizedContent.experience : []
      },
      additionalSections: Array.isArray(typedResult?.additionalSections) ? typedResult.additionalSections : []
    };
  } catch (error) {
    console.error('Error in industry optimization:', error);
    throw new Error('Failed to perform industry optimization');
  }
};

export const clearResumeConversationMemory = async (): Promise<void> => {
  try {
    await resumeConversationMemory.clear();
    console.log('LangChain: Resume conversation memory cleared successfully');
  } catch (error) {
    console.error('LangChain: Error clearing resume conversation memory:', error);
  }
};

export const clearSkillsConversationMemory = async (): Promise<void> => {
  try {
    await skillsConversationMemory.clear();
    console.log('LangChain: Skills conversation memory cleared successfully');
  } catch (error) {
    console.error('LangChain: Error clearing skills conversation memory:', error);
  }
};

export const clearCareerConversationMemory = async (): Promise<void> => {
  try {
    await careerConversationMemory.clear();
    console.log('LangChain: Career conversation memory cleared successfully');
  } catch (error) {
    console.error('LangChain: Error clearing career conversation memory:', error);
  }
};

export const clearAllConversationMemory = async (): Promise<void> => {
  console.log('LangChain: Clearing all conversation memories');
  await Promise.all([
    clearResumeConversationMemory(),
    clearSkillsConversationMemory(),
    clearCareerConversationMemory()
  ]);
};
