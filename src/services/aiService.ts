import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.VITE_GROQ_API_KEY || '',
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
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      summary: response.summary || "Failed to generate summary",
      skills: response.skills || []
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
      model: "mixtral-8x7b-32768",
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
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      score: response.score || 0,
      matchedKeywords: response.matchedKeywords || [],
      missedKeywords: response.missedKeywords || [],
      suggestions: response.suggestions || []
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
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 2048,
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      ...response,
      score: response.score || 0,
      matchedKeywords: response.matchedKeywords || [],
      missedKeywords: response.missedKeywords || [],
      suggestions: response.suggestions || [],
      industryInsights: {
        trendsAndDemand: response.industryInsights?.trendsAndDemand || 'No industry insights available',
        salaryRange: response.industryInsights?.salaryRange || 'Salary information unavailable',
        keyCompetitors: response.industryInsights?.keyCompetitors || []
      },
      atsCompatibility: {
        score: response.atsCompatibility?.score || 0,
        issues: response.atsCompatibility?.issues || [],
        formatting: response.atsCompatibility?.formatting || []
      },
      coverLetterSuggestions: {
        keyPoints: response.coverLetterSuggestions?.keyPoints || [],
        uniqueSellingPoints: response.coverLetterSuggestions?.uniqueSellingPoints || [],
        customization: response.coverLetterSuggestions?.customization || 'No customization suggestions available'
      }
    };
  } catch (error) {
    console.error('Error performing detailed analysis:', error);
    throw new Error('Failed to perform detailed resume analysis');
  }
};
