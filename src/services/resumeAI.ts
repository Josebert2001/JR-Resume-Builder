import { Groq } from "groq-sdk";
import {
  generateEducationDescription as lcGenerateEducationDescription,
  generateJobResponsibilities as lcGenerateJobResponsibilities,
  suggestSkills as lcSuggestSkills,
  analyzeResume as lcAnalyzeResume
} from './langchain/langchainService';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true
});

export const generateEducationDescription = async (
  degree: string,
  fieldOfStudy: string,
  school: string
): Promise<string> => {
  try {
    // Try LangChain first
    return await lcGenerateEducationDescription(degree, fieldOfStudy, school);
  } catch (error) {
    console.warn('LangChain generation failed, falling back to direct Groq:', error);
    
    // Fallback to original implementation
    const prompt = `Generate a concise, professional description for an education entry with:
Degree: ${degree}
Field of Study: ${fieldOfStudy}
School: ${school}

Focus on:
- Relevant coursework
- Key academic achievements
- Research or projects if applicable
- Skills developed

Keep it to 2-3 sentences maximum.`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 200,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating education description:', error);
      return '';
    }
  }
};

export const generateWorkDescription = async (
  position: string,
  company: string,
  industry?: string
): Promise<string> => {
  try {
    // Try LangChain first
    return await lcGenerateJobResponsibilities({ position, company, industry });
  } catch (error) {
    console.warn('LangChain generation failed, falling back to direct Groq:', error);
    
    // Fallback to original implementation
    const prompt = `Generate a professional work experience description for:
Position: ${position}
Company: ${company}
${industry ? `Industry: ${industry}` : ''}

Include:
- Key responsibilities
- Notable achievements
- Impact on the organization
- Use action verbs and quantifiable results
- 3-4 bullet points

Format each point starting with "• " and separate with newlines.`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 300,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating work description:', error);
      return '';
    }
  }
};

export const suggestSkills = async (
  position: string,
  experience: string[],
  jobDescription?: string
): Promise<string[]> => {
  try {
    // Try LangChain first
    return await lcSuggestSkills(position, experience, jobDescription);
  } catch (error) {
    console.warn('LangChain generation failed, falling back to direct Groq:', error);
    
    // Fallback to original implementation
    const prompt = `Suggest relevant professional skills for:
Position: ${position}
Experience: ${experience.join(', ')}
${jobDescription ? `Target Job Description: ${jobDescription}` : ''}

Include:
- Technical skills
- Soft skills
- Industry-specific skills
- Tools and technologies
- Certifications if applicable
${jobDescription ? '- Skills specifically mentioned in the job description' : ''}

Return only a JSON array of skills, nothing else.`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 200,
      });

      const content = completion.choices[0]?.message?.content || '[]';
      return JSON.parse(content);
    } catch (error) {
      console.error('Error suggesting skills:', error);
      return [];
    }
  }
};

export const analyzeResume = async (
  resumeText: string,
  jobDescription: string
  industry?: string,
  jobDescription?: string
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
  suggestions: string[];
}> => {
  try {
    // Try LangChain first
    return await lcGenerateJobResponsibilities({ position, company, industry, jobDescription });
  } catch (error) {
    console.warn('LangChain analysis failed, falling back to direct Groq:', error);
    
    // Fallback to original implementation
    const prompt = `Analyze this resume against the following job description:

RESUME:
${resumeText}
${jobDescription ? `Target Job Requirements: ${jobDescription}` : ''}

JOB DESCRIPTION:
${jobDescription}

Provide a detailed analysis with the following components:
1. A match score as a percentage (0-100%) representing how well the resume matches the job requirements.
2. A list of keywords from the job description that are present in the resume.
3. A list of important keywords from the job description that are missing from the resume.
4. Specific suggestions for improving the resume to better match this job description.

Return the analysis as a JSON object with the following format:
{
  "score": number,
  "matchedKeywords": string[],
  "missedKeywords": string[],
  "suggestions": string[]
}
${jobDescription ? '- Align with requirements mentioned in the target job description' : ''}

Be thorough but concise. The score should reflect the overall match quality.`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content || '{"score": 0, "matchedKeywords": [], "missedKeywords": [], "suggestions": []}';
      
      try {
        const result = JSON.parse(content);
        return {
          score: result.score || 0,
          matchedKeywords: result.matchedKeywords || [],
          missedKeywords: result.missedKeywords || [],
          suggestions: result.suggestions || []
        };
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        return {
          score: 0,
          matchedKeywords: [],
          missedKeywords: [],
          suggestions: ['Failed to parse AI analysis.']
        };
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      return {
        score: 0,
        matchedKeywords: [],
        missedKeywords: [],
        suggestions: ['Failed to complete AI analysis.']
      };
    }
  }
};
