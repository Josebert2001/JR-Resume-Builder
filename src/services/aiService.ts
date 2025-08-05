import { Groq } from "groq-sdk";
import {
  generateResumeContent as lcGenerateResumeContent,
  generateJobResponsibilities as lcGenerateJobResponsibilities,
  suggestSkills as lcSuggestSkills
} from './langchain/resume/resumeService';
import { analyzeResume as lcAnalyzeResume } from './langchain/analysis/analysisService';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true
});

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

export type DetailedResumeAnalysis = ResumeAnalysisResponse & {
  industryInsights: {
    trendsAndDemand: string;
    salaryRange: string;
    keyCompetitors: string[];
  };
  atsCompatibility: {
    score: number;
    issues: string[];
    formatting: string[];
  };
  coverLetterSuggestions: {
    keyPoints: string[];
    uniqueSellingPoints: string[];
    customization: string;
  };
};

export type ProfessionalInterestsResponse = {
  interests: string[];
  descriptions: Record<string, string>;
};

export const generateResumeContent = async (data: GenerationRequest): Promise<GenerationResponse> => {
  try {
    // Try LangChain first
    return await lcGenerateResumeContent(data);
  } catch (error) {
    console.warn('LangChain generation failed, falling back to direct Groq:', error);
    
    // Fallback to original implementation
    if (!data.course || !data.school || !data.interests) {
      throw new Error('Missing required fields for resume content generation');
    }

    const prompt = `Create a professional resume summary and relevant skills list for:
Name: ${data.name}
Education: ${data.course} from ${data.school}
Interests: ${data.interests}

Generate:
1. A compelling career objective/professional summary (2-3 sentences) that:
   - Highlights educational background
   - Mentions career aspirations
   - Connects interests with professional goals
2. A list of 5-7 relevant technical and soft skills based on the course and interests

Return ONLY a JSON object with the following structure, nothing else:
{
  "summary": "career objective here",
  "skills": ["skill1", "skill2", ...]
}`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "You are a professional resume writer. Return ONLY properly formatted JSON with a summary and skills array. Do not include any other text or explanations."
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1024,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from AI service');
      }

      let response;
      try {
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}') + 1;
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error('No JSON object found in response');
        }
        const jsonContent = content.slice(jsonStart, jsonEnd);
        
        response = JSON.parse(jsonContent);
        
        if (!response.summary || !Array.isArray(response.skills)) {
          throw new Error('Invalid response structure');
        }

        return {
          summary: response.summary,
          skills: response.skills
        };
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError, 'Raw content:', content);
        throw new Error('Failed to parse AI response');
      }
    } catch (error) {
      console.error('Error generating resume content:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to generate resume content');
    }
  }
};

export const generateJobResponsibilities = async (data: ResponsibilityGenerationRequest): Promise<string> => {
  try {
    // Try LangChain first
    return await lcGenerateJobResponsibilities(data);
  } catch (error) {
    console.warn('LangChain generation failed, falling back to direct Groq:', error);
    
    // Fallback to original implementation
    const prompt = `Generate 4-5 detailed bullet points describing key responsibilities for a ${data.position} role at ${data.company}${data.industry ? ` in the ${data.industry} industry` : ''}.
    Focus on specific, measurable achievements and key responsibilities.
    Format each bullet point starting with "• " and separate with newlines.`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || "Failed to generate responsibilities";
    } catch (error) {
      console.error('Error generating job responsibilities:', error);
      throw new Error('Failed to generate job responsibilities');
    }
  }
};

export const analyzeResume = async (resumeContent: string, jobDescription: string): Promise<ResumeAnalysisResponse> => {
  try {
    // Try LangChain first
    return await lcAnalyzeResume(resumeContent, jobDescription);
  } catch (error) {
    console.warn('LangChain analysis failed, falling back to direct Groq:', error);
    
    // Fallback to original implementation
    const prompt = `Analyze this resume against a job description and provide feedback in JSON format.

Resume Content:
${resumeContent}

Job Description:
${jobDescription}

Return a JSON object with:
1. score (0-100): match percentage between resume and job requirements
2. matchedKeywords: array of skills/keywords from resume that match job requirements
3. missedKeywords: array of important keywords from job description missing in resume
4. suggestions: array of specific improvement suggestions

Format:
{
  "score": number,
  "matchedKeywords": string[],
  "missedKeywords": string[],
  "suggestions": string[]
}`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1024,
      });

      let response;
      const content = completion.choices[0]?.message?.content;
      
      try {
        if (typeof content === 'string' && content.trim().startsWith('{')) {
          response = JSON.parse(content);
        } else {
          console.error('Invalid response format from API');
          response = {};
        }
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        response = {};
      }

      return {
        score: response?.score || 0,
        matchedKeywords: Array.isArray(response?.matchedKeywords) ? response.matchedKeywords : [],
        missedKeywords: Array.isArray(response?.missedKeywords) ? response.missedKeywords : [],
        suggestions: Array.isArray(response?.suggestions) ? response.suggestions : []
      };
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to analyze resume');
    }
  }
};

export const getDetailedAnalysis = async (resumeContent: string, jobDescription: string): Promise<DetailedResumeAnalysis> => {
  const prompt = `Perform a detailed analysis of this resume against a job description. Include industry insights, ATS compatibility, and cover letter suggestions.

Resume Content:
${resumeContent}

Job Description:
${jobDescription}

Return a comprehensive JSON object that includes:
1. Basic match analysis (score, keywords, suggestions)
2. Industry insights (trends, salary ranges, key competitors)
3. ATS compatibility check (formatting issues, structure)
4. Cover letter customization suggestions

Format the response as:
{
  "score": number,
  "matchedKeywords": string[],
  "missedKeywords": string[],
  "suggestions": string[],
  "industryInsights": {
    "trendsAndDemand": string,
    "salaryRange": string,
    "keyCompetitors": string[]
  },
  "atsCompatibility": {
    "score": number,
    "issues": string[],
    "formatting": string[]
  },
  "coverLetterSuggestions": {
    "keyPoints": string[],
    "uniqueSellingPoints": string[],
    "customization": string
  }
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 2048,
    });

    let response;
    const content = completion.choices[0]?.message?.content;
    
    try {
      if (typeof content === 'string' && content.trim().startsWith('{')) {
        response = JSON.parse(content);
      } else {
        console.error('Invalid response format from API');
        response = {};
      }
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      response = {};
    }

    return {
      score: response?.score || 0,
      matchedKeywords: Array.isArray(response?.matchedKeywords) ? response.matchedKeywords : [],
      missedKeywords: Array.isArray(response?.missedKeywords) ? response.missedKeywords : [],
      suggestions: Array.isArray(response?.suggestions) ? response.suggestions : [],
      industryInsights: {
        trendsAndDemand: response?.industryInsights?.trendsAndDemand || 'No industry insights available',
        salaryRange: response?.industryInsights?.salaryRange || 'Salary information unavailable',
        keyCompetitors: Array.isArray(response?.industryInsights?.keyCompetitors) ? response.industryInsights.keyCompetitors : []
      },
      atsCompatibility: {
        score: response?.atsCompatibility?.score || 0,
        issues: Array.isArray(response?.atsCompatibility?.issues) ? response.atsCompatibility.issues : [],
        formatting: Array.isArray(response?.atsCompatibility?.formatting) ? response.atsCompatibility.formatting : []
      },
      coverLetterSuggestions: {
        keyPoints: Array.isArray(response?.coverLetterSuggestions?.keyPoints) ? response.coverLetterSuggestions.keyPoints : [],
        uniqueSellingPoints: Array.isArray(response?.coverLetterSuggestions?.uniqueSellingPoints) ? response.coverLetterSuggestions.uniqueSellingPoints : [],
        customization: response?.coverLetterSuggestions?.customization || 'No customization suggestions available'
      }
    };
  } catch (error) {
    console.error('Error performing detailed analysis:', error);
    throw new Error('Failed to perform detailed resume analysis');
  }
};

export const generateProfessionalInterests = async (field: string, skills: string[]): Promise<ProfessionalInterestsResponse> => {
  const prompt = `Generate a list of relevant professional interests for someone in ${field} with skills in ${skills.join(', ')}.
  Return a JSON object with:
  1. An array of 10-12 specific professional interests
  2. A brief description for each interest explaining its relevance to the field
  
  Format as:
  {
    "interests": ["interest1", "interest2", ...],
    "descriptions": {
      "interest1": "description1",
      "interest2": "description2",
      ...
    }
  }`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a career counselor specializing in professional development. Return ONLY properly formatted JSON."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from AI service');
    }

    let response;
    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON object found in response');
      }
      const jsonContent = content.slice(jsonStart, jsonEnd);
      
      response = JSON.parse(jsonContent);
      
      if (!Array.isArray(response.interests) || typeof response.descriptions !== 'object') {
        throw new Error('Invalid response structure');
      }

      return {
        interests: response.interests,
        descriptions: response.descriptions
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError, 'Raw content:', content);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error generating professional interests:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate professional interests');
  }
};
