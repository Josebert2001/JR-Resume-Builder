
import { z } from "zod";
import { createGroqChat, safeJsonParse } from '../core/llmCore';

// Define Zod schema for resume analysis
const resumeAnalysisSchema = z.object({
  score: z.number().describe("A score indicating the overall quality of the resume."),
  matchedKeywords: z.array(z.string()).describe("Keywords from the job description that are present in the resume."),
  missedKeywords: z.array(z.string()).describe("Keywords from the job description that are missing from the resume."),
  suggestions: z.array(z.string()).describe("Specific suggestions for improving the resume."),
});

type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;

export interface ResumeAnalysisResponse extends ResumeAnalysis {
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
  suggestions: string[];
}

export const analyzeResume = async (resumeText: string, jobDescription?: string): Promise<ResumeAnalysisResponse> => {
  try {
    const chat = createGroqChat();

    const prompt = jobDescription 
      ? `Analyze this resume against the job description and provide feedback in JSON format.

Resume: ${resumeText}
Job Description: ${jobDescription}

Return JSON with: score (0-100), matchedKeywords array, missedKeywords array, suggestions array.

{
  "score": number,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missedKeywords": ["keyword3", "keyword4"],
  "suggestions": ["suggestion1", "suggestion2"]
}`
      : `Analyze this resume and provide feedback in JSON format.

Resume: ${resumeText}

Return JSON with: score (0-100), matchedKeywords array, missedKeywords array, suggestions array.

{
  "score": number,
  "matchedKeywords": ["keyword1", "keyword2"],
  "missedKeywords": ["keyword3", "keyword4"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

    const response = await chat.invoke([
      { 
        role: "system", 
        content: "You are a resume analysis expert. Return ONLY properly formatted JSON with the requested structure."
      },
      { 
        role: "user", 
        content: prompt 
      }
    ]);
    
    const defaultResponse: ResumeAnalysisResponse = {
      score: 0,
      matchedKeywords: [],
      missedKeywords: [],
      suggestions: []
    };

    const parsed = safeJsonParse<ResumeAnalysisResponse>(response.content as string, defaultResponse);

    return {
      score: parsed.score ?? 0,
      matchedKeywords: parsed.matchedKeywords ?? [],
      missedKeywords: parsed.missedKeywords ?? [],
      suggestions: parsed.suggestions ?? []
    };
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw error;
  }
};

export const getComprehensiveResumeAnalysis = async (
  resumeText: string, 
  targetRole: string, 
  industry: string, 
  jobDescription: string
): Promise<any> => {
  try {
    const chat = createGroqChat();
    
    const prompt = `Perform a comprehensive analysis of this resume for a ${targetRole} position in the ${industry} industry.

Resume Content:
${resumeText}

Target Role: ${targetRole}
Industry: ${industry}
Job Description: ${jobDescription}

Provide a detailed analysis in JSON format with:
{
  "analysis": {
    "overallScore": number (0-100),
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "missingElements": ["element1", "element2"]
  },
  "improvements": {
    "priorityActions": ["action1", "action2"],
    "contentSuggestions": {
      "summary": "improved summary",
      "skills": ["skill1", "skill2"]
    },
    "formattingTips": ["tip1", "tip2"]
  },
  "atsOptimization": {
    "atsScore": number (0-100),
    "keywordMatches": ["keyword1", "keyword2"],
    "missingKeywords": ["keyword3", "keyword4"],
    "recommendations": ["rec1", "rec2"]
  }
}`;

    const response = await chat.invoke([
      { 
        role: "system", 
        content: "You are an expert resume analyst. Return ONLY properly formatted JSON."
      },
      { 
        role: "user", 
        content: prompt 
      }
    ]);

    const defaultResponse = {
      analysis: {
        overallScore: 0,
        strengths: [],
        weaknesses: [],
        missingElements: []
      },
      improvements: {
        priorityActions: [],
        contentSuggestions: {
          summary: "",
          skills: []
        },
        formattingTips: []
      },
      atsOptimization: {
        atsScore: 0,
        keywordMatches: [],
        missingKeywords: [],
        recommendations: []
      }
    };

    return safeJsonParse(response.content as string, defaultResponse);
  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    throw new Error('Failed to perform comprehensive analysis');
  }
};

export const getIndustryOptimization = async (
  resumeText: string, 
  targetRole: string, 
  industry: string
): Promise<any> => {
  try {
    const chat = createGroqChat();
    
    const prompt = `Optimize this resume for the ${industry} industry and ${targetRole} role.

Resume Content:
${resumeText}

Target Role: ${targetRole}
Industry: ${industry}

Provide industry-specific optimization in JSON format:
{
  "industryKeywords": ["keyword1", "keyword2"],
  "essentialSkills": ["skill1", "skill2"],
  "optimizedContent": {
    "summary": "industry-optimized summary",
    "skills": ["industry-relevant skill 1"]
  }
}`;

    const response = await chat.invoke([
      { 
        role: "system", 
        content: "You are an industry-specific career consultant. Return ONLY properly formatted JSON."
      },
      { 
        role: "user", 
        content: prompt 
      }
    ]);

    const defaultResponse = {
      industryKeywords: [],
      essentialSkills: [],
      optimizedContent: {
        summary: "",
        skills: []
      }
    };

    return safeJsonParse(response.content as string, defaultResponse);
  } catch (error) {
    console.error('Industry optimization error:', error);
    throw new Error('Failed to perform industry optimization');
  }
};
