
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

export const getResumeConversationResponse = async (input: string): Promise<ConversationResponse> => {
  try {
    console.log('Processing resume conversation input:', input);
    
    const result = await resumeConversationChain.invoke({
      input: input
    });

    console.log('Resume conversation result:', result);

    // Handle different possible response formats
    let response = '';
    if (typeof result === 'string') {
      response = result;
    } else if (result && typeof result === 'object') {
      response = result.response || result.text || result.output || 'No response generated';
    } else {
      response = 'No response generated';
    }

    return {
      response: response,
      context: 'resume_assistance'
    };
  } catch (error) {
    console.error('Error in resume conversation:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('additional_kwargs')) {
        throw new Error('AI conversation memory error. Please try clearing the conversation and starting again.');
      } else if (error.message.includes('API')) {
        throw new Error('AI service unavailable. Please check your API configuration.');
      }
    }
    
    throw new Error('Failed to process resume conversation');
  }
};

export const getSkillsConversationResponse = async (input: string): Promise<ConversationResponse> => {
  try {
    console.log('Processing skills conversation input:', input);
    
    const result = await skillsConversationChain.invoke({
      input: input
    });

    console.log('Skills conversation result:', result);

    let response = '';
    if (typeof result === 'string') {
      response = result;
    } else if (result && typeof result === 'object') {
      response = result.response || result.text || result.output || 'No response generated';
    } else {
      response = 'No response generated';
    }

    return {
      response: response,
      context: 'skills_development'
    };
  } catch (error) {
    console.error('Error in skills conversation:', error);
    
    if (error instanceof Error && error.message.includes('additional_kwargs')) {
      throw new Error('AI conversation memory error. Please try clearing the conversation and starting again.');
    }
    
    throw new Error('Failed to process skills conversation');
  }
};

export const getCareerConversationResponse = async (input: string): Promise<ConversationResponse> => {
  try {
    console.log('Processing career conversation input:', input);
    
    const result = await careerConversationChain.invoke({
      input: input
    });

    console.log('Career conversation result:', result);

    let response = '';
    if (typeof result === 'string') {
      response = result;
    } else if (result && typeof result === 'object') {
      response = result.response || result.text || result.output || 'No response generated';
    } else {
      response = 'No response generated';
    }

    return {
      response: response,
      context: 'career_guidance'
    };
  } catch (error) {
    console.error('Error in career conversation:', error);
    
    if (error instanceof Error && error.message.includes('additional_kwargs')) {
      throw new Error('AI conversation memory error. Please try clearing the conversation and starting again.');
    }
    
    throw new Error('Failed to process career conversation');
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
    console.log('Resume conversation memory cleared');
  } catch (error) {
    console.error('Error clearing resume conversation memory:', error);
  }
};

export const clearSkillsConversationMemory = async (): Promise<void> => {
  try {
    await skillsConversationMemory.clear();
    console.log('Skills conversation memory cleared');
  } catch (error) {
    console.error('Error clearing skills conversation memory:', error);
  }
};

export const clearCareerConversationMemory = async (): Promise<void> => {
  try {
    await careerConversationMemory.clear();
    console.log('Career conversation memory cleared');
  } catch (error) {
    console.error('Error clearing career conversation memory:', error);
  }
};

export const clearAllConversationMemory = async (): Promise<void> => {
  await Promise.all([
    clearResumeConversationMemory(),
    clearSkillsConversationMemory(),
    clearCareerConversationMemory()
  ]);
};
