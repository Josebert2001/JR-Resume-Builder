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
      });

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
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError, 'Raw content:', content);
        throw new Error('Failed to parse AI response');
export const generateJobResponsibilities = async (data: ResponsibilityGenerationRequest): Promise<string> => {
    const prompt = `Generate 4-5 detailed bullet points describing key responsibilities for a ${data.position} role at ${data.company}${data.industry ? ` in the ${data.industry} industry` : ''}.
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

      let response;
      const content = completion.choices[0]?.message?.content;
      
        model: "mixtral-8x7b-32768",
        if (typeof content === 'string' && content.trim().startsWith('{')) {
          response = JSON.parse(content);
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
};
