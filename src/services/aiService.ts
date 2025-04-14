import { Groq } from "groq-sdk";

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

export const generateResumeContent = async (data: GenerationRequest): Promise<GenerationResponse> => {
  const prompt = `Create a professional resume summary and relevant skills list for:
Name: ${data.name}
Education: ${data.course} from ${data.school}
Interests: ${data.interests}

Format the response as JSON with:
1. A concise, professional summary highlighting education and career aspirations (max 100 words)
2. A list of 5-7 relevant technical and soft skills based on the course and interests

Response format:
{
  "summary": "...",
  "skills": ["skill1", "skill2", ...]
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
      // Only parse if it's a string and looks like JSON
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
      summary: response?.summary || "Failed to generate summary",
      skills: Array.isArray(response?.skills) ? response.skills : []
    };
  } catch (error) {
    console.error('Error generating resume content:', error);
    throw new Error('Failed to generate resume content');
  }
};

export const generateJobResponsibilities = async (data: ResponsibilityGenerationRequest): Promise<string> => {
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
};

export const analyzeResume = async (resumeContent: string, jobDescription: string): Promise<ResumeAnalysisResponse> => {
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
